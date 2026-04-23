"use client";

import { useState } from "react";
import { IconCheck } from "@/lib/icons";

export function LearnButton({
  wordId,
  initialLearned,
}: {
  wordId: number;
  initialLearned: number;
}) {
  const [learned, setLearned] = useState(initialLearned);

  async function toggle() {
    const res = await fetch(`/api/words/${wordId}/learn`, { method: "POST" });
    const data = await res.json();
    setLearned(data.learned);
  }

  return (
    <button
      className={`learned-btn ${learned ? "on" : ""}`}
      onClick={toggle}
      style={{ padding: "8px 14px", fontSize: 13 }}
    >
      {learned && (
        <span className="ico">
          <IconCheck />
        </span>
      )}
      <span>覚えた</span>
    </button>
  );
}
