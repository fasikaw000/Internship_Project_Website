import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../src/models/Order.js";
import Review from "../src/models/Review.js";
import Comment from "../src/models/Comment.js";

dotenv.config();

const cleanData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // 1. Delete Orders
        const orders = await Order.deleteMany({});
        console.log(`Deleted ${orders.deletedCount} orders.`);

        // 2. Delete Reviews
        const reviews = await Review.deleteMany({});
        console.log(`Deleted ${reviews.deletedCount} reviews.`);

        // 3. Delete Comments (if any)
        try {
            const comments = await Comment.deleteMany({});
            console.log(`Deleted ${comments.deletedCount} comments.`);
        } catch (e) {
            console.log("No Comment model or table found, skipping.");
        }

        console.log("✅ Data cleanup complete! Website is fresh.");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

cleanData();
