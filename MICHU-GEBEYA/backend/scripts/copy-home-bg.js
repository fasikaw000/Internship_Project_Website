/**
 * Copy home page background image from Cursor assets to frontend/public/home-bg.png
 * Run from backend: node scripts/copy-home-bg.js "C:\path\to\assets"
 * Or set ASSETS_FOLDER env var. Looks for filename containing "shutter-speed" or "BQ9usyzHx_w".
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const FRONTEND_PUBLIC = path.join(PROJECT_ROOT, "frontend", "public");
const DEST = path.join(FRONTEND_PUBLIC, "home-bg.png");

const assetsDir = process.env.ASSETS_FOLDER || process.argv[2];
if (!assetsDir || !fs.existsSync(assetsDir)) {
  console.error("Usage: node scripts/copy-home-bg.js <path-to-assets-folder>");
  process.exit(1);
}

const files = fs.readdirSync(assetsDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
const found = files.find((f) => f.includes("shutter-speed") || f.includes("BQ9usyzHx_w") || f.includes("unsplash"));
if (!found) {
  console.error("No home background image (shutter-speed / unsplash) found in folder.");
  process.exit(1);
}

if (!fs.existsSync(FRONTEND_PUBLIC)) fs.mkdirSync(FRONTEND_PUBLIC, { recursive: true });
fs.copyFileSync(path.join(assetsDir, found), DEST);
console.log("Copied home background to frontend/public/home-bg.png");
