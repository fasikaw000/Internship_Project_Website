import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../src/models/user.js";

dotenv.config();

const testApi = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: "admin" });
        if (!admin) {
            console.error("No admin found");
            process.exit(1);
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Generated Token:", token);

        // Simulate fetch
        const response = await fetch("http://localhost:5001/api/admin/logs", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Logs count fetched:", data.length);
        if (data.length > 0) {
            console.log("Latest log action:", data[0].action);
        }

        process.exit(0);
    } catch (err) {
        console.error("API Test failed:", err.message);
        process.exit(1);
    }
};

testApi();
