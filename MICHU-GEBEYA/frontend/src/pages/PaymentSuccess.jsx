import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function PaymentSuccess() {
    const { id } = useParams(); // Order ID
    const [status, setStatus] = useState("verifying"); // verifying, success, failed
    const { user } = useAuth();

    const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

    useEffect(() => {
        const verify = async () => {
            try {
                const token = localStorage.getItem("token"); // Manually get token since axios interceptor might not be in this simple component scope context if it depends on Provider ?? actually axios instance usually handles it.
                // Assuming we use the global axios instance or similar. 
                // Let's use direct axios for safety here or improved service call.
                const res = await axios.get(`${API_BASE}/api/payment/verify/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status === "verified" || res.data.message.includes("verified")) {
                    setStatus("success");
                } else {
                    setStatus("failed");
                }
            } catch (err) {
                console.error(err);
                setStatus("failed");
            }
        };

        if (id) verify();
    }, [id, API_BASE]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full animate-fadeIn">
                {status === "verifying" && (
                    <>
                        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-slate-800">Verifying Payment...</h2>
                        <p className="text-slate-500 mt-2">Please wait while we confirm your transaction.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h2>
                        <p className="text-slate-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
                        <div className="space-y-3">
                            <Link to="/orders" className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">View My Orders</Link>
                            <Link to="/products" className="block w-full text-slate-500 font-bold hover:text-slate-800">Continue Shopping</Link>
                        </div>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✕</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification Failed</h2>
                        <p className="text-slate-600 mb-8">We couldn't verify your payment. If you have been charged, please contact support.</p>
                        <Link to="/contact" className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">Contact Support</Link>
                    </>
                )}
            </div>
        </div>
    );
}
