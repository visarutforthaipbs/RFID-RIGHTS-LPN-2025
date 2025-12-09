"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

export function QuickHelp() {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-black mb-8 text-center">
        {t.cantFind}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/help"
          className="bg-[#EE0000] rounded-3xl p-8 hover:opacity-90 transition-opacity group text-center flex flex-col items-center justify-center min-h-[240px]"
        >
          <div className="mb-6 relative w-20 h-20">
            <Image
              src="/icons/help-icon.svg"
              alt="Help"
              fill
              className="object-contain"
            />
          </div>
          <h4 className="font-bold text-white text-xl mb-1">{t.getHelp}</h4>
          <p className="text-sm text-white/90">{t.emergencyHotline}</p>
        </Link>

        <Link
          href="/topics"
          className="bg-[#FFC314] rounded-3xl p-8 hover:opacity-90 transition-opacity group text-center flex flex-col items-center justify-center min-h-[240px]"
        >
          <div className="mb-6 relative w-20 h-20">
            <Image
              src="/icons/topic-icon.svg"
              alt="Topics"
              fill
              className="object-contain"
            />
          </div>
          <h4 className="font-bold text-black text-xl mb-1">
            {t.viewAllTopics}
          </h4>
          <p className="text-sm text-black/80">{t.learnMore}</p>
        </Link>

        <Link
          href="/settings"
          className="bg-[#EAEFF1] rounded-3xl p-8 hover:opacity-90 transition-opacity group text-center flex flex-col items-center justify-center min-h-[240px]"
        >
          <div className="mb-6 relative w-20 h-20">
            <Image
              src="/icons/setting-icon.svg"
              alt="Settings"
              fill
              className="object-contain"
            />
          </div>
          <h4 className="font-bold text-black text-xl mb-1">{t.settings}</h4>
          <p className="text-sm text-black/60">{t.settingsAndDisplay}</p>
        </Link>
      </div>
    </section>
  );
}
