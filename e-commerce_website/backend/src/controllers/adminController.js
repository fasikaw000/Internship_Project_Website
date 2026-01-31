import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/errorHandler.js";

// Get dashboard stats (Admin)
export const getStats = asyncHandler(async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);
  res.json({ users, products, orders });
});

// Get all users/customers (Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// Get any customer's information (Admin)
export const getCustomerInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Send screenshots of a customer's transaction (Admin)
export const getOrderReceipts = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id, status: "completed" });
  const receipts = orders.map(order => order.receiptImage).filter(Boolean);
  res.json(receipts);
});

// Commit a transaction (Admin)
export const commitTransaction = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = "completed";
  await order.save();
  res.json({ message: "Transaction completed", order });
});
