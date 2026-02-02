import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

  const lineTotal = (item) => (item.price || 0) * (item.quantity || 1);
  const grandTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4">ItemsList(selected)</h2>
      {cart.length === 0 ? (
        <>
          <p className="text-gray-600 mb-4">Your cart is empty. Add products from the Products page; you can unselect any item here before Order.</p>
          <Link to="/products" className="text-indigo-600 underline">Browse products</Link>
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="pb-2 font-semibold">Image</th>
                  <th className="pb-2 font-semibold">Item</th>
                  <th className="pb-2 font-semibold text-right">Unit price</th>
                  <th className="pb-2 font-semibold text-right">Qty</th>
                  <th className="pb-2 font-semibold text-right">Total</th>
                  <th className="pb-2 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 align-middle">
                    <td className="py-3">
                      {item.image ? (
                        <img
                          src={`${API_BASE}/uploads/products/${item.image}`}
                          alt={item.name}
                          className="h-12 w-12 object-contain bg-gray-50 rounded shadow-sm"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500">No Image</div>
                      )}
                    </td>
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-right">{(item.price || 0).toFixed(2)} ETB</td>
                    <td className="py-3 text-right">
                      <input
                        type="number"
                        min="1"
                        className="w-14 border rounded px-1 py-0.5 text-right"
                        value={item.quantity}
                        onChange={(e) => updateQty(item._id, e.target.value)}
                      />
                    </td>
                    <td className="py-3 text-right font-medium">{lineTotal(item).toFixed(2)} ETB</td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 transition">
                        Unselect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <p className="text-lg font-bold">Total: {grandTotal.toFixed(2)} ETB</p>
          </div>
          <Link to="/checkout" className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Order
          </Link>
        </>
      )}
    </div>
  );
}
