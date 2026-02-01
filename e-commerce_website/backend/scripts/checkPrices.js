import "dotenv/config";
import mongoose from "mongoose";
import Product from "../src/models/Product.js";

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({}, "name price");
    console.log("Current Database Products & Prices:");
    products.forEach(p => console.log(`- ${p.name}: ${p.price}`));
    await mongoose.disconnect();
}

check().catch(console.error);
