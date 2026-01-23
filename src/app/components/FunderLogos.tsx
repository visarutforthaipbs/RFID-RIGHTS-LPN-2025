"use client";

import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";

export function FunderLogos() {
  const { locale } = useLanguage();

  const supportedByText = {
    th: 'สนับสนุนโดย',
    mm: 'ထောက်ပံ့သူများ',
    en: 'Supported By',
    km: 'Supported By'
  };

  return (
    <div className="bg-white border-t border-gray-200 py-8 mb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-600 mb-6 font-medium">
          {supportedByText[locale] || supportedByText.en}
        </p>
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="relative h-12 sm:h-20 w-auto flex-shrink-0">
            <Image
              src="/logos/AGO_001 - LPN Foundation - Final Logo Small- LPN Initials Small - No Background.png"
              alt="LPN Foundation"
              width={180}
              height={80}
              className="object-contain h-12 sm:h-20 w-auto"
            />
          </div>
          <div className="relative h-12 sm:h-20 w-auto flex-shrink-0">
            <Image
              src="/logos/IJM_Logo_Horizontal_Blue_PNG.png"
              alt="International Justice Mission"
              width={200}
              height={80}
              className="object-contain h-12 sm:h-20 w-auto"
            />
          </div>
          <div className="relative h-5 sm:h-8 w-auto flex-shrink-0">
            <Image
              src="/logos/KOICA_Logo Mark(BLUE).png"
              alt="KOICA"
              width={100}
              height={32}
              className="object-contain h-5 sm:h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
