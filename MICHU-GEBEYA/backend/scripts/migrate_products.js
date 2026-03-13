import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product.js";

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const result = await Product.updateMany(
            { isDeleted: { $exists: false } },
            { $set: { isDeleted: false } }
        );

        console.log(`Migration Complete. Updated ${result.modifiedCount} products.`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrate();
