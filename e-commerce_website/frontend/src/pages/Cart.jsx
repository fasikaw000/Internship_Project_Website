import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

  const lineTotal = (item) => (item.price || 0) * (item.quantity || 1);
  const grandTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);

  // Reusable Quantity Control Component
  const QuantityControl = ({ item }) => (
    <div className="flex items-center border border-slate-200 rounded-lg">
      <button
        onClick={() => updateQty(item._id, Math.max(1, item.quantity - 1))}
        className="px-3 py-1 hover:bg-slate-50 text-slate-600 transition"
      >
        −
      </button>
      <input
        type="number"
        min="1"
        max={item.stock}
        value={item.quantity}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val <= item.stock) updateQty(item._id, val);
          else {
            alert(`Only ${item.stock} left in stock.`);
            updateQty(item._id, item.stock);
          }
        }}
        className="w-10 text-center text-sm font-semibold focus:outline-none"
      />
      <button
        onClick={() => updateQty(item._id, Math.min(item.stock, item.quantity + 1))}
        disabled={item.quantity >= item.stock}
        className={`px-3 py-1 hover:bg-slate-50 text-slate-600 transition ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        +
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn min-h-screen">


      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-xl text-slate-400 font-medium mb-4">Your cart is currently empty.</p>
          <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center">
                {/* Image */}
                <div className="w-24 h-24 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-50">
                  {item.image ? (
                    <img
                      src={`${API_BASE}/uploads/products/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                    <p className="font-bold text-indigo-600">{(item.price * item.quantity).toFixed(2)} ETB</p>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">{item.description}</p>

                  <div className="flex justify-between items-center">
                    <QuantityControl item={item} />
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 transition"
                    >
                      <span className="text-lg">✕</span> Unselect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Order Total</span>
                  <span className="text-2xl font-black text-indigo-900">{grandTotal.toFixed(2)} <span className="text-sm font-normal text-slate-500">ETB</span></span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-indigo-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform active:scale-95"
              >
                Proceed to Order
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">🔒</div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">🚚</div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
