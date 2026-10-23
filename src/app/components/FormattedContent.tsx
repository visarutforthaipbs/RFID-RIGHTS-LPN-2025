"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { useLanguage } from "../contexts/LanguageContext";

interface FormattedContentProps {
  content: string;
}

/**
 * HIERARCHY SYMBOL SYSTEM FOR CSV DATA
 * =====================================
 * Use these symbols at the start of each line in your CSV:
 *
 * • (Bullet)       - Level 1: Main collapsible point
 * ◦ (White Bullet) - Level 2: Sub-collapsible point
 * ▪ (Small Square) - Level 3: Detail point
 * ‣ (Triangle)     - Level 4: Sub-detail
 *
 * Styling (LPN One CI): bullets and rails are ink/separator, never yellow;
 * the whole block reads in IBM Plex Sans Thai Looped (class .reading);
 * collapsible rows are real buttons ≥ 44 px.
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
  "•": { level: 1, color: "text-label", borderColor: "border-separator-strong" },
  "◦": { level: 2, color: "text-label-secondary", borderColor: "border-separator" },
  "▪": { level: 3, color: "text-label-secondary", borderColor: "border-separator" },
  "‣": { level: 4, color: "text-label-secondary", borderColor: "border-separator" },
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
        color: "text-label",
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
    <div className="reading space-y-2 text-base">
      {items.map((item, index) => (
        <ContentNode key={index} item={item} />
      ))}
    </div>
  );
}

function ContentNode({ item, depth = 0 }: { item: ContentItem; depth?: number }) {
  // Top-level items (depth 0) start expanded for better discoverability
  const [isOpen, setIsOpen] = useState(depth === 0);
  const hasChildren = item.children.length > 0;
  const { locale } = useLanguage();

  const toggleLabel = isOpen
    ? (locale === "en" ? "Collapse" : locale === "mm" ? "ချုံ့ရန်" : "ย่อ")
    : (locale === "en" ? "Expand" : locale === "mm" ? "ချဲ့ရန်" : "ขยาย");

  // Plain text (no bullet)
  if (item.level === 0) {
    return (
      <div className={item.color}>
        <LinkifiedText text={item.text} />
      </div>
    );
  }

  // Hierarchical bullet point (levels 1-4)
  const Caret = isOpen ? CaretDown : CaretRight;
  return (
    <div className={item.level === 1 ? "mb-3" : ""}>
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-11 flex items-start gap-2 text-left rounded-lg -mx-1 px-1 py-1 hover:bg-surface-secondary transition-colors ${item.color}`}
          aria-expanded={isOpen}
          aria-label={`${toggleLabel}: ${item.text.substring(0, 50)}`}
        >
          <span className="w-6 flex-shrink-0 flex items-center justify-center mt-1" aria-hidden="true">
            <Caret size={18} weight="bold" />
          </span>
          <span className={`flex-1 min-w-0 ${item.level === 1 ? "font-semibold" : ""}`}>
            <LinkifiedText text={item.text} />
          </span>
        </button>
      ) : (
        <div className={`flex items-start gap-2 px-1 ${item.color}`}>
          <span className="w-6 flex-shrink-0 flex items-center justify-center font-bold" aria-hidden="true">
            {item.symbol}
          </span>
          <div className="flex-1 min-w-0">
            <LinkifiedText text={item.text} />
          </div>
        </div>
      )}
      {hasChildren && isOpen && (
        <div className={`mt-2 ml-3 space-y-2 border-l-2 ${item.borderColor} pl-4`}>
          {item.children.map((child, index) => (
            <ContentNode key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Translations for LPN popup and doc button
const lpnLabels = {
  th: {
    contactTitle: "ติดต่อมูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN)",
    myanmar: "ภาษาพม่า",
    thai: "ภาษาไทย",
    lao: "ภาษาลาว",
    cambodian: "ภาษากัมพูชา",
    viewDoc: "ดูเอกสาร",
  },
  en: {
    contactTitle: "Contact Labour Rights Promotion Network Foundation (LPN)",
    myanmar: "Myanmar",
    thai: "Thai",
    lao: "Lao",
    cambodian: "Cambodian",
    viewDoc: "View document",
  },
  mm: {
    contactTitle: "အလုပ်သမားကာကွယ်ရေးကွန်ရက်ဖောင်ဒေးရှင်း (LPN) ဆက်သွယ်ရန်",
    myanmar: "မြန်မာ",
    thai: "ထိုင်း",
    lao: "လာအို",
    cambodian: "ကမ္ဘောဒီးယား",
    viewDoc: "စာရွက်စာတမ်းကြည့်ရန်",
  },
  km: {
    contactTitle: "ទាក់ទងមូលនិធិបណ្តាញលើកកម្ពស់គុណភាពជីវិតកម្មករ (LPN)",
    myanmar: "មីយ៉ាន់ម៉ា",
    thai: "ថៃ",
    lao: "ឡាវ",
    cambodian: "កម្ពុជា",
    viewDoc: "មើលឯកសារ",
  },
} as const;

function LPNPopup({ matchedText }: { matchedText: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLanguage();
  const labels = lpnLabels[locale] || lpnLabels.en;
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape and manage focus trap
  const handleClose = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Focus the dialog when opened
    const timer = setTimeout(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleClose]);

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="link font-semibold inline min-h-0 min-w-0 text-left"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {matchedText}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-hidden="true"
          />

          {/* Popup Modal */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.contactTitle}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-elevated text-label rounded-2xl border border-separator z-50 p-4 sm:p-6 max-w-md w-[calc(100%-2rem)] sm:w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-bold text-label">
                {labels.contactTitle}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="w-12 h-12 -mr-2 -mt-2 inline-flex items-center justify-center rounded-lg text-label-secondary hover:text-label hover:bg-surface-secondary transition-colors flex-shrink-0"
                aria-label={locale === "en" ? "Close dialog" : locale === "mm" ? "ပိတ်ရန်" : "ปิด"}
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3 p-3 bg-surface-secondary rounded-xl">
                <Phone size={22} className="text-label-secondary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-label text-sm sm:text-base">
                    {labels.myanmar}
                  </p>
                  <a
                    href="tel:099-1865-587"
                    className="link font-medium text-base"
                  >
                    099-1865-587
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-secondary rounded-xl">
                <Phone size={22} className="text-label-secondary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-label text-sm sm:text-base">
                    {labels.thai}
                  </p>
                  <a
                    href="tel:084-121-1609"
                    className="link font-medium text-base"
                  >
                    084-121-1609
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-secondary rounded-xl">
                <Phone size={22} className="text-label-secondary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-label text-sm sm:text-base">
                    {labels.lao}
                  </p>
                  <a
                    href="tel:092-321-1516"
                    className="link font-medium text-base"
                  >
                    092-321-1516
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-surface-secondary rounded-xl">
                <Phone size={22} className="text-label-secondary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-label text-sm sm:text-base">
                    {labels.cambodian}
                  </p>
                  <a
                    href="tel:086-449-9413"
                    className="link font-medium text-base"
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

// Combined regex for LPN organization name in Thai, English, and Myanmar
const LPN_REGEX = /มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน\s*\(LPN\)|Labour (?:Rights Promotion|Protection) Network Foundation\s*\(LPN\)|[\u1000-\u109F][\u1000-\u109F\u200B\s]*\(LPN\)[\u1000-\u109F]*/;

function LinkifiedText({ text }: { text: string }) {
  const { locale } = useLanguage();
  const labels = lpnLabels[locale] || lpnLabels.en;
  const parts: Array<{ type: "text" | "url" | "lpn"; content: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find the next URL or LPN match
    const urlMatch = remaining.match(/https?:\/\/[^\s]+/);
    const lpnMatch = remaining.match(LPN_REGEX);

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
          return <LPNPopup key={index} matchedText={part.content} />;
        }

        if (part.type === "url") {
          const cleanedUrl = cleanUrl(part.content);
          return (
            <span key={index} className="inline-block mt-2">
              <a
                href={cleanedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary min-h-11 px-3 text-sm"
                onClick={(e) => e.stopPropagation()}
                title={cleanedUrl}
              >
                <FileText size={18} aria-hidden="true" />
                <span>{labels.viewDoc}</span>
                <ArrowSquareOut size={16} aria-hidden="true" />
              </a>
            </span>
          );
        }

        return <span key={index}>{part.content}</span>;
      })}
    </>
  );
}
