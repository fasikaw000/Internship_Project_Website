import { useEffect, useState } from "react";
import { getMyOrders, resubmitReceipt } from "../services/orderService";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [trackingOrder, setTrackingOrder] = useState(null);

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

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

  const handleResubmit = async (orderId, file) => {
    if (!file) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("receiptImage", file);

    try {
      await resubmitReceipt(orderId, formData);
      alert("Receipt uploaded successfully. Order is now pending verification.");
      // Refresh
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload receipt.");
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(o => {
    // 1. Search Filter
    // Allow users to copy "Order # 123" or "#123" directly
    const cleanSearch = search.toLowerCase().replace("order", "").replace("#", "").trim();

    const matchSearch =
      o._id.toLowerCase().includes(cleanSearch) ||
      o.products.some(p => p.product?.name?.toLowerCase().includes(cleanSearch));

    if (search && !matchSearch) return false;

    // 2. Tab Filter
    if (filter === "all") return true;
    if (filter === "active") return ["pending", "verified", "receipt_rejected"].includes(o.status);
    if (filter === "completed") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  // Helper: Status Stepper
  const OrderStepper = ({ status }) => {
    const steps = [
      { key: "pending", label: "Placed" },
      { key: "verified", label: "Paid" },
      { key: "delivered", label: "Delivered" }
    ];

    let currentStepIndex = -1;
    if (status === "pending" || status === "receipt_rejected") currentStepIndex = 0;
    if (status === "verified") currentStepIndex = 1;
    if (status === "delivered") currentStepIndex = 2;

    if (status === "cancelled") {
      return (
        <div className="w-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide py-2 rounded text-center border border-red-100">
          Order Cancelled
        </div>
      );
    }

    return (
      <div className="flex items-center w-full relative mt-2 mb-4">
        {/* Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -z-10 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isCompleted
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-slate-300 text-slate-300"
                  }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span className={`text-[10px] uppercase font-bold mt-1 tracking-wider ${isCompleted ? "text-indigo-600" : "text-slate-300"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return (
    <div className="p-10 flex justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn min-h-screen">


      {/* Controls: Search & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        {/* Tabs */}
        <div className="flex gap-2">
          {["all", "active", "completed", "cancelled"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition ${filter === tab
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search Order ID or Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-xl text-slate-400 font-medium mb-4">No orders found.</p>
          <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredOrders.map((o) => (
            <div key={o._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">

              {/* Header */}
              <div className="bg-slate-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 gap-4">
                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Placed</p>
                    <p className="font-semibold text-slate-700">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                    <p className="font-semibold text-slate-700">{o.totalPrice?.toFixed(2)} ETB</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ship To</p>
                    <p className="font-semibold text-slate-700 group relative cursor-help">
                      {o.deliveryInfo?.name}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        {o.deliveryInfo?.address}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order # {o._id.slice(-6).toUpperCase()}</p>
                  {/* links to details could go here */}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left: Items */}
                  <div className="flex-1 space-y-6">
                    <div className="mb-6">
                      <OrderStepper status={o.status} />
                      {o.status === "receipt_rejected" && (
                        <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-xs font-bold mt-2 border border-orange-200 flex items-center gap-2">
                          <span>⚠️</span> Receipt Rejected. Please re-upload.
                        </div>
                      )}
                    </div>

                    {o.products?.map((p, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 p-1">
                          {p.product?.image ? (
                            <img
                              src={`${API_BASE}/uploads/products/${p.product.image}`}
                              alt={p.product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">No Img</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{p.product?.name || "Product Unavailable"}</h4>
                          <p className="text-xs text-slate-500 mb-2">Qty: {p.quantity}</p>
                          <Link
                            to={`/products`} /* Changed to products list as details link might be broken */
                            className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded hover:bg-indigo-100 transition"
                          >
                            Buy Again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Actions */}
                  <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 flex flex-col gap-3">
                    {o.status === "receipt_rejected" && (
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-2">
                        <p className="text-xs font-bold text-orange-800 mb-2">Upload New Receipt</p>
                        <input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files[0] && window.confirm("Upload this receipt?")) {
                              handleResubmit(o._id, e.target.files[0]);
                            }
                          }}
                          className="text-xs w-full text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-orange-200 file:text-orange-800 hover:file:bg-orange-300"
                        />
                      </div>
                    )}

                    <Link
                      to={`/order/${o._id}/track`}
                      className="block w-full text-center py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Track Package
                    </Link>
                    <Link
                      to={`/order/${o._id}/invoice`}
                      className="block w-full text-center py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      View Invoice
                    </Link>
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
