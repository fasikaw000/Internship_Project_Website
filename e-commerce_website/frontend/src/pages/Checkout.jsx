import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder, getBankInfo } from "../services/orderService";
import { useCart } from "../context/CartContext";
import {
  validateFullName,
  validateEmail,
  validateEthiopianPhone,
  validateAddressAddisAbaba,
} from "../utils/validation";

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
    getBankInfo().then(setBank).catch(() => { });
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
    const errors = [];
    const nameErr = validateFullName(trimmed.name);
    if (nameErr) errors.push(nameErr);
    const phoneErr = validateEthiopianPhone(trimmed.phone);
    if (phoneErr) errors.push(phoneErr);
    const emailErr = validateEmail(trimmed.email);
    if (emailErr) errors.push(emailErr);
    const addressErr = validateAddressAddisAbaba(trimmed.address);
    if (addressErr) errors.push(addressErr);
    if (!receipt) errors.push("Payment receipt");
    if (errors.length > 0) {
      alert("Please complete all required fields:\n\n• " + errors.join("\n• "));
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
          className="border border-gray-300 w-full p-2 rounded"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border border-gray-300 w-full p-2 rounded"
          placeholder="Ethiopian phone (e.g. 0911123456 or +251911123456)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          type="email"
          className="border border-gray-300 w-full p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="border border-gray-300 w-full p-2 rounded"
          placeholder="Address in Addis Ababa, Ethiopia"
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
