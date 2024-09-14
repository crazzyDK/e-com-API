import express from 'express';
import { addWishlist, createProduct, deleteProduct, getAllProducts, getProducts, rating, updateProducts } from '../controller/Product.controller.js';
import { isAdmin, authMiddleware  } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/all-products', getAllProducts);
router.get('/get-product/', getProducts);
router.put('/update-product/:id', authMiddleware, isAdmin, updateProducts);
router.get('/delete-product/:id', authMiddleware, isAdmin, deleteProduct);
router.put('/add-product', authMiddleware, addWishlist);
router.post('/rating', authMiddleware, rating);

export default router;