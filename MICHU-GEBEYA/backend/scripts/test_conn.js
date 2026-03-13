import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConn = async () => {
    console.time("connect");
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.timeEnd("connect");
        console.log("Connected");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
};

testConn();
