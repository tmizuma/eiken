"use client";

import { useState } from "react";

export function QuestionBookmarkButton({
  questionId,
  initialBookmarked,
}: {
  questionId: number;
  initialBookmarked: number;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  async function toggle() {
    const res = await fetch(`/api/vocab-questions/${questionId}/bookmark`, { method: "POST" });
    const data = await res.json();
    setBookmarked(data.bookmarked);
  }

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
        bookmarked
          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
          : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {bookmarked ? "★ ブックマーク済み" : "☆ ブックマーク"}
    </button>
  );
}
