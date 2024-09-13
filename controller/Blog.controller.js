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

// delete blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    if (!deleteBlog) {
      throw new Error("Blog not found!");
    }
    res.json({
      message: "Blog deleted successfully",
      success: true,
      status: 200,
    })
  } catch (error) {
    throw new Error(error)
  }
});

// like blog
export const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validatemongoID(blogId);

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({
      message: "Blog not found!",
      success: false
    });
  }

  const loginUserId = req.user._id; 

  if (!Array.isArray(blog.likes)) {
    return res.status(400).json({
      message: "Blog likes data is invalid or not available",
      success: false
    });
  }

  // Check if the user has already liked the blog
  const alreadyLiked = blog.likes.find((like) => like.toString() === loginUserId.toString());

  // If already liked, unlike the blog
  if (alreadyLiked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false
      },
      { new: true }
    );

    return res.json({
      message: "Blog unliked successfully",
      success: true,
      status: 200,
      blog: updatedBlog
    });
  }

  // Like the blog if not already liked
  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: { likes: loginUserId },
      isLiked: true
    },
    { new: true }
  );

  return res.json({
    message: "Blog liked successfully",
    success: true,
    status: 200,
    blog: updatedBlog
  });
});