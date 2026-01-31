import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading orders…</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet. <Link to="/products" className="text-indigo-600 underline">Browse products</Link>.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    o.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {o.status === "completed" ? "Transaction completed" : o.status}
                </span>
              </div>
              <p className="font-medium">Total: ${o.totalPrice?.toFixed(2)}</p>
              {o.deliveryInfo && (
                <p className="text-sm text-gray-600">
                  {o.deliveryInfo.name}, {o.deliveryInfo.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
