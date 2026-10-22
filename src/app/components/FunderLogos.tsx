"use client";

import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * "สนับสนุนโดย" strip — the one black stage on the guide (BRAND.md rule 8:
 * logos black or white only). Partner marks are rendered as white silhouettes
 * (`brightness-0 invert`) so the strip reads the same in light and dark.
 */
export function FunderLogos() {
  const { locale } = useLanguage();

  const supportedByText = {
    th: 'สนับสนุนโดย',
    mm: 'ထောက်ပံ့သူများ',
    en: 'Supported By',
    km: 'Supported By'
  };

  return (
    <footer className="bg-inverse text-on-inverse py-8" role="contentinfo">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-on-inverse-secondary mb-6 font-medium">
          {supportedByText[locale] || supportedByText.en}
        </p>
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <Image
            src="/logos/AGO_001 - LPN Foundation - Final Logo Small- LPN Initials Small - No Background.png"
            alt="LPN Foundation"
            width={180}
            height={80}
            className="object-contain h-14 sm:h-16 w-auto brightness-0 invert"
          />
          <Image
            src="/logos/IJM_Logo_Horizontal_Blue_PNG.png"
            alt="International Justice Mission"
            width={200}
            height={80}
            className="object-contain h-12 sm:h-14 w-auto brightness-0 invert"
          />
          <Image
            src="/logos/KOICA_Logo Mark(BLUE).png"
            alt="KOICA"
            width={100}
            height={32}
            className="object-contain h-6 sm:h-7 w-auto brightness-0 invert"
          />
        </div>
      </div>
    </footer>
  );
}
