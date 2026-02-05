import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  accountNumber: { type: String }, // Only for admin
  isSuspended: { type: Boolean, default: false },
  suspensionReason: { type: String },
});

export default mongoose.model("User", userSchema);
