import Link from "next/link";
import { TopicRow } from "../../../lib/types";

interface TopicCardProps {
  row: TopicRow;
}

export function TopicCard({ row }: TopicCardProps) {
  const excerpt = row.knowYourRights
    ? row.knowYourRights.substring(0, 120) +
      (row.knowYourRights.length > 120 ? "..." : "")
    : row.howToIdentify
    ? row.howToIdentify.substring(0, 120) +
      (row.howToIdentify.length > 120 ? "..." : "")
    : "คลิกเพื่อดูรายละเอียด";

  return (
    <Link href={`/topic/${row.slug}`} className="block group">
      <article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 group-hover:border-yellow-400">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-black rounded-full">
            {row.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-black mb-3 group-hover:text-yellow-600 transition-colors">
          {row.topic}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center text-black text-sm font-medium">
          <span>อ่านต่อ</span>
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
