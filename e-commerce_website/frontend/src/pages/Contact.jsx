import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendComment } from "../services/commentService";
import { validateName, validateEmail, validateMessage } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";

export default function Contact() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (type === "success") {
      setTimeout(() => setNotification(null), 6000);
    } else {
      setTimeout(() => setNotification(null), 5000);
    }
  };

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
        name: user.fullName || prev.name
      }));
    }
  }, [user]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification("Please login to send a message.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const trimmed = {
      name: form.name.trim(),
      email: user.email, // Always use registered email
      message: form.message.trim(),
    };
    const errors = [];
    const nameErr = validateName(trimmed.name);
    if (nameErr) errors.push(nameErr);
    const messageErr = validateMessage(trimmed.message);
    if (messageErr) errors.push(messageErr);
    if (errors.length > 0) {
      showNotification("Please correct the form fields.");
      return;
    }
    try {
      await sendComment(trimmed);
      showNotification("Thank you! Your message has been sent successfully.", "success");
      setForm({ name: user.fullName || "", email: user.email, message: "" });
    } catch (err) {
      showNotification("Failed to send message. Please try again.");
      console.error(err);
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
      {/* 1. Physical address, 2. Phone number, 3. Email - per scenario */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Reach us</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Figa Road, Goro, Addis Ababa, Ethiopia</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">+251 951769049</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">aytenfasikaw21@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            </div>
            <div>
              <a href="https://t.me/fasikaw56" target="_blank" rel="noopener noreferrer" className="text-sky-600 text-sm font-bold hover:underline">@fasikaw56</a>
            </div>
          </div>
        </div>
      </section>

      {/* Write Us: 1. Name, 2. Email, 3. Message, Send button - per scenario */}
      <section className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Write us</h3>
        <form onSubmit={submitHandler} className="p-6 max-w-md mx-auto space-y-3 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className={`border border-gray-300 w-full p-2 rounded ${user ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
              placeholder="Your email"
              value={form.email}
              readOnly={!!user}
              onChange={(e) => !user && setForm({ ...form, email: e.target.value })}
              title={user ? "Email must match your login email" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="border border-gray-300 w-full p-2 rounded min-h-[120px]"
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 transition">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
