import express from "express";
import {
  createComment,
  getAllComments,
  replyComment,
  deleteComment,
} from "../controllers/commentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// @route   POST /api/comments
// @desc    Customer creates a comment
router.post("/", authMiddleware, createComment);

// @route   GET /api/comments
// @desc    Admin gets all comments
router.get("/", authMiddleware, adminMiddleware, getAllComments);

// @route   PUT /api/comments/:id
// @desc    Admin replies to comment
router.put("/:id", authMiddleware, adminMiddleware, replyComment);

// @route   DELETE /api/comments/:id
// @desc    Admin deletes comment
router.delete("/:id", authMiddleware, adminMiddleware, deleteComment);

export default router;
