"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { locales, type Locale } from "../../../lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const getLanguageLabel = (loc: Locale): string => {
    switch (loc) {
      case "th":
        return "ไทย";
      case "en":
        return "English";
      case "mm":
        return "မြန်မာ";
      case "km":
        return "ខ្មែរ";
    }
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        aria-label="เลือกภาษา / Choose Language"
      >
        {locales
          .filter((loc) => loc !== "km") // Hide Khmer until content is ready
          .map((loc) => (
            <option key={loc} value={loc}>
              {getLanguageLabel(loc)}
            </option>
          ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
