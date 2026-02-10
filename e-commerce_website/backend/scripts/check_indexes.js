import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        console.log("--- Order Indexes ---");
        console.log(await db.collection("orders").indexes());

        console.log("\n--- Product Indexes ---");
        console.log(await db.collection("products").indexes());

        console.log("\n--- User Indexes ---");
        console.log(await db.collection("users").indexes());

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkIndexes();
