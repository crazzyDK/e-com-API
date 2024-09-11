import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  numViews: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isDisLiked: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dislikes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    default: "",
  },
  author: {
    type: String,
    default: "Admin",
  }
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;