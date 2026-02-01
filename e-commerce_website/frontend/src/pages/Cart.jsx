import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();

  const lineTotal = (item) => (item.price || 0) * (item.quantity || 1);
  const grandTotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <>
          <p className="text-gray-600 mb-4">Your cart is empty. Add products from the Products page; you can unselect any item here before checkout.</p>
          <Link to="/products" className="text-indigo-600 underline">Browse products</Link>
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="pb-2 font-semibold">Item</th>
                  <th className="pb-2 font-semibold text-right">Unit price</th>
                  <th className="pb-2 font-semibold text-right">Qty</th>
                  <th className="pb-2 font-semibold text-right">Total</th>
                  <th className="pb-2 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border-b border-gray-200 align-middle">
                    <td className="py-3">{item.name}</td>
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
                    <td className="py-3">
                      <button type="button" onClick={() => removeFromCart(item._id)} className="text-red-600 text-sm hover:underline">
                        Remove
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
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}
