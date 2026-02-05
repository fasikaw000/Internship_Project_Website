import User from "../models/user.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { sendMail } from "../utils/sendMail.js";
import { logAction } from "./auditController.js";

// Get dashboard stats (Admin)
export const getStats = asyncHandler(async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  // Calculate Total Revenue
  const revenueResult = await Order.aggregate([
    { $match: { status: { $in: ["verified", "delivered", "completed"] } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Low Stock Products
  const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select("name stock");

  res.json({ users, products, orders, totalRevenue, lowStockProducts });
});

// Get all users/customers (Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// Suspend/Unsuspend User (Admin)
export const toggleUserSuspension = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "admin") {
    return res.status(400).json({ message: "Cannot suspend an admin" });
  }

  user.isSuspended = !user.isSuspended;
  user.suspensionReason = req.body.reason || (user.isSuspended ? "Violation of terms" : null);

  await user.save();

  // Log the action
  await logAction(
    req.user._id,
    user.isSuspended ? "SUSPEND_USER" : "UNSUSPEND_USER",
    `User: ${user.email}`,
    { reason: user.suspensionReason },
    req.ip
  );

  res.json({
    message: `User ${user.isSuspended ? "suspended" : "unsuspended"}`,
    user
  });
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

// Request Receipt Resubmission (Admin)
export const requestReceiptResubmission = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "email name");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "verified" || order.status === "delivered") {
    return res.status(400).json({ message: "Cannot request resubmission for verified or delivered orders." });
  }

  order.status = "receipt_rejected";
  await order.save();

  // Send email to user
  const emailSubject = "Action Required: Please Resubmit Your Payment Receipt";
  const emailText = `Dear ${order.deliveryInfo.name || "Customer"},\n\nYour payment receipt for Order #${order._id} was unclear or invalid. Please upload a clear image of your receipt to proceed with your order processing.\n\nThank you,\nStore Admin`;

  const emailHtml = `
    <h3>Action Required: Receipt Resubmission</h3>
    <p>Dear ${order.deliveryInfo.name || "Customer"},</p>
    <p>Your payment receipt for <strong>Order #${order._id}</strong> was unclear or invalid.</p>
    <p>Please log in to your account and upload a clear image of your receipt to proceed with your order processing.</p>
    <br>
    <p>Thank you,</p>
    <p><strong>Store Admin</strong></p>
  `;

  await sendMail({
    to: order.deliveryInfo.email || order.user.email,
    subject: emailSubject,
    text: emailText,
    html: emailHtml,
  });

  res.json({ message: "Receipt resubmission requested and email sent", order });
});
