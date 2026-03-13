import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function ProductCard({ product, onDelete }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const isAdmin = user?.role === "admin";
  const imageSrc = product.imageUrl || (product.image ? `${API_BASE}/uploads/products/${product.image}` : null);


  const handleAddToCart = () => {
    addToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500); // Keep "Added" state long enough to see
  };

  return (
    <div className="group flex flex-col bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-xl transition-all duration-700 animate-scaleIn hover:-translate-y-2 relative overflow-hidden border border-slate-50">
      <div className="aspect-square w-full bg-[#fdfdfd] rounded-2xl overflow-hidden relative border border-slate-50 flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-slate-50 opacity-30 group-hover:opacity-0 transition-opacity duration-500"></div>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-200">
            <span className="text-4xl opacity-10">📦</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-20">No Image</span>
          </div>
        )}

        {/* Stock Badge - Refined */}
        <div className="absolute top-5 left-5 z-20">
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-amber-600 text-[8px] font-bold uppercase tracking-widest rounded-full border border-amber-100 shadow-sm">
              Limited Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-400 text-[8px] font-bold uppercase tracking-widest rounded-full border border-slate-100 shadow-sm">
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow mt-6 px-2">
        <div className="flex-grow">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest line-clamp-1 group-hover:text-indigo-600 transition-colors mb-2">
            {product.name}
          </h2>
          <p className="text-2xl font-bold text-slate-900 tracking-tighter">
            {product.price ? product.price.toFixed(2) : "0.00"} <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest ml-1">ETB</span>
          </p>
        </div>

        {/* Collapsible Description Section */}
        {showDescription && (
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-slideDown overflow-hidden">
            <p className="text-slate-600 text-xs font-bold leading-relaxed italic">
              "{product.description}"
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
            <button
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors font-bold"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => {
                const val = Math.max(1, Math.min(product.stock, Number(e.target.value)));
                setQty(val);
              }}
              className="w-12 text-center bg-transparent border-none focus:outline-none text-xs font-bold text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQty(qty < product.stock ? qty + 1 : qty)}
              disabled={qty >= product.stock}
              className={`w-9 h-9 flex items-center justify-center font-bold transition-colors ${qty >= product.stock ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-slate-900"
                }`}
            >
              +
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdded}
              className={`w-full py-4 rounded-2xl font-bold uppercase tracking-[0.15em] text-[10px] transition-all duration-500 transform active:scale-95 ${product.stock === 0
                ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                : isAdded
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20"
                }`}
            >
              {product.stock === 0 ? "Unavailable" : isAdded ? "Added" : "Add to Cart"}
            </button>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 group/btn"
            >
              <span className={`h-[1px] w-4 bg-slate-200 group-hover/btn:bg-indigo-600 transition-all ${showDescription ? "w-8" : ""}`}></span>
              {showDescription ? "Hide Details" : "Details"}
              <span className={`h-[1px] w-4 bg-slate-200 group-hover/btn:bg-indigo-600 transition-all ${showDescription ? "w-8" : ""}`}></span>
            </button>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/product/edit/${product._id}`);
            }}
            className="p-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-50 transition border border-blue-100"
            title="Edit Product"
          >
            ✏️
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to delete this product?")) {
                  onDelete(product._id);
                }
              }}
              className="p-2 bg-white text-rose-600 rounded-full shadow hover:bg-rose-50 transition border border-rose-100"
              title="Delete Product"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
