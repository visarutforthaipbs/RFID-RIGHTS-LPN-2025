"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { GearSix } from "@phosphor-icons/react/dist/ssr/GearSix";
import { List } from "@phosphor-icons/react/dist/ssr/List";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

/**
 * Sticky top bar — the ONE place (with the bottom SOS bar) where glass is
 * allowed (BRAND.md rule 7). Active tab = Phosphor `fill` weight + label,
 * inactive = `regular` (rule 10). Every control ≥ 44 px.
 */
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
    { href: "/topics", label: t.allTopics, Icon: Scales },
    { href: "/help", label: t.help, Icon: Question },
    // { href: "/volunteer", label: t.volunteer }, // Hidden: still concept idea
    { href: "/settings", label: t.settings, Icon: GearSix },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="glass border-b border-separator sticky top-0 z-40" role="banner" ref={menuRef}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 min-h-16 py-1">
          {/* Logo and title */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0 rounded-lg">
            <Image src="/favicon-new.svg" alt="" width={32} height={32} className="w-8 h-8 flex-shrink-0" aria-hidden="true" />
            <span className="min-w-0 leading-tight">
              <span className="block text-base font-bold text-label truncate">{t.title}</span>
              <span className="block text-xs text-label-secondary">Migrant Rights Guide</span>
            </span>
          </Link>

          {/* Navigation and language switcher */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map(({ href, label, Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-1.5 px-3 rounded-lg text-sm whitespace-nowrap transition-colors hover:bg-surface-secondary ${
                      active ? "font-semibold text-label" : "font-medium text-label-secondary hover:text-label"
                    }`}
                  >
                    <Icon size={20} weight={active ? "fill" : "regular"} aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <LanguageSwitcher />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-lg hover:bg-surface-secondary transition-colors text-label"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        role="region"
        aria-label={t.allTopics}
        hidden={!mobileMenuOpen}
        className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out ${
          mobileMenuOpen ? "max-h-72 border-t border-separator" : "max-h-0"
        }`}
      >
        <nav className="px-4 py-3 space-y-1" aria-label="Mobile navigation">
          {navLinks.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-4 min-h-12 rounded-lg text-base transition-colors ${
                  active ? "font-semibold text-label bg-surface-secondary" : "font-medium text-label-secondary hover:bg-surface-secondary hover:text-label"
                }`}
              >
                <Icon size={22} weight={active ? "fill" : "regular"} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
