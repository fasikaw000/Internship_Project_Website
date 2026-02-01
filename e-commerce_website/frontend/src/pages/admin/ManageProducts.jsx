import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const CATEGORIES = ["all", "electronics", "fashion", "books"];

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "all",
    price: "",
    description: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10); // Parse strictly

    if (
      !form.name.trim() ||
      !form.category ||
      form.category === "all" ||
      form.price === "" ||
      isNaN(price) ||
      price <= 0 ||
      form.stock === "" ||
      isNaN(stock) ||
      stock < 0 ||
      !form.description.trim() ||
      !imageFile
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("category", form.category);
      body.append("price", price);
      body.append("description", form.description.trim());
      body.append("stock", stock);
      body.append("image", imageFile);

      await api.post("/products", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ name: "", category: "all", price: "", description: "", stock: "" });
      setImageFile(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
      </div>
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>

      <form onSubmit={addProduct} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="border border-gray-300 w-full p-2 rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              className="border border-gray-300 w-full p-2 rounded"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="border border-gray-300 w-full p-2 rounded min-h-[80px]"
            placeholder="Optional description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product image</label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP. Optional for all categories.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <h3 className="font-semibold mb-2">All Products</h3>
      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="flex justify-between items-center gap-4 border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                {p.image ? (
                  <img src={`${API_BASE}/uploads/products/${p.image}`} alt={p.name} className="h-12 w-12 object-cover rounded" />
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-gray-500 text-sm ml-2">{p.price?.toFixed(2)} ETB · {p.category}</span>
                </div>
              </div>
              <button
                onClick={() => deleteProduct(p._id)}
                className="text-red-600 text-sm hover:underline shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
