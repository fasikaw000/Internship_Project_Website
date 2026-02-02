import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const CATEGORIES = ["all", "electronics", "fashions", "books"];

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
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

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
      (!editingId && !imageFile)
    ) {
      alert("Please fill all fields " + (!editingId ? "including an image." : "(If updating, name/category/price/stock/description are required)."));
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
        alert("✅ Product updated successfully!");
      } else {
        await api.post("/products", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Product added successfully!");
      }

      cancelEdit();
      await loadProducts();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      alert(`❌ Failed to ${editingId ? "update" : "add"} product: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    // 1. Standard Professional Confirmation
    const primaryConfirm = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!primaryConfirm) return;

    try {
      await api.delete(`/products/${id}`);

      // Success Alert
      alert(
        "✅ Product deleted successfully.\n\n" +
        "The product has been removed from the catalog."
      );
      loadProducts();
    } catch (err) {
      const data = err.response?.data;

      // Check if product is linked to ACTIVE orders - Hard Block
      if (data?.isLinked && data?.isActive) {
        alert(
          "❌ This product cannot be deleted because it is linked to active orders.\n\nPlease try again later."
        );
        return;
      }

      // Check if product is linked to OTHER orders - Warning / Force Option
      if (data?.isLinked && !data?.isActive) {
        const secondaryConfirm = confirm(
          "This product is associated with existing orders. Deleting it may affect order records. Continue?"
        );
        if (secondaryConfirm) {
          try {
            await api.delete(`/products/${id}?force=true`);
            alert(
              "✅ Product deleted successfully.\n\n" +
              "The product has been removed from the catalog."
            );
            loadProducts();
          } catch (forceErr) {
            alert("❌ Please try again later.");
          }
        }
        return;
      }

      // Generic Error Alert
      alert("❌ Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/admin" className="text-indigo-600 hover:underline text-sm font-semibold italic">← Back to Dashboard</Link>
      </div>
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
            <div key={p._id} className="flex justify-between items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition group">
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
                  onClick={() => deleteProduct(p._id)}
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
