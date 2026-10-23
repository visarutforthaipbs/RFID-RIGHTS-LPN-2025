"use client";

import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { useLanguage } from "../contexts/LanguageContext";
import { locales, type Locale } from "../../../lib/i18n";

/** Language select — ≥ 44 px, Phosphor `translate` icon (icons.json: language). */
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
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-label" aria-hidden="true">
        <Translate size={20} />
      </span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none min-h-12 bg-elevated text-label border border-separator-strong rounded-lg pl-10 pr-9 text-sm font-medium"
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
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-label-secondary" aria-hidden="true">
        <CaretDown size={16} weight="bold" />
      </span>
    </div>
  );
}
