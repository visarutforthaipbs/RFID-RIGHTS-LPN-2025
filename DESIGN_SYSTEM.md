# รู้สิทธิ ติดกระเป๋า — Design System (LPN One CI)

> **Source of truth for every visual decision:** `LPN/brand/` —
> `BRAND.md` (rules), `guideline.html` (visual book, §04 colour · §05 type ·
> §06 shape · §07 icons · §08 components · §10 vocabulary), `tokens/lpn-tokens.css`.
> This file only says how those rules land in *this* repo. If the two disagree,
> the brand folder wins and this file is wrong.
>
> Stack: Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · TypeScript 5 · next-pwa.
> Content hierarchy symbols: see `HIERARCHY_GUIDE.md`.

---

## 1. Where the tokens live

| File | Role |
|---|---|
| `src/app/lpn-tokens.css` | Verbatim copy of `brand/tokens/lpn-tokens.css`. Colours, type scale, radius, targets, glass, dark-mode values, `:lang()` script rules, focus ring. Imported by **both** root layouts (`(guide)/layout.tsx` via `globals.css`, `(intake)/layout.tsx` directly). Re-copy from the brand folder when it changes — do not edit here. |
| `src/app/globals.css` | Guide route group: Tailwind `@theme inline` mapping (semantic utilities), legacy `--color-primary…` aliases, base type, `.btn/.card/.chip/.status/.field-input/.crumb/.glass` components. |
| `src/app/(intake)/intake.css` | Worker intake pages (`/voice-report`, `/track`) — plain CSS on the same tokens, no Tailwind. |

Dark mode follows `prefers-color-scheme` through the tokens. There is no toggle.
Pin a light-only area with `data-appearance="light"` on `<html>` if ever needed.

## 2. Colour — use the semantic utilities, never palette classes

| Job | Utility | Token |
|---|---|---|
| Page / card / tinted panel | `bg-surface` · `bg-elevated` · `bg-surface-secondary` · `bg-surface-tertiary` | `--bg*` |
| Text | `text-label` · `text-label-secondary` (placeholders only: `text-label-tertiary`) | `--label*` |
| Hairlines | `border-separator` · `border-separator-strong` (inputs) | `--separator*` |
| **Yellow #FFC314** — exactly three jobs | `bg-accent text-on-accent` (the ONE primary action per screen) · selected state (`.chip-select[aria-pressed=true]`, settings size picker) · focus ring (tokens) | `--accent` |
| Status — word + dot, never colour alone | `.status .status-critical / -medium / -success`, `bg-critical-tint text-critical-ink border-critical` | `--critical-*` … |
| Emergency numbers 191 / 1669 and the SOS bar hotline | `.btn-emergency` (red, white label) | `--emergency` |
| Black stage (footer "สนับสนุนโดย" only) | `bg-inverse text-on-inverse` + logos `brightness-0 invert` | `--bg-inverse` |

Forbidden in the guide: `bg-white`, `gray-*`, `yellow-*`, `red-*`, `green-*`, `bg-[#…]`,
gradients, shadows, yellow text, white on yellow, yellow meaning "warning".
`grep -rn 'gray-\|yellow-\|bg-\[#' src/app` must stay empty.

Legacy aliases (`--color-primary`, `--color-text-muted` …) still exist and now
resolve to tokens, so old call sites follow dark mode too.

## 3. Type

| | Face (`next/font/google`, all SIL OFL) | Variable |
|---|---|---|
| UI Latin | IBM Plex Sans 400/500/600/700 | `--font-plex-sans` |
| UI Thai | IBM Plex Sans Thai 400/500/600/700 | `--font-plex-thai` |
| Article bodies (`FormattedContent`, topic remark) | IBM Plex Sans Thai Looped — class **`.reading`** | `--font-plex-thai-looped` |
| `lang="my"` | Noto Sans Myanmar | `--font-noto-myanmar` |

Scale (Tailwind `@theme`): `text-xs` 13 px (**the floor**) · `text-sm` 15 · `text-base` **18** (body, worker-facing) ·
`text-lg` 20 · `text-xl` 24 · `text-2xl` 28 · `text-3xl` 32. Thai line-height 1.7 body / 1.45 headings,
`letter-spacing: normal` always. Never `leading-none` on Thai — tone marks clip.
The settings page scales the root font-size (14/16/18 px); everything is rem-based so it follows.

## 4. Shape, space, targets

`rounded-lg` = 8 px (controls) · `rounded-xl` = 12 px (cards) · `rounded-2xl` = 16 px (sheets, dialogs) ·
`rounded-full` (chips, badges). `rounded-3xl` is remapped to 16 px so it can never appear.
Surfaces are solid with a 1 px separator — no shadows, no gradients, no hover lift.
Every `button, a, input, select, textarea, [role=button]` is forced to ≥ 48 px (`globals.css`);
inline prose links (`p a, li a, .reading a`) are exempt; breadcrumb links are 44 px tall.
Worker primary buttons: `.btn-lg` (56 px).

## 5. Glass

Only two surfaces: the sticky `Header` and the bottom `SOSBar` (`.glass`). Nothing else blurs.

## 6. Icons — Phosphor only

`@phosphor-icons/react` (import from `/dist/ssr/<Name>`), names from `brand/assets/icons/icons.json`.
- Regular = default UI · **Fill = active/selected** (header tab) · Duotone with the yellow second layer = pictograms ≥ 32 px.
- The duotone yellow layer comes from `.duo-accent svg path[opacity]` (globals.css); wrap the icon in `<span class="duo-accent">`.
- Topic pictograms: `TopicIcon` (`src/app/components/TopicIcon.tsx`) renders the glyph from `lib/topic-icons.ts`
  (`topicIconNames`: Thai topic title → Phosphor name). The same glyphs as static SVGs live in
  `public/icons/topic-icons/*.svg` (copied from `brand/assets/icons/phosphor/duotone/`) for OG/print.
- Category badge = **one neutral style** (`CategoryBadge`: `.chip` + regular-weight category icon). No hashed colours.
- Never duotone inside a badge or on a yellow button; no emoji, no other icon sets, no hand-drawn SVG UI icons.
- Scenario illustrations in `public/images/*.svg` are brand-approved art and stay; their yellow is `#ffc314`.

## 7. Components (globals.css `@layer components`)

| Class | Use |
|---|---|
| `.btn` + `.btn-primary` (yellow, one per screen) / `.btn-secondary` (outline) / `.btn-plain` / `.btn-inverse` / `.btn-emergency` (red) / `.btn-lg` | All buttons and button-like links |
| `.card` | Elevated surface, separator, 12 px |
| `.chip` / `.chip-select` | Neutral pill (13 px floor) / selectable filter chip (yellow when `aria-pressed`) |
| `.status-*` | Status badge with dot |
| `.field-input` | Inputs (48 px, strong separator border) |
| `.crumb` | Breadcrumb row |
| `.link` | Inline text link (underline, ink) |

Shared React components: `Header`, `SOSBar`, `HeroSection` (light surface, not a black stage), `ScenarioCard`,
`TopicCard`/`CategoryBadge`, `TopicIcon`, `FilterChips`, `SearchBox`, `FormattedContent` (`.reading`),
`QuickHelp`, `FunderLogos`, `LanguageSwitcher`, `BackToTop`, `RouteProgress`.

## 8. Vocabulary (brand §10 — same words in every module)

`ขอความช่วยเหลือ` (get help) · `ส่งเสียงเล่าเรื่อง` → `/voice-report` · `ติดตามเรื่อง` → `/track` ·
`รหัสติดตามเรื่อง` · `สายด่วน LPN 084-121-1609` (pending LPN confirmation — do not change numbers) ·
`ออกทันที` (Quick Exit). Keys: `voiceReportTitle/Desc`, `trackTitle/Desc` in `lib/i18n.ts` (th/en/mm/km).

## 9. Engineering notes that still hold

- Every page is `"use client"`; data comes from `/api/topics` (CSV → JSON at runtime); i18n is `messages[locale]`
  from `lib/i18n.ts` with `LanguageContext` (`localStorage.locale`); content fields use the `En`/`Mm` suffix convention.
- Routes: `/`, `/topics`, `/topic/[slug]`, `/help`, `/settings`, `/volunteer` (guide layout, GA) and
  `/voice-report`, `/track` (intake layout — no analytics, noindex, Quick Exit). Canonical/OG/sitemap origin:
  `SITE_URL` in `lib/site.ts` (`NEXT_PUBLIC_SITE_URL`, falls back to the Vercel URL).
- Supabase is only used by the volunteer form and is created lazily (`getSupabase()`), so the page renders without env.
- PWA: `next-pwa` wraps the production build only; intake routes are NetworkOnly and excluded from precache.
- Dev server: `npm run dev` is **webpack** on purpose (`next dev --turbopack` caused a process storm on the 16 GB build Mac, and next-pwa is webpack-only).

## 10. Gate before merging a visual change

1. `npm run lint && npx tsc --noEmit && npx next build` clean.
2. HIG matrix (`apple-hig-design` skill, `scripts/hig_audit_matrix.py`) on `/`, `/topics`, `/topic/<slug>`, `/help`,
   `/settings`, `/volunteer`, `/voice-report`, `/track` × 390/1280 × light/dark:
   `target_fails 0 · low_contrast 0 · small_text 0 · h1_not_1 0`, dark ≠ light.
3. Look at the 390 px light + dark captures yourself: no clipped tone marks, no second yellow fill, no graybox.
