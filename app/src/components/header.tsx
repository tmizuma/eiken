"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconMoon, IconPalette, IconSun } from "@/lib/icons";

const ACCENT_MAP: Record<string, number> = {
  indigo: 255,
  moss: 145,
  ember: 30,
  plum: 320,
  slate: 240,
};

const NAV_ITEMS = [
  { href: "/words", label: "単語一覧", match: "/words" },
  { href: "/passages", label: "長文問題", match: "/passages" },
  { href: "/vocab", label: "語彙問題", match: "/vocab" },
];

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [accent, setAccent] = useState<string>("plum");
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    try {
      const t = (localStorage.getItem("eiken-theme") as "light" | "dark") || "light";
      const a = localStorage.getItem("eiken-accent") || "plum";
      setTheme(t);
      setAccent(a);
      document.documentElement.setAttribute("data-theme", t);
      document.documentElement.style.setProperty(
        "--accent-h",
        String(ACCENT_MAP[a] ?? 320)
      );
    } catch {}
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("eiken-theme", next);
    } catch {}
  }

  function chooseAccent(name: string) {
    setAccent(name);
    document.documentElement.style.setProperty(
      "--accent-h",
      String(ACCENT_MAP[name] ?? 320)
    );
    try {
      localStorage.setItem("eiken-accent", name);
    } catch {}
  }

  function setThemeExplicit(next: "light" | "dark") {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("eiken-theme", next);
    } catch {}
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">E</span>
            <span>Eiken 1</span>
            <span className="brand-sub">Reading Practice</span>
          </Link>
          <nav className="nav">
            {NAV_ITEMS.map((it) => {
              const active =
                pathname === it.match || pathname.startsWith(it.match + "/");
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={active ? "active" : ""}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="header-right">
            <span id="header-timer" />
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <IconMoon /> : <IconSun />}
            </button>
            <button
              className="icon-btn"
              onClick={() => setPanelOpen((v) => !v)}
              title="Tweaks"
              aria-label="Tweaks"
            >
              <IconPalette />
            </button>
          </div>
        </div>
      </header>

      <div className={`tweaks ${panelOpen ? "open" : ""}`}>
        <h4>Accent color</h4>
        <div className="row">
          {Object.entries(ACCENT_MAP).map(([name, h]) => (
            <button
              key={name}
              className={`swatch ${accent === name ? "active" : ""}`}
              style={{ background: `oklch(0.55 0.13 ${h})` }}
              title={name}
              onClick={() => chooseAccent(name)}
              aria-label={`Accent ${name}`}
            />
          ))}
        </div>
        <h4>Theme</h4>
        <div className="row seg">
          <button
            className={theme === "light" ? "on" : ""}
            onClick={() => setThemeExplicit("light")}
          >
            Light
          </button>
          <button
            className={theme === "dark" ? "on" : ""}
            onClick={() => setThemeExplicit("dark")}
          >
            Dark
          </button>
        </div>
      </div>
    </>
  );
}
