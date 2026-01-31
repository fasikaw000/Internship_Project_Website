import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
    try {
      await register(form);
      alert("Registered successfully, please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please check your inputs.");
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
                className="border w-full p-2 pr-10"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
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

        return (
          <input
            key={key}
            className="border w-full p-2 mb-3"
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        );
      })}
      <button className="bg-indigo-600 text-white px-4 py-2">
        Register
      </button>
    </form>
  );
}