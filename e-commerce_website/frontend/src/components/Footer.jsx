export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} E-Commerce Platform</p>
      </div>
    </footer>
  );
}
