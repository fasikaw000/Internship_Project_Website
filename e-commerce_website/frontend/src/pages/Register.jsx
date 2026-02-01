import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  validateFullName,
  validateUsername,
  validateEmail,
  validatePassword,
} from "../utils/validation";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const errors = [];
    const fullNameErr = validateFullName(form.fullName);
    if (fullNameErr) errors.push(fullNameErr);
    const usernameErr = validateUsername(form.username);
    if (usernameErr) errors.push(usernameErr);
    const emailErr = validateEmail(form.email);
    if (emailErr) errors.push(emailErr);
    const passwordErr = validatePassword(form.password);
    if (passwordErr) errors.push(passwordErr);
    if (errors.length > 0) {
      alert("Please correct the following:\n\n• " + errors.join("\n• "));
      return;
    }
    try {
      await register(form);
      alert("Registered successfully, please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={submitHandler} className="p-6 max-w-md mx-auto">
      {Object.keys(form).map((key) => {
        if (key === "password") {
          return (
            <div key={key} className="mb-3 relative">
              <input
                className="border border-gray-300 w-full p-2 pr-10 rounded"
                placeholder="Password (min 6 characters)"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye off icon with forward slash
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {/* eye outline */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5S3.75 16.5 2.25 12z"
                    />
                    {/* forward slash (top-right to bottom-left) */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 6L6 18"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5S3.75 16.5 2.25 12z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          );
        }

        const labels = { fullName: "Full name", username: "Username", email: "Email" };
        return (
          <input
            key={key}
            type={key === "email" ? "email" : "text"}
            className="border border-gray-300 w-full p-2 mb-3 rounded"
            placeholder={labels[key] || key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
          />
        );
      })}
      <button className="bg-indigo-600 text-white px-4 py-2">
        Register
      </button>
    </form>
  );
}