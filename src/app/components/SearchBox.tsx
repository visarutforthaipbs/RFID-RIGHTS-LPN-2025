"use client";

import { useState, useCallback, useMemo } from "react";
import { TopicRow } from "../../../lib/types";
import { trackEvent } from "../../../lib/analytics";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

interface SearchBoxProps {
  data: TopicRow[];
  onResults: (results: TopicRow[], query: string) => void;
  placeholder?: string;
}

export function SearchBox({ data, onResults, placeholder }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [resultCount, setResultCount] = useState(0);
  const { locale } = useLanguage();
  const t = messages[locale];

  // Use provided placeholder or default from i18n
  const searchPlaceholder = placeholder || t.searchPlaceholder;

  // Debounced search function
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        onResults(data, "");
        return;
      }

      const lowercaseQuery = searchQuery.toLowerCase();
      const results = data.filter(
        (item) =>
          item.topic.toLowerCase().includes(lowercaseQuery) ||
          item.topicEn?.toLowerCase().includes(lowercaseQuery) ||
          item.topicMm?.toLowerCase().includes(lowercaseQuery) ||
          item.category.toLowerCase().includes(lowercaseQuery) ||
          item.categoryEn?.toLowerCase().includes(lowercaseQuery) ||
          item.categoryMm?.toLowerCase().includes(lowercaseQuery) ||
          item.knowYourRights?.toLowerCase().includes(lowercaseQuery) ||
          item.knowYourRightsEn?.toLowerCase().includes(lowercaseQuery) ||
          item.knowYourRightsMm?.toLowerCase().includes(lowercaseQuery) ||
          item.howToIdentify?.toLowerCase().includes(lowercaseQuery) ||
          item.howToIdentifyEn?.toLowerCase().includes(lowercaseQuery) ||
          item.howToIdentifyMm?.toLowerCase().includes(lowercaseQuery) ||
          item.selfHelp?.toLowerCase().includes(lowercaseQuery) ||
          item.selfHelpEn?.toLowerCase().includes(lowercaseQuery) ||
          item.selfHelpMm?.toLowerCase().includes(lowercaseQuery)
      );

      // Track search analytics
      trackEvent({
        type: "search",
        q_len: searchQuery.length,
        results_count: results.length,
      });

      setResultCount(results.length);
      onResults(results, searchQuery);
    },
    [data, onResults]
  );

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (searchQuery: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => performSearch(searchQuery), 300);
    };
  }, [performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onResults(data, "");
  };

  return (
    <search role="search" aria-label={locale === "en" ? "Search topics" : locale === "mm" ? "ခေါင္းစဥ္ရှာရန်" : "ค้นหาหัวข้อ"}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={searchPlaceholder}
          className="field-input pl-12 pr-14 py-3 text-base"
          aria-label={searchPlaceholder}
        />

        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-label-secondary" aria-hidden="true">
          <MagnifyingGlass size={22} />
        </div>

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-label-secondary hover:text-label rounded-lg"
            aria-label={locale === "en" ? "Clear search" : "ล้างการค้นหา"}
            type="button"
          >
            <X size={22} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="sr-only" aria-live="polite" role="status">
        {query &&
          (locale === "en"
            ? `Found ${resultCount} search results`
            : locale === "mm"
            ? `ရှာဖွေရလာဒ် ${resultCount} ခု`
            : `พบผลลัพธ์การค้นหา ${resultCount} รายการ`)}
      </div>
    </search>
  );
}
