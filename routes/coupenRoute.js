import express from 'express';
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from '../controller/Coupen.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCoupon);
router.put('/update/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCoupon);
router.get('/get-all-coupens', authMiddleware, getAllCoupons);
router.get('/get-coupen/:id', authMiddleware, getCoupon);

export default router;