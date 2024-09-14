import Coupen from '../models/Coupen.model.js';
import asyncHandler from 'express-async-handler';
import { validatemongoID } from "../utils/validatemongoID.js";

// create a new coupon
export const createCoupon = asyncHandler(async (req, res) =>{
  const { name, discount, expiry } = req.body;
  try {
    const newCoupon = new Coupen({
      name,
      discount,
      expiry
    })
    await newCoupon.save();
    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: newCoupon
    });
  } catch (error) {
    throw new Error(error);
  }
})

// update a coupon
export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, discount, expiry } = req.body;
  validatemongoID(id);
  try {
    const updatedCoupon = await Coupen.findByIdAndUpdate(id, { name, discount, expiry }, { new: true });
    if (!updatedCoupon) {
      throw new Error("Coupon not found!");
    }
    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: updatedCoupon
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete a coupon
export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const deletedCoupon = await Coupen.findByIdAndDelete(id);
    if (!deletedCoupon) {
      throw new Error("Coupon not found!");
    }
    res.json({
      message: 'Coupon deleted successfully',
      success: true,
      status: 200,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all coupons
export const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupen.find({});
    if (!coupons) {
      throw new Error("No coupons found!");
    }
    res.json({
      success: true,
      message: 'Coupons retrieved successfully',
      data: coupons
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get a coupon by id
export const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoID(id);
  try {
    const coupon = await Coupen.findById(id);
    if (!coupon) {
      throw new Error("Coupon not found!");
    }
    res.json({
      success: true,
      message: 'Coupon retrieved successfully',
      data: coupon
    });
  } catch (error) {
    throw new Error(error);
  }
});