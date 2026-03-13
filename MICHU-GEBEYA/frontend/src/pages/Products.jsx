import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import Loader from "../components/Loader";
import { getProducts, deleteProduct } from "../services/productService";
import { useAuth } from "../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";

const INITIAL_SHOW = 8;
const LOAD_MORE_STEP = 8;

export default function Products() {
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("cat") || "all";

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);

  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const urlCat = new URLSearchParams(location.search).get("cat") || "all";
    setCategory(urlCat);
  }, [location.search]);

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



      {/* Centered Search Bar */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 font-medium pr-14"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="flex justify-end mb-8">
          <Link
            to="/admin/product/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition flex items-center gap-2"
          >
            <span>+</span> Add New Product
          </Link>
        </div>
      )}

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
                className="bg-indigo-600 text-white px-10 py-3.5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all duration-300 active:scale-95"
              >
                show more
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
