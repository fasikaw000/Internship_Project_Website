import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/errorHandler.js";

// Add a new product (Admin)
export const addProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  const product = await Product.create({
    name,
    category,
    price,
    description,
    stock,
    image: req.file?.filename,
  });
  res.status(201).json(product);
});

// Update a product (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (name) product.name = name;
  if (category) product.category = category;
  if (price) product.price = Number(price);
  if (description) product.description = description;
  if (stock !== undefined) product.stock = Number(stock);
  if (req.file) product.image = req.file.filename;

  await product.save();
  res.json(product);
});

// Delete a product (Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { force } = req.query;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // 1. Check for ACTIVE orders (pending, verified) - Hard block
  const activeOrder = await Order.findOne({
    "products.product": id,
    status: { $in: ["pending", "verified"] }
  });
  if (activeOrder) {
    return res.status(400).json({
      message: "This product is linked to active orders.",
      isLinked: true,
      isActive: true
    });
  }

  // 2. Check for OTHER orders (delivered, cancelled) - Warning only
  const otherOrder = await Order.findOne({ "products.product": id });
  if (otherOrder && force !== "true") {
    return res.status(400).json({
      message: "This product is associated with existing orders. Deleting it may affect order records.",
      isLinked: true,
      isActive: false
    });
  }

  await Product.findByIdAndDelete(id);
  res.json({ message: "Product removed" });
});

// Get all products (User), optional category filter
export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category && category.toLowerCase() !== "all") {
    filter.category = category.toLowerCase();
  }
  const products = await Product.find(filter);
  res.json(products);
});

// Get product by ID (User)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});
