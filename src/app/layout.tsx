import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai, Noto_Sans_Myanmar } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { GlobalUI } from "./components/GlobalUI";

const GA_MEASUREMENT_ID = "G-4733EDMP26";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-myanmar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rfid-rights.vercel.app"),
  title: "รู้สิทธิ ติดกระเป๋า - Migrant Rights Guide",
  description:
    "Complete offline guide for migrant workers' rights in Thailand. Know your rights, identify issues, get help.",
  keywords:
    "migrant rights, Thailand, workers rights, labor law, ผู้ใช้แรงงาน, สิทธิแรงงาน",
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
    url: "https://rfid-rights.vercel.app",
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
  themeColor: "#ffc314",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${notoSansMyanmar.variable}`}>
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
                  url: "https://rfid-rights.vercel.app",
                  description:
                    "Complete offline guide for migrant workers' rights in Thailand. Know your rights, identify issues, get help.",
                  inLanguage: ["th", "en", "my", "km"],
                },
                {
                  "@type": "Organization",
                  name: "Migrant Rights Guide",
                  url: "https://rfid-rights.vercel.app",
                  logo: "https://rfid-rights.vercel.app/favicon-new.svg",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className="min-h-screen bg-gray-50 text-black antialiased"
        style={{
          fontFamily:
            "var(--font-noto-sans-thai), var(--font-noto-sans-myanmar), system-ui, -apple-system, sans-serif",
        }}
      >
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
