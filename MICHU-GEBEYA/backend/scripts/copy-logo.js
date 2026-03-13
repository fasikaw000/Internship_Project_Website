/**
 * Copy a logo image to frontend/public/logo.png
 * Run from backend: node scripts/copy-logo.js "C:\path\to\assets"
 * Optional: node scripts/copy-logo.js "path" click-collect | person-basket | yellow-bag
 * Default: tries Click & Collect (4732442), then person-with-basket, then yellow transparent bag (19f8f732).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const FRONTEND_PUBLIC = path.join(PROJECT_ROOT, "frontend", "public");
const DEST = path.join(FRONTEND_PUBLIC, "logo.png");

const assetsDir = process.env.ASSETS_FOLDER || process.argv[2];
const choice = process.argv[3] || "";

const searchOrder = [
  ["person-with-basket", "53d8ca8f", "31339983"],  // Person with basket (dark figure)
  ["4732442", "click-collect"],
  ["19f8f732"],                   // Yellow 3D bag - transparent
];

const files = assetsDir && fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
  : [];

let found = null;
if (choice === "click-collect" || choice === "4732442") {
  found = files.find((f) => f.includes("4732442"));
} else if (choice === "person-basket" || choice === "person-with-basket") {
  found = files.find((f) => f.includes("person-with-basket") || f.includes("31339983") || f.includes("53d8ca8f"));
} else if (choice === "yellow-bag" || choice === "transparent") {
  found = files.find((f) => f.includes("19f8f732"));
} else {
  for (const [needle] of searchOrder) {
    found = files.find((f) => f.includes(needle));
    if (found) break;
  }
}

if (!assetsDir || !fs.existsSync(assetsDir)) {
  console.error("Usage: node scripts/copy-logo.js <path-to-assets-folder> [click-collect|person-basket|yellow-bag]");
  process.exit(1);
}
if (!found) {
  console.error("No logo image found. Options: click-collect (4732442), person-basket, yellow-bag (transparent).");
  process.exit(1);
}

if (!fs.existsSync(FRONTEND_PUBLIC)) fs.mkdirSync(FRONTEND_PUBLIC, { recursive: true });
fs.copyFileSync(path.join(assetsDir, found), DEST);
console.log("Copied", found, "-> frontend/public/logo.png");
