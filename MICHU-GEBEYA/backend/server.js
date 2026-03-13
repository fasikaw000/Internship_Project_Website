import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import couponRoutes from "./src/routes/couponRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import { errorMiddleware } from "./src/utils/errorHandler.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, "src/uploads/receipts"),
  path.join(__dirname, "src/uploads/products"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});
// Serve uploaded receipts and product images
app.use("/uploads/receipts", express.static(path.join(__dirname, "src/uploads/receipts")));
app.use("/uploads/products", express.static(path.join(__dirname, "src/uploads/products")));

// Public config (admin CBE account for checkout)
app.get("/api/config/bank", (req, res) => {
  res.json({
    fullName: process.env.ADMIN_FULLNAME || "Admin",
    accountNumber: process.env.ADMIN_ACCOUNT_NUMBER || "",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
