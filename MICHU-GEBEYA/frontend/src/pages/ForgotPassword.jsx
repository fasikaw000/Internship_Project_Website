import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            setMessage(data.message);
            // Clear message after 2 seconds
            setTimeout(() => {
                setMessage("");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link");
            // Clear error after 2 seconds
            setTimeout(() => {
                setError("");
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md animate-fadeIn relative overflow-hidden">
                {/* Notification Area */}
                <div className="absolute top-0 left-0 right-0 z-10">
                    {message && (
                        <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold animate-slideDown shadow-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-600 text-white text-center py-2 text-sm font-semibold animate-slideDown shadow-sm">
                            {error}
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-bold text-center text-indigo-700 mt-2 mb-6 font-primary">Forgot Password</h2>
                <p className="text-gray-600 mb-6 text-center">Enter your email and we'll send you a link to reset your password.</p>

                <form onSubmit={submitHandler} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Email</label>
                        <input
                            type="email"
                            className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        Send Reset Link
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium">Back to Log In</a>
                </div>
            </div>
        </div>
    );
}
