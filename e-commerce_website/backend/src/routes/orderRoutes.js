import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  resubmitReceipt,
  cancelOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order (User)
router.post("/", authMiddleware, upload.single("receiptImage"), createOrder);

// @route   GET /api/orders/me
// @desc    Get orders of logged-in user
router.get("/me", authMiddleware, getUserOrders);

// @route   GET /api/orders
// @desc    Get all orders (Admin)
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin)
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

// @route   PUT /api/orders/:id/resubmit
// @desc    Resubmit receipt image (User)
router.put("/:id/resubmit", authMiddleware, upload.single("receiptImage"), resubmitReceipt);

// @route   PUT /api/orders/:id/cancel
// @desc    User cancel order
router.put("/:id/cancel", authMiddleware, cancelOrder);

export default router;
