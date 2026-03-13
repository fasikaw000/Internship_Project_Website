import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.js";
import Order from "../src/models/order.js";
import AuditLog from "../src/models/AuditLog.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

        // Delete all admin history (audit logs)
        const auditResult = await AuditLog.deleteMany({});
        console.log(`Deleted ${auditResult.deletedCount} history logs.`);

        console.log("Database cleanup complete.");
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetDB();
