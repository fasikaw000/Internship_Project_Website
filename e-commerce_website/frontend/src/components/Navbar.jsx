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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 relative z-50">
      <div className="px-6 py-3.5 flex items-center justify-between shadow-md relative z-50 bg-slate-900">
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

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-7 items-center">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/products" className={navClass}>Products</NavLink>
          <NavLink to="/contact" className={navClass}>Contact</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          {user && <NavLink to="/cart" className={navClass}>Cart</NavLink>}
          {user && <NavLink to="/orders" className={navClass}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </div>

        <div className="hidden lg:flex gap-4 items-center font-medium">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-teal-100 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 absolute w-full left-0 shadow-xl flex flex-col p-4 space-y-4 animate-fadeIn">
          <NavLink to="/" end className={navClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/products" className={navClass} onClick={() => setIsMenuOpen(false)}>Products</NavLink>
          <NavLink to="/contact" className={navClass} onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
          {user && <NavLink to="/cart" className={navClass} onClick={() => setIsMenuOpen(false)}>Cart</NavLink>}
          {user && <NavLink to="/orders" className={navClass} onClick={() => setIsMenuOpen(false)}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}

          <div className="border-t border-slate-700 pt-4 flex flex-col gap-3">
            {!user ? (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                <Link to="/register" className="bg-white hover:bg-teal-50 text-teal-700 px-3 py-2 rounded-lg font-medium transition text-center" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <div className="text-center text-teal-200 text-sm mb-2">Signed in as {user.fullName}</div>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-red-500/10 text-red-200 border border-red-500/20 w-full py-2 rounded hover:bg-red-500/20 transition">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
