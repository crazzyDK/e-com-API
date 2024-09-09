import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProducts, updateProducts } from '../controller/Product.controller.js';
import { isAdmin, authMiddleware  } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/all-products', getAllProducts);
router.get('/get-product/', getProducts);
router.put('/update-product/:id', authMiddleware, isAdmin, updateProducts);
router.get('/delete-product/:id', authMiddleware, isAdmin, deleteProduct);

export default router;