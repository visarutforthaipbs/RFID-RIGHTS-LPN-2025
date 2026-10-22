"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Header } from "../../components/Header";
import { SOSBar } from "../../components/SOSBar";
import { SearchBox } from "../../components/SearchBox";
import { TopicCard, TopicCardSkeleton } from "../../components/TopicCard";
import { FilterChips } from "../../components/FilterChips";
import { TopicRow } from "../../../../lib/types";
import { useLanguage } from "../../contexts/LanguageContext";
import { messages } from "../../../../lib/i18n";

export default function TopicsPage() {
  const [data, setData] = useState<TopicRow[]>([]);
  const [filteredData, setFilteredData] = useState<TopicRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
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
    <div className="min-h-screen bg-surface pb-24">
      <Header />

      <main className="container mx-auto px-4 py-8" id="main-content">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-8">
            <nav className="crumb mb-6" aria-label="Breadcrumb">
              <Link href="/">{t.home}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t.allTopics}</span>
            </nav>

            <h1 className="text-3xl font-bold text-label mb-3">
              {t.allTopics}
            </h1>
            <p className="text-label-secondary mb-6">{t.topicsPageDescription}</p>
          </header>

          {/* Search */}
          <div className="mb-6">
            <SearchBox
              data={data}
              onResults={(results, query) => {
                setFilteredData(results);
                setSearchQuery(query);
              }}
              placeholder={t.searchTopicsPlaceholder}
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
              <div className="h-6 w-32 bg-surface-tertiary rounded animate-pulse"></div>
            ) : (
              <p className="text-label-secondary">
                {filteredData.length === data.length
                  ? `${t.totalTopics} ${data.length} ${t.topicsCount}`
                  : `${t.foundTopicsOf} ${filteredData.length} ${t.topicsOf} ${data.length} ${t.topicsCount}`}
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
              <MagnifyingGlass size={48} className="mx-auto text-label-secondary mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-label mb-2">
                {t.noTopicsFound}
              </h3>
              <p className="text-label-secondary mb-4">
                {t.tryDifferentSearchOrCategory}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="btn btn-primary"
              >
                {t.showAllTopics}
              </button>
            </div>
          )}
        </div>
      </main>
      <SOSBar />
    </div>
  );
}
