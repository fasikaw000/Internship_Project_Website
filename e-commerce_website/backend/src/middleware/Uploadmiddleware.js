import multer from "multer";
import path from "path";

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads/receipts"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) return cb(new Error("Only image files allowed"), false);
  cb(null, true);
};

// Upload instance
export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
