"use client";

import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { TopicRow } from "../../../lib/types";
import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";
import { TopicIcon, CategoryIcon } from "./TopicIcon";

interface TopicCardProps {
  row: TopicRow;
}

/** Neutral category badge: surface-secondary + label + the category's Phosphor icon. */
export function CategoryBadge({ row, label, className = "" }: { row: TopicRow; label: string; className?: string }) {
  return (
    <span className={`chip ${className}`.trim()}>
      <CategoryIcon category={row.category} />
      {label}
    </span>
  );
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

  return (
    <Link href={`/topic/${row.slug}`} className="block group rounded-xl">
      <article className="card p-5 sm:p-6 h-full flex flex-col transition-colors group-hover:border-separator-strong">
        <div className="flex justify-between items-start gap-3 mb-4">
          <CategoryBadge row={row} label={category || row.category} />
          <TopicIcon topic={row.topic} size={44} className="flex-shrink-0" />
        </div>

        <h3 className="text-lg font-semibold text-label mb-2">{topic}</h3>

        <p className="text-label-secondary text-sm line-clamp-3 flex-grow">{excerpt}</p>

        <div className="mt-4 flex items-center text-label text-sm font-semibold gap-1">
          <span>{t.readMore}</span>
          <CaretRight size={16} weight="bold" aria-hidden="true" />
        </div>
      </article>
    </Link>
  );
}

// Skeleton loader for when data is loading
export function TopicCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse" aria-hidden="true">
      <div className="mb-3">
        <div className="h-7 w-24 bg-surface-tertiary rounded-full"></div>
      </div>
      <div className="h-6 w-3/4 bg-surface-tertiary rounded mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-surface-tertiary rounded"></div>
        <div className="h-4 w-5/6 bg-surface-tertiary rounded"></div>
        <div className="h-4 w-4/6 bg-surface-tertiary rounded"></div>
      </div>
      <div className="mt-4 h-4 w-16 bg-surface-tertiary rounded"></div>
    </div>
  );
}
