"use client";

import Link from "next/link";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { Microphone } from "@phosphor-icons/react/dist/ssr/Microphone";
import { ListChecks } from "@phosphor-icons/react/dist/ssr/ListChecks";
import { Scales } from "@phosphor-icons/react/dist/ssr/Scales";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

/**
 * "Can't find it?" — four neutral cards (brand vocabulary §10):
 * ขอความช่วยเหลือ · ส่งเสียงเล่าเรื่อง · ติดตามเรื่อง · คู่มือทั้งหมด.
 * Pictograms are Phosphor duotone with the yellow layer; no filled cards, so
 * the yellow accent is not spent here (home has no single primary action).
 */
export function QuickHelp() {
  const { locale } = useLanguage();
  const t = messages[locale];

  const cards = [
    { href: "/help", Icon: Question, title: t.getHelp, desc: t.emergencyHotline },
    { href: "/voice-report", Icon: Microphone, title: t.voiceReportTitle, desc: t.voiceReportDesc },
    { href: "/track", Icon: ListChecks, title: t.trackTitle, desc: t.trackDesc },
    { href: "/topics", Icon: Scales, title: t.viewAllTopics, desc: t.learnMore },
  ];

  return (
    <section className="mt-16" aria-labelledby="quick-help-heading">
      <h2 id="quick-help-heading" className="text-2xl font-bold text-label mb-6 text-center">
        {t.cantFind}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ href, Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="card p-5 flex items-center gap-4 transition-colors hover:border-separator-strong group"
          >
            <span className="duo-accent text-label flex-shrink-0" aria-hidden="true">
              <Icon size={44} weight="duotone" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-label text-lg">{title}</span>
              <span className="block text-sm text-label-secondary">{desc}</span>
            </span>
            <CaretRight size={20} weight="bold" className="text-label-secondary flex-shrink-0" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
