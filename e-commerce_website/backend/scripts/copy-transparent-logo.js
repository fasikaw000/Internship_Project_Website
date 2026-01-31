/**
 * Copy the transparent logo (yellow 3D shopping bag) to frontend/public/logo.png
 * Run from backend: node scripts/copy-transparent-logo.js "C:\path\to\assets"
 * Looks for filename containing "19f8f732" (transparent logo).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const FRONTEND_PUBLIC = path.join(PROJECT_ROOT, "frontend", "public");
const DEST = path.join(FRONTEND_PUBLIC, "logo.png");

const assetsDir = process.env.ASSETS_FOLDER || process.argv[2];
if (!assetsDir || !fs.existsSync(assetsDir)) {
  console.error("Usage: node scripts/copy-transparent-logo.js <path-to-assets-folder>");
  process.exit(1);
}

const files = fs.readdirSync(assetsDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
const found = files.find((f) => f.includes("19f8f732"));
if (!found) {
  console.error("Transparent logo (19f8f732) not found in folder.");
  process.exit(1);
}

if (!fs.existsSync(FRONTEND_PUBLIC)) fs.mkdirSync(FRONTEND_PUBLIC, { recursive: true });
fs.copyFileSync(path.join(assetsDir, found), DEST);
console.log("Copied transparent logo to frontend/public/logo.png");
