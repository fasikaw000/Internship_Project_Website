import express from "express";
import {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    validateCoupon,
} from "../controllers/couponController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public/User Routes
router.post("/validate", authMiddleware, validateCoupon);

// Admin Routes
router.post("/", authMiddleware, adminMiddleware, createCoupon);
router.get("/", authMiddleware, adminMiddleware, getAllCoupons);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);

export default router;
