"use client";

import { useState } from "react";

export function BookmarkButton({
  wordId,
  initialBookmarked,
}: {
  wordId: number;
  initialBookmarked: number;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/words/${wordId}/bookmark`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded text-sm disabled:opacity-50 ${
        bookmarked
          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {bookmarked ? "\u2605" : "\u2606"}
    </button>
  );
}
