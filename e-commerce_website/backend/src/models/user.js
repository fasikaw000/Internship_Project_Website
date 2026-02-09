import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  accountNumber: { type: String }, // Only for admin
  isSuspended: { type: Boolean, default: false },
  suspensionReason: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
});

export default mongoose.model("User", userSchema);
