import axios from "axios";
import { asyncHandler } from "../utils/errorHandler.js";
import Order from "../models/Order.js";

const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_VERIFY_URL = "https://api.chapa.co/v1/transaction/verify";

// Initialize Chapa Payment
export const initializePayment = async (order, user) => {
    const config = {
        headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
    };

    // Callback URL: The frontend URL where user is redirected after payment
    // We'll use a success page that handles the verification
    const CALLBACK_URL = `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/success/${order._id}`;
    // For Chapa specific return_url
    const RETURN_URL = `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/success/${order._id}`;

    const tx_ref = `tx-${order._id}-${Date.now()}`; // Unique transaction reference

    // Save the tx_ref to the order first!
    order.paymentRef = tx_ref;
    await order.save();

    const data = {
        amount: order.totalPrice,
        currency: "ETB",
        email: user.email,
        first_name: user.fullName.split(" ")[0],
        last_name: user.fullName.split(" ")[1] || "User",
        tx_ref: tx_ref,
        callback_url: CALLBACK_URL,
        return_url: RETURN_URL,
        customization: {
            title: "MichuGebeya Payment",
            description: `Payment for Order #${order._id}`,
        },
    };

    // MOCK MODE: If using the placeholder key, simulate success immediately
    if (process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY.includes("xxxxxxxx")) {
        console.log("⚠️  Using Mock Chapa Payment (Invalid Key Detected)");
        return CALLBACK_URL; // Redirect directly to success page
    }

    try {
        const response = await axios.post(CHAPA_URL, data, config);
        return response.data.data.checkout_url;
    } catch (error) {
        console.error("Chapa Error:", error.response?.data || error.message);
        throw new Error("Payment initialization failed");
    }
};

// Verify Payment Endpoint (Called by Frontend or Webhook)
export const verifyPayment = asyncHandler(async (req, res) => {
    const { id } = req.params; // Order ID
    console.log(`Verifying payment for order: ${id}`);

    const order = await Order.findById(id);
    if (!order) {
        console.log("Order not found");
        return res.status(404).json({ message: "Order not found" });
    }
    console.log(`Order status: ${order.status}, PaymentRef: ${order.paymentRef}`);



    if (order.status === "verified" || order.status === "pending" || order.status === "delivered") {
        // Already paid or processed
        return res.json({ message: "Payment verified", status: order.status });
    }

    // We need the tx_ref to verify with Chapa. 
    // Ideally we stored it, but Chapa verify endpoint uses tx_ref.
    // Wait, Chapa verify uses tx_ref. We generated it as `tx-${order._id}-...`.
    // If we didn't save it, we can't easily verify by ID unless we query our DB for the tx_ref.
    // NOTE: For this implementation, we will assume strict 1:1 and maybe we should have saved tx_ref in order.
    // CORRECT APPROACH: Save tx_ref in Order model.

    // Let's UPDATE Order Model first to support tx_ref.
    // For now, if we didn't save it, we might be stuck.
    // ALTERNATIVE: The frontend will receive the tx_ref? No, Chapa redirects.

    // Let's assume we update order model to store tx_ref.
    // If we lack tx_ref, we can't call Chapa verify easily without it.

    // Refactor: Let's assume the user passes the tx_ref if they have it? 
    // actually Chapa redirects with ?tx_ref=... usually or we rely on our stored one.

    // TO FIX: I will update Order model to have `paymentRef`.

    // ... (See next steps for model update)

    // Temporary: If we assume we saved it:
    if (!order.paymentRef) {
        console.log("Missing paymentRef");
        return res.status(400).json({ message: "No payment reference found for this order" });
    }

    // MOCK MODE: If using the placeholder key, simulate success
    if (process.env.CHAPA_SECRET_KEY && process.env.CHAPA_SECRET_KEY.includes("xxxxxxxx")) {
        console.log("Mock Mode: Verifying immediately.");
        order.status = "verified";
        order.statusHistory.push({ status: "verified", comment: "Payment verified via Mock Mode" });
        await order.save();
        return res.json({ message: "Payment verified successfully (Mock)", order });
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            },
        };

        const response = await axios.get(`${CHAPA_VERIFY_URL}/${order.paymentRef}`, config);

        if (response.data.status === "success") {
            order.status = "verified";
            order.statusHistory.push({ status: "verified", comment: "Payment verified via Chapa" });
            await order.save();
            return res.json({ message: "Payment verified successfully", order });
        } else {
            return res.status(400).json({ message: "Payment not successful" });
        }
    } catch (error) {
        console.error("Verify Error:", error.response?.data || error.message);
        return res.status(500).json({ message: "Verification failed" });
    }
});
