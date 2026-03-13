import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authService";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start (from session storage for tab isolation)
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res.user);
  };

  // Register
  const register = async (data) => {
    await registerUser(data);
  };

  // Logout
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
