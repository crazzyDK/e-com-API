import Brand from "../models/Brand.model.js";
import asyncHandler from "express-async-handler";
import { validatemongoID } from "../utils/validatemongoID.js";

// create brand by authenticated user
export const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    const newBrand = new Brand({
      title
    })
    await newBrand.save();
    return res.json({
      message: "Brand created successfully",
      success: true,
      status: 200
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update brand by authenticated user
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  const { title } = req.body;
  try {
    const brand = await Brand.findByIdAndUpdate(id, { title }, { new: true });
    if (!brand) {
      throw new Error("Brand not found!");
    }
    return res.json({
      message: "Brand updated successfully",
      success: true,
      status: 200,
      brand
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete brand by authenticated user
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      throw new Error("Brand not found!");
    }
    return res.json({
      message: "Brand deleted successfully",
      success: true,
      status: 200
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all brands
export const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find({});
    if (!brands) {
      throw new Error("No brands found!");
    }
    return res.json({
      message: "Brands retrieved successfully",
      success: true,
      status: 200,
      brands
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get brand by id
export const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new Error("Brand not found!");
    }
    return res.json({
      message: "Brand retrieved successfully",
      success: true,
      status: 200,
      brand
    });
  } catch (error) {
    throw new Error(error);
  }
});