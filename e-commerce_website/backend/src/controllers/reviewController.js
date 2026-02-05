import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/errorHandler.js";

// Create a review (Verified Purchase only)
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    // 1. Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: req.user._id, product: productId });
    if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // 2. Check if user actually bought the product (Verified Purchase)
    const hasPurchased = await Order.findOne({
        user: req.user._id,
        "products.product": productId,
        status: { $in: ["verified", "delivered", "completed"] }
    });

    if (!hasPurchased) {
        return res.status(403).json({ message: "You can only review products you have purchased" });
    }

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment,
    });

    res.status(201).json(review);
});

// Get reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId })
        .populate("user", "fullName")
        .sort({ createdAt: -1 });
    res.json(reviews);
});
