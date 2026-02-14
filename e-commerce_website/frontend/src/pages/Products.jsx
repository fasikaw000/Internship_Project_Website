import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import Loader from "../components/Loader";
import { getProducts, deleteProduct } from "../services/productService";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const INITIAL_SHOW = 8;
const LOAD_MORE_STEP = 8;

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);

  const categoryOptions = [
    { label: "ALL", value: "all" },
    { label: "Electronics", value: "electronics" },
    { label: "Fashions", value: "fashions" },
    { label: "Books", value: "books" }
  ];

  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    setLoading(true);
    getProducts(category).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showNotification("Product deleted successfully", "success");
    } catch (err) {
      showNotification("Failed to delete product");
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  const visible = filteredProducts.slice(0, showCount);
  const hasMore = filteredProducts.length > showCount;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn min-h-screen relative">
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
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Discover Premium Quality Products</p>
        </div>

        {user?.role === "admin" && (
          <Link
            to="/admin/product/new"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition flex items-center gap-2"
          >
            <span>+</span> Add New Product
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <CategoryFilter
          categories={categoryOptions}
          selected={category}
          onChange={setCategory}
        />

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
          />

        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {visible.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm animate-fadeIn col-span-full">
              <div className="mb-4 flex justify-center text-slate-200">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <p className="text-xl text-slate-500 font-bold tracking-tight">No products found.</p>
              <p className="text-slate-400 text-sm mt-1 mb-8">Refine your search criteria or explore other categories.</p>
              <button
                onClick={() => { setSearch(""); setCategory("all"); }}
                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
              >
                Clear All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {visible.map((p) => (
                <ProductCard key={p._id} product={p} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setShowCount((c) => Math.min(c + LOAD_MORE_STEP, filteredProducts.length))}
                className="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition hover:border-slate-400"
              >
                Load More Products
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
            Showing {visible.length} of {filteredProducts.length} items
          </p>
        </>
      )}
    </div>
  );
}
