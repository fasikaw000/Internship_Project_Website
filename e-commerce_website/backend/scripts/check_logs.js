import mongoose from "mongoose";
import dotenv from "dotenv";
import AuditLog from "../src/models/AuditLog.js";

dotenv.config();

const checkLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await AuditLog.countDocuments();
        console.log(`Log count: ${count}`);
        if (count > 0) {
            const logs = await AuditLog.find().populate("admin", "email").limit(5);
            console.log("Recent logs:", JSON.stringify(logs, null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkLogs();
