"use client";

import { useState } from "react";

interface FormattedContentProps {
  content: string;
}

/**
 * HIERARCHY SYMBOL SYSTEM FOR CSV DATA
 * =====================================
 * Use these symbols at the start of each line in your CSV:
 *
 * • (Bullet)       - Level 1: Main collapsible point (yellow)
 * ◦ (White Bullet) - Level 2: Sub-collapsible point (yellow)
 * ▪ (Small Square) - Level 3: Detail point (yellow)
 * ‣ (Triangle)     - Level 4: Sub-detail (yellow)
 *
 * No symbol        - Plain text (no bullet)
 *
 * EXAMPLE CSV FORMAT:
 * • Main point that can collapse
 * ◦ Sub-point under main (can also collapse)
 * ▪ Detail under sub-point
 * ‣ Sub-detail under detail
 * Plain text without any symbol
 */

interface ContentItem {
  level: 1 | 2 | 3 | 4 | 0; // 0 = plain text, 1-4 = hierarchy levels
  symbol: string;
  text: string;
  children: ContentItem[];
  color: string;
  borderColor: string;
}

const HIERARCHY_CONFIG = {
  "•": { level: 1, color: "text-yellow-600", borderColor: "border-yellow-200" },
  "◦": { level: 2, color: "text-yellow-600", borderColor: "border-yellow-200" },
  "▪": { level: 3, color: "text-yellow-600", borderColor: "border-yellow-200" },
  "‣": { level: 4, color: "text-yellow-600", borderColor: "border-yellow-200" },
} as const;

export function FormattedContent({ content }: FormattedContentProps) {
  // First, normalize content by splitting bullets that appear mid-line
  // This handles cases like "text • text • text" and converts to separate lines
  let normalizedContent = content;

  // For each hierarchy symbol, split when it appears after non-whitespace
  Object.keys(HIERARCHY_CONFIG).forEach((symbol) => {
    // Match: (any non-newline char) + (optional spaces) + (symbol) + (space)
    // Replace with: \n + symbol + space
    const regex = new RegExp(`([^\\n])\\s*\\${symbol}\\s+`, "g");
    normalizedContent = normalizedContent.replace(regex, `$1\n${symbol} `);
  });

  const lines = normalizedContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Parse lines into hierarchical structure
  const items: ContentItem[] = [];
  const stack: ContentItem[] = []; // Track parent chain

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Detect which symbol starts the line
    let matchedSymbol: string | null = null;
    let text = trimmedLine;

    for (const symbol of Object.keys(HIERARCHY_CONFIG)) {
      if (trimmedLine.startsWith(symbol + " ")) {
        matchedSymbol = symbol;
        text = trimmedLine.substring(symbol.length + 1).trim();
        break;
      }
    }

    if (matchedSymbol && matchedSymbol in HIERARCHY_CONFIG) {
      const config =
        HIERARCHY_CONFIG[matchedSymbol as keyof typeof HIERARCHY_CONFIG];
      const newItem: ContentItem = {
        level: config.level,
        symbol: matchedSymbol,
        text,
        children: [],
        color: config.color,
        borderColor: config.borderColor,
      };

      // Find the correct parent based on level
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= config.level
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        // Top level item
        items.push(newItem);
      } else {
        // Add as child to the last item in stack
        stack[stack.length - 1].children.push(newItem);
      }

      stack.push(newItem);
    } else {
      // Plain text (no symbol)
      const plainItem: ContentItem = {
        level: 0,
        symbol: "",
        text: trimmedLine,
        children: [],
        color: "text-gray-700",
        borderColor: "",
      };

      if (stack.length > 0) {
        // Add as child to current context
        stack[stack.length - 1].children.push(plainItem);
      } else {
        items.push(plainItem);
      }
    }
  });

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <ContentNode key={index} item={item} />
      ))}
    </div>
  );
}

function ContentNode({ item }: { item: ContentItem }) {
  const [isOpen, setIsOpen] = useState(false); // Start collapsed by default
  const hasChildren = item.children.length > 0;

  // Plain text (no bullet)
  if (item.level === 0) {
    return (
      <div className={`leading-relaxed ${item.color}`}>
        <LinkifiedText text={item.text} />
      </div>
    );
  }

  // Hierarchical bullet point (levels 1-4)
  return (
    <div className={item.level === 1 ? "mb-3" : ""}>
      <div className="flex items-center gap-2">
        <div className="w-5 flex-shrink-0 flex items-center justify-center">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${item.color} font-bold ${
                item.level === 1 ? "text-lg" : "text-base"
              } hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 rounded p-0.5`}
              aria-expanded={isOpen}
              title={isOpen ? "Click to collapse" : "Click to expand"}
            >
              {isOpen ? "▼" : "▶"}
            </button>
          ) : (
            <span
              className={`${item.color} font-bold ${
                item.level === 1 ? "text-lg" : "text-base"
              } block`}
            >
              {item.symbol}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-gray-700 leading-relaxed ${
              hasChildren ? "cursor-pointer hover:text-gray-900" : ""
            }`}
            onClick={() => hasChildren && setIsOpen(!isOpen)}
          >
            <LinkifiedText text={item.text} />
          </div>
          {hasChildren && isOpen && (
            <div
              className={`mt-2 ml-2 space-y-2 border-l-2 ${item.borderColor} pl-4`}
            >
              {item.children.map((child, index) => (
                <ContentNode key={index} item={child} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LPNPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-yellow-600 hover:text-yellow-700 font-semibold underline decoration-2 decoration-yellow-400 hover:decoration-yellow-500 cursor-pointer transition-colors"
      >
        มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN)
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-10 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Popup Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 p-4 sm:p-6 max-w-md w-[calc(100%-2rem)] sm:w-full border-2 border-yellow-400 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">
                ติดต่อมูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN)
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 font-bold text-sm mt-0.5">
                  ◦
                </span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm sm:text-base">
                    ภาษาพม่า
                  </p>
                  <a
                    href="tel:099-1865-587"
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm sm:text-base"
                  >
                    099-1865-587
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 font-bold text-sm mt-0.5">
                  ◦
                </span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm sm:text-base">
                    ภาษาไทย
                  </p>
                  <a
                    href="tel:084-121-1609"
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm sm:text-base"
                  >
                    084-121-1609
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 font-bold text-sm mt-0.5">
                  ◦
                </span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm sm:text-base">
                    ภาษาลาว
                  </p>
                  <a
                    href="tel:092-321-1516"
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm sm:text-base"
                  >
                    092-321-1516
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 font-bold text-sm mt-0.5">
                  ◦
                </span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm sm:text-base">
                    ภาษากัมพูชา
                  </p>
                  <a
                    href="tel:086-449-9413"
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm sm:text-base"
                  >
                    086-449-9413
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </span>
  );
}

function LinkifiedText({ text }: { text: string }) {
  const parts: Array<{ type: "text" | "url" | "lpn"; content: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find the next URL or LPN match
    const urlMatch = remaining.match(/https?:\/\/[^\s]+/);
    const lpnMatch = remaining.match(
      /มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน \(LPN\)/
    );

    // Determine which comes first
    const urlIndex = urlMatch ? remaining.indexOf(urlMatch[0]) : -1;
    const lpnIndex = lpnMatch ? remaining.indexOf(lpnMatch[0]) : -1;

    if (urlIndex === -1 && lpnIndex === -1) {
      // No more matches, add remaining text
      if (remaining) {
        parts.push({ type: "text", content: remaining });
      }
      break;
    }

    // Determine which pattern appears first
    const useUrl = urlIndex !== -1 && (lpnIndex === -1 || urlIndex < lpnIndex);

    if (useUrl && urlMatch) {
      // Add text before URL
      if (urlIndex > 0) {
        parts.push({ type: "text", content: remaining.substring(0, urlIndex) });
      }
      // Add URL
      parts.push({ type: "url", content: urlMatch[0] });
      remaining = remaining.substring(urlIndex + urlMatch[0].length);
    } else if (lpnMatch) {
      // Add text before LPN
      if (lpnIndex > 0) {
        parts.push({ type: "text", content: remaining.substring(0, lpnIndex) });
      }
      // Add LPN
      parts.push({ type: "lpn", content: lpnMatch[0] });
      remaining = remaining.substring(lpnIndex + lpnMatch[0].length);
    }
  }

  // Clean URL by removing trailing special characters
  const cleanUrl = (url: string): string => {
    return url.replace(/[`'"]+$/, "").trim();
  };

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "lpn") {
          return <LPNPopup key={index} />;
        }

        if (part.type === "url") {
          const cleanedUrl = cleanUrl(part.content);
          return (
            <span key={index} className="inline-block mt-2">
              <a
                href={cleanedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 hover:text-yellow-800 rounded transition-colors text-xs font-medium border border-yellow-300"
                onClick={(e) => e.stopPropagation()}
                title={cleanedUrl}
              >
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>ดูเอกสาร</span>
                <svg
                  className="w-2.5 h-2.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </span>
          );
        }

        return <span key={index}>{part.content}</span>;
      })}
    </>
  );
}
