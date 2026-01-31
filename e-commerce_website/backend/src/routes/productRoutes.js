import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { uploadProduct } from "../middleware/uploadProductMiddleware.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (User)
router.get("/", getProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID (User)
router.get("/:id", getProductById);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, uploadProduct.single("image"), addProduct);
router.put("/:id", authMiddleware, adminMiddleware, uploadProduct.single("image"), updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
