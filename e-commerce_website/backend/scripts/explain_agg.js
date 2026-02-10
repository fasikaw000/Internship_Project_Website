import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../src/models/Order.js";

dotenv.config();

const explainAgg = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const pipeline = [
            { $match: { status: { $in: ["verified", "delivered", "completed"] } } },
            {
                $facet: {
                    total: [{ $group: { _id: null, sum: { $sum: "$totalPrice" } } }],
                    today: [
                        { $match: { createdAt: { $gte: startOfToday } } },
                        { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
                    ]
                }
            }
        ];

        console.log("Explaining aggregation...");
        const explain = await Order.aggregate(pipeline).explain();
        console.log(JSON.stringify(explain, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

explainAgg();
