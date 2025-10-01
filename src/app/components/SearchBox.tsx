"use client";

import { useState, useCallback, useMemo } from "react";
import { TopicRow } from "../../../lib/types";
import { trackEvent } from "../../../lib/analytics";

interface SearchBoxProps {
  data: TopicRow[];
  onResults: (results: TopicRow[], query: string) => void;
  placeholder?: string;
}

export function SearchBox({
  data,
  onResults,
  placeholder = "ค้นหาหัวข้อ...",
}: SearchBoxProps) {
  const [query, setQuery] = useState("");

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
          item.category.toLowerCase().includes(lowercaseQuery) ||
          item.knowYourRights?.toLowerCase().includes(lowercaseQuery) ||
          item.howToIdentify?.toLowerCase().includes(lowercaseQuery) ||
          item.selfHelp?.toLowerCase().includes(lowercaseQuery)
      );

      // Track search analytics
      trackEvent({
        type: "search",
        q_len: searchQuery.length,
        results_count: results.length,
      });

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
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          aria-label={placeholder}
        />

        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
        </div>

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="ล้างการค้นหา"
            type="button"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="sr-only" aria-live="polite" role="status">
        {query && `พบผลลัพธ์การค้นหา ${data.length} รายการ`}
      </div>
    </div>
  );
}
