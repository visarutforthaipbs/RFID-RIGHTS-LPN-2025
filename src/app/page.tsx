"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "./components/Header";
import { SearchBox } from "./components/SearchBox";
import { TopicCard } from "./components/TopicCard";
import { SOSBar } from "./components/SOSBar";
import { ScenarioCard, scenarios } from "./components/ScenarioCard";
import { TopicRow } from "../../lib/types";
import { hashUid } from "../../lib/rfidhash";
import { trackEvent } from "../../lib/analytics";
import { useLanguage } from "./contexts/LanguageContext";
import { messages } from "../../lib/i18n";

export default function Home() {
  const [data, setData] = useState<TopicRow[]>([]);
  const [filteredData, setFilteredData] = useState<TopicRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const { locale } = useLanguage();
  const t = messages[locale];

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/topics", {
          cache: "no-store", // Always get fresh data
        });
        const jsonData: TopicRow[] = await response.json();
        setData(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  // Handle RFID UID from URL params
  useEffect(() => {
    const checkRFIDParam = async () => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get("uid");

        if (uid) {
          try {
            const hashedUid = await hashUid(uid);
            trackEvent({ type: "rfid_visit", uid_hash: hashedUid });
          } catch (error) {
            console.warn("Failed to hash UID:", error);
          }
        }
      }
    };

    checkRFIDParam();
  }, []);

  const handleSearchResults = (results: TopicRow[], query: string) => {
    setSearchQuery(query);
    setFilteredData(results);
    setSelectedScenario(null); // Clear scenario when searching
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setSearchQuery("");

    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    // Filter topics based on scenario
    let filtered: TopicRow[] = [];

    if (scenario.id === "emergency-help") {
      // For emergency, redirect to help page
      window.location.href = "/help";
      return;
    } else if (scenario.category && scenario.category !== "general") {
      // Filter by category
      filtered = data.filter((topic) => topic.category === scenario.category);
    } else {
      // Filter by keywords for general scenarios
      const keywords = scenario.keywords.map((k) => k.toLowerCase());
      filtered = data.filter((topic) =>
        keywords.some(
          (keyword) =>
            topic.topic.toLowerCase().includes(keyword) ||
            (topic.knowYourRights &&
              topic.knowYourRights.toLowerCase().includes(keyword)) ||
            topic.category.toLowerCase().includes(keyword)
        )
      );
    }

    setFilteredData(filtered);
  };

  const clearScenario = () => {
    setSelectedScenario(null);
    setSearchQuery("");
    setFilteredData(data);
  };

  const selectedScenarioData = scenarios.find((s) => s.id === selectedScenario);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main id="main-content" className="min-h-screen pb-20">
        {/* Hero section */}
        {!selectedScenario && !searchQuery && (
          <section className="relative w-full h-[480px] mb-12">
            <Image
              src="/images/hero-new.svg"
              alt="RFID Rights Guide Cover"
              fill
              className="object-cover brightness-75"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Image
                  src="/favicon-new.svg"
                  alt="Icon"
                  width={48}
                  height={48}
                  className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-lg"
                />
                <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg max-w-4xl">
                  {t.chooseYourSituation}
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium whitespace-pre-line">
                {t.chooseDescription}
              </p>

              <div className="w-full max-w-md relative">
                <SearchBox
                  data={data}
                  onResults={handleSearchResults}
                  placeholder={t.orSearchDirectly}
                />
                <div className="mt-4 text-sm text-white/90 font-medium drop-shadow-sm">
                  {t.orChooseBelow}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button for scenario/search */}
          {(selectedScenario || searchQuery) && (
            <div className="mb-6">
              <button
                onClick={clearScenario}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t.backToSituations}
              </button>
            </div>
          )}

          {/* Scenarios Grid */}
          {!selectedScenario && !searchQuery && (
            <section className="mb-12">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-black mb-2">
                  {t.commonSituations}
                </h2>
                <p className="text-gray-600">{t.chooseClosest}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onClick={() => handleScenarioSelect(scenario.id)}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-yellow-400"
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
                {t.tip}
              </div>
            </section>
          )}

          {/* Selected Scenario Results */}
          {selectedScenario && selectedScenarioData && (
            <section>
              <div className="mb-8 p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="mr-4 p-2 rounded-full bg-white shadow-sm flex items-center justify-center">
                    {selectedScenarioData.iconType === "image" ? (
                      <div className="w-16 h-16 relative">
                        <Image
                          src={selectedScenarioData.icon}
                          alt={selectedScenarioData.title}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="text-4xl">
                        {selectedScenarioData.icon}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-black mb-1">
                      {locale === "en"
                        ? selectedScenarioData.titleEn
                        : selectedScenarioData.title}
                    </h2>
                    <p className="text-gray-600">
                      {locale === "en"
                        ? selectedScenarioData.descriptionEn
                        : selectedScenarioData.description}
                    </p>
                  </div>
                  <div className="hidden sm:flex gap-2 flex-wrap">
                    {(locale === "en"
                      ? selectedScenarioData.keywordsEn
                      : selectedScenarioData.keywords
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
                        <p className="text-red-800 font-medium">
                          {t.urgentAction}
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                          {t.emergencyContact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-black">
                  {t.relatedTopics}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {t.found} {filteredData.length} {t.topicsCount}
                </span>
              </div>

              {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((topic) => (
                    <TopicCard key={topic.slug} row={topic} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
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
                      onClick={clearScenario}
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
                </div>
              )}
            </section>
          )}

          {/* Search Results */}
          {searchQuery && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-black">
                  {t.searchResults} &quot;{searchQuery}&quot;
                </h3>
                <span className="text-sm text-gray-500">
                  {t.found} {filteredData.length} {t.resultsCount}
                </span>
              </div>

              {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((topic) => (
                    <TopicCard key={topic.slug} row={topic} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
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
              )}
            </section>
          )}

          {/* Quick help for scenarios without content */}
          {!selectedScenario && !searchQuery && (
            <section className="mt-16">
              <h3 className="text-2xl font-bold text-black mb-8 text-center">
                {t.cantFind}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/help"
                  className="bg-[#EE0000] rounded-3xl p-8 hover:opacity-90 transition-opacity group text-center flex flex-col items-center justify-center min-h-[240px]"
                >
                  <div className="mb-6 relative w-20 h-20">
                    <Image
                      src="/icons/help-icon.svg"
                      alt="Help"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="font-bold text-white text-xl mb-1">
                    {t.getHelp}
                  </h4>
                  <p className="text-sm text-white/90">{t.emergencyHotline}</p>
                </Link>

                <Link
                  href="/topics"
                  className="bg-[#FFC314] rounded-3xl p-8 hover:opacity-90 transition-opacity group text-center flex flex-col items-center justify-center min-h-[240px]"
                >
                  <div className="mb-6 relative w-20 h-20">
                    <Image
                      src="/icons/topic-icon.svg"
                      alt="Topics"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="font-bold text-black text-xl mb-1">
                    {t.viewAllTopics}
                  </h4>
                  <p className="text-sm text-black/80">{t.learnMore}</p>
                </Link>

                <Link
                  href="/settings"
                  className="bg-[#EAEFF1] rounded-3xl p-8 hover:opacity-90 transition-opacity group text-center flex flex-col items-center justify-center min-h-[240px]"
                >
                  <div className="mb-6 relative w-20 h-20">
                    <Image
                      src="/icons/setting-icon.svg"
                      alt="Settings"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h4 className="font-bold text-black text-xl mb-1">
                    {t.settings}
                  </h4>
                  <p className="text-sm text-black/60">
                    {t.settingsAndDisplay}
                  </p>
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      <SOSBar />
    </div>
  );
}
