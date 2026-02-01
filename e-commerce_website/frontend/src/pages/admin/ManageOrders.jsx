import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
      orders.map((o) => (
        <div key={o._id} className="border rounded p-4 mb-4 bg-white shadow-sm">
          <p className="font-medium">User: {o.user?.fullName} ({o.user?.email})</p>
          <p className="text-gray-600">Total: {o.totalPrice?.toFixed(2)} ETB</p>
          {o.deliveryInfo && (
            <p className="text-sm text-gray-500">
              {o.deliveryInfo.name}, {o.deliveryInfo.phone}, {o.deliveryInfo.address}
            </p>
          )}
          {o.receiptImage && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Receipt: </span>
              <a
                href={`${API_URL}/uploads/receipts/${o.receiptImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                View screenshot
              </a>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm font-medium">Status:</label>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="pending">pending</option>
              <option value="completed">completed</option>
            </select>
          </div>
        </div>
      ))
      )}
    </div>
  );
}
