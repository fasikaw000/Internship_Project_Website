import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    remainingUses: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
