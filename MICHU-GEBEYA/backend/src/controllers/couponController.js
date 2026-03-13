import Coupon from "../models/Coupon.js";
import { asyncHandler } from "../utils/errorHandler.js";

// Create Coupon (Admin)
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountPercent, remainingUses, expiryDate } = req.body;
    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountPercent,
        remainingUses,
        expiryDate,
    });
    res.status(201).json(coupon);
});

// Get all coupons (Admin)
export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
});

// Delete Coupon (Admin)
export const deleteCoupon = asyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
});

// Validate Coupon (User)
export const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (new Date() > coupon.expiryDate) {
        return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.remainingUses <= 0) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.json({
        message: "Coupon applied",
        discountPercent: coupon.discountPercent,
        code: coupon.code
    });
});
