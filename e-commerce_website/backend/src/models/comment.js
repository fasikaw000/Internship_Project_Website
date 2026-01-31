import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  adminReply: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Comment", commentSchema);
