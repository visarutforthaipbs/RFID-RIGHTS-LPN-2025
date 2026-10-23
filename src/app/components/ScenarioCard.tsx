"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { Microphone } from "@phosphor-icons/react/dist/ssr/Microphone";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { useLanguage } from "../contexts/LanguageContext";
import { Scenario } from "../../../lib/types";
import { getLocalizedField, messages } from "../../../lib/i18n";

interface ScenarioCardProps {
  scenario: Scenario;
  onClick?: () => void;
}

/**
 * Situation card. Solid elevated surface, radius 12, 1 px separator, no hover
 * motion. Urgency is a status word + dot (never colour alone, never yellow).
 * The emergency card is the only one with two actions: "ขอความช่วยเหลือ"
 * (→ /help, same destination as before) and "ส่งเสียงเล่าเรื่อง" (→ /voice-report).
 */
export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  const [imageError, setImageError] = useState(false);
  const { locale } = useLanguage();

  const title = getLocalizedField(scenario, locale, "title") as string;
  const description = getLocalizedField(scenario, locale, "description") as string;
  const keywords = getLocalizedField(scenario, locale, "keywords") as string[];
  const t = messages[locale];
  const isEmergency = scenario.id === "emergency-help";

  const urgencyBadge =
    scenario.urgency === "high" ? (
      <span className="status status-critical">{t.urgencyHigh}</span>
    ) : scenario.urgency === "medium" ? (
      <span className="status status-medium">{t.urgencyMedium}</span>
    ) : null;

  const handleImageError = () => {
    console.error(`Failed to load image: ${scenario.icon}`);
    setImageError(true);
  };

  const art = (
    <div className="mb-4 flex items-center justify-center">
      {scenario.iconType === "image" ? (
        <div className="w-28 h-28 sm:w-32 sm:h-32 relative">
          {!imageError ? (
            <Image
              src={scenario.icon}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 112px, 128px"
              priority={scenario.priority}
              onError={handleImageError}
              aria-hidden="true"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-surface-secondary" aria-hidden="true" />
          )}
        </div>
      ) : (
        <div className="text-4xl">{scenario.icon}</div>
      )}
    </div>
  );

  const body = (
    <>
      <h3 className={`font-bold text-label mb-2 ${scenario.iconType === "image" ? "text-xl" : "text-lg"}`}>{title}</h3>
      <p className="text-base text-label-secondary mb-4">{description}</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {keywords.slice(0, 3).map((keyword, index) => (
          <span key={index} className="chip">
            {keyword}
          </span>
        ))}
      </div>
    </>
  );

  if (isEmergency) {
    return (
      <article
        className={`card p-6 relative w-full text-center flex flex-col ${
          isEmergency ? "border-critical" : ""
        }`}
        aria-labelledby={`scenario-${scenario.id}`}
      >
        {urgencyBadge && <div className="absolute top-3 right-3">{urgencyBadge}</div>}
        {art}
        <h3 id={`scenario-${scenario.id}`} className="font-bold text-label text-xl mb-2 flex items-center justify-center gap-2">
          <Warning size={24} weight="fill" className="text-critical" aria-hidden="true" />
          {title}
        </h3>
        <p className="text-base text-label-secondary mb-5">{description}</p>
        <div className="mt-auto grid gap-2">
          <button type="button" onClick={onClick} className="btn btn-emergency w-full">
            <Question size={22} weight="bold" aria-hidden="true" />
            {t.getHelp}
          </button>
          <Link href="/voice-report" className="btn btn-secondary w-full">
            <Microphone size={22} aria-hidden="true" />
            {t.voiceReportTitle}
          </Link>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title} — ${description}`}
      className="card p-6 relative w-full text-center transition-colors hover:border-separator-strong cursor-pointer"
    >
      {urgencyBadge && <div className="absolute top-3 right-3">{urgencyBadge}</div>}
      <div className="w-full">
        {art}
        {body}
      </div>
    </button>
  );
}
