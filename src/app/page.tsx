"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SOSBar } from "./components/SOSBar";
import { HeroSection } from "./components/HeroSection";
import { ScenarioGrid } from "./components/ScenarioGrid";
import { ResultsSection } from "./components/ResultsSection";
import { QuickHelp } from "./components/QuickHelp";
import { TopicRow } from "../../lib/types";
import { scenarios } from "../../lib/scenarios";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main id="main-content" className="min-h-screen pb-20">
        {/* Hero section */}
        {!selectedScenario && !searchQuery && (
          <HeroSection data={data} onResults={handleSearchResults} />
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
            <ScenarioGrid onScenarioSelect={handleScenarioSelect} />
          )}

          {/* Selected Scenario Results */}
          <ResultsSection
            searchQuery={searchQuery}
            selectedScenarioId={selectedScenario}
            filteredData={filteredData}
            onClear={clearScenario}
          />

          {/* Quick help for scenarios without content */}
          {!selectedScenario && !searchQuery && <QuickHelp />}
        </div>
      </main>

      <SOSBar />
    </div>
  );
}