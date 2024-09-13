import ProdCategory from '../models/prodcategory.model.js';
import asyncHandler from 'express-async-handler';
import { validatemongoID } from "../utils/validatemongoID.js";

// create category by authenticated user
export const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    const newCategory = new ProdCategory ({
      title
    })
    await newCategory.save();
    res.json({
      message: "Category created successfully",
      success: true,
      status: 200,
      category: newCategory,
    })
  } catch (error) {
    throw new Error(error);
  }
});

// update category by authenticated user
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  const { title } = req.body;
  try {
    const updatedCategory = await ProdCategory.findByIdAndUpdate(id, { title }, { new: true });
    if (!updatedCategory) {
      throw new Error("Category not found!");
    }
    res.json({
      message: "Category updated successfully",
      success: true,
      status: 200,
      category: updatedCategory,
    })
  } catch (error) {
    throw new Error(error);
  }
});

// delete category by authenticated user
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const category = await ProdCategory.findByIdAndDelete(id);
    if (!category) {
      throw new Error("Category not found!");
    }
    res.json({
      message: "Category deleted successfully",
      success: true,
      status: 200,
    })
  } catch (error) {
    throw new Error(error);
  } 
});