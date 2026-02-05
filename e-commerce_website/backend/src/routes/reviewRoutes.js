import express from "express";
import { createReview, getProductReviews } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: View Reviews
router.get("/:productId", getProductReviews);

// Private: Add Review (Verified Purchase)
router.post("/", authMiddleware, createReview);

export default router;
