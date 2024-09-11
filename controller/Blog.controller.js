import Blog from "../models/Blog.model.js";
import User from "../models/User.model.js";
import asyncHandler from "express-async-handler";
import { validatemongoID } from "../utils/validatemongoID.js";

// create blog post by authenticated user
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category, content } = req.body;
  try {
    const newBlogs = new Blog({
      title,
      description,
      category,
      content
    })
    await newBlogs.save();
    res.json({
      message: "Blog created successfully",
      success: true,
      blog: newBlogs,
      status: 200
    })
  } catch (error) {
    throw new Error(error);
  }
});

// update blog by authenticated user
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!blog) {
      throw new Error("Blog not found!");
    }
    res.json({
      message: "Blog updated successfully",
      success: true,
      blog,
      status: 200
    })
  } catch (error) {
    throw new Error(error);
  }
});

// getAll blogs
export const getAllBlog = asyncHandler(async (req, res) =>{
  const data = await Blog.find();
  res.json({
    message: "Blogs retrieved successfully",
    success: true,
    status: 200,
    data,
  });
});

// get blog
export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    await Blog.findByIdAndUpdate(
      id, 
      { numViews: blog.numViews + 1 },
      { new: true }
    )
    if (!blog) {
      throw new Error("Blog not found!");
    }
    res.json({
      message: "Blog retrieved successfully",
      success: true,
      status: 200,
      blog,
    })
  } catch (error) {
    throw new Error(error);
  }
});