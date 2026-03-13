import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
    const { cart, isCartOpen, closeCart, updateQty, removeFromCart } = useCart();
    const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-in-out transform ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Your Cart</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                            {cart.length} {cart.length === 1 ? 'Item' : 'Items'} selected
                        </p>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-white rounded-full transition-colors group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-slate-400 group-hover:text-slate-900 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-slate-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your cart is empty</p>
                            <Link
                                to="/products"
                                onClick={closeCart}
                                className="text-indigo-600 font-black text-sm uppercase tracking-tighter hover:underline"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="flex gap-4 group">
                                {/* Image */}
                                <div className="w-24 h-24 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-slate-100 p-2 overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`${API_BASE}/uploads/products/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">No Image</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-slate-400 hover:text-red-600 text-[10px] font-bold flex items-center gap-1 transition-colors uppercase tracking-wider"
                                            >
                                                <span className="text-xs">✕</span> Remove
                                            </button>
                                        </div>
                                        <p className="text-slate-900 font-black text-sm mt-1">
                                            {item.price?.toFixed(2)} <span className="text-[10px] uppercase font-bold tracking-widest">ETB</span>
                                        </p>
                                    </div>

                                    {/* Qty Control */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-slate-50 rounded-lg px-2 py-1 border border-slate-100">
                                            <button
                                                onClick={() => updateQty(item._id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 font-bold"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQty(item._id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Total</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                {subtotal.toFixed(2)} <span className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">ETB</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-2">
                            <Link
                                to="/cart"
                                onClick={closeCart}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] text-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                            >
                                View Full Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </>
    );
}
