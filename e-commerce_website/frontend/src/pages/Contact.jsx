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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification("Please Log In to send a message.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const trimmed = {
      name: form.name.trim(),
      email: user.email,
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Have a question or comment about our products or services?</h2>
        </div>

        {notification && (
          <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-xl border animate-slideDown flex items-center gap-3 shadow-md ${notification.type === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
            : "bg-rose-50 border-rose-100 text-rose-800"
            }`}>
            <span className="text-2xl">{notification.type === "success" ? "✅" : "⚠️"}</span>
            <p className="font-bold text-sm tracking-tight">{notification.msg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Info Section */}
          <div className="space-y-8 animate-slideRight">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Reach Us Here</h3>
              <div className="space-y-6">

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center">
                    <div>
                      <p className="text-lg font-medium text-gray-900">Figa Road, Goro</p>
                      <p className="text-gray-600">Addis Ababa, Ethiopia</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center">
                    <p className="text-lg font-medium text-gray-900">+251 951769049</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center">
                    <p className="text-lg font-medium text-gray-900 break-all">aytenfasikaw21@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 flex items-center">
                    <a href="https://t.me/fasikaw0" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-sky-600 hover:text-sky-700 transition-colors block">
                      @fasikaw0
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="animate-slideLeft">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Write us Here</h3>
                <p className="text-gray-500 text-sm mt-1">We'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={submitHandler} className="p-8 space-y-6">
                <div>
                  <input
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${user ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                      }`}
                    placeholder="Email Address"
                    value={form.email}
                    readOnly={!!user}
                    onChange={(e) => !user && setForm({ ...form, email: e.target.value })}
                    title={user ? "Email must match your Log In email" : ""}
                    required
                  />
                </div>

                <div>
                  <textarea
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-h-[150px]"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
