import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../src/models/user.js";
import Product from "../src/models/Product.js";

dotenv.config();

const testRealAction = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: "admin" });
        const product = await Product.findOne({ isDeleted: { $ne: true } });

        if (!admin || !product) {
            console.error("Admin or Product not found");
            process.exit(1);
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log(`Updating product ${product._id}...`);
        // Simulate product update call to backend
        const resPath = `http://localhost:5001/api/products/${product._id}`;

        // We need to use FormData or just JSON if the endpoint supports it. 
        // updateProduct controller uses req.body and req.file.
        // Let's use JSON for simplicity if possible.

        const response = await axios.put(resPath, {
            name: product.name,
            price: product.price,
            stock: (product.stock || 0) + 1,
            category: product.category,
            description: product.description
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Update status:", response.status);

        console.log("Fetching logs...");
        const logsRes = await axios.get("http://localhost:5001/api/admin/logs", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Logs count:", logsRes.data.length);
        console.log("Last log:", logsRes.data[0].action, logsRes.data[0].target);

        process.exit(0);
    } catch (err) {
        console.error("Action test failed:", err.response?.data || err.message);
        process.exit(1);
    }
};

testRealAction();
