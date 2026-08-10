import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProviders } from "@/components/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ASCYN PRO - Board Exam Readiness",
    template: "%s | ASCYN PRO",
  },
  description: "A professional licensing education platform that helps students identify learning gaps earlier and gives instructors actionable insight before the board exam.",
  keywords: ["barber exam", "licensing exam", "cosmetology", "esthetics", "nail technology", "board exam prep", "ASCYN PRO"],
  authors: [{ name: "ASCYN PRO" }],
  creator: "ASCYN PRO",
  publisher: "ASCYN PRO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ascynpro.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-gold.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/brand/icon-180.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    other: [
      { url: "/brand/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/brand/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ascynpro.com",
    siteName: "ASCYN PRO",
    title: "ASCYN PRO - Board Exam Readiness",
    description: "A professional licensing education platform that helps students identify learning gaps earlier and gives instructors actionable insight before the board exam.",
    images: [
      {
        url: "/brand/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ASCYN PRO - Elevate. Learn. Succeed.",
      },
      {
        url: "/brand/og-image-square.svg",
        width: 1200,
        height: 1200,
        alt: "ASCYN PRO - Elevate. Learn. Succeed.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCYN PRO - Board Exam Readiness",
    description: "A professional licensing education platform that helps students identify learning gaps earlier and gives instructors actionable insight before the board exam.",
    images: ["/brand/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-black text-white min-h-screen">
        {/* Skip to Content Link — WCAG 2.4.1 Bypass Blocks */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-brand-gold)] focus:text-black focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <AnalyticsProviders />
      </body>
    </html>
  );
}
