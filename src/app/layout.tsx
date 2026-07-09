import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ASCYN PRO - Board Exam Readiness",
  description: "A professional licensing education platform that helps students identify learning gaps earlier and gives instructors actionable insight before the board exam.",
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
