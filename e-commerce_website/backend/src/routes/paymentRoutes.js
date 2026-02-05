import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Verify Payment: POST /api/payment/verify/:id
router.get("/verify/:id", authMiddleware, verifyPayment);

export default router;
