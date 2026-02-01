import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const imageSrc = product.imageUrl || (product.image ? `${API_BASE}/uploads/products/${product.image}` : null);

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
          <img src={imageSrc} alt={product.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span className="text-gray-500 text-sm">No image</span>
        )}
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
          <button onClick={() => setQty(qty + 1)} className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">
            +
          </button>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow"
      >
        {added ? "Added to cart" : "Add to Cart"}
      </button>
    </div>
  );
}
