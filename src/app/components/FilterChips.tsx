"use client";

interface FilterChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function FilterChips({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? "bg-yellow-400 text-black"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        aria-pressed={selectedCategory === null}
        type="button"
      >
        ทั้งหมด
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? "bg-yellow-400 text-black"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-pressed={selectedCategory === category}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
