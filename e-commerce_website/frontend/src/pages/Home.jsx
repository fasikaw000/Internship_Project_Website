import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const allProducts = await getProducts("all");
        const categories = ["electronics", "fashions", "books"];
        const featured = [];

        categories.forEach(cat => {
          const catProducts = allProducts
            .filter(p => p.category === cat)
            .slice(0, 1);
          featured.push(...catProducts);
        });

        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: `url(/home-bg.png)` }}
    >
      {/* Remove global overlay completely for background clarity */}

      <div className="relative z-10">
        {/* Featured Products Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto mb-12 bg-white/10 backdrop-blur-sm rounded-[4rem] border border-white/10 shadow-2xl mt-12">
          <div className="flex flex-col items-center mb-16 px-4 text-center">
            <p className="text-xs md:text-sm font-semibold text-white uppercase tracking-[0.6em] mb-4 drop-shadow-lg">Discover Excellence in Every Purchase</p>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase italic whitespace-nowrap">
              Top Rated <span className="text-teal-400">Products</span>
            </h3>
            <div className="w-16 h-[2px] bg-white/20 mt-8 rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <div className="mt-16 flex justify-center">
                <Link to="/products" className="group relative px-12 py-5 bg-teal-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:shadow-[0_20px_50px_rgba(20,184,166,0.5)] transition-all duration-500 hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Our Products <span className="text-lg transition-transform group-hover:translate-x-2">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Why Choose Section - Transparent background */}
      <section className="bg-slate-900/10 backdrop-blur-sm py-32 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto text-center font-bold">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tighter uppercase italic drop-shadow-2xl">
            Why Choose <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">MICHU</span><span className="text-teal-400 drop-shadow-[0_2px_10px_rgba(20,184,166,0.3)]">GEBEYA?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Premium Quality", desc: "Hand-selected and verified excellence for every customer." },
              { title: "Fast Delivery", desc: "Your package arrives on time." },
              { title: "Secure Shopping", desc: "Secure bank transfers or cash on delivery." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-3xl flex items-center justify-center text-teal-400 text-xl font-black mb-6 shadow-xl group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                  0{idx + 1}
                </div>
                <h4 className="text-white text-lg font-bold mb-3 uppercase tracking-tighter">{feature.title}</h4>
                <p className="text-slate-100 text-sm leading-relaxed max-w-[200px] font-bold drop-shadow-md">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
