"use client";

import { useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { messages } from "../../lib/i18n";
import { Header } from "./components/Header";
import { SOSBar } from "./components/SOSBar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLanguage();
  const t = messages[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.somethingWentWrong}</h2>
              <button
                onClick={() => reset()}
                className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 font-medium transition-colors"
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
