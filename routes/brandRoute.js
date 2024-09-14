import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from '../controller/Brand.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/update/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/get-all-brands', getAllBrands);
router.get('/get-brand/:id', getBrand);

export default router;