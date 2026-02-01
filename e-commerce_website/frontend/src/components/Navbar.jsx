import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import logoSvg from "../assets/logo.svg";

const navClass = ({ isActive }) =>
  `font-medium transition ${isActive ? "text-white font-semibold underline underline-offset-4" : "text-teal-100 hover:text-white"}`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { clearCart } = useCart();
  const [logoSrc, setLogoSrc] = useState(logoSvg);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoSrc("/logo.png");
    img.onerror = () => { };
    img.src = "/logo.png";
  }, []);

  const handleLogout = () => {
    clearCart();
    logout();
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center shrink-0">
        <img src={logoSrc} alt="Logo" className="h-10 object-contain max-w-[140px] brightness-0 invert" />
      </Link>

      <div className="flex gap-7 items-center">
        <NavLink to="/" end className={navClass}>Home</NavLink>
        <NavLink to="/products" className={navClass}>Products</NavLink>
        <NavLink to="/contact" className={navClass}>Contact Us</NavLink>
        <NavLink to="/about" className={navClass}>About Us</NavLink>
        {user && <NavLink to="/cart" className={navClass}>Cart</NavLink>}
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
