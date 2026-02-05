import express from "express";
import {
  getStats,
  getUsers,
  getCustomerInfo,
  getOrderReceipts,
  commitTransaction,
  requestReceiptResubmission,
  toggleUserSuspension,
} from "../controllers/adminController.js";
import { getAuditLogs } from "../controllers/auditController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// @route   GET /api/admin/logs
// @desc    View audit logs (Admin)
router.get("/logs", authMiddleware, adminMiddleware, getAuditLogs);

// @route   GET /api/admin/stats
// @desc    Dashboard stats (Admin)
router.get("/stats", authMiddleware, adminMiddleware, getStats);

// @route   GET /api/admin/users
// @desc    List all users (Admin)
router.get("/users", authMiddleware, adminMiddleware, getUsers);

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend/Unsuspend user (Admin)
router.put("/users/:id/suspend", authMiddleware, adminMiddleware, toggleUserSuspension);

// @route   GET /api/admin/customer/:id
// @desc    Get any customer's information (Admin)
router.get("/customer/:id", authMiddleware, adminMiddleware, getCustomerInfo);

// @route   GET /api/admin/customer/:id/receipts
// @desc    Get all receipts of a customer (Admin)
router.get("/customer/:id/receipts", authMiddleware, adminMiddleware, getOrderReceipts);

// @route   PUT /api/admin/order/:id/commit
// @desc    Commit a transaction (Admin)
router.put("/order/:id/commit", authMiddleware, adminMiddleware, commitTransaction);

// @route   POST /api/admin/order/:id/resubmit-receipt
// @desc    Request receipt resubmission (Admin)
router.post("/order/:id/resubmit-receipt", authMiddleware, adminMiddleware, requestReceiptResubmission);

export default router;
