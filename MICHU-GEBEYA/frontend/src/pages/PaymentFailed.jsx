import { Link } from "react-router-dom";

export default function PaymentFailed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full animate-fadeIn">
                <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">!</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h2>
                <p className="text-slate-600 mb-8">You cancelled the payment process. No charges were made.</p>
                <Link to="/cart" className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Return to Cart</Link>
            </div>
        </div>
    );
}
