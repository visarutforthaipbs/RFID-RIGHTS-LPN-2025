"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { TextAa } from "@phosphor-icons/react/dist/ssr/TextAa";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { Header } from "../../components/Header";
import { SOSBar } from "../../components/SOSBar";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useLanguage } from "../../contexts/LanguageContext";
import { messages } from "../../../../lib/i18n";

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
    <div className="min-h-screen bg-surface pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="crumb mb-6" aria-label="Breadcrumb">
            <Link href="/">{t.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t.settings}</span>
          </nav>

          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-label mb-3">
              {t.settingsPageTitle}
            </h1>
            <p className="text-label-secondary">{t.settingsPageDescription}</p>
          </header>

          <div className="space-y-6">
            {/* Language Settings */}
            <section className="card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
                <Translate size={26} aria-hidden="true" />
                {t.language}
              </h2>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-label font-medium mb-1">
                    {t.selectLanguage}
                  </p>
                  <p className="text-label-secondary text-sm">
                    {t.changeLanguageDisplay}
                  </p>
                </div>
                <LanguageSwitcher />
              </div>
            </section>

            {/* Display Settings */}
            <section className="card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
                <TextAa size={26} aria-hidden="true" />
                {t.display}
              </h2>

              {/* Font Size */}
              <div>
                <p className="block text-label font-medium mb-2" id="font-size-label">
                  {t.fontSize}
                </p>
              <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="font-size-label">
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
                      type="button"
                      className={`p-3 min-h-12 rounded-lg border text-center font-medium transition-colors ${
                        fontSize === option.value
                          ? "border-accent bg-accent text-on-accent"
                          : "border-separator-strong bg-elevated text-label hover:bg-surface-secondary"
                      }`}
                    >
                      <span className={option.size}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* About & Reset */}
            <section className="card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-label mb-4 flex items-center gap-2">
                <Info size={26} aria-hidden="true" />
                {t.aboutSection}
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-label font-medium">{t.appName}</p>
                  <p className="text-label-secondary text-sm">{t.version}</p>
                </div>

                <div>
                  <p className="text-label font-medium">{t.designedBy}</p>
                  <p className="text-label-secondary text-sm">{t.designedByDetail}</p>
                </div>

                <div>
                  <p className="text-label font-medium mb-3">
                    {t.supportedBy}
                  </p>
                  <div className="flex flex-wrap items-center gap-8 bg-inverse p-6 rounded-xl justify-center">
                    <div className="relative h-20 w-auto">
                      <Image
                        src="/logos/AGO_001 - LPN Foundation - Final Logo Small- LPN Initials Small - No Background.png"
                        alt="LPN Foundation"
                        height={80}
                        width={180}
                        className="object-contain h-16 w-auto brightness-0 invert"
                      />
                    </div>
                    <div className="relative h-20 w-auto">
                      <Image
                        src="/logos/IJM_Logo_Horizontal_Blue_PNG.png"
                        alt="IJM"
                        height={80}
                        width={200}
                        className="object-contain h-16 w-auto brightness-0 invert"
                      />
                    </div>
                    <div className="relative h-8 w-auto">
                      <Image
                        src="/logos/KOICA_Logo Mark(BLUE).png"
                        alt="KOICA"
                        height={32}
                        width={100}
                        className="object-contain h-7 w-auto brightness-0 invert"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-separator">
                  <button
                    type="button"
                    onClick={resetSettings}
                    className="btn btn-secondary w-full text-critical-ink border-critical"
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
