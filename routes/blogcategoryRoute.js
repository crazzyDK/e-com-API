import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../controller/BlogCategory.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/update/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/get-all-blogs', getAllCategories);
router.get('/get-blogs/:id', getCategory);

export default router;