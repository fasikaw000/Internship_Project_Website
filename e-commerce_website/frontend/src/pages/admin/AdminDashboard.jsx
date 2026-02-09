import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, totalRevenue: 0, todayRevenue: 0, pendingOrdersCount: 0 });
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

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</h2>
          <p className="text-xl font-black text-green-600 mt-1">{stats.totalRevenue.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Revenue</h2>
          <p className="text-xl font-black text-green-600 mt-1">{stats.monthlyRevenue?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weekly Revenue</h2>
          <p className="text-xl font-black text-green-600 mt-1">{stats.weeklyRevenue?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Revenue</h2>
          <p className="text-xl font-black text-green-600 mt-1">{stats.dailyRevenue?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Users</h2>
          <p className="text-xl font-bold text-indigo-600 mt-1">{stats.users}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</h2>
          <p className="text-xl font-bold text-indigo-600 mt-1">{stats.products}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</h2>
          <p className="text-xl font-bold text-indigo-600 mt-1">{stats.orders}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {links.map(({ to, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="group block p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md transition duration-300"
          >
            <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{label}</span>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
