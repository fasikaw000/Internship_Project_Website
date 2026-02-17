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
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ").slice(1).join(" ") || "",
    phone: "",
    email: user?.email || "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [receipt, setReceipt] = useState(null);
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (type === "success") {
      // Stay longer if success
      setTimeout(() => setNotification(null), 6000);
    } else {
      setTimeout(() => setNotification(null), 5000);
    }
  };

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
        email: user.email,
        firstName: user.fullName?.split(" ")[0] || prev.firstName,
        lastName: user.fullName?.split(" ").slice(1).join(" ") || prev.lastName,
      }));
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      showNotification("Your cart is empty. Add products first.");
      return;
    }
    const trimmed = {
      name: `${form.firstName} ${form.lastName}`.trim(),
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

    if (paymentMethod === "transfer" && !receipt) {
      errors.push("Please upload the payment receipt for bank transfer.");
    }

    if (createAccount && !password) {
      errors.push("Please enter a password to create an account.");
    }

    if (errors.length > 0) {
      showNotification("Please check the form: " + errors[0]);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("deliveryInfo", JSON.stringify(trimmed));
      formData.append("paymentMethod", paymentMethod);
      if (receipt) formData.append("receiptImage", receipt);
      formData.append("products", JSON.stringify(cart.map((item) => ({ product: item._id, quantity: item.quantity }))));
      if (createAccount) {
        formData.append("createAccount", true);
        formData.append("password", password);
      }

      await placeOrder(formData);

      showNotification(paymentMethod === "cod"
        ? "Order placed! We will contact you soon for delivery."
        : "Order placed successfully! We will verify your receipt and update the status.", "success");

      clearCart();
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to place order. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto animate-fadeIn relative">
      {/* Notification Banner */}
      {notification && (
        <div className={`mb-6 p-4 rounded-2xl border animate-slideDown flex items-center gap-3 shadow-sm ${notification.type === "success"
          ? "bg-emerald-50 border-emerald-100 text-emerald-800"
          : "bg-rose-50 border-rose-100 text-rose-800"
          }`}>
          <span className="text-xl">{notification.type === "success" ? "✅" : "⚠️"}</span>
          <p className="font-bold text-sm tracking-tight">{notification.msg}</p>
        </div>
      )}
      <h2 className="text-2xl font-black text-slate-800 mb-6 text-center tracking-tight">Checkout</h2>

      {/* Payment Method Selector */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => setPaymentMethod("transfer")}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${paymentMethod === "transfer" ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-200 bg-white hover:border-indigo-300"}`}
        >
          <div className={`p-2 rounded-full ${paymentMethod === "transfer" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">Bank Transfer</span>
        </button>
        <button
          onClick={() => setPaymentMethod("cod")}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${paymentMethod === "cod" ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-slate-200 bg-white hover:border-indigo-300"}`}
        >
          <div className={`p-2 rounded-full ${paymentMethod === "cod" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">Cash on Delivery</span>
        </button>
      </div>

      {/* Bank Info Section (Conditional) */}
      {paymentMethod === "transfer" && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center animate-slideDown">
          <p className="font-bold text-indigo-900 mb-3 uppercase text-xs tracking-widest">Bank Transfer Details</p>
          <div className="bg-white p-4 rounded-xl shadow-sm inline-block text-left border border-indigo-100">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1 opacity-50">CBE Account</p>
            <p className="font-mono font-black text-indigo-600 text-xl tracking-tighter">1000787545343</p>
            <p className="text-slate-700 text-sm font-bold mb-1">Fasikaw Ayten Akele</p>
          </div>
          <p className="text-[10px] text-indigo-400 mt-4 font-medium">Please upload the receipt screenshot below after transfer.</p>
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="mb-6 p-6 bg-teal-50 border border-teal-200 rounded-2xl text-center animate-slideDown">
          <p className="text-xs text-teal-600 font-bold leading-relaxed">You will pay the total amount directly to our delivery person when you receive your package.</p>
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <input
              className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <input
            className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="phone(e.g 0951769049 or +251951769049)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="email"
            className={`appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${user ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
            placeholder="Email"
            value={form.email}
            readOnly={!!user}
            onChange={(e) => !user && setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Address (Addis Ababa, Ethiopia)"
            rows="3"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          ></textarea>
        </div>

        {/* Guest Account Creation */}
        {!user && (
          <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-xl shadow-indigo-100/20 animate-slideUp">
            <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 p-4 rounded-xl hover:bg-indigo-50 transition-colors border border-slate-100">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300 transition-all cursor-pointer"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
              />
              <span className="text-sm font-black text-slate-700 group-hover:text-indigo-900 transition-colors uppercase tracking-widest">Create account for later?</span>
            </label>

            {createAccount && (
              <div className="mt-6 space-y-4 animate-fadeIn">
                <div className="relative group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">password</p>
                  <input
                    type="password"
                    className="appearance-none block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={createAccount}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {paymentMethod === "transfer" && (
          <div className="border border-dashed border-indigo-300 bg-indigo-50/30 p-5 rounded-2xl text-center animate-slideDown">
            <label className="block text-indigo-900 font-black text-[10px] uppercase tracking-widest mb-3">Upload Payment Receipt</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReceipt(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
              required={paymentMethod === "transfer"}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2 mt-4"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
