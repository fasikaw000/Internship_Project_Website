import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "../src/models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI not set");
        process.exit(1);
    }

    await mongoose.connect(uri);

    const products = await Product.find({});
    console.log("Total products:", products.length);

    const categories = {};
    products.forEach(p => {
        if (!categories[p.category]) categories[p.category] = 0;
        categories[p.category]++;
        console.log(`Product: "${p.name}", Category: "${p.category}"`);
    });

    console.log("\nCategory counts:", categories);

    await mongoose.disconnect();
}

run().catch(console.error);
