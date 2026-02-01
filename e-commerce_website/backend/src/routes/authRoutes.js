import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login a user
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get("/me", authMiddleware, getMe);

export default router;
