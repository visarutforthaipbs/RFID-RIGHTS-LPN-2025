import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    icon: [
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
    shortcut: "/favicon-32x32.svg",
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
    <html lang="th">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="รู้สิทธิ" />
        <meta name="msapplication-TileColor" content="#ffc314" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
      </head>
      <body
        className="min-h-screen bg-gray-50 text-black antialiased"
        style={{
          fontFamily: "'DB Helvethaica', system-ui, -apple-system, sans-serif",
        }}
      >
        <a href="#main-content" className="skip-to-content">
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
}
