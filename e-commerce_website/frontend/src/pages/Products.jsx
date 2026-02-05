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
  const [showCount, setShowCount] = useState(INITIAL_SHOW);

  const categoryOptions = [
    { label: "ALL PRODUCTS", value: "all" },
    { label: "ELECTRONICS", value: "electronics" },
    { label: "FASHIONS", value: "fashions" },
    { label: "BOOKS", value: "books" },
  ];

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
      alert("Product deleted successfully");
    } catch (err) {
      alert("Failed to delete product");
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
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn min-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Collection</h2>
          <p className="text-slate-500 mt-1">Discover premium quality products</p>
        </div>

        {user?.role === "admin" && (
          <Link
            to="/admin"
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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {visible.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400 font-medium">No products found matching your criteria.</p>
              <button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Filters</button>
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
