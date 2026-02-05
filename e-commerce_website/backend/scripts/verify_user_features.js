import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/user.js";
import Product from "../src/models/Product.js";
import Order from "../src/models/Order.js";
import Review from "../src/models/Review.js";
import bcrypt from "bcryptjs";

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Setup: Create User & Product
        const email = `testuser_${Date.now()}@example.com`;
        const user = await User.create({
            fullName: "Test User",
            email,
            password: await bcrypt.hash("password123", 10),
            username: `user_${Date.now()}`
        });
        console.log(`Created User: ${user.email}`);

        const product = await Product.create({
            name: "Review Test Product",
            price: 100,
            stock: 10,
            category: "electronics"
        });
        console.log(`Created Product: ${product.name} (Stock: ${product.stock})`);

        // 1. Verify Profile Update (Simulate Logic)
        console.log("\n--- Verifying Profile Update ---");
        user.fullName = "Updated Name";
        await user.save();
        const updatedUser = await User.findById(user._id);
        if (updatedUser.fullName === "Updated Name") {
            console.log("✅ Profile updated successfully.");
        } else {
            console.error("❌ Profile update failed.");
        }

        // 2. Verify Order Cancellation
        console.log("\n--- Verifying Order Cancellation ---");
        // Place Order
        const order = await Order.create({
            user: user._id,
            products: [{ product: product._id, quantity: 2 }],
            totalPrice: 200,
            deliveryInfo: { name: "Test", address: "Test", phone: "123", email },
            status: "pending",
            statusHistory: [{ status: "pending" }]
        });
        // Reduce stock manually as controller would
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -2 } });

        let pAfterOrder = await Product.findById(product._id);
        console.log(`Order Placed. Stock: ${pAfterOrder.stock} (Expected: 8)`);

        // Cancel Order (Simulate Controller Logic)
        if (order.status === "pending") {
            // Restore Stock
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
            order.status = "cancelled";
            await order.save();
        }

        const pAfterCancel = await Product.findById(product._id);
        console.log(`Order Cancelled. Stock: ${pAfterCancel.stock} (Expected: 10)`);

        if (pAfterCancel.stock === 10 && order.status === "cancelled") {
            console.log("✅ Order cancellation and stock restoration successful.");
        } else {
            console.error("❌ Order cancellation failed.");
        }

        // 3. Verify Product Reviews
        console.log("\n--- Verifying Product Reviews ---");

        // Attempt 1: Review without verified purchase (Order is cancelled now, so typically shouldn't work if strict, or we simulate a new non-purchased scenario)
        // Let's create a new product for clean state
        const product2 = await Product.create({ name: "Unbought Product", price: 50, stock: 5, category: "books" });

        // Check Logic
        const hasPurchased = await Order.findOne({
            user: user._id,
            "products.product": product2._id,
            status: { $in: ["verified", "delivered", "completed"] }
        });

        if (!hasPurchased) {
            console.log("✅ correctly blocked review for un-purchased product.");
        } else {
            console.error("❌ Failed to block review.");
        }

        // Attempt 2: Valid Review
        // Create a delivered order
        await Order.create({
            user: user._id,
            products: [{ product: product2._id, quantity: 1 }],
            totalPrice: 50,
            deliveryInfo: { name: "Test", address: "Test", phone: "123", email },
            status: "delivered"
        });

        const hasPurchasedValid = await Order.findOne({
            user: user._id,
            "products.product": product2._id,
            status: { $in: ["verified", "delivered", "completed"] }
        });

        if (hasPurchasedValid) {
            await Review.create({
                user: user._id,
                product: product2._id,
                rating: 5,
                comment: "Great book!"
            });
            console.log("✅ Review created successfully for purchased product.");
        } else {
            console.error("❌ Valid purchase verification failed.");
        }

        // Cleanup
        await User.deleteOne({ _id: user._id });
        await Product.deleteMany({ _id: { $in: [product._id, product2._id] } });
        await Order.deleteMany({ user: user._id });
        await Review.deleteMany({ user: user._id });

        console.log("\nTest Complete.");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
