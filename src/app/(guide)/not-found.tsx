"use client";

import Link from "next/link";
import { SmileyMeh } from "@phosphor-icons/react/dist/ssr/SmileyMeh";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";
import { Header } from "../components/Header";
import { SOSBar } from "../components/SOSBar";

export default function NotFound() {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <div className="min-h-screen bg-surface pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="card p-8 max-w-md w-full">
              <SmileyMeh size={64} className="text-label-secondary mx-auto mb-4" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-label mb-4">{t.pageNotFound}</h1>
              <p className="text-label-secondary mb-8">{t.notFoundDescription}</p>
              <Link
                href="/"
                className="btn btn-primary"
              >
                {t.returnHome}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
