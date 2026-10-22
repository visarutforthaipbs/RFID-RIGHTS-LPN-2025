"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

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
  const { locale } = useLanguage();
  const t = messages[locale];

  // Map Thai category names to translation keys
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      เอกสารและการเดินทาง: t.categoryDocuments,
      ทำงานและสวัสดิการ: t.categoryWork,
      ครอบครัวและชีวิตในชุมชน: t.categoryFamily,
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label={locale === "en" ? "Filter by category" : locale === "mm" ? "အမျိုးအစားဖြင့် စစ်ထုတ်ရန်" : "กรองตามหมวดหมู่"}>
      <button
        onClick={() => onCategoryChange(null)}
        className="chip chip-select"
        aria-pressed={selectedCategory === null}
        type="button"
      >
        {t.all}
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className="chip chip-select"
          aria-pressed={selectedCategory === category}
          type="button"
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
