export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full">
      {categories.map((cat) => {
        const value = typeof cat === "object" ? cat.value : cat;
        const label = typeof cat === "object" ? cat.label : cat;
        const isActive = selected === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-5 py-2.5 rounded-lg font-semibold transition shadow-sm ${isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
