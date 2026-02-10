import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Full name is required"], trim: true },
  username: { type: String, unique: true, sparse: true, trim: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email']
  },
  password: { type: String, required: [true, "Password is required"] },
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
