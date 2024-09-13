import express from 'express';
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from '../controller/prodCategory.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/update-prodcategory/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/delete-prodcategory/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/get-prodcategory/:id', getCategory);
router.get('/get-all-prodcategory/', getAllCategory);

export default router;