import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendComment } from "../services/commentService";
import { validateName, validateEmail, validateMessage } from "../utils/validation";
import { useAuth } from "../hooks/useAuth";

export default function Contact() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

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
      alert("Please login to send a message.");
      navigate("/login");
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
      alert("Please correct the following:\n\n• " + errors.join("\n• "));
      return;
    }
    try {
      await sendComment(trimmed);
      alert("thank you, message is sent");
      setForm({ name: user.fullName || "", email: user.email, message: "" });
    } catch (err) {
      alert("Failed to send message. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto animate-fadeIn">
      {/* 1. Physical address, 2. Phone number, 3. Email - per scenario */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Reach us</h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700">Physical address</p>
            <p className="text-gray-600">Figa Road, Goro, Addis Ababa, Ethiopia</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Phone number</p>
            <p className="text-gray-600">+251 951769049</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Email</p>
            <p className="text-gray-600">aytenfasikaw21@gmail.com</p>
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
