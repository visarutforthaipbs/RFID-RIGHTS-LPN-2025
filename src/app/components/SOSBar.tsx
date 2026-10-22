"use client";

import Link from "next/link";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { trackEvent } from "../../../lib/analytics";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

/**
 * Bottom help bar (glass — the second of the two allowed glass surfaces).
 * Emergency/SOS elements use the status red (critical) tokens, never yellow:
 * the hotline is the filled red action, "more help" is an outline button.
 * Number 084-121-1609 stays until LPN confirms (BRAND §10).
 */
export function SOSBar() {
  const { locale } = useLanguage();
  const t = messages[locale];

  const handleCallClick = (number: string, type: "call") => {
    trackEvent({ type: "sos_contact", method: type });
    window.location.href = `tel:${number}`;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 glass border-t border-separator text-label px-4 py-3 z-50"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label={locale === "en" ? "Emergency contacts" : locale === "mm" ? "အရေးပေါ်ဆက်သွယ်ရန်" : "ช่องทางฉุกเฉิน"}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base leading-snug">{t.sosHeading}</h3>
          <p className="hidden sm:block text-xs text-label-secondary leading-snug">{t.sosSubtext}</p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {/* LPN hotline */}
          <button
            type="button"
            onClick={() => handleCallClick("084-121-1609", "call")}
            className="btn btn-emergency text-sm px-3"
            aria-label={t.sosCallAria}
          >
            <Phone size={20} weight="fill" aria-hidden="true" />
            <span className="whitespace-nowrap">084-121-1609</span>
          </button>

          {/* More help page */}
          <Link href="/help" className="btn btn-secondary text-sm px-3" aria-label={t.sosHelpLinkAria}>
            <Question size={20} aria-hidden="true" />
            <span className="hidden sm:inline">{t.sosHelpLinkLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
