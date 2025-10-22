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

export default function Home() {
  const [data, setData] = useState<TopicRow[]>([]);
  const [filteredData, setFilteredData] = useState<TopicRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

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

      <main
        id="main-content"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20"
      >
        {/* Hero section */}
        {!selectedScenario && !searchQuery && (
          <section className="text-center mb-12">
            <div className="mb-8">
              <div className="mb-6">
                <Image
                  src="/images/cover-1.png"
                  alt="RFID Rights Guide Cover"
                  width={600}
                  height={300}
                  className="mx-auto rounded-lg"
                  priority
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                เลือกสถานการณ์ของคุณ
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                เลือกสถานการณ์ที่ตรงกับปัญหาหรือความต้องการของคุณ
                <br className="hidden sm:block" />
                เพื่อให้เราช่วยคุณหาคำตอบและวิธีแก้ไขที่เหมาะสม
              </p>
            </div>

            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <SearchBox
                  data={data}
                  onResults={handleSearchResults}
                  placeholder="หรือค้นหาโดยตรง..."
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-400">
                  หรือเลือกสถานการณ์ด้านล่าง
                </div>
              </div>
            </div>
          </section>
        )}

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
              กลับไปเลือกสถานการณ์
            </button>
          </div>
        )}

        {/* Scenarios Grid */}
        {!selectedScenario && !searchQuery && (
          <section className="mb-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-black mb-2">
                สถานการณ์ที่พบบ่อย
              </h2>
              <p className="text-gray-600">
                เลือกสถานการณ์ที่ใกล้เคียงกับของคุณมากที่สุด
              </p>
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

            <div className="mt-8 text-center text-sm text-gray-500">
              💡 เคล็ดลับ: คลิกที่สถานการณ์เพื่อดูหัวข้อที่เกี่ยวข้อง
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
                    <div className="text-4xl">{selectedScenarioData.icon}</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black mb-1">
                    {selectedScenarioData.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedScenarioData.description}
                  </p>
                </div>
                <div className="hidden sm:flex gap-2 flex-wrap">
                  {selectedScenarioData.keywords
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
                    <span className="text-2xl mr-3">🚨</span>
                    <div>
                      <p className="text-red-800 font-medium">
                        เรื่องนี้สำคัญและต้องดำเนินการเร่งด่วน
                      </p>
                      <p className="text-red-600 text-sm mt-1">
                        หากเป็นเรื่องฉุกเฉินจริง กรุณาติดต่อสายด่วน 191 หรือ
                        1694
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black">
                หัวข้อที่เกี่ยวข้อง
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                พบ {filteredData.length} หัวข้อ
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
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  ยังไม่พบหัวข้อที่เกี่ยวข้อง
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  ลองเลือกสถานการณ์อื่น หรือใช้การค้นหาเพื่อหาข้อมูลที่ต้องการ
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={clearScenario}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    เลือกสถานการณ์ใหม่
                  </button>
                  <Link
                    href="/topics"
                    className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
                  >
                    ดูหัวข้อทั้งหมด
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
                ผลการค้นหา &quot;{searchQuery}&quot;
              </h3>
              <span className="text-sm text-gray-500">
                พบ {filteredData.length} รายการ
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
                  ไม่พบผลลัพธ์
                </h3>
                <p className="mt-2 text-gray-500">ลองเปลี่ยนคำค้นหาดู</p>
              </div>
            )}
          </section>
        )}

        {/* Quick help for scenarios without content */}
        {!selectedScenario && !searchQuery && (
          <section className="mt-16">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-black mb-4 text-center">
                ไม่เจอที่ต้องการ?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/help"
                  className="bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors group text-center"
                >
                  <div className="text-2xl mb-2">🚨</div>
                  <h4 className="font-semibold text-red-800 group-hover:text-red-900">
                    ขอความช่วยเหลือ
                  </h4>
                  <p className="text-sm text-red-600">สายด่วนฉุกเฉิน</p>
                </Link>

                <Link
                  href="/topics"
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors group text-center"
                >
                  <div className="text-2xl mb-2">📚</div>
                  <h4 className="font-semibold text-black">ดูหัวข้อทั้งหมด</h4>
                  <p className="text-sm text-gray-600">ศึกษาเพิ่มเติม</p>
                </Link>

                <Link
                  href="/settings"
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors group text-center"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-gray-900">
                    ตั้งค่า
                  </h4>
                  <p className="text-sm text-gray-600">ภาษาและการแสดงผล</p>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <SOSBar />
    </div>
  );
}
