import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import Loader from "../components/Loader";
import { getProducts } from "../services/productService";

const INITIAL_SHOW = 6;
const LOAD_MORE_STEP = 6;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);

  const categoryOptions = [
    { label: "ALL PRODUCTS", value: "All" },
    { label: "ELECTRONICS", value: "Electronics" },
    { label: "FASHIONS", value: "Fashion" },
    { label: "BOOKS", value: "Books" },
  ];

  useEffect(() => {
    setLoading(true);
    getProducts(category).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  useEffect(() => {
    setShowCount(INITIAL_SHOW);
  }, [category]);

  const visible = products.slice(0, showCount);
  const hasMore = products.length > showCount;

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
      <CategoryFilter
        categories={categoryOptions}
        selected={category}
        onChange={setCategory}
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center max-w-6xl mx-auto">
            {visible.map((p) => (
              <div key={p._id} className="w-full max-w-[280px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowCount((c) => Math.min(c + LOAD_MORE_STEP, products.length))}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
              >
                See more ({products.length - showCount} left)
              </button>
            </div>
          )}
          {!loading && products.length > 0 && !hasMore && (
            <p className="mt-6 text-center text-gray-500 text-sm">Showing all {products.length} items</p>
          )}
        </>
      )}
    </div>
  );
}
