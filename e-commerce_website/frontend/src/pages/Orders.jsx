import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

  if (loading) return <div className="p-6">Loading orders…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">My orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 bg-white p-4 rounded shadow-sm text-center">You have no orders yet. <Link to="/products" className="text-indigo-600 underline font-medium">Browse products</Link>.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o._id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
              <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">
                  {new Date(o.createdAt).toLocaleString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${o.status === "delivered" ? "bg-green-100 text-green-700" :
                    o.status === "verified" ? "bg-blue-100 text-blue-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                    }`}
                >
                  {o.status === "verified" ? "Transaction completed" :
                    o.status === "delivered" ? "Order delivered" :
                      o.status === "cancelled" ? "Order cancelled" :
                        "pending"}
                </span>
              </div>

              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {o.products?.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {p.product?.image ? (
                        <img
                          src={`${API_BASE}/uploads/products/${p.product.image}`}
                          alt={p.product.name}
                          className="h-12 w-12 object-contain rounded-md shadow-inner bg-gray-50"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-[8px] text-gray-400">No Img</div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{p.product?.name || "Product Item"}</p>
                        <p className="text-xs text-slate-500 font-medium">Quantity: {p.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Delivery Info</p>
                    <p className="text-sm text-slate-600 leading-snug">{o.deliveryInfo?.name}, {o.deliveryInfo?.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Total Paid</p>
                    <p className="text-xl font-black text-slate-900 leading-none">{o.totalPrice?.toFixed(2)} <span className="text-xs font-normal text-slate-400">ETB</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
