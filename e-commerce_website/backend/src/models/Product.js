import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name is required"], trim: true },
  category: {
    type: String,
    enum: {
      values: ["electronics", "fashions", "books", "all"],
      message: "{VALUE} is not a valid category"
    },
    default: "all",
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  description: { type: String, required: [true, "Description is required"], trim: true },
  image: { type: String, required: [true, "Image is required"] },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative"]
  },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
