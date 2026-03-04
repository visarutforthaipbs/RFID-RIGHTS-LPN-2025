"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "../components/Header";
import { SOSBar } from "../components/SOSBar";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const { locale } = useLanguage();
  const t = messages[locale];

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFontSize =
      (localStorage.getItem("fontSize") as "small" | "medium" | "large") ||
      "medium";

    setFontSize(savedFontSize);
  }, []);

  // Apply font size to document
  useEffect(() => {
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };

    document.documentElement.style.fontSize = fontSizeMap[fontSize];
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const resetSettings = () => {
    if (confirm(t.confirmReset)) {
      localStorage.clear();
      setFontSize("medium");
      document.documentElement.style.fontSize = "16px";
      alert(t.settingsReset);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-black hover:text-yellow-600">
              {t.home}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{t.settings}</span>
          </nav>

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t.settingsPageTitle}
            </h1>
            <p className="text-gray-600">{t.settingsPageDescription}</p>
          </header>

          <div className="space-y-6">
            {/* Language Settings */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                {t.language}
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium mb-1">
                    {t.selectLanguage}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {t.changeLanguageDisplay}
                  </p>
                </div>
                <LanguageSwitcher />
              </div>
            </section>

            {/* Display Settings */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t.display}
              </h2>

              {/* Font Size */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t.fontSize}
                </label>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label={t.fontSize}>
                  {[
                    { value: "small", label: t.small, size: "text-sm" },
                    { value: "medium", label: t.medium, size: "text-base" },
                    { value: "large", label: t.large, size: "text-lg" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFontSize(
                          option.value as "small" | "medium" | "large"
                        )
                      }
                      aria-pressed={fontSize === option.value}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        fontSize === option.value
                          ? "border-yellow-400 bg-yellow-50 text-black"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className={option.size}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* About & Reset */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="h-6 w-6 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t.aboutSection}
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 font-medium">{t.appName}</p>
                  <p className="text-gray-500 text-sm">{t.version}</p>
                </div>

                <div>
                  <p className="text-gray-700 font-medium">{t.designedBy}</p>
                  <p className="text-gray-500 text-sm">{t.designedByDetail}</p>
                </div>

                <div>
                  <p className="text-gray-700 font-medium mb-3">
                    {t.supportedBy}
                  </p>
                  <div className="flex flex-wrap items-center gap-8 bg-gray-50 p-6 rounded-lg justify-center">
                    <div className="relative h-20 w-auto">
                      <Image
                        src="/logos/AGO_001 - LPN Foundation - Final Logo Small- LPN Initials Small - No Background.png"
                        alt="LPN Foundation"
                        height={80}
                        width={180}
                        className="object-contain h-20 w-auto"
                      />
                    </div>
                    <div className="relative h-20 w-auto">
                      <Image
                        src="/logos/IJM_Logo_Horizontal_Blue_PNG.png"
                        alt="IJM"
                        height={80}
                        width={200}
                        className="object-contain h-20 w-auto"
                      />
                    </div>
                    <div className="relative h-8 w-auto">
                      <Image
                        src="/logos/KOICA_Logo Mark(BLUE).png"
                        alt="KOICA"
                        height={32}
                        width={100}
                        className="object-contain h-8 w-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={resetSettings}
                    className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    {t.resetAllSettings}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
