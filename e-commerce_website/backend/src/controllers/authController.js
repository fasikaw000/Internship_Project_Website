import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { asyncHandler } from "../utils/errorHandler.js";
import { sendMail } from "../utils/sendMail.js";

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const passwordError = validatePasswordStrength(password);
  if (passwordError) return res.status(400).json({ message: passwordError });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    username: email // Use email as default username to satisfy unique constraint if field remains
  });

  res.status(201).json({ message: "User registered successfully" });
});

// Helper for password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) return `Password must be at least ${minLength} characters long.`;
  if (!hasUppercase) return "Password must contain at least one uppercase letter.";
  if (!hasLowercase) return "Password must contain at least one lowercase letter.";
  if (!hasNumber) return "Password must contain at least one number.";
  if (!hasSymbol) return "Password must contain at least one special character.";
  return null;
};

// Login a user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
    return res.status(403).json({ message: `Account is temporarily locked. Try again in ${remainingTime} minutes.` });
  }

  if (user.isSuspended) {
    return res.status(403).json({ message: `Account suspended: ${user.suspensionReason || "Contact support"}` });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= 10) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      user.failedLoginAttempts = 0; // Reset attempts after locking
      await user.save();
      return res.status(403).json({ message: "Account locked due to too many failed attempts. Try again in 15 minutes." });
    }

    await user.save();
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Reset lockout on success
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

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
    const passwordError = validatePasswordStrength(req.body.password);
    if (passwordError) return res.status(400).json({ message: passwordError });
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

// Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found with this email" });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set expire (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    await sendMail({
      to: user.email,
      subject: "Password Reset Token",
      html: message,
    });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(500).json({ message: "Email could not be sent" });
  }
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Set new password
  const passwordError = validatePasswordStrength(req.body.password);
  if (passwordError) return res.status(400).json({ message: passwordError });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset success",
  });
});

// Delete self account
export const deleteMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Optional Safeguard: Prevent unique/last admin from deleting themselves? 
  // Already handled in adminController for generic admin deletion.
  // Here we just allow standard user deletion. 

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
