# RFID Rights — Design System Reference

> **Project:** รู้สิทธิ ติดกระเป๋า (Know Your Rights) — Migrant Rights Guide  
> **Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · TypeScript 5 · PWA (next-pwa)  
> **Deployment:** Vercel (`rfid-rights.vercel.app`)  
> **Last updated:** 2026-02-21

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Library](#5-component-library)
6. [Icon System](#6-icon-system)
7. [Internationalization (i18n)](#7-internationalization-i18n)
8. [Data Flow](#8-data-flow)
9. [Navigation & Routing](#9-navigation--routing)
10. [Accessibility](#10-accessibility)
11. [Patterns & Conventions](#11-patterns--conventions)
12. [Card & Surface System](#12-card--surface-system)
13. [Interactive States](#13-interactive-states)
14. [Responsive Breakpoints](#14-responsive-breakpoints)
15. [Analytics](#15-analytics)
16. [PWA Configuration](#16-pwa-configuration)
17. [Mandatory Rules — Quick Checklist](#17-mandatory-rules--quick-checklist)

---

## 1. Architecture Overview

### Directory Structure

```
rfid-rights/
├── data/                    # CSV source files (Thai, English, Myanmar)
│   ├── source.csv           # Primary Thai content
│   ├── english-source.csv   # English translations
│   └── myanmar-content.csv  # Myanmar translations
├── lib/                     # Shared libraries (outside src/)
│   ├── analytics.ts         # Plausible analytics events
│   ├── i18n.ts              # Locale messages & getLocalizedField()
│   ├── rfidhash.ts          # SHA-256 UID hashing
│   ├── scenarios.ts         # 8 scenario definitions
│   ├── supabaseClient.ts    # Supabase client (volunteer form)
│   ├── topic-icons.ts       # Topic → icon path mapping
│   └── types.ts             # TopicRow, Scenario, DataGrouped types
├── public/
│   ├── data/                # Build-time JSON (from scripts/build-data.js)
│   ├── icons/topic-icons/   # SVG topic icons
│   ├── images/              # Hero, scenario, and thumbnail images
│   ├── logos/               # LPN, IJM, KOICA logos
│   ├── font/                # Custom fonts
│   └── manifest.json        # PWA manifest
├── scripts/
│   └── build-data.js        # CSV → JSON build script
├── src/app/                 # Next.js App Router
│   ├── layout.tsx           # Root layout (font, LanguageProvider)
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global CSS + CSS variables
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # 404 page
│   ├── api/topics/route.ts  # Server route: CSV → JSON API
│   ├── components/          # 13 shared components
│   ├── contexts/            # LanguageContext provider
│   ├── help/page.tsx        # Emergency help page
│   ├── settings/page.tsx    # User settings page
│   ├── topic/[slug]/page.tsx # Topic detail (dynamic route)
│   ├── topics/page.tsx      # All topics listing
│   └── volunteer/page.tsx   # Volunteer application form
└── tailwind.config.ts       # Tailwind theme extensions
```

### Key Architectural Decisions

- **All pages are `"use client"`** — the app is a client-side SPA wrapped in Next.js for routing, SEO metadata, and SSR shell
- **Data served via API route** (`/api/topics`) that reads CSV files at runtime (force-dynamic, no caching)
- **Content is CSV-driven** — Thai is the primary source; English and Myanmar CSVs are index-matched
- **i18n is manual** (no next-intl) — a `LanguageContext` stores locale in `localStorage`, and `messages[locale]` provides UI strings
- **Supabase** is only used for the volunteer form submission

---

## 2. Color System

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` / `--color-primary` | `#FFC314` | Brand yellow — buttons, accents, SOS bar, focus rings, active states |
| `primary-dark` / `--color-primary-dark` | `#F5B800` | Hover/pressed primary |
| `primary-light` / `--color-primary-light` | `#FFF3B8` | Light backgrounds for primary elements |
| `secondary` / `--color-secondary` | `#000000` | Text, header, dark surfaces |

### Extended Primary Palette (Tailwind)

```
primary-50:  #fffdf0    primary-500: #f5b800
primary-100: #fffae0    primary-600: #d49500
primary-200: #fff3b8    primary-700: #a87100
primary-300: #ffe985    primary-800: #8b5a08
primary-400: #ffc314    primary-900: #744a0c
```

### Surface & Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#FAFAFA` | Page background (`bg-gray-50`) |
| `--color-surface` | `#FFFFFF` | Cards, modals, sections (`bg-white`) |
| `--color-text` | `#000000` | Primary text |
| `--color-text-muted` | `#6D6D6D` | Secondary/muted text (`text-gray-500`) |
| `--color-text-light` | `#888888` | Tertiary text (`text-gray-400`) |
| `--color-border` | `#D1D1D1` | Card/section borders (`border-gray-200`) |
| `--color-border-light` | `#E7E7E7` | Subtle dividers (`border-gray-100`) |

### Semantic Colors (used inline, not tokenized)

| Color | Tailwind Classes | Usage |
|-------|-----------------|-------|
| Red | `bg-red-50`, `border-red-200`, `text-red-800` | Emergency alerts, high urgency |
| Green | `text-green-600`, `bg-green-100` | Success states, availability badges |
| Yellow | `bg-yellow-400`, `text-yellow-600` | Primary actions, active pills, hierarchy markers |
| Teal | `bg-[#117c8e]` | Category badge variant |
| Orange | `bg-[#ff5122]` | Category badge variant |
| Yellow badge | `bg-[#fec700]` | Category badge variant |

### Category Badge Color System

Category badges are deterministically assigned one of 3 colors based on a character-code hash:

```typescript
const styles = [
  "bg-[#117c8e] text-white",  // Teal
  "bg-[#ff5122] text-white",  // Orange
  "bg-[#fec700] text-black",  // Yellow
];
// Hash uses categoryEn for cross-language consistency
```

### Scenario Card Colors

| Scenario | bg | border | hoverBg |
|----------|----|---------|-----------| 
| Most scenarios | `bg-slate-50` | `border-yellow-400` | `hover:bg-slate-100` |
| Emergency | `bg-red-50` | `border-red-200` | `hover:bg-red-100` |

---

## 3. Typography

### Font Families

- **Primary:** `Noto Sans Thai` (Google Fonts, loaded via `next/font`)
- **Myanmar:** `Noto Sans Myanmar` (Google Fonts, loaded via `next/font`)
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Subsets:** Thai + Latin (primary), Myanmar (secondary)
- **CSS Variables:** `--font-noto-sans-thai`, `--font-noto-sans-myanmar`
- **Fallbacks:** `system-ui`, `-apple-system`, `sans-serif`

### Font Sizes & Usage

| Context | Size | Weight | Tailwind Class |
|---------|------|--------|----------------|
| Page title (hero) | 30–48px | Bold | `text-3xl sm:text-5xl font-bold` |
| Page heading (h1) | 24–30px | Bold | `text-3xl font-bold` |
| Section heading (h2) | 20–24px | SemiBold | `text-xl font-semibold` or `text-2xl font-semibold` |
| Sub-heading (h3) | 18–20px | SemiBold/Bold | `text-lg font-semibold` or `text-xl font-bold` |
| Card title | 18–24px | SemiBold/Bold | `text-lg font-semibold` |
| Body text | 14–16px | Regular | `text-sm sm:text-base` |
| Small/Caption | 12–14px | Medium | `text-xs sm:text-sm font-medium` |
| Badge/Pill | 12px | Medium | `text-xs font-medium` |

### Heading Color

> **RULE:** All headings (`h1`, `h2`, `h3`) use `text-gray-900` as their standard color.
> The only exception is headings on colored backgrounds (e.g., yellow-50 sections use `text-yellow-900`, red-50 sections use `text-red-900`).

### Base Size

```css
html { font-size: 16px; line-height: 1.6; }
```

User-configurable via Settings page: `14px` (small), `16px` (medium), `18px` (large).

---

## 4. Spacing & Layout

### Container

- Max width: `max-w-4xl` (896px) — standard pages
- Max width: `max-w-2xl` (672px) — form-focused pages (Settings)
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

### Page Layout Pattern (MANDATORY)

Every page MUST follow this exact layout structure:

```tsx
<div className="min-h-screen bg-gray-50">
  <Header />
  <main className="container mx-auto px-4 py-8" id="main-content">
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-gray-900 hover:text-yellow-600">{t.home}</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{t.currentPage}</span>
      </nav>

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.pageTitle}</h1>
        <p className="text-gray-600">{t.pageDescription}</p>
      </header>

      {/* Content sections */}
    </div>
  </main>
  <FunderLogos />
  <SOSBar />
</div>
```

**Key rules:**
- `<Header />` is always the first child
- `<SOSBar />` is always the last child (fixed bottom, z-50)
- `<FunderLogos />` sits just above SOSBar with `mb-24` to clear it
- Home page is a special case: it uses `HeroSection` instead of Breadcrumb + Page Header, and wraps inner content in `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- `error.tsx` and `not-found.tsx` are special cases: they use `"use client"`, include Header, and include i18n

### Breadcrumb Pattern

```tsx
<nav className="mb-6">
  <Link href="/" className="text-gray-900 hover:text-yellow-600">{t.home}</Link>
  <span className="mx-2 text-gray-400">/</span>
  <span className="text-gray-600">{currentPageTitle}</span>
</nav>
```

- Always `mb-6` spacing
- Breadcrumb Home link: `text-gray-900 hover:text-yellow-600`
- Current page: `text-gray-600`

### Spacing Scale (commonly used)

| Token | Value | Usage |
|-------|-------|-------|
| `gap-2` | 8px | Inline elements, pill groups |
| `gap-4` | 16px | Card grids, button groups |
| `gap-6` | 24px | Section spacing, grid gaps |
| `mb-6` | 24px | Between sections, breadcrumb |
| `mb-8` | 32px | Between major sections, page header |
| `mb-12` | 48px | Between page zones |
| `p-6` | 24px | Card padding |
| `p-8` | 32px | Large card/hero padding |
| `py-8` | 32px | Page vertical padding |

### Grid Patterns

| Context | Layout |
|---------|--------|
| Scenario cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6` |
| Topic cards (results) | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Topic cards (listing) | `grid-cols-1 md:grid-cols-2 gap-6` |
| Quick help cards | `grid-cols-1 sm:grid-cols-3 gap-4` |
| Help contacts | `grid-cols-1 md:grid-cols-2 gap-4` |
| Settings sections | Single column, `space-y-6` |

---

## 5. Component Library

### Page-Level Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `components/Header.tsx` | Sticky top nav with logo, nav links, language switcher |
| `SOSBar` | `components/SOSBar.tsx` | Fixed bottom emergency bar (yellow `#FFC314`) — **MUST appear on every page** |
| `HeroSection` | `components/HeroSection.tsx` | Full-width hero with search (480px tall) |
| `FunderLogos` | `components/FunderLogos.tsx` | Footer-area sponsor logos — **MUST appear on every page** |

### Content Components

| Component | File | Purpose |
|-----------|------|---------|
| `ScenarioGrid` | `components/ScenarioGrid.tsx` | Grid of 8 scenario cards |
| `ScenarioCard` | `components/ScenarioCard.tsx` | Individual scenario selection card |
| `TopicCard` | `components/TopicCard.tsx` | Topic card with category badge, icon, excerpt |
| `TopicCardSkeleton` | `components/TopicCard.tsx` | Loading skeleton for topic cards |
| `ResultsSection` | `components/ResultsSection.tsx` | Search/scenario results display |
| `FormattedContent` | `components/FormattedContent.tsx` | Hierarchical bullet content renderer |
| `QuickHelp` | `components/QuickHelp.tsx` | 3-card CTA section (Help, Topics, Settings) |

### Interactive Components

| Component | File | Purpose |
|-----------|------|---------|
| `SearchBox` | `components/SearchBox.tsx` | Search input with debounce (300ms) |
| `FilterChips` | `components/FilterChips.tsx` | Category filter pills |
| `LanguageSwitcher` | `components/LanguageSwitcher.tsx` | Language `<select>` dropdown |

### Context

| Context | File | Purpose |
|---------|------|---------|
| `LanguageProvider` / `useLanguage` | `contexts/LanguageContext.tsx` | Store & switch locale (persisted in localStorage) |

---

## 6. Icon System

### Topic Icons

Topic-specific SVG icons stored in `/public/icons/topic-icons/`. Mapped via `lib/topic-icons.ts`:

```typescript
export const topicIcons: Record<string, string> = {
  "เริ่มต้นทำงานให้ถูกกฎหมาย":   "/icons/topic-icons/imigrant-new.svg",
  "วิธีต่ออายุบัตรและพาสปอร์ต":   "/icons/topic-icons/document-new.svg",
  "ระวังโดนหลอก/นายหน้าเถื่อน":  "/icons/topic-icons/cross-border.svg",
  "เช็กเงินเดือนและค่าโอที":      "/icons/topic-icons/payment.svg",
  "สิทธิเมื่อเจ็บป่วยหรือว่างงาน": "/icons/topic-icons/know-your-right.svg",
  "ทำงานยังไงให้ปลอดภัย":         "/icons/topic-icons/workplace-new.svg",
  "เมื่อถูกบังคับหรือโดนเอาเปรียบ": "/icons/topic-icons/human-trafficking.svg",
  "การเรียนและโรงเรียนของลูก":    "/icons/topic-icons/education.svg",
  "สิทธิและการดูแลเด็ก":          "/icons/topic-icons/child-protect-new.svg",
  "ปัญหาในบ้าน/ความรุนแรง":       "/icons/topic-icons/family-harm.svg",
  "แจ้งเกิดและเอกสารสำคัญ":       "/icons/topic-icons/verify-new.svg",
  "ป่วยแล้วไปหาหมอที่ไหน?":       "/icons/topic-icons/health.svg",
};
// Fallback: "/icons/topic-icons/know-your-right.svg"
```

### Scenario Icons

Scenario cards use large SVG images from `/public/images/`:

```
newjob-new.svg, problem-job-new.svg, expire-workpermit-new.svg,
family-new.svg, hospital-new.svg, community-new.svg,
help-new.svg, know-your-right-new.svg
```

### UI Icons

All inline UI icons use **Heroicons** (SVG inlined, no icon library dependency):

- **Outline style** for navigation, sections, form labels
- **Solid style** for urgency badges, call-to-action indicators
- Common sizes: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`, `w-8 h-8`

### QuickHelp CTA Icons

Three custom SVGs at `/public/icons/`:

```
help-icon.svg    → Red help card
topic-icon.svg   → Yellow topics card
setting-icon.svg → Gray settings card
```

---

## 7. Internationalization (i18n)

### Supported Locales

| Code | Language | Status |
|------|----------|--------|
| `th` | Thai (ไทย) | **Default** — full coverage |
| `en` | English | Full UI + content translations |
| `mm` | Myanmar (မြန်မာ) | Full UI + content translations |
| `km` | Khmer (ខ្មែរ) | UI strings only — **hidden from language switcher** |

### Implementation Pattern

```typescript
// lib/i18n.ts
export const locales = ["th", "en", "mm", "km"] as const;
export type Locale = (typeof locales)[number];
export const messages = { th: {...}, en: {...}, mm: {...}, km: {...} };

// Usage in components:
const { locale } = useLanguage();
const t = messages[locale];
// Then: t.title, t.searchPlaceholder, etc.
```

### i18n Rules

> **RULE:** Every user-visible string MUST be sourced from `messages[locale]` (the `t` object).
> **No hardcoded Thai, English, or Myanmar strings in components.** If a key is missing from `i18n.ts`, add it before using it.
> The only exception is `error.tsx` and `not-found.tsx` which use a local fallback approach since they may render outside `LanguageProvider`.

### Content Localization (Topics)

Topic data fields follow a suffix convention:

| Thai (default) | English | Myanmar |
|-----------------|---------|---------|
| `topic` | `topicEn` | `topicMm` |
| `category` | `categoryEn` | `categoryMm` |
| `knowYourRights` | `knowYourRightsEn` | `knowYourRightsMm` |
| `howToIdentify` | `howToIdentifyEn` | `howToIdentifyMm` |
| `selfHelp` | `selfHelpEn` | `selfHelpMm` |
| `law` | `lawEn` | `lawMm` |

Helper function:

```typescript
getLocalizedField(obj, locale, "title")
// → obj.titleEn (en) | obj.titleMm (mm) | obj.title (fallback)
```

### Locale Persistence

Stored in `localStorage` under key `"locale"`. Loaded on mount in `LanguageProvider`.

---

## 8. Data Flow

### Content Pipeline

```
data/source.csv           ──┐
data/english-source.csv   ──┼── /api/topics (GET) ── CSV parse ── JSON response
data/myanmar-content.csv  ──┘

Client fetch("/api/topics") → TopicRow[] → React state
```

### TopicRow Schema

```typescript
export type TopicRow = {
  category: string;         // Thai category name
  topic: string;            // Thai topic title
  law?: string;             // Referenced law text
  lawUrls?: string[];       // URLs to full law docs (semicolon-separated in CSV)
  knowYourRights?: string;  // Rights explanation
  howToIdentify?: string;   // How to spot violations
  selfHelp?: string;        // Self-help steps
  remark?: string;          // Additional notes
  videoUrl?: string;        // YouTube URL
  slug: string;             // URL slug (Thai-safe slugify)
  // English fields: categoryEn, topicEn, lawEn, knowYourRightsEn, etc.
  // Myanmar fields: categoryMm, topicMm, lawMm, knowYourRightsMm, etc.
};
```

### Scenario Schema

```typescript
export interface Scenario {
  id: string;                              // e.g., "new-worker"
  title: string; titleEn: string; titleMm: string;
  description: string; descriptionEn: string; descriptionMm: string;
  icon: string;                            // Image path or emoji
  iconType?: "emoji" | "image";
  color: { bg, border, text, hoverBg };    // Tailwind classes
  keywords: string[]; keywordsEn: string[]; keywordsMm: string[];
  category?: string;                       // Maps to TopicRow.category
  urgency?: "low" | "medium" | "high";
  priority?: boolean;
};
```

### Search Logic

Client-side full-text search across all localized fields (topic, category, knowYourRights, howToIdentify, selfHelp) with 300ms debounce.

### Scenario Filtering

Scenarios map to topics via:
- `category` match → `data.filter(t => t.category === scenario.category)`
- `keywords` match → substring search on topic fields
- `"emergency-help"` → redirects to `/help`
- `"general"` category → keyword-based filtering

---

## 9. Navigation & Routing

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Hero + scenarios + search + quick help |
| `/topics` | Topics listing | All topics with search + category filter |
| `/topic/[slug]` | Topic detail | Full topic content with sections |
| `/help` | Help & Emergency | Emergency numbers + organizations |
| `/settings` | Settings | Language, font size, about |
| `/volunteer` | Volunteer form | Supabase-backed application |

### Navigation Elements

- **Header nav** (desktop only, `hidden md:flex`): Topics, Help, Volunteer, Settings
- **Breadcrumbs**: Home → Current page (on all inner pages)
- **Back button**: Shown when scenario/search is active on home
- **SOSBar**: Fixed bottom CTA to call LPN (084-121-1609) + link to /help

### Slugification

Thai-safe slug generation preserving Thai Unicode range `\u0E00-\u0E7F`:

```typescript
function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "").replace(/-+$/, "");
}
```

---

## 10. Accessibility

### Touch Targets

All interactive elements enforce minimum 48×48px touch targets:

```css
button, a, input, select, textarea {
  min-height: 48px;
  min-width: 48px;
}
```

### Focus Indicators

> **RULE:** All focus rings use yellow-400 (`#ffc314`). Never use `focus:ring-blue-*`.

Global CSS provides the baseline:

```css
*:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ffc314;
  border-radius: 4px;
}
```

For Tailwind overrides (e.g., form inputs):
```tsx
focus:ring-2 focus:ring-yellow-400 focus:border-transparent
```

### Skip Navigation

Skip-to-content link with Thai text "ข้ามไปยังเนื้อหาหลัก" targeting `#main-content`.

### ARIA Patterns

- `role="banner"` on header
- `role="navigation"` with `aria-label` on nav elements
- `aria-pressed` on filter chips/toggle buttons
- `aria-expanded` on collapsible content nodes
- `aria-label` on icon-only buttons and search inputs
- `aria-live="polite"` for search result count (screen-reader only via `sr-only`)

### Semantic HTML

- `<header>`, `<main>`, `<section>`, `<nav>`, `<article>` used throughout
- `<h1>`–`<h3>` hierarchy maintained per page

---

## 11. Patterns & Conventions

### Component Pattern

All components follow this structure:

```tsx
"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { messages } from "../../../lib/i18n";

interface ComponentProps { /* ... */ }

export function ComponentName({ props }: ComponentProps) {
  const { locale } = useLanguage();
  const t = messages[locale];
  
  return (/* JSX */);
}
```

### Naming Conventions

- **Components:** PascalCase, named exports (`export function Header`)
- **Files:** PascalCase for components, camelCase for libraries
- **CSS:** Tailwind utility classes only (no CSS modules)
- **Paths:** `@/*` alias maps to `./src/*`
- **Types:** Defined in `lib/types.ts`, imported as needed

### State Management

- **No global state library** — React `useState` + Context API
- **LanguageContext** is the only shared context
- **Data loaded per-page** via `fetch("/api/topics")` in `useEffect`
- **Settings** persisted to `localStorage` (fontSize, locale)

### CSS Methodology

- **Tailwind-first** — all styling via utility classes
- **CSS variables** in `globals.css` for brand colors (used by both Tailwind config and raw CSS)
- **No CSS-in-JS** or styled-components
- **Tailwind v4** with `@import "tailwindcss"` (new import syntax)

---

## 12. Card & Surface System

### Standard Card

```tsx
<article className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 
                     hover:shadow-md transition-shadow duration-200 
                     group-hover:border-yellow-400">
```

| Property | Value |
|----------|-------|
| Background | `bg-white` |
| Border | `border border-gray-200` |
| Border radius | `rounded-2xl` (16px) |
| Shadow | `shadow-sm` → `shadow-md` on hover |
| Padding | `p-6` (24px) |
| Hover border | `border-yellow-400` |

### Section Card (Standard content section)

```tsx
<section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
    <svg className="h-6 w-6 text-yellow-600 mr-2">...</svg>
    {title}
  </h2>
  <FormattedContent content={...} />
</section>
```

> **RULE:** Section card h2 uses `text-gray-900`. Section icon color is `text-yellow-600` by default, except for semantic sections:
> - Know Your Rights: `text-green-600`
> - How to Identify: `text-red-600`
> - Self Help: `text-yellow-600`
> - Law: `text-yellow-600`

### Alert / Warning Card

```tsx
<div className="bg-red-50 border border-red-200 rounded-2xl p-6">
```

### Info / Highlight Card

```tsx
<div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
```

### Scenario Card

Large interactive card with custom border color, icon area, and keyword pills:

```tsx
<button className="bg-slate-50 border-2 border-yellow-400 rounded-xl p-6 
                    hover:bg-slate-100 hover:shadow-xl hover:-translate-y-2 
                    transition-all duration-300 transform-gpu">
```

### QuickHelp CTA Cards

Three distinctive full-color cards:

| Card | Background | Text Color |
|------|-----------|------------|
| Help | `bg-[#EE0000]` | White |
| Topics | `bg-[#FFC314]` | Black |
| Settings | `bg-[#EAEFF1]` | Black |

All: `rounded-3xl p-8 min-h-[240px]`

---

## 13. Interactive States

### Buttons

| Type | Default | Hover | Classes |
|------|---------|-------|---------|
| Primary | `bg-yellow-400 text-black` | `bg-yellow-300` | `rounded-lg font-medium transition-colors` |
| Secondary | `bg-white border border-gray-300` | `bg-gray-50` | `rounded-lg transition-colors` |
| Danger | `bg-red-600 text-white` | `bg-red-700` | `rounded-lg font-medium transition-colors` |
| Ghost | `text-gray-700` | `text-black bg-yellow-400/20` | `px-2 py-1 rounded transition-all` |
| Pill (active) | `bg-yellow-400 text-black` | — | `rounded-full text-sm font-medium` |
| Pill (inactive) | `bg-gray-100 text-gray-700` | `bg-gray-200` | `rounded-full text-sm font-medium` |

> **RULE:** Never use `bg-blue-*` for buttons. Primary actions always use yellow-400. Navigation "back to home" links always use primary button style (`bg-yellow-400 text-black rounded-lg hover:bg-yellow-300`).

### Form Inputs

```tsx
<input className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                   transition-all" />
```

Search box:
```tsx
<input className="w-full pl-12 pr-12 py-3 text-base border-2 border-gray-300 
                   rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 
                   focus:border-transparent bg-white" />
```

### Links

- **Breadcrumb home:** `text-gray-900 hover:text-yellow-600`
- **In-text links:** Yellow-themed (`text-yellow-600 hover:text-yellow-700`)
- **URL badges:** Compact pill with icon (`bg-yellow-50 text-yellow-700 border-yellow-300 rounded`)
- **Navigation links:** `text-gray-700 hover:text-black` with yellow background on hover

### Transitions

- Standard: `transition-colors` (150ms default)
- Cards: `transition-all duration-300` + `transform-gpu`
- Hover lift: `hover:-translate-y-2 hover:shadow-xl`
- Icon scale: `group-hover:scale-110 transition-transform duration-300`
- Arrow slide: `group-hover:translate-x-1 transition-transform`

---

## 14. Responsive Breakpoints

Using Tailwind's default breakpoints:

| Breakpoint | Min-width | Usage |
|------------|-----------|-------|
| (default) | 0px | Mobile-first base styles |
| `sm:` | 640px | 2-column grids, larger text, expanded padding |
| `md:` | 768px | Desktop nav visible, 2-column topic grid, side-by-side layouts |
| `lg:` | 1024px | 3-column scenario/topic grids, wider padding |

### Key Responsive Behaviors

- **Header nav**: Hidden on mobile (`hidden md:flex`)
- **Hero text**: `text-3xl sm:text-5xl`
- **Scenario cards**: `grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-3`
- **Topic detail icon**: `hidden sm:block` (desktop only)
- **SOS bar**: Always visible, responsive flex layout
- **Logo sizes**: `h-12 sm:h-20` for funder logos

---

## 15. Analytics

### Provider: Plausible Analytics

Events are fired via `window.plausible()` if available:

| Event Name | Props | Trigger |
|------------|-------|---------|
| `Topic View` | `slug` | Topic detail page load |
| `Search` | `query_length`, `results` | Search execution |
| `RFID Visit` | `uid_hash` (SHA-256) | URL contains `?uid=` param |
| `SOS Contact` | `method: "call" \| "line" \| "form"` | SOS bar interaction |
| `PWA Install` | `source: "button" \| "browser"` | PWA install prompt |

---

## 16. PWA Configuration

### Manifest (`public/manifest.json`)

```json
{
  "name": "รู้สิทธิ ติดกระเป๋า - Migrant Rights Guide",
  "short_name": "รู้สิทธิ",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffc314",
  "orientation": "portrait-primary",
  "lang": "th"
}
```

### Service Worker

- Generated by `next-pwa` (workbox-based)
- Disabled in development (`process.env.NODE_ENV === "development"`)
- `register: true`, `skipWaiting: true`

---

## 17. Mandatory Rules — Quick Checklist

Use this checklist when creating or modifying any page/component:

### Layout
- [ ] Page wrapped in `<div className="min-h-screen bg-gray-50">`
- [ ] `<Header />` is the first child
- [ ] `<SOSBar />` is the last child
- [ ] `<FunderLogos />` sits just before SOSBar
- [ ] `<main>` has `id="main-content"` and `className="container mx-auto px-4 py-8"`
- [ ] Inner content area uses `max-w-4xl mx-auto` (or `max-w-2xl` for form pages)

### Breadcrumbs
- [ ] All inner pages (not Home) have a `<nav className="mb-6">` breadcrumb
- [ ] Home link uses `text-gray-900 hover:text-yellow-600`
- [ ] Current page uses `text-gray-600`

### Typography
- [ ] All heading text uses `text-gray-900` (not `text-black`)
- [ ] Section headings on white cards: `text-xl font-semibold text-gray-900 mb-4`
- [ ] Exception: Headings on colored backgrounds match surface semantics

### Colors
- [ ] Primary buttons: `bg-yellow-400 text-black hover:bg-yellow-300`
- [ ] No blue buttons or blue focus rings anywhere
- [ ] Focus rings: `focus:ring-2 focus:ring-yellow-400`

### i18n
- [ ] All user-visible strings from `messages[locale]`
- [ ] No hardcoded Thai/English/Myanmar strings in JSX

### Cards
- [ ] Standard card: `bg-white rounded-2xl border border-gray-200 shadow-sm p-6`
- [ ] Section icon in h2: `h-6 w-6 text-yellow-600 mr-2`

---

## Appendix: Content Hierarchy Symbol System

Used in CSV content fields, rendered by `FormattedContent`:

| Symbol | Level | Purpose |
|--------|-------|---------|
| `•` (Bullet) | 1 | Main collapsible point |
| `◦` (White Bullet) | 2 | Sub-collapsible point |
| `▪` (Small Square) | 3 | Detail point |
| `‣` (Triangle) | 4 | Sub-detail point |
| (none) | 0 | Plain text |

All levels rendered in `text-yellow-600` with `border-yellow-200` collapse borders. Levels 1–2 are collapsible (expand/collapse on click).

### Special Content Behaviors

- **URLs** in content are auto-detected and rendered as mini pill-buttons ("ดูเอกสาร")
- **"มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN)"** is auto-detected and rendered as a clickable popup with multilingual phone numbers
