import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    console.log("Fetching product details for ID:", id);
    setLoading(true);
    getProductById(id)
      .then((data) => {
        console.log("Product data received:", data);
        if (data) {
          setProduct(data);
        } else {
          console.error("Received null/undefined product data");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product details:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      navigate("/cart");
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader />
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <span className="text-6xl block mb-6 transform hover:scale-110 transition-transform cursor-help">🔍</span>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-4">Product Not Found</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">The luxury item you are looking for may have been moved or removed.</p>
          <Link to="/products" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = product.imageUrl || (product.image ? `${API_BASE}/uploads/products/${product.image}` : null);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/products" className="text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] transition-colors flex items-center gap-2">
            <span className="text-lg leading-none">←</span> Back to Collection
          </Link>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/5 border border-white overflow-hidden flex flex-col lg:flex-row">
          {/* Image Section - Professional Framing */}
          <div className="lg:w-1/2 bg-[#fdfdfd] p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-50">
            <div className="aspect-square w-full relative max-w-md">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply animate-scaleIn"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-20">
                  <span className="text-6xl">📦</span>
                  <p className="font-black text-xs tracking-widest uppercase">No Image Available</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block mb-6 shadow-sm">
                {product.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-6">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-indigo-600 italic tracking-tighter">
                {product.price?.toLocaleString()} <span className="text-sm font-normal text-slate-400 not-italic uppercase tracking-widest ml-2">ETB</span>
              </p>
            </div>

            <div className="mb-10 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {product.description || "No description provided for this premium item."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                  <button
                    onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-900 font-black text-xl hover:bg-white rounded-xl transition-all"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className="w-16 text-center bg-transparent font-black text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => setQty(qty < product.stock ? qty + 1 : qty)}
                    disabled={qty >= product.stock}
                    className="w-12 h-12 flex items-center justify-center text-slate-900 font-black text-xl hover:bg-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {product.stock} units available
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdded}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all duration-500 transform active:scale-95 shadow-2xl relative overflow-hidden group ${product.stock === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : isAdded
                    ? "bg-teal-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40"
                  }`}
              >
                <span className="relative z-10">
                  {product.stock === 0 ? "Currently Unavailable" : isAdded ? "✓ Added to Cart" : "Purchase Now"}
                </span>
                {!isAdded && product.stock > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-indigo-600 to-indigo-800 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
