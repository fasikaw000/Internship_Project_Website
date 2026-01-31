import Comment from "../models/Comment.js";
import { asyncHandler } from "../utils/errorHandler.js";

// Customer creates a comment
export const createComment = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  const comment = await Comment.create({
    user: req.user._id,
    message,
  });

  res.status(201).json({ message: "Thank you, message is sent", comment });
});

// Get all comments (Admin)
export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user", "fullName email");
  res.json(comments);
});

// Admin replies to a comment
export const replyComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  comment.adminReply = req.body.adminReply || "";
  await comment.save();
  res.json(comment);
});

// Admin deletes a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  res.json({ message: "Comment deleted" });
});
