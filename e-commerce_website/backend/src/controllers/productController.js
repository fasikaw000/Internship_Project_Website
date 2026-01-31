import Product from "../models/Product.js";
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
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  Object.assign(product, req.body);
  if (req.file) product.image = req.file.filename;
  await product.save();
  res.json(product);
});

// Delete a product (Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.remove();
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
