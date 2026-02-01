import Order from "../models/Order.js";
import { asyncHandler } from "../utils/errorHandler.js";
import Product from "../models/Product.js";
import { sendMail } from "../utils/sendMail.js";

// Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  let { products, deliveryInfo } = req.body;
  if (typeof products === "string") products = JSON.parse(products);
  if (typeof deliveryInfo === "string") deliveryInfo = JSON.parse(deliveryInfo);

  if (!products || products.length === 0)
    return res.status(400).json({ message: "No products selected" });

  // Calculate total price and prepare summary for email
  let totalPrice = 0;
  let itemsSummary = "";
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
    const linePrice = product.price * item.quantity;
    totalPrice += linePrice;
    itemsSummary += `- ${product.name} (x${item.quantity}): ${linePrice.toFixed(2)} ETB\n`;
  }

  const order = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
    deliveryInfo,
    receiptImage: req.file?.filename,
  });

  // Notify Admin
  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Order Received - Order ID: ${order._id}`,
    text: `A new order has been placed by ${deliveryInfo.name} (${deliveryInfo.email}).\n\nTotal: ${totalPrice.toFixed(2)} ETB\n\nItems:\n${itemsSummary}\nAddress: ${deliveryInfo.address}\nPhone: ${deliveryInfo.phone}`,
    html: `<h3>New Order Received</h3>
           <p><strong>Customer:</strong> ${deliveryInfo.name} (${deliveryInfo.email})</p>
           <p><strong>Total:</strong> ${totalPrice.toFixed(2)} ETB</p>
           <h4>Items:</h4>
           <pre>${itemsSummary}</pre>
           <p><strong>Address:</strong> ${deliveryInfo.address}</p>
           <p><strong>Phone:</strong> ${deliveryInfo.phone}</p>`,
  });

  res.status(201).json(order);
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
  order.status = status || order.status;
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
