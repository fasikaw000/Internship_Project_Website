import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryInfo: {
    name: String,
    phone: String,
    email: String,
    address: String,
  },
  receiptImage: { type: String }, // uploaded by user
  paymentRef: { type: String }, // Chapa Transaction Reference
  status: {
    type: String,
    enum: ["pending", "pending_payment", "verified", "shipped", "delivered", "cancelled", "refunded", "receipt_rejected"],
    default: "pending_payment",
  },
  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      comment: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
