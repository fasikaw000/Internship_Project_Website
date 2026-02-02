import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import logoPng from "../assets/logo_unique.png";

const navClass = ({ isActive }) =>
  `font-medium transition ${isActive ? "text-white font-semibold underline underline-offset-4" : "text-teal-100 hover:text-white"}`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-teal-500 p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">
          MICHU<span className="text-teal-400">GEBEYA</span>
        </span>
      </Link>

      <div className="flex gap-7 items-center">
        <NavLink to="/" end className={navClass}>Home</NavLink>
        <NavLink to="/products" className={navClass}>Products</NavLink>
        <NavLink to="/contact" className={navClass}>Contact Us</NavLink>
        <NavLink to="/about" className={navClass}>About Us</NavLink>
        {user && <NavLink to="/cart" className={navClass}>Cart</NavLink>}
        {user && <NavLink to="/orders" className={navClass}>My Orders</NavLink>}
        {isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
      </div>

      <div className="flex gap-4 items-center font-medium">
        {!user ? (
          <>
            <NavLink to="/login" className={navClass}>Login</NavLink>
            <Link to="/register" className="bg-white hover:bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg font-medium transition">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-teal-100">Welcome, {user.fullName}</span>
            <button onClick={handleLogout} className="text-teal-100 hover:text-white transition">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
