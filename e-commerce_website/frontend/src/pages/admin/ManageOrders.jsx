import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      loadOrders();
      if (status === "completed") {
        alert("Transaction completed. Customer will see this status.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
        </div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-4 text-left">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm font-semibold italic">← Back to Dashboard</Link>
      </div>
      <h2 className="text-3xl font-extrabold mb-8 text-slate-900 tracking-tight">Manage Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Left Column: Client & Status */}
              <div className="p-6 md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Order ID: {o._id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(o.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{o.user?.fullName}</h3>
                  <p className="text-xs text-slate-500 truncate mb-4 italic">{o.user?.email}</p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-slate-600"><span className="font-bold text-slate-400 uppercase text-[9px]">Phone:</span> {o.deliveryInfo?.phone}</p>
                    <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold text-slate-400 uppercase text-[9px]">Ship to:</span> {o.deliveryInfo?.address}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Update Status</label>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="w-full border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified (Paid)</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Middle Column: Items Ordered */}
              <div className="p-6 flex-1 border-r border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Items Ordered</h4>
                <div className="space-y-4">
                  {o.products?.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-50 shadow-sm">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {p.product?.image ? (
                          <img
                            src={`${API_BASE}/uploads/products/${p.product.image}`}
                            alt={p.product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-bold">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.product?.name || "Deleted Product"}</p>
                        <p className="text-[10px] font-semibold text-slate-400">Qty: <span className="text-slate-700 text-xs">{p.quantity}</span></p>
                      </div>
                      <div className="text-right pr-2">
                        <p className="text-xs font-bold text-slate-700">{(p.product?.price * p.quantity).toFixed(2)}</p>
                        <p className="text-[8px] text-slate-300 font-bold">ETB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Receipt & Payment */}
              <div className="p-6 md:w-1/4 bg-indigo-900 text-white flex flex-col justify-between text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 -rotate-45 translate-x-16 -translate-y-16 rounded-full opacity-20"></div>

                <div className="z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 opacity-60 mb-2">Total Amount</p>
                  <p className="text-3xl font-black">{o.totalPrice?.toFixed(2)}</p>
                  <p className="text-xs font-medium text-indigo-200 mb-8 tracking-wider">ETB</p>
                </div>

                <div className="z-10 bg-indigo-800 p-4 rounded-2xl border border-indigo-700/50 shadow-inner">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">Verification</p>
                  {o.receiptImage ? (
                    <a
                      href={`${API_BASE}/uploads/receipts/${o.receiptImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full bg-white text-indigo-900 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-indigo-50 transition shadow-lg active:scale-95"
                    >
                      Check Receipt
                    </a>
                  ) : (
                    <span className="text-xs text-indigo-300 font-semibold italic">No receipt uploaded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
