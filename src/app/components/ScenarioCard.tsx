"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Scenario } from "../../../lib/types";
import { getLocalizedField } from "../../../lib/i18n";

interface ScenarioCardProps {
  scenario: Scenario;
  onClick?: () => void;
}

export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  const [imageError, setImageError] = useState(false);
  const { locale } = useLanguage();

  const title = getLocalizedField(scenario, locale, "title") as string;
  const description = getLocalizedField(scenario, locale, "description") as string;
  const keywords = getLocalizedField(scenario, locale, "keywords") as string[];

  const urgencyBadge =
    scenario.urgency === "high" ? (
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {locale === "en" ? "Urgent" : locale === "mm" ? "အရေးတကြီး" : "ด่วน"}
        </span>
      </div>
    ) : scenario.urgency === "medium" ? (
      <div className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {locale === "en"
            ? "Important"
            : locale === "mm"
            ? "အရေးကြီး"
            : "สำคัญ"}
        </span>
      </div>
    ) : null;

  const handleImageError = () => {
    console.error(`Failed to load image: ${scenario.icon}`);
    setImageError(true);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${scenario.color.bg} ${scenario.color.border} border-2 rounded-xl p-6 ${scenario.color.hoverBg} transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-2 relative transform-gpu w-full text-left`}
    >
      {urgencyBadge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg motion-safe:animate-pulse">
          {urgencyBadge}
        </div>
      )}

      <div className="text-center w-full">
        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
          {scenario.iconType === "image" ? (
            <div className="w-28 h-28 sm:w-32 sm:h-32 relative">
              {!imageError ? (
                <Image
                  src={scenario.icon}
                  alt={title}
                  fill
                  className="object-contain drop-shadow-sm"
                  sizes="(max-width: 640px) 112px, 128px"
                  priority={scenario.priority}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="text-4xl">{scenario.icon}</div>
          )}
        </div>

        <h3
          className={`font-bold ${
            scenario.iconType === "image" ? "text-xl sm:text-2xl" : "text-lg"
          } ${
            scenario.color.text
          } mb-3 group-hover:text-black transition-colors duration-200`}
        >
          {title}
        </h3>

        <p
          className={`${
            scenario.iconType === "image" ? "text-base" : "text-sm"
          } text-gray-600 mb-4 group-hover:text-gray-800 transition-colors duration-200 leading-relaxed`}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-1 justify-center opacity-75 group-hover:opacity-100 transition-opacity duration-200">
          {keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-gray-700 border border-white/50"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
