"use client";

import Image from "next/image";
import { SearchBox } from "./SearchBox";
import { TopicRow } from "../../../lib/types";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

interface HeroSectionProps {
  data: TopicRow[];
  onResults: (results: TopicRow[], query: string) => void;
}

/**
 * Home hero — a light surface (worker tool, not a black stage). Title and
 * search on the left, the brand-approved scenario illustration beside it on
 * wide screens and below it on phones. No overlays, no gradients.
 */
export function HeroSection({ data, onResults }: HeroSectionProps) {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <section className="w-full bg-surface-secondary border-b border-separator mb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Image src="/favicon-new.svg" alt="" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" aria-hidden="true" />
            <h1 className="text-2xl sm:text-3xl font-bold text-label">{t.chooseYourSituation}</h1>
          </div>
          <p className="text-base sm:text-lg text-label-secondary mb-6 max-w-2xl mx-auto lg:mx-0">
            {t.chooseDescription}
          </p>

          <div className="w-full max-w-md mx-auto lg:mx-0">
            <SearchBox data={data} onResults={onResults} placeholder={t.orSearchDirectly} />
            <p className="mt-3 text-sm text-label-secondary">{t.orChooseBelow}</p>
          </div>
        </div>

        <div className="relative w-full aspect-[1968/930] max-h-56 lg:max-h-72 rounded-xl overflow-hidden">
          <Image src="/images/hero-new.svg" alt="" fill className="object-cover object-center" priority aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
