import User from '../models/User.model.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';
import { validatemongoID } from '../utils/validatemongoID.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import jwt from 'jsonwebtoken';

// register user
export const userRegister = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phonenumber, password } = req.body;

  const user = await User.findOne({ email });
  if (user){
    throw new Error ("User already exists!");
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ 
    firstname, 
    lastname, 
    email,
    phonenumber, 
    password: hashedPassword
  });
  await newUser.save();
  return res.status(200).json({
    message: 'User registered successfully',
    status: 200,
    success: true,
    user: newUser
  })
});

// login user
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email address!');
  }

  const isMatch = await bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password!');
  }

  const token = generateToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);
  const updateUser = await User.findByIdAndUpdate(
    user._id, 
    { refreshToken: refreshToken }, 
    { new: true }
  );
  res.cookie('Token', refreshToken,{ 
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
     });
  res.json({
    message: 'User logged in successfully',
    status: 200,
    success: true,
    token,
  });
});

// logout user
export const userLogout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.Token) {
    throw new Error('No Refresh Token found!');
  }
  const user = await User.findOne({ refreshToken: cookie.Token });
  if (!user) {
    res.clearCookie('Token', {
      httpOnly: true,
      secure: true,
    })
    res.sendStatus(404)
  }
  await User.findOneAndUpdate(user._id, {
    refreshToken: "",
  }, { new: true });
  res.clearCookie('Token', {
    httpOnly: true,
    secure: true,
  })
  res.json({
    message: 'User logged out successfully',
    status: 200,
    success: true,
  })
});

// refresh token 
export const refreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie.Token) {
    throw new Error('No Refresh Token found!');
  }

  const refreshToken = cookie.refreshToken;
  
  const user = await User.findOne({ refreshToken });
  // console.log(user);
  if(!user) {
    throw new Error('No Refresh found!');
  }
  // verify that the refresh token
  jwt.verify(cookie.Token, process.env.JWT_SECRET, (err, decode) => {
    if(err || user.id !== decode.id) {
      throw new Error('Invalid token');
    }
    const accessToken = generateToken(user._id);
    res.json({accessToken});
  });
})

// get all users
export const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find();
  if (!user) {
    throw new Error('User not found!');
  }
  return res.json({
    message: 'User retrieved successfully',
    status: 200,
    success: true,
    user,
  });
});

// get a single user
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found!');
  }
  return res.json({
    message: 'User retrieved successfully',
    status: 200,
    success: true,
    user,
  });
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validatemongoID(_id);
  const { firstname, lastname, email, phonenumber, password } = req.body;

  const userExists = await User.findById(_id);
  if (!userExists) {
    throw new Error('User not found!');
  }

  // hash password if new password is provided
  let hashedPassword;
  if (password) {
    hashedPassword = bcrypt.hashSync(password, 10);
  } else {
    hashedPassword = userExists.password;
  }
  
  // update user
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      firstname: firstname || userExists.firstname,
      lastname: lastname || userExists.lastname,
      email: email || userExists.email,
      phonenumber: phonenumber || userExists.phonenumber,
      password: hashedPassword, 
    },
    { new: true } // Return the updated document
  );
  if (!updatedUser) {
    throw new Error('Failed to update user!');
  }
  return res.json({
    message: 'User updated successfully',
    status: 200,
    success: true,
    user: updatedUser,
  });
});

// delete user 
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);

  const user =  await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found!');
  }
  return res.json({
    message: 'User deleted successfully',
    status: 200,
    success: true,
  });
})