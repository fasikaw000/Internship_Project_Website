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
      <div className="p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center">
          <span className="text-3xl block mb-2">⚠️</span>
          <p className="text-rose-800 font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-rose-200">Try Again</button>
        </div>
      </div>
    );
  }

  const links = [
    { to: "/admin/products", label: "Manage Products", desc: "Add, edit, delete products" },
    { to: "/admin/orders", label: "Manage Orders", desc: "View and update order status" },
    { to: "/admin/comments", label: "Manage Comments", desc: "View and delete customer messages" },
    { to: "/admin/customers", label: "View Customers", desc: "List registered users" },
    { to: "/admin/history", label: "Admin History", desc: "View admin activity logs" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</h2>
          <p className="text-lg font-black text-green-600 mt-1">{stats.totalRevenue.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Revenue</h2>
          <p className="text-lg font-black text-green-600 mt-1">{stats.monthlyRevenue?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weekly Revenue</h2>
          <p className="text-lg font-black text-green-600 mt-1">{stats.weeklyRevenue?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Revenue</h2>
          <p className="text-lg font-black text-green-600 mt-1">{stats.dailyRevenue?.toLocaleString() || '0'} <span className="text-[10px] font-normal text-slate-400">ETB</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
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
