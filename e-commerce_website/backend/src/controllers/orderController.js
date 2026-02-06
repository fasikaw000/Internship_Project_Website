import Order from "../models/Order.js";
import { asyncHandler } from "../utils/errorHandler.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

import { sendMail } from "../utils/sendMail.js";
import { initializePayment } from "./paymentController.js";

// Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  let { products, deliveryInfo } = req.body;
  if (typeof products === "string") products = JSON.parse(products);
  if (typeof deliveryInfo === "string") deliveryInfo = JSON.parse(deliveryInfo);

  if (!products || products.length === 0)
    return res.status(400).json({ message: "No products selected" });

  // 1. Validate Stock & Calculate Price
  let totalPrice = 0;
  let itemsSummary = "";

  // First pass: Check stock availability
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product not found` });

    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}. Only ${product.stock} available.` });
    }

    // Accumulate price
    const linePrice = product.price * item.quantity;
    totalPrice += linePrice;
    itemsSummary += `- ${product.name} (x${item.quantity}): ${linePrice.toFixed(2)} ETB\n`;
  }

  // Apple Coupon Discount
  let discountAmount = 0;
  if (req.body.couponCode) {
    const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase(), isActive: true });

    // Simple validation (can be more robust in real world, e.g. check expiry again)
    if (coupon && coupon.remainingUses > 0 && new Date() <= coupon.expiryDate) {
      discountAmount = (totalPrice * coupon.discountPercent) / 100;
      totalPrice -= discountAmount;
      itemsSummary += `\nDiscount (${coupon.code}): -${discountAmount.toFixed(2)} ETB`;

      // Decrement use
      coupon.remainingUses -= 1;
      await coupon.save();
    }
  }

  // Second pass: Deduct stock
  for (const item of products) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
  }

  /* 
   * PAYMENT LOGIC UPDATE:
   * If a receipt image is uploaded, we assume manual bank transfer.
   * If no receipt, we could fallback to Chapa, but currently frontend forces receipt.
   */
  let receiptImage = null;
  if (req.file) {
    receiptImage = req.file.filename;
  }

  const tx_ref = `tx-${Date.now()}`;

  const order = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
    deliveryInfo,
    paymentRef: receiptImage ? null : tx_ref, // Use tx_ref only if using Chapa (no receipt)
    receiptImage: receiptImage,
    status: receiptImage ? "pending_payment" : "pending_payment",
    statusHistory: [{ status: "pending_payment", comment: "Order placed. Waiting for verification." }],
  });

  // If we have a receipt, we are done. Return success.
  if (receiptImage) {
    return res.status(201).json({ order, message: "Order placed successfully. Receipt uploaded." });
  }

  // Fallback to Chapa (Only if no receipt uploaded, though frontend validates existence)
  try {
    const paymentUrl = await initializePayment(order, req.user);
    res.status(201).json({ order, paymentUrl });
  } catch (error) {
    // If payment init fails, we might want to delete the order or keep it as failed?
    // For now, return error
    order.status = "cancelled";
    await order.save();
    return res.status(500).json({ message: "Failed to initialize payment gateway" });
  }
});

// Get orders for logged-in user
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("products.product");
  res.json(orders);
});

// Get all orders (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "fullName email").populate("products.product");
  res.json(orders);
});

// Update order status (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate("user", "fullName email");
  if (!order) return res.status(404).json({ message: "Order not found" });

  const oldStatus = order.status;

  // Prevent changing status if order is already delivered, unless needed (optional: can be strict)
  if (oldStatus === "delivered" && (status === "receipt_rejected" || status === "cancelled")) {
    return res.status(400).json({ message: "Cannot change status of a delivered order to rejected or cancelled." });
  }

  // Stock Restoration Logic (if cancelling, rejecting, or refunding)
  if ((status === "cancelled" || status === "receipt_rejected" || status === "refunded") &&
    oldStatus !== "cancelled" && oldStatus !== "receipt_rejected" && oldStatus !== "refunded") {
    // Only restore if we are coming from a state where stock was reserved
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
  }

  order.status = status || order.status;

  // Add to history
  if (oldStatus !== order.status) {
    order.statusHistory.push({
      status: order.status,
      comment: `Status updated from ${oldStatus} to ${order.status}`,
    });
  }

  await order.save();

  // Notify Customer if status changed to verified or delivered
  if (oldStatus !== order.status) {
    let subject = "";
    let messageBody = "";

    if (order.status === "verified") {
      subject = "Transaction Completed - Your Order is Verified";
      messageBody = `Hi ${order.deliveryInfo?.name || "Customer"},\n\nYour payment for Order #${order._id} has been verified. We are now preparing your items for delivery.\n\nThank you for shopping with us!`;
    } else if (order.status === "delivered") {
      subject = "Order Delivered - Thank You!";
      messageBody = `Hi ${order.deliveryInfo?.name || "Customer"},\n\nGood news! Your Order #${order._id} has been delivered to ${order.deliveryInfo?.address}.\n\nWe hope you enjoy your purchase!`;
    }

    if (subject) {
      await sendMail({
        to: order.deliveryInfo?.email || order.user?.email,
        subject,
        text: messageBody,
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #4f46e5;">Order Update</h2>
                <p>${messageBody.replace(/\n/g, "<br>")}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">This is an automated notification from our store.</p>
               </div>`,
      });
    }
  }

  res.json(order);
});

// Update receipt image (User resubmission)
export const resubmitReceipt = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "receipt_rejected" && order.status !== "pending") {
    return res.status(400).json({ message: "You can only resubmit receipt for rejected or pending orders." });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a valid image file." });
  }

  order.receiptImage = req.file.filename;
  order.status = "pending"; // Reset status to pending so admin can check again
  await order.save();

  // Notify Admin about resubmission
  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `Receipt Re-uploaded for Order ID: ${order._id}`,
    text: `Customer ${order.deliveryInfo.name} has re-uploaded the payment receipt for Order #${order._id}.\n\nPlease review it in the admin dashboard.`,
    html: `<h3>Receipt Re-uploaded</h3>
           <p>Customer <strong>${order.deliveryInfo.name}</strong> has re-uploaded the payment receipt for <strong>Order #${order._id}</strong>.</p>
           <p>Please review it in the admin dashboard.</p>`,
  });

  res.json(order);
});

// User cancels their own order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "pending") {
    return res.status(400).json({ message: "You can only cancel pending orders. If already verified, please contact support." });
  }

  // Restore Stock
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  order.status = "cancelled";
  order.statusHistory.push({ status: "cancelled", comment: "User cancelled the order" });
  await order.save();

  // Notify Admin
  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `Order Cancelled by User - Order ID: ${order._id}`,
    text: `Order #${order._id} has been cancelled by the user.\n\nStock has been automatically restored.`,
    html: `<h3>Order Cancelled</h3>
           <p>Order <strong>#${order._id}</strong> has been cancelled by the user.</p>
           <p>Stock has been automatically restored.</p>`,
  });

  res.json({ message: "Order cancelled successfully", order });
});
