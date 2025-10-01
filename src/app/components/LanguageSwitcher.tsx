"use client";

import { useState, useEffect } from "react";
import { locales, defaultLocale, type Locale } from "../../../lib/i18n";

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Get saved language from localStorage
    const savedLocale = localStorage.getItem("preferred-locale") as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setCurrentLocale(savedLocale);
    }
  }, []);

  const switchLanguage = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem("preferred-locale", locale);
    // In a full implementation, this would trigger a rerender with new messages
    window.location.reload();
  };

  const getLanguageLabel = (locale: Locale): string => {
    switch (locale) {
      case "th":
        return "ไทย";
      case "mm":
        return "မြန်မာ";
      case "km":
        return "ខ្មែរ";
    }
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value as Locale)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="เลือกภาษา / Choose Language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {getLanguageLabel(locale)}
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
