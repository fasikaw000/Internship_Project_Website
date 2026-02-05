import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandler.js";

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, username, email, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully" });
});

// Login a user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (user.isSuspended) {
    return res.status(403).json({ message: `Account suspended: ${user.suspensionReason || "Contact support"}` });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email } });
});

// Get current user profile
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ id: user._id, fullName: user.fullName, role: user.role, email: user.email });
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  res.json({
    id: updatedUser._id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    role: updatedUser.role,
    token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
  });
});
