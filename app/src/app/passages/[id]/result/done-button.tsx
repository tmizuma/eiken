"use client";

import { useState } from "react";

export function DoneButton({
  passageId,
  initialDone,
}: {
  passageId: number;
  initialDone: number;
}) {
  const [done, setDone] = useState(initialDone);

  async function toggle() {
    const res = await fetch(`/api/passages/${passageId}/done`, { method: "POST" });
    const data = await res.json();
    setDone(data.done);
  }

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded font-medium text-sm ${
        done
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {done ? "DONE" : "完了にする"}
    </button>
  );
}
