import api from "./api";

// Register new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login user
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // Save token locally in session (isolates tabs)
  sessionStorage.setItem("token", res.data.token);

  return res.data;
};

// Logout user
export const logoutUser = () => {
  sessionStorage.removeItem("token");
};
