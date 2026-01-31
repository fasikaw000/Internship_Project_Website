import api from "./api";

// Get all products (with optional category)
export const getProducts = async (category) => {
  const url =
    category && category !== "All"
      ? `/products?category=${category}`
      : "/products";

  const res = await api.get(url);
  return res.data;
};

// Get single product
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// Admin: add product
export const addProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

// Admin: delete product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
