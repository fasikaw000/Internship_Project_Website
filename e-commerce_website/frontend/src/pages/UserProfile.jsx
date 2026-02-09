import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function UserProfile() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      await api.delete("/auth/me");
      setSuccess("Account successfully deleted. Redirecting...");
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account. Please try again.");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header/Banner Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="px-8 pb-8">
          {/* Profile Picture Placeholder */}
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-md">
              {user.fullName?.charAt(0)}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">{user.fullName}</h2>
          <p className="text-gray-500 mb-6 flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
            {user.role?.toUpperCase() || "USER"} Profile
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</p>
              <p className="text-gray-800 font-medium">{user.fullName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Email Address</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-bold animate-fadeIn">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="border-t border-gray-100 pt-8 mt-8">
            {!showConfirm ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Account Actions</h3>
                  <p className="text-sm text-gray-500">Manage your account presence and security.</p>
                </div>

                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-lg transition-all duration-300 focus:ring-4 focus:ring-red-100"
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center animate-fadeIn">
                <p className="text-rose-900 font-black mb-1 uppercase tracking-tight text-sm">⚠ Critical Action</p>
                <p className="text-rose-700 text-sm mb-4">Are you sure you want to delete your account? This action is permanent and all your data will be removed forever.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition shadow-lg shadow-rose-200"
                  >
                    {loading ? "Deleting..." : "Yes, Delete Everything"}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="px-6 py-2 bg-white text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <p className="text-indigo-800 font-medium mb-1">Enjoying our store?</p>
        <p className="text-indigo-600 text-sm">Check out our latest products or view your previous orders.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="/" className="text-indigo-700 font-bold hover:underline">Shop Now</a>
          <span className="text-indigo-300">|</span>
          <a href="/order/me" className="text-indigo-700 font-bold hover:underline">My Orders</a>
        </div>
      </div>
    </div>
  );
}
