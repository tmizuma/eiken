"use client";

import { usePathname } from "next/navigation";

function mainClassFor(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const [a, b, c] = parts;

  if (a === "words" && b) return "main medium";
  if (a === "passages" && b && c === "result") return "main medium";
  if (a === "vocab" && b === "bookmarked") return "main medium";
  if (a === "vocab" && b && c === "result") return "main medium";
  if (a === "vocab" && b && !c) return "main narrow";
  return "main";
}

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <main className={mainClassFor(pathname)}>{children}</main>;
}
