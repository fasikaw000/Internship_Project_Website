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
  const [added, setAdded] = useState(false);
  const imageSrc = product.imageUrl || (product.image ? `${API_BASE}/uploads/products/${product.image}` : null);
  const isNew = product.createdAt && (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24) < 7;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col bg-white h-full animate-scaleIn hover:-translate-y-2 group">
      <div className="aspect-square w-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="text-gray-500 text-sm">No image</span>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isNew && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">NEW</span>
          )}
          {user?.role === "admin" && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm opacity-90">
              Stock: {product.stock}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-3 text-gray-900">{product.name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2 flex-1 mt-1">{product.description}</p>
      <p className="font-bold mt-2 text-indigo-600">{Number(product.price).toFixed(2)} ETB</p>

      {user && (
        <div className="flex items-center mt-3 gap-1">
          <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">
            −
          </button>
          <span className="mx-2 min-w-[1.5rem] text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty(qty < product.stock ? qty + 1 : qty)}
            disabled={qty >= product.stock}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${qty >= product.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            +
          </button>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow ${product.stock <= 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
      >
        {product.stock <= 0 ? "Out of Stock" : added ? "Added to cart" : "Add to Cart"}
      </button>
      {/* Admin Controls */}
      {user?.role === "admin" && (
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/product/delete/${product._id}`);
            }}
            className="p-2 bg-white text-red-600 rounded-full shadow hover:bg-red-50 transition border border-red-100"
            title="Delete Product"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
