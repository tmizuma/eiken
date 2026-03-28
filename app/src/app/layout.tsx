import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eiken Grade 1 Reading Practice",
  description: "英検一級 Reading Part 練習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-bold text-lg">
              Eiken 1
            </Link>
            <Link href="/words" className="text-blue-600 hover:underline">
              単語一覧
            </Link>
            <Link href="/passages" className="text-blue-600 hover:underline">
              長文問題
            </Link>
            <Link href="/vocab" className="text-blue-600 hover:underline">
              語彙問題
            </Link>
            <div id="header-timer" className="ml-auto" />
          </nav>
        </header>
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
