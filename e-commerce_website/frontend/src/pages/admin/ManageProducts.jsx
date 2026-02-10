import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const CATEGORIES = ["all", "electronics", "fashions", "books"];
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "all",
    price: "",
    description: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id: string, name: string, force: boolean }
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      category: product.category || "all",
      price: String(product.price || ""),
      description: product.description || "",
      stock: String(product.stock || "0"),
    });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", category: "all", price: "", description: "", stock: "" });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);

    if (!form.name.trim()) {
      showNotification("Product name is required.");
      return;
    }
    if (!form.category || form.category === "all") {
      showNotification("Please select a valid category.");
      return;
    }
    if (form.price === "" || isNaN(price) || price <= 0) {
      showNotification("Please enter a valid price greater than 0.");
      return;
    }
    if (form.stock === "" || isNaN(stock) || stock < 0) {
      showNotification("Please enter a valid stock count (0 or more).");
      return;
    }
    if (!form.description.trim()) {
      showNotification("Product description is required.");
      return;
    }
    if (!editingId && !imageFile) {
      showNotification("Please upload a product image.");
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
      if (imageFile) body.append("image", imageFile);

      if (editingId) {
        await api.put(`/products/${editingId}`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Product updated successfully!", "success");
      } else {
        await api.post("/products", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Product added successfully!", "success");
      }

      cancelEdit();
      await loadProducts();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      showNotification(`Failed to ${editingId ? "update" : "add"} product: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (product) => {
    setDeleteConfirm({ id: product._id, name: product.name, force: false, isActive: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const executeDelete = async () => {
    const { id, force } = deleteConfirm;
    setLoading(true);
    try {
      await api.delete(`/products/${id}${force ? "?force=true" : ""}`);
      showNotification("Product deleted successfully.", "success");
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      const data = err.response?.data;
      if (data?.isLinked) {
        setDeleteConfirm({ ...deleteConfirm, isLinked: true, isActive: data.isActive });
      } else {
        showNotification("Failed to delete product. Please try again.");
        setDeleteConfirm(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative min-h-screen">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm font-semibold italic">← Back to Dashboard</Link>
      </div>

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

      {/* Deletion Confirmation Modal/UI */}
      {deleteConfirm && (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-2xl animate-fadeIn text-center shadow-lg shadow-rose-100">
          <p className="text-rose-900 font-black mb-1 uppercase tracking-widest text-xs">⚠ Critical Action</p>
          <p className="text-rose-800 text-sm mb-4">
            {deleteConfirm.isLinked
              ? deleteConfirm.isActive
                ? `Cannot delete "${deleteConfirm.name}" because it is linked to active orders.`
                : `"${deleteConfirm.name}" is associated with past orders. Deleting it may affect records. Proceed?`
              : `Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`
            }
          </p>
          <div className="flex justify-center gap-4">
            {!(deleteConfirm.isLinked && deleteConfirm.isActive) && (
              <button
                onClick={() => {
                  if (deleteConfirm.isLinked) setDeleteConfirm({ ...deleteConfirm, force: true });
                  executeDelete();
                }}
                disabled={loading}
                className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition shadow-lg"
              >
                {loading ? "Processing..." : "Confirm Delete"}
              </button>
            )}
            <button
              onClick={() => setDeleteConfirm(null)}
              disabled={loading}
              className="px-6 py-2 bg-white text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition border border-slate-200"
            >
              {deleteConfirm.isLinked && deleteConfirm.isActive ? "Close" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-extrabold mb-6 text-slate-900 tracking-tight">
        {editingId ? "Edit Product" : "Manage Products"}
      </h2>

      <form onSubmit={handleSubmit} className="mb-10 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Name *</label>
            <input
              className="w-full border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Category</label>
            <select
              className="w-full border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 transition"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Stock</label>
            <input
              type="number"
              min="0"
              className="w-full border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
          <textarea
            className="w-full border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 transition min-h-[100px]"
            placeholder="Detailed description of the product..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
            Product image {editingId && "(Optional)"}
          </label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-bold file:text-xs hover:file:bg-indigo-100 transition"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition active:scale-95"
          >
            {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Product" : "Add Product")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex justify-between items-end mb-4">
        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Product Catalog</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{products.length} Items</span>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium italic">No products in catalog yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-16 w-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 grayscale-[0.5] group-hover:grayscale-0 transition duration-500">
                  {p.image ? (
                    <img src={`${API_BASE}/uploads/products/${p.image}`} alt={p.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">No Img</div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 truncate leading-tight mb-0.5">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{p.category} • {p.stock} in stock</p>
                  <p className="font-black text-indigo-600 text-sm">{p.price?.toFixed(2)} <span className="text-[9px] font-bold text-slate-400">ETB</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition whitespace-nowrap"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(p)}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-100 transition whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
