import express from "express";
import { getUserById, getAllUser, userLogin, userRegister, deleteUser, updateUser, refreshToken, userLogout } from "../controller/User.controller.js";
import { authMiddleware, blockUser, isAdmin, unblockUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/get-all-users', getAllUser);
router.get('/get/:id', authMiddleware, isAdmin, getUserById);
router.get('/delete/:id', deleteUser);
router.put('/update', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.get('/refresh-token', refreshToken);
router.get('/logout', userLogout);

export default router;