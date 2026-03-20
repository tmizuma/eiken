"use client";

import { useState } from "react";

export function LearnButton({
  wordId,
  initialLearned,
}: {
  wordId: number;
  initialLearned: number;
}) {
  const [learned, setLearned] = useState(initialLearned);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/words/${wordId}/learn`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLearned(data.learned);
      }
    } finally {
      setLoading(false);
    }
  }

  if (learned) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 rounded text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
      >
        &#10003; 覚えた
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      覚えた!
    </button>
  );
}
