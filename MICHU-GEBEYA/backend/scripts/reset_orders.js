import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../src/models/Order.js";

dotenv.config();

const resetOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const result = await Order.deleteMany({});
        console.log(`Deleted ${result.deletedCount} orders.`);

        console.log("Database reset complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error resetting database:", error);
        process.exit(1);
    }
};

resetOrders();
