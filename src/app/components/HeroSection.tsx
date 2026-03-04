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

export function HeroSection({ data, onResults }: HeroSectionProps) {
  const { locale } = useLanguage();
  const t = messages[locale];

  return (
    <section className="relative w-full min-h-[440px] sm:min-h-[450px] lg:min-h-[520px] mb-12">
      <Image
        src="/images/hero-new.svg"
        alt=""
        fill
        className="object-cover brightness-75"
        priority
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 py-6 z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image
            src="/favicon-new.svg"
            alt=""
            width={48}
            height={48}
            className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-lg"
            aria-hidden="true"
          />
          <h1 className="text-2xl sm:text-5xl font-bold text-white drop-shadow-lg max-w-4xl">
            {t.chooseYourSituation}
          </h1>
        </div>
        <p className="text-sm sm:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium whitespace-normal sm:whitespace-pre-line px-2">
          {t.chooseDescription}
        </p>

        <div className="w-full max-w-md relative">
          <SearchBox
            data={data}
            onResults={onResults}
            placeholder={t.orSearchDirectly}
          />
          <div className="mt-4 text-sm text-white/90 font-medium drop-shadow-sm">
            {t.orChooseBelow}
          </div>
        </div>
      </div>
    </section>
  );
}
