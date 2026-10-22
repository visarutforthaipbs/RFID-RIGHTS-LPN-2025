"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { useLanguage } from "../contexts/LanguageContext";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { locale } = useLanguage();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-4 z-40 bg-elevated text-label w-12 h-12 rounded-full border border-separator-strong flex items-center justify-center hover:bg-surface-secondary transition-colors"
      aria-label={locale === "en" ? "Back to top" : locale === "mm" ? "အပေါ်သို့ ပြန်သွားရန်" : "กลับขึ้นด้านบน"}
    >
      <ArrowUp size={22} weight="bold" aria-hidden="true" />
    </button>
  );
}
