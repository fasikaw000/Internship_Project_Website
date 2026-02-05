import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to check JWT token
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect: "Bearer <token>"
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // attach user to request

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
