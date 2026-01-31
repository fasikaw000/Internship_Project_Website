/**
 * Copy the 10 images from Cursor assets folder into seed-images with the correct names.
 * Run from backend folder: node scripts/copy-assets-to-seed.js "C:\path\to\assets"
 * Or set ASSETS_FOLDER env var.
 *
 * Expects the assets folder to contain exactly 10 image files (order by filename):
 * 1 = logo (shopping bag), 2-4 = electronics, 5-7 = fashion, 8-10 = books.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const SEED_IMAGES = path.join(PROJECT_ROOT, "seed-images");

// Filename must contain this substring -> copy as this target (order: logo, electronics 1-3, fashion 1-3, books 1-3)
const MATCH_ORDER = [
  "shopping-bag",
  "C3JVFsG8kzpwRLMTsn44m8",
  "Apple_iphone13",
  "m4-macbook-air",
  "31442939_60846431",
  "6149mVtxPvL",
  "casual-women-shoes",
  "229190-fc3d-1-min",
  "Book-58828bd7",
  "9789358562187",
];

const TARGET_NAMES = [
  "logo.png",
  "electronics-1.png",
  "electronics-2.png",
  "electronics-3.png",
  "fashion-1.png",
  "fashion-2.png",
  "fashion-3.png",
  "books-1.png",
  "books-2.png",
  "books-3.png",
];

const assetsDir = process.env.ASSETS_FOLDER || process.argv[2];
if (!assetsDir || !fs.existsSync(assetsDir)) {
  console.error("Usage: node scripts/copy-assets-to-seed.js <path-to-assets-folder>");
  console.error("Or set ASSETS_FOLDER to the folder containing your 10 images.");
  process.exit(1);
}

if (!fs.existsSync(SEED_IMAGES)) fs.mkdirSync(SEED_IMAGES, { recursive: true });

const files = fs.readdirSync(assetsDir)
  .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

for (let i = 0; i < MATCH_ORDER.length; i++) {
  const needle = MATCH_ORDER[i];
  const found = files.find((f) => f.includes(needle));
  if (!found) {
    console.warn(`No file containing "${needle}". Skipping ${TARGET_NAMES[i]}`);
    continue;
  }
  const src = path.join(assetsDir, found);
  const dest = path.join(SEED_IMAGES, TARGET_NAMES[i]);
  fs.copyFileSync(src, dest);
  console.log(`${found} -> ${TARGET_NAMES[i]}`);
}

console.log("Done. Run: npm run seed");
