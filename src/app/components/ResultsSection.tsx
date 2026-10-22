"use client";

import Link from "next/link";
import Image from "next/image";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
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
        <div className="mb-8 p-6 card">
          <div className="flex items-center mb-4">
            <div className="mr-4 p-2 rounded-xl bg-surface-secondary flex items-center justify-center">
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
              <h2 className="text-2xl font-bold text-label mb-1">
                {getLocalizedField(selectedScenarioData, locale, "title") as string}
              </h2>
              <p className="text-label-secondary">
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
                    className="chip"
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>

          {selectedScenarioData.urgency === "high" && (
            <div className="bg-critical-tint border border-critical rounded-xl p-4 mb-4" role="note">
              <div className="flex items-center">
                <span className="mr-3 text-critical"><Warning size={32} weight="fill" aria-hidden="true" /></span>
                <div>
                  <p className="text-critical-ink font-semibold">{t.urgentAction}</p>
                  <p className="text-critical-ink text-sm mt-1">
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
        <h3 className="text-xl sm:text-2xl font-semibold text-label">
          {searchQuery
            ? `${t.searchResults} "${searchQuery}"`
            : t.relatedTopics}
        </h3>
        <span className="chip">
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
        <div className="text-center py-16 card">
          {searchQuery ? (
            <div className="py-4">
              <MagnifyingGlass size={48} className="mx-auto text-label-secondary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-label">
                {t.noResults}
              </h3>
              <p className="mt-2 text-label-secondary">{t.tryDifferentKeywords}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-center text-label-secondary"><Question size={64} aria-hidden="true" /></div>
              <h3 className="text-xl font-semibold text-label mb-2">
                {t.notFoundYet}
              </h3>
              <p className="text-label-secondary mb-8 max-w-md mx-auto">
                {t.tryOtherOrSearch}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={onClear}
                  className="btn btn-secondary"
                >
                  {t.chooseNewSituation}
                </button>
                <Link
                  href="/topics"
                  className="btn btn-primary"
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
