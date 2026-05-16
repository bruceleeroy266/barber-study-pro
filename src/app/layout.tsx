import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Barber Study Pro - Master Your Craft",
  description: "Professional barbering education platform with 21 comprehensive chapters, interactive flashcards, and practice quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-gray-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
