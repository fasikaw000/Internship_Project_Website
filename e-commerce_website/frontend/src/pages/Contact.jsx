import { useState } from "react";
import { sendComment } from "../services/commentService";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submitHandler = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      alert("Please fill in all fields (name, email, and message).");
      return;
    }
    try {
      await sendComment(trimmed);
      alert("Thank you, message is sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 1. Physical address, 2. Phone number, 3. Email - per scenario */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Reach us</h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700">Physical address</p>
            <p className="text-gray-600">Bole Road, Addis Ababa, Ethiopia</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Phone number</p>
            <p className="text-gray-600">+251 11 123 4567</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Email</p>
            <p className="text-gray-600">info@ecommerce.com</p>
          </div>
        </div>
      </section>

      {/* Write Us: 1. Name, 2. Email, 3. Message, Send button - per scenario */}
      <section className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Write us</h3>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="border border-gray-300 w-full p-2 rounded min-h-[120px]"
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-medium">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
