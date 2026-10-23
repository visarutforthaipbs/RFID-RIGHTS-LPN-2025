import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai, IBM_Plex_Sans_Thai_Looped, Noto_Sans_Myanmar } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { SITE_URL } from "../../../lib/site";
import { LanguageProvider } from "../contexts/LanguageContext";
import { GlobalUI } from "../components/GlobalUI";

const GA_MEASUREMENT_ID = "G-4733EDMP26";

/* LPN One CI type (all SIL OFL, see LPN/brand/BRAND.md rule 5):
   UI = IBM Plex Sans (Latin) + IBM Plex Sans Thai; topic article bodies
   (class .reading) = IBM Plex Sans Thai Looped; lang=my = Noto Sans Myanmar. */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-thai",
  display: "swap",
});

const plexThaiLooped = IBM_Plex_Sans_Thai_Looped({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-thai-looped",
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "รู้สิทธิ ติดกระเป๋า - Migrant Rights Guide",
    template: "%s | รู้สิทธิ ติดกระเป๋า",
  },
  description:
    "Complete offline guide for migrant workers' rights in Thailand. Know your rights, identify issues, get help.",
  keywords:
    "migrant rights, Thailand, workers rights, labor law, ผู้ใช้แรงงาน, สิทธิแรงงาน, แรงงานข้ามชาติ, สิทธิแรงงานข้ามชาติ, Myanmar workers, migrant workers Thailand",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "th": SITE_URL,
      "en": SITE_URL,
      "my": SITE_URL,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "รู้สิทธิ",
  },
  icons: {
    icon: [{ url: "/favicon-new.svg", type: "image/svg+xml" }],
    apple: "/favicon-new.svg",
    shortcut: "/favicon-new.svg",
  },
  openGraph: {
    title: "รู้สิทธิ ติดกระเป๋า - Migrant Rights Guide",
    description:
      "Complete offline guide for migrant workers' rights in Thailand. Know your rights, identify issues, get help.",
    url: SITE_URL,
    siteName: "Migrant Rights Guide",
    images: [
      {
        url: "/images/thumnail-image.png",
        width: 1200,
        height: 630,
        alt: "Migrant Rights Guide Thumbnail",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "รู้สิทธิ ติดกระเป๋า - Migrant Rights Guide",
    description:
      "Complete offline guide for migrant workers' rights in Thailand. Know your rights, identify issues, get help.",
    images: ["/images/thumnail-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${plexSans.variable} ${plexThai.variable} ${plexThaiLooped.variable} ${notoMyanmar.variable}`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <meta name="msapplication-TileColor" content="#ffc314" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "รู้สิทธิ ติดกระเป๋า - Migrant Rights Guide",
                  url: SITE_URL,
                  description:
                    "Complete offline guide for migrant workers' rights in Thailand. Know your rights, identify issues, get help.",
                  inLanguage: ["th", "en", "my"],
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${SITE_URL}/topics?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  name: "Labor Protection Network Foundation (LPN)",
                  alternateName: "มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน",
                  url: "https://www.lpnfoundation.org",
                  logo: `${SITE_URL}/favicon-new.svg`,
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+66-84-121-1609",
                    contactType: "customer support",
                    availableLanguage: ["Thai", "Burmese", "English"],
                  },
                },
                {
                  "@type": "WebApplication",
                  name: "รู้สิทธิ ติดกระเป๋า",
                  url: SITE_URL,
                  applicationCategory: "ReferenceApplication",
                  operatingSystem: "All",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "THB",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-surface text-label antialiased">
        <LanguageProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content / ข้ามไปยังเนื้อหาหลัก
          </a>
          <GlobalUI />
          <div className="flex flex-col min-h-screen">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
