import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import logoPng from "../assets/logo_unique.png";

const navClass = ({ isActive }) =>
  `font-medium transition ${isActive ? "text-white font-semibold underline underline-offset-4" : "text-teal-100 hover:text-white"}`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { clearCart, cartItems, openCart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 relative z-50">
      {/* Custom Dropdown CSS */}
      <style>{`
        .navbar-item-container:hover .navbar-dropdown {
          display: block;
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .navbar-dropdown {
          display: none;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .fashion-item-container:hover .fashion-sub-menu {
          display: block;
        }
        .fashion-sub-menu {
          display: none;
          left: 100%;
          top: 0;
          margin-left: 2px;
        }
      `}</style>

      <div className="px-6 py-3.5 flex items-center justify-between shadow-md relative z-50 bg-slate-900">
        <Link to="/" className="flex items-center gap-1.5 md:gap-2 group">
          <div className="p-1 md:p-1.5 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <span className="text-lg md:text-xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
            MICHU&nbsp;<span className="text-indigo-500">GEBEYA</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-4 xl:gap-7 items-center">
          <NavLink to="/" end className={navClass}>Home</NavLink>

          {/* Products with Hover Dropdown */}
          <div className="relative navbar-item-container h-full flex items-center">
            <NavLink to="/products" className={(props) => navClass(props) + " flex items-center gap-1"}>
              Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </NavLink>

            {/* Main Dropdown */}
            <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 py-3 navbar-dropdown overflow-visible translate-y-[14px]">
              <Link to="/products?cat=electronics" className="block px-5 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold transition">
                Electronics
              </Link>

              {/* Fashions with Nested Menu */}
              <div className="relative fashion-item-container group/fashion">
                <Link to="/products?cat=fashions" className="flex items-center justify-between px-5 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold transition">
                  Fashions
                  <svg className="w-3 h-3 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {/* Sub Menu */}
                <div className="absolute left-full top-0 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 fashion-sub-menu">
                  <Link to="/products?cat=mens" className="block px-5 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold transition">
                    Men's
                  </Link>
                  <Link to="/products?cat=womens" className="block px-5 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold transition">
                    Women's
                  </Link>
                </div>
              </div>

              <Link to="/products?cat=books" className="block px-5 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-bold transition">
                Books
              </Link>
            </div>
          </div>

          <NavLink to="/contact" className={navClass}>Contact Us</NavLink>
          <NavLink to="/about" className={navClass}>About Us</NavLink>
          {user && <NavLink to="/orders" className={navClass}>My Orders</NavLink>}
          {isAdmin && (
            <div className="ml-2 xl:ml-4 pl-2 xl:pl-4 border-l border-slate-700">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-2 xl:px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-black uppercase tracking-tighter transition-all duration-300 ${isActive
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/50"
                    : "bg-slate-800 text-teal-400 hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                Admin
              </NavLink>
            </div>
          )}
        </div>

        <div className="hidden lg:flex gap-2 xl:gap-4 items-center font-medium">
          {/* Professional Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2.5 text-teal-100 hover:text-white transition-all group mr-3 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 hover:border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-indigo-500/40 border-2 border-slate-900 group-hover:scale-110 transition-transform">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>

          {!user ? (
            <>
              <NavLink to="/login" className="border border-white text-white px-3 py-1 rounded-full text-sm font-semibold transition hover:bg-white/10">Log In</NavLink>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full text-sm font-bold transition shadow-lg shadow-indigo-600/20">Register</Link>
            </>
          ) : (
            <>
              <span className="text-xs xl:text-sm text-teal-100">Welcome, {user.fullName}</span>
              <button onClick={handleLogout} className="border border-white text-white px-3 py-1 rounded-full text-sm font-semibold transition hover:bg-white/10">Log Out</button>
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

          <div className="flex flex-col gap-2 pl-4 border-l border-slate-700">
            <NavLink to="/products" className={navClass} onClick={() => setIsMenuOpen(false)}>All Products</NavLink>
            <Link to="/products?cat=electronics" className="text-teal-200/60 text-sm hover:text-white pl-2" onClick={() => setIsMenuOpen(false)}>Electronics</Link>
            <Link to="/products?cat=fashions" className="text-teal-200/60 text-sm hover:text-white pl-2" onClick={() => setIsMenuOpen(false)}>Fashions</Link>
            <Link to="/products?cat=mens" className="text-teal-200/40 text-xs hover:text-white pl-6" onClick={() => setIsMenuOpen(false)}>— Men's</Link>
            <Link to="/products?cat=womens" className="text-teal-200/40 text-xs hover:text-white pl-6" onClick={() => setIsMenuOpen(false)}>— Women's</Link>
            <Link to="/products?cat=books" className="text-teal-200/60 text-sm hover:text-white pl-2" onClick={() => setIsMenuOpen(false)}>Books</Link>
          </div>

          <NavLink to="/contact" className={navClass} onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
          <button
            onClick={() => { openCart(); setIsMenuOpen(false); }}
            className={`flex items-center justify-between ${navClass({ isActive: false })}`}
          >
            <span>My Cart</span>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </button>
          {user && <NavLink to="/orders" className={navClass} onClick={() => setIsMenuOpen(false)}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}

          <div className="border-t border-slate-700 pt-4 flex flex-col gap-3">
            {!user ? (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setIsMenuOpen(false)}>Log In</NavLink>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium transition text-center shadow-lg shadow-indigo-600/20" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <div className="text-center text-teal-200 text-sm mb-2">Signed in as {user.fullName}</div>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-red-500/10 text-red-200 border border-red-500/20 w-full py-2 rounded hover:bg-red-500/20 transition">Log Out</button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Professional Cart Drawer Component */}
      <CartDrawer />
    </nav>
  );
}
