import BlogCategory from '../models/blogcategory.model.js';
import asyncHandler from 'express-async-handler';
import { validatemongoID } from "../utils/validatemongoID.js";

// create blog category
export const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    const newCategory = new BlogCategory ({
      title
    })
    await newCategory.save();
    res.json({
      success: true,
      message: "Blog category created successfully",
      data: newCategory
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update blog category
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  const { title } = req.body;
  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, { title }, { new: true });
    if (!updatedCategory) {
      throw new Error("Blog category not found!");
    }
    res.json({
      message: "Blog category updated successfully",
      success: true,
      status: 200,
      data: updatedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete blog category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const category = await BlogCategory.findByIdAndDelete(id);
    if (!category) {
      throw new Error("Blog category not found!");
    }
    res.json({
      message: "Blog category deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all blog categories
export const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BlogCategory.find({});
    if (!categories) {
      throw new Error("No blog categories found!");
    }
    res.json({
      message: "Blog categories retrieved successfully",
      success: true,
      status: 200,
      data: categories,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get blog category by id
export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const category = await BlogCategory.findById(id);
    if (!category) {
      throw new Error("Blog category not found!");
    }
    res.json({
      message: "Blog category retrieved successfully",
      success: true,
      status: 200,
      data: category,
    });
  } catch (error) {
    throw new Error(error);
  }
});