import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.js";
import Order from "../src/models/order.js";

dotenv.config();

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Delete all users except admin
        const userResult = await User.deleteMany({ role: { $ne: "admin" } });
        console.log(`Deleted ${userResult.deletedCount} non-admin users.`);

        // Delete all orders
        const orderResult = await Order.deleteMany({});
        console.log(`Deleted ${orderResult.deletedCount} orders.`);

        console.log("Database cleanup complete.");
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetDB();
