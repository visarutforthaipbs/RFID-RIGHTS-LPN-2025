"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

export function Header() {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
      role="banner"
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
            <nav
              className="hidden lg:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                href="/topics"
                className="text-xs text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all whitespace-nowrap"
              >
                {t.allTopics}
              </Link>
              <Link
                href="/help"
                className="text-xs text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all whitespace-nowrap"
              >
                {t.help}
              </Link>
              <Link
                href="/volunteer"
                className="text-xs text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all whitespace-nowrap"
              >
                {t.volunteer}
              </Link>
              <Link
                href="/settings"
                className="text-xs text-gray-700 hover:text-black hover:bg-yellow-400 hover:bg-opacity-20 px-2 py-1 rounded transition-all whitespace-nowrap"
              >
                {t.settings}
              </Link>
            </nav>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
