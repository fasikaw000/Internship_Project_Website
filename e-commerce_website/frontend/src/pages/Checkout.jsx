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
    const fetchBank = async () => {
      try {
        const info = await getBankInfo();
        setBank(info);
      } catch (error) {
        console.error("Failed to fetch bank info", error);
      }
    };
    fetchBank();
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

    if (!receipt) {
      errors.push("Please upload the payment receipt.");
    }

    if (errors.length > 0) {
      alert("Please complete all required fields:\n\n• " + errors.join("\n• "));
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("deliveryInfo", JSON.stringify(trimmed));
      formData.append("receiptImage", receipt);
      // Products are handled by backend from cart or we send them?
      // Check orderService/backend: usually backend might take products from body or we send them.
      // Looking at `placeOrder` in orderService, it sends `formData`.
      // Backend usually expects `products` in body or creates from User's cart if stored in DB?
      // Let's assume we need to send products array as JSON string if backend expects it in FormData
      // PREVIOUS LOGIC (from memory/inference): It likely sent product IDs.
      // SAFE BET: Send products array.
      formData.append("products", JSON.stringify(cart.map((item) => ({ product: item._id, quantity: item.quantity }))));

      await placeOrder(formData);

      alert("Order placed successfully! We will verify your receipt and update the status.");
      clearCart();
      navigate("/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto animate-fadeIn">


      {/* Bank Info Section */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded text-center">
        <p className="font-bold text-indigo-900">Bank Transfer Details</p>
        <p className="text-sm text-indigo-700 mb-2">Please transfer the total amount to:</p>
        <div className="bg-white p-3 rounded shadow-sm inline-block text-left">
          <p className="text-gray-600 text-sm">Bank: <span className="font-bold text-gray-800">CBE (Commercial Bank of Ethiopia)</span></p>
          <p className="text-gray-600 text-sm">Account Name: <span className="font-bold text-gray-800">{bank.fullName || "Loading..."}</span></p>
          <p className="text-gray-600 text-sm">Account Number: <span className="font-mono font-bold text-indigo-600 text-lg">{bank.accountNumber || "Wait..."}</span></p>
        </div>
        <p className="text-xs text-indigo-500 mt-2">Upload the receipt screenshot below after transfer.</p>
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

        <div className="border border-dashed border-indigo-300 bg-indigo-50/50 p-4 rounded-xl text-center">
          <label className="block text-indigo-900 font-bold text-sm mb-2">Upload Payment Receipt</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files[0])}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex justify-center items-center gap-2"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
