import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    // enum: ["admin", "user"],
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Array,
    default: [],
  },
  address: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  refreshToken: {
    type: String,
  }
},
{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;