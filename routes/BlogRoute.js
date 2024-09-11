import express from 'express';
import { createBlog, getAllBlog, getBlog, updateBlog } from '../controller/Blog.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router =  express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/update-blog/:id', authMiddleware, isAdmin, updateBlog);
router.get('/get-blog/:id', authMiddleware, isAdmin, getBlog);
router.get('/get-all-blogs', getAllBlog);

export default router;