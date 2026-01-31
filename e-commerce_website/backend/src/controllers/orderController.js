import Order from "../models/Order.js";
import { asyncHandler } from "../utils/errorHandler.js";
import Product from "../models/Product.js";

// Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  let { products, deliveryInfo } = req.body;
  if (typeof products === "string") products = JSON.parse(products);
  if (typeof deliveryInfo === "string") deliveryInfo = JSON.parse(deliveryInfo);

  if (!products || products.length === 0)
    return res.status(400).json({ message: "No products selected" });

  // Calculate total price
  let totalPrice = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
    deliveryInfo,
    receiptImage: req.file?.filename,
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
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status || order.status;
  await order.save();
  res.json(order);
});
