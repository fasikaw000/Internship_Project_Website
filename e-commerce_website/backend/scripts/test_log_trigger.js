import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product.js";
import { logAction } from "../src/controllers/auditController.js";
import User from "../src/models/user.js";

dotenv.config();

const testLog = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: "admin" });
        if (!admin) {
            console.error("No admin found");
            process.exit(1);
        }

        const product = await Product.findOne();
        if (!product) {
            console.error("No product found");
            process.exit(1);
        }

        console.log("Triggering test log...");
        await logAction(
            admin._id,
            "TEST_ACTION",
            `Product: ${product.name}`,
            { info: "Manual test log" },
            "127.0.0.1"
        );

        console.log("Checking if log was created...");
        const AuditLog = (await import("../src/models/AuditLog.js")).default;
        const log = await AuditLog.findOne({ action: "TEST_ACTION" });
        if (log) {
            console.log("✅ Test log found!");
        } else {
            console.error("❌ Test log NOT found!");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLog();
