import express from 'express';
import { createCategory, deleteCategory, updateCategory } from '../controller/prodCategory.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/update-prodcategory/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/delete-prodcategory/:id', authMiddleware, isAdmin, deleteCategory);

export default router;