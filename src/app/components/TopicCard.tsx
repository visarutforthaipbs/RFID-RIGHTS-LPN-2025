"use client";

import Link from "next/link";
import Image from "next/image";
import { TopicRow } from "../../../lib/types";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";
import { getTopicIcon } from "../../../lib/topic-icons";

interface TopicCardProps {
  row: TopicRow;
}

export function TopicCard({ row }: TopicCardProps) {
  const { locale } = useLanguage();
  const t = messages[locale];

  const category =
    locale === "en"
      ? row.categoryEn
      : locale === "mm"
      ? row.categoryMm
      : row.category;
  const topic =
    (locale === "en"
      ? row.topicEn
      : locale === "mm"
      ? row.topicMm
      : row.topic) || row.topic;

  const iconPath = getTopicIcon(row.topic);

  const content =
    locale === "en"
      ? row.knowYourRightsEn || row.howToIdentifyEn || "Click to see details"
      : locale === "mm"
      ? row.knowYourRightsMm ||
        row.howToIdentifyMm ||
        "အသေးစိတ်ကြည့်ရန် နှိပ်ပါ"
      : row.knowYourRights || row.howToIdentify || "คลิกเพื่อดูรายละเอียด";

  const excerpt =
    content.substring(0, 120) + (content.length > 120 ? "..." : "");

  // Helper function to get badge color based on category
  const getBadgeStyle = (categoryName: string) => {
    const styles = [
      "bg-[#117c8e] text-white", // Teal
      "bg-[#ff5122] text-white", // Orange
      "bg-[#fec700] text-black", // Yellow
    ];

    let hash = 0;
    // Use the English category name for consistent coloring across languages if available,
    // otherwise fallback to the display name
    const key = row.categoryEn || categoryName || "";

    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }

    return styles[Math.abs(hash) % styles.length];
  };

  return (
    <Link href={`/topic/${row.slug}`} className="block group">
      <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 group-hover:border-yellow-400 h-full flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getBadgeStyle(
              category || ""
            )}`}
          >
            {category}
          </span>
          <div className="w-12 h-12 relative flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <Image src={iconPath} alt={topic} fill className="object-contain" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-black mb-3 group-hover:text-yellow-600 transition-colors">
          {topic}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center text-black text-sm font-medium">
          <span>{t.readMore}</span>
          <svg
            className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </article>
    </Link>
  );
}

// Skeleton loader for when data is loading
export function TopicCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4 h-4 w-16 bg-gray-200 rounded"></div>
    </div>
  );
}
