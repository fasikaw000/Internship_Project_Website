/**
 * Seed script: inserts 9 products (electronics, fashions, books) using existing images from uploads/products folder.
 * Run from backend folder: npm run seed
 */
import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../src/models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_ROOT = path.join(__dirname, "..");
const PROJECT_ROOT = path.join(BACKEND_ROOT, "..");
const SEED_IMAGES = path.join(PROJECT_ROOT, "seed-images");
const FRONTEND_PUBLIC = path.join(PROJECT_ROOT, "frontend", "public");
const UPLOADS_PRODUCTS = path.join(BACKEND_ROOT, "src", "uploads", "products");

const PRODUCTS = [
  { file: "headphones-audio-listen.jpg", name: "Premium Wireless Headphones", category: "electronics", price: 299.99, description: "High-quality wireless headphones with noise cancellation and superior sound quality." },
  { file: "elegant-smartphone-composition.jpg", name: "Elegant Smartphone", category: "electronics", price: 899.00, description: "Latest smartphone with advanced camera system and sleek design." },
  { file: "pexels-efrem-efre-2786187-12526086.jpg", name: "Smart Watch Pro", category: "electronics", price: 399.00, description: "Feature-rich smartwatch with health tracking and notifications." },
  { file: "vecteezy_stylish-winter-jacket_54348840.png", name: "Stylish Winter Jacket", category: "fashions", price: 179.99, description: "Warm and fashionable winter jacket perfect for cold weather." },
  { file: "pexels-ox-street-3848035-6050929.jpg", name: "Premium Sneakers", category: "fashions", price: 129.99, description: "Comfortable and stylish sneakers for everyday wear." },
  { file: "pexels-tima-miroshnichenko-5928998.jpg", name: "Fashion Ensemble", category: "fashions", price: 249.00, description: "Complete fashion outfit with modern design and premium materials." },
  { file: "sincerely-media-CXYPfveiuis-unsplash.jpg", name: "The Art of Mindfulness", category: "books", price: 24.99, description: "A comprehensive guide to meditation and mindful living." },
  { file: "pexels-solliefoto-273930.jpg", name: "Classic Literature Collection", category: "books", price: 34.99, description: "Timeless classics beautifully bound in premium edition." },
  { file: "pexels-mart-production-9558265.jpg", name: "Modern Business Guide", category: "books", price: 29.99, description: "Essential strategies for success in today's business world." },
];

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Skip (not found): ${src}`);
    return false;
  }
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${path.basename(src)} -> ${path.relative(BACKEND_ROOT, dest)}`);
  return true;
}

async function run() {
  console.log("Seed script: Using existing product images from uploads folder");

  // Verify that the uploads folder exists
  if (!fs.existsSync(UPLOADS_PRODUCTS)) {
    console.error(`Missing folder: ${UPLOADS_PRODUCTS}`);
    process.exit(1);
  }

  // Check which product images exist
  const existingImages = fs.readdirSync(UPLOADS_PRODUCTS);
  console.log(`Found ${existingImages.length} images in uploads/products folder`);

  // Connect and seed products
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env. Skipping database seed.");
    process.exit(1);
  }

  await mongoose.connect(uri);

  // Clear existing products to avoid duplicates/stale data
  await Product.deleteMany({});
  console.log("Cleared existing products from database.");

  for (const p of PRODUCTS) {
    // Check if the image file exists
    const imageExists = existingImages.includes(p.file);
    if (!imageExists) {
      console.warn(`Warning: Image file ${p.file} not found in uploads folder`);
    }

    await Product.findOneAndUpdate(
      { name: p.name },
      { name: p.name, category: p.category, price: p.price, description: p.description, image: p.file, stock: 10 },
      { upsert: true, new: true }
    );
    console.log(`✓ Product: ${p.name} ${imageExists ? '(with image)' : '(no image)'}`);
  }

  await mongoose.disconnect();
  console.log("\n✓ Seed complete! Products are ready with images.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
