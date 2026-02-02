import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#87CEEB]">
      <section
        className="min-h-[calc(100vh-8rem)] w-full flex flex-col justify-center items-center text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/home-bg.png)`,
          backgroundColor: "#87CEEB",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-2xl flex flex-col justify-center items-center px-6 py-12 animate-slideUp">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg scale-100 hover:scale-105 transition-transform duration-500">
            <span className="text-indigo-200">Welcome to</span> <span className="whitespace-nowrap text-white">MICHU<span className="text-teal-400">GEBEYA</span></span>
          </h1>
          <p className="mb-6 text-lg text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90">
            We are your one-stop shop for Electronics, Fashions, Books and more. Browse our curated categories and order with ease.
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 animate-fadeIn"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
