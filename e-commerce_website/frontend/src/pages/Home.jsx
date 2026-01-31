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
        <div className="w-full max-w-2xl flex flex-col justify-center items-center px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            Welcome to Our E-Commerce Store
          </h1>
          <p className="mb-6 text-lg text-gray-800 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            We are your one-stop shop for Electronics, Fashion, Books and more. Browse four categories and order with ease.
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition hover:shadow-xl"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
