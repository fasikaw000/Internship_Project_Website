/**
 * Seed script: copies logo + product images and inserts 9 products (electronics, fashion, books).
 * Run from backend folder: npm run seed
 * Requires: seed-images/ folder at e-commerce_website/seed-images with logo.png and electronics-1.png ... books-3.png
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
  { file: "electronics-1.png", name: "1MORE Over-Ear Headphones", category: "electronics", price: 89.99, description: "Navy blue over-ear headphones, comfortable padded ear cups and headband." },
  { file: "electronics-2.png", name: "iPhone 13", category: "electronics", price: 799.00, description: "Apple iPhone 13 in rose gold, dual camera, powerful performance." },
  { file: "electronics-3.png", name: "MacBook Pro", category: "electronics", price: 1299.00, description: "Silver MacBook Pro, large display, premium build." },
  { file: "fashion-1.jpg", name: "Brown Shearling Jacket", category: "fashion", price: 249.00, description: "Brown teddy fleece jacket with shearling collar, full zip." },
  { file: "fashion-2.jpg", name: "Light Blue Dress Shirt", category: "fashion", price: 49.99, description: "Classic long-sleeved men's dress shirt in light blue." },
  { file: "fashion-3.jpg", name: "Platform Sneakers", category: "fashion", price: 79.99, description: "Women's pink and white platform sneakers with metallic accents." },
  { file: "books-1.png", name: "really good, actually", category: "books", price: 16.99, description: "Novel by Monica Heisey. Wildly funny and relatable." },
  { file: "books-2.png", name: "The Power of Your Dreams", category: "books", price: 18.99, description: "A guide to hearing and understanding how God speaks while you sleep. By Stephanie Ike Okafor." },
  { file: "books-3.png", name: "The Book of Hope", category: "books", price: 22.99, description: "Inspirational book with gold and green butterfly design." },
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
  console.log("Seed images folder:", SEED_IMAGES);
  if (!fs.existsSync(SEED_IMAGES)) {
    console.error("Missing folder: seed-images. Create it at e-commerce_website/seed-images and add the 10 images (see seed-images/README.md).");
    process.exit(1);
  }

  // 1) Copy logo and home background to frontend public
  copyFile(path.join(SEED_IMAGES, "logo.png"), path.join(FRONTEND_PUBLIC, "logo.png"));
  copyFile(path.join(SEED_IMAGES, "home-bg.png"), path.join(FRONTEND_PUBLIC, "home-bg.png"));

  // 2) Ensure uploads/products exists and copy product images (use stable filenames for DB)
  if (!fs.existsSync(UPLOADS_PRODUCTS)) fs.mkdirSync(UPLOADS_PRODUCTS, { recursive: true });

  const imageFilenames = {};
  for (const p of PRODUCTS) {
    const src = path.join(SEED_IMAGES, p.file);
    const ext = path.extname(p.file);
    const stableName = p.file.replace(ext, "") + ext;
    const dest = path.join(UPLOADS_PRODUCTS, stableName);
    if (copyFile(src, dest)) imageFilenames[p.file] = stableName;
  }

  // 3) Connect and seed products
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
    const imageName = imageFilenames[p.file];
    await Product.findOneAndUpdate(
      { name: p.name },
      { name: p.name, category: p.category, price: p.price, description: p.description, image: imageName || undefined, stock: 10 },
      { upsert: true, new: true }
    );
    console.log("Product:", p.name, imageName ? "(with image)" : "(no image)");
  }

  await mongoose.disconnect();
  console.log("Seed done. Logo and products are ready.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
