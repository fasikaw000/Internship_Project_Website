import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder, getBankInfo } from "../services/orderService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import {
  validateFullName,
  validateEmail,
  validateEthiopianPhone,
  validateAddressAddisAbaba,
} from "../utils/validation";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bank, setBank] = useState({ fullName: "", accountNumber: "" });
  const [form, setForm] = useState({
    name: user?.fullName || "",
    phone: "",
    email: user?.email || "",
    address: "",
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No bank info needed for Chapa
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
        name: user.fullName || prev.name,
      }));
    }
  }, [user]);

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
    // No receipt validation
    if (errors.length > 0) {
      alert("Please complete all required fields:\n\n• " + errors.join("\n• "));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        products: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
        deliveryInfo: trimmed
      };

      const response = await placeOrder(payload); // Now returns { order, paymentUrl }

      // Redirect to Chapa
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        alert("Order created but payment initialization failed. Please check My Orders.");
        navigate("/orders");
      }
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded flex gap-4 items-center">
        <div className="text-3xl">💳</div>
        <div>
          <p className="font-bold text-indigo-900">Secure Payment</p>
          <p className="text-sm text-indigo-700">You will be redirected to Chapa for secure payment (Telebirr, CBE, Cards, etc.)</p>
        </div>
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
          className={`border border-gray-300 w-full p-2 rounded ${user ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
          placeholder="Email"
          value={form.email}
          readOnly={!!user}
          onChange={(e) => !user && setForm({ ...form, email: e.target.value })}
          title={user ? "Email must match your login email" : ""}
          required
        />
        <input
          className="border border-gray-300 w-full p-2 rounded"
          placeholder="Address in Addis Ababa, Ethiopia"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex justify-center items-center gap-2"
        >
          {loading ? "Processing..." : "Pay Now with Chapa"}
        </button>
      </form>
    </div>
  );
}
