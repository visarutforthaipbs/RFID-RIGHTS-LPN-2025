"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

export function Header() {
  const { locale } = useLanguage();
  const t = messages[locale];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/topics", label: t.allTopics },
    { href: "/help", label: t.help },
    // { href: "/volunteer", label: t.volunteer }, // Hidden: still concept idea
    { href: "/settings", label: t.settings },
  ];

  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
      role="banner"
      ref={menuRef}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0 min-w-0"
          >
            <Image
              src="/favicon-new.svg"
              alt={t.title}
              width={32}
              height={32}
              className="w-8 h-8 flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-black leading-tight truncate">{t.title}</h1>
              <p className="text-xs text-gray-600 leading-tight">Migrant Rights Guide</p>
            </div>
          </Link>

          {/* Navigation and language switcher */}
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs px-2 py-1 rounded transition-all whitespace-nowrap ${
                    pathname === link.href
                      ? "text-black bg-yellow-400 bg-opacity-30 font-semibold"
                      : "text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <LanguageSwitcher />

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          mobileMenuOpen ? "max-h-64 border-t border-gray-200" : "max-h-0"
        }`}
      >
        <nav className="px-4 py-3 space-y-1" role="navigation" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-black bg-yellow-400 bg-opacity-30"
                  : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
