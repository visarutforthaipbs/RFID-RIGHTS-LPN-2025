"use client";

import { useEffect } from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";
import { Header } from "../components/Header";
import { SOSBar } from "../components/SOSBar";

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
    <div className="min-h-screen bg-surface pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="card p-8 max-w-md w-full" role="alert">
              <Warning size={64} className="text-critical mx-auto mb-4" aria-hidden="true" />
              <h1 className="text-xl font-bold text-label mb-4">{t.somethingWentWrong}</h1>
              <button
                onClick={() => reset()}
                className="btn btn-primary"
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
