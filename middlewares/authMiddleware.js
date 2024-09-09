import User from "../models/User.model.js";
import jwt from  'jsonwebtoken';
import asyncHandler from "express-async-handler";
import { validatemongoID } from "../utils/validatemongoID.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error("Not authorized, token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    throw new Error("Not authorized, token is invalid. Pleasen again!");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'admin') {
    throw new Error("Not authorized as an admin");
  }
  next();
});

export const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validatemongoID(id);

  try {
    const user = await User.findByIdAndUpdate(id, 
      { isBlocked: true }, { new: true });
    res.json({ message: "User blocked successfully", user });
  } catch (error) {
    throw new Error("Not authorized");
  }
})

export const unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validatemongoID(id);

  try {
    const user = await User.findByIdAndUpdate(id, 
      { isBlocked: false }, { new: true });
    res.json({ message: "User unblocked successfully", user });
  } catch (error) {
    throw new Error("Not authorized");
  }
})