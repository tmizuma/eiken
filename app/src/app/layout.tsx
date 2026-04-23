import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/header";
import { MainShell } from "@/components/main-shell";

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
    <html lang="ja" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script id="eiken-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('eiken-theme')||'light';var a=localStorage.getItem('eiken-accent')||'plum';var M={indigo:255,moss:145,ember:30,plum:320,slate:240};document.documentElement.setAttribute('data-theme',t);document.documentElement.style.setProperty('--accent-h',String(M[a]||320));}catch(e){}})();`}
        </Script>
        <div className="app">
          <Header />
          <MainShell>{children}</MainShell>
          <footer className="foot">
            EIKEN 1 · READING PRACTICE · CALM READING DESIGN
          </footer>
        </div>
      </body>
    </html>
  );
}
