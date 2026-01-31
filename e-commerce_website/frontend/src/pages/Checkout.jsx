import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder, getBankInfo } from "../services/orderService";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [bank, setBank] = useState({ fullName: "", accountNumber: "" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBankInfo().then(setBank).catch(() => {});
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      alert("Your cart is empty. Add products first.");
      return;
    }
    const trimmed = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    };
    if (!trimmed.name || !trimmed.phone || !trimmed.email || !trimmed.address) {
      alert("Please fill in all delivery fields: name, phone, email, and address.");
      return;
    }
    if (!receipt) {
      alert("Please upload your payment receipt (screenshot).");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "products",
        JSON.stringify(cart.map((item) => ({ product: item._id, quantity: item.quantity })))
      );
      formData.append("deliveryInfo", JSON.stringify(trimmed));
      formData.append("receiptImage", receipt);
      await placeOrder(formData);
      alert("Order placed successfully. We will confirm after verifying your payment.");
      clearCart();
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Admin CBE account - visible for payment */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded">
        <p className="font-bold text-gray-800">Pay to this CBE account:</p>
        <p className="mt-1">Account name: {bank.fullName}</p>
        <p>Account number: {bank.accountNumber}</p>
      </div>

      <form onSubmit={submitHandler} className="space-y-3">
        <input
          className="border w-full p-2"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border w-full p-2"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          className="border w-full p-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="border w-full p-2"
          placeholder="Address (Addis Ababa)"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Upload payment receipt (screenshot)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            className="border w-full p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
