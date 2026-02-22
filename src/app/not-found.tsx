"use client";

import Link from "next/link";
import { useLanguage } from "./contexts/LanguageContext";
import { messages } from "../../lib/i18n";
import { Header } from "./components/Header";
import { SOSBar } from "./components/SOSBar";

export default function NotFound() {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full">
              <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.pageNotFound}</h2>
              <p className="text-gray-600 mb-8">{t.notFoundDescription}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 font-medium transition-colors"
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
