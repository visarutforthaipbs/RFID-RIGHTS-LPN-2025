import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, IBM_Plex_Sans_Thai_Looped, IBM_Plex_Mono, Noto_Sans_Myanmar } from "next/font/google";
import "../intake-tokens.css";
import "./intake.css";
import { IntakeLangProvider } from "./_lib/IntakeLangContext";

/**
 * Root layout for the worker-facing intake pages (/voice-report, /track).
 * Deliberately separate from the guide's root layout:
 *  - NO Google Analytics / gtag / Plausible — BRAND.md rule 9, PRD §6.
 *  - IBM Plex Sans Thai + Plex Mono (codes) + Noto Sans Myanmar, per brand/.
 *  - robots noindex.
 *  - <html lang> is set client-side from the chosen language (IntakeLangProvider).
 */

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-thai",
  display: "swap",
});

const plexThaiLooped = IBM_Plex_Sans_Thai_Looped({
  subsets: ["thai", "latin"],
  weight: ["400", "500"],
  variable: "--font-plex-thai-looped",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "รู้สิทธิ ติดกระเป๋า",
  description: "ส่งเสียงเล่าเรื่องและติดตามเรื่องกับมูลนิธิ LPN",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
  icons: { icon: [{ url: "/favicon-new.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function IntakeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${plexThai.variable} ${plexThaiLooped.variable} ${plexMono.variable} ${notoMyanmar.variable}`}
    >
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className="intake-body">
        <IntakeLangProvider>{children}</IntakeLangProvider>
      </body>
    </html>
  );
}
