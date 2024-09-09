import express from 'express';
import { createProduct, getAllProducts, getProducts, updateProducts } from '../controller/Product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/all-products', getAllProducts);
router.get('/:id', getProducts);
router.put('/update-product/:id', updateProducts);

export default router;