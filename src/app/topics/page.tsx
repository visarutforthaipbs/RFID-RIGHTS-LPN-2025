"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { SearchBox } from "../components/SearchBox";
import { TopicCard, TopicCardSkeleton } from "../components/TopicCard";
import { FilterChips } from "../components/FilterChips";
import { TopicRow } from "../../../lib/types";

export default function TopicsPage() {
  const [data, setData] = useState<TopicRow[]>([]);
  const [filteredData, setFilteredData] = useState<TopicRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/data_flat.json");
        const jsonData: TopicRow[] = await response.json();

        // Get unique categories
        const uniqueCategories = Array.from(
          new Set(jsonData.map((item) => item.category))
        ).sort();

        setData(jsonData);
        setFilteredData(jsonData);
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter data based on category (search is handled by SearchBox)
  useEffect(() => {
    let filtered = data;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // If we have a search query, we need to reapply search to the category-filtered data
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.topic.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.knowYourRights &&
            item.knowYourRights.toLowerCase().includes(query)) ||
          (item.howToIdentify &&
            item.howToIdentify.toLowerCase().includes(query)) ||
          (item.selfHelp && item.selfHelp.toLowerCase().includes(query))
      );
    }

    setFilteredData(filtered);
  }, [data, searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-8">
            <nav className="mb-4">
              <Link href="/" className="text-black hover:text-yellow-600">
                หน้าหลัก
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">หัวข้อทั้งหมด</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              หัวข้อทั้งหมด
            </h1>
            <p className="text-gray-600 mb-6">
              ค้นหาและเรียนรู้เกี่ยวกับสิทธิของคุณในฐานะแรงงานต่างด้าว
            </p>
          </header>

          {/* Search */}
          <div className="mb-6">
            <SearchBox
              data={data}
              onResults={(results, query) => {
                setFilteredData(results);
                setSearchQuery(query);
              }}
              placeholder="ค้นหาหัวข้อ..."
            />
          </div>

          {/* Category Filter */}
          {!loading && (
            <FilterChips
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}

          {/* Results Summary */}
          <div className="mb-6">
            {loading ? (
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-gray-600">
                {filteredData.length === data.length
                  ? `ทั้งหมด ${data.length} หัวข้อ`
                  : `พบ ${filteredData.length} หัวข้อจากทั้งหมด ${data.length} หัวข้อ`}
              </p>
            )}
          </div>

          {/* Topics Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <TopicCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((row, index) => (
                <TopicCard key={`${row.slug}-${index}`} row={row} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ไม่พบหัวข้อที่คุณค้นหา
              </h3>
              <p className="text-gray-500 mb-4">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
              >
                แสดงหัวข้อทั้งหมด
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
