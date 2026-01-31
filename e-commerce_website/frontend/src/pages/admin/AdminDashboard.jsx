import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => {
        setStats(res.data);
        setError(null);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const links = [
    { to: "/admin/products", label: "Manage Products", desc: "Add, edit, delete products" },
    { to: "/admin/orders", label: "Manage Orders", desc: "View and update order status" },
    { to: "/admin/comments", label: "Manage Comments", desc: "View and delete customer messages" },
    { to: "/admin/customers", label: "View Customers", desc: "List registered users" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Users</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.users}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Products</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.products}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Orders</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.orders}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Quick links</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map(({ to, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow transition"
          >
            <span className="font-medium text-gray-900">{label}</span>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
