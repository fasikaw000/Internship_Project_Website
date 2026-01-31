import multer from "multer";
import path from "path";
import fs from "fs";

const productUploadDir = "src/uploads/products";
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, productUploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) return cb(new Error("Only image files (png, jpg, jpeg, webp) allowed"), false);
  cb(null, true);
};

export const uploadProduct = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
