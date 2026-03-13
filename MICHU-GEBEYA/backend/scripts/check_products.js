import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product.js";

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const count = await Product.countDocuments();
        const visibleCount = await Product.countDocuments({ isDeleted: false });
        console.log(`Total Products in DB: ${count}`);
        console.log(`Visible Products (isDeleted: false): ${visibleCount}`);

        if (count > 0) {
            const p = await Product.findOne();
            console.log("Sample Product:", p);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
