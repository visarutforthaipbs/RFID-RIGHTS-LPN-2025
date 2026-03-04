"use client";

import Link from "next/link";
import Image from "next/image";
import { TopicCard } from "./TopicCard";
import { TopicRow } from "../../../lib/types";
import { scenarios } from "../../../lib/scenarios";
import { useLanguage } from "../contexts/LanguageContext";
import { messages, getLocalizedField } from "../../../lib/i18n";

interface ResultsSectionProps {
  searchQuery: string;
  selectedScenarioId: string | null;
  filteredData: TopicRow[];
  onClear: () => void;
}

export function ResultsSection({
  searchQuery,
  selectedScenarioId,
  filteredData,
  onClear,
}: ResultsSectionProps) {
  const { locale } = useLanguage();
  const t = messages[locale];

  const selectedScenarioData = selectedScenarioId
    ? scenarios.find((s) => s.id === selectedScenarioId)
    : null;

  if (!searchQuery && !selectedScenarioData) return null;

  return (
    <section aria-label={searchQuery ? t.searchResults : t.relatedTopics}>
      {/* Screen reader live region for results count */}
      <div className="sr-only" aria-live="polite" role="status">
        {filteredData.length > 0
          ? `${t.found} ${filteredData.length} ${searchQuery ? t.resultsCount : t.topicsCount}`
          : t.noResults}
      </div>
      {/* Selected Scenario Header */}
      {selectedScenarioData && (
        <div className="mb-8 p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <div className="mr-4 p-2 rounded-full bg-white shadow-sm flex items-center justify-center">
              {selectedScenarioData.iconType === "image" ? (
                <div className="w-16 h-16 relative">
                  <Image
                    src={selectedScenarioData.icon}
                    alt={getLocalizedField(
                      selectedScenarioData,
                      locale,
                      "title"
                    ) as string}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="text-4xl">{selectedScenarioData.icon}</div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black mb-1">
                {getLocalizedField(selectedScenarioData, locale, "title") as string}
              </h2>
              <p className="text-gray-600">
                {getLocalizedField(selectedScenarioData, locale, "description") as string}
              </p>
            </div>
            <div className="hidden sm:flex gap-2 flex-wrap">
              {(
                (getLocalizedField(
                  selectedScenarioData,
                  locale,
                  "keywords"
                ) as string[]) || []
              )
                .slice(0, 4)
                .map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full border border-yellow-200"
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>

          {selectedScenarioData.urgency === "high" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="mr-3 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-red-800 font-medium">{t.urgentAction}</p>
                  <p className="text-red-600 text-sm mt-1">
                    {t.emergencyContact}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-black">
          {searchQuery
            ? `${t.searchResults} "${searchQuery}"`
            : t.relatedTopics}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {t.found} {filteredData.length}{" "}
          {searchQuery ? t.resultsCount : t.topicsCount}
        </span>
      </div>

      {/* Grid or Not Found */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((topic) => (
            <TopicCard key={topic.slug} row={topic} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          {searchQuery ? (
            <div className="py-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {t.noResults}
              </h3>
              <p className="mt-2 text-gray-500">{t.tryDifferentKeywords}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t.notFoundYet}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t.tryOtherOrSearch}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={onClear}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t.chooseNewSituation}
                </button>
                <Link
                  href="/topics"
                  className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  {t.viewAllTopics}
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
