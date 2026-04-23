"use client";

import { useState } from "react";
import { IconStar, IconStarFill } from "@/lib/icons";

export function QuestionBookmarkButton({
  questionId,
  initialBookmarked,
}: {
  questionId: number;
  initialBookmarked: number;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  async function toggle() {
    const res = await fetch(`/api/vocab-questions/${questionId}/bookmark`, {
      method: "POST",
    });
    const data = await res.json();
    setBookmarked(data.bookmarked);
  }

  return (
    <button
      className="star"
      aria-pressed={!!bookmarked}
      onClick={toggle}
      title={bookmarked ? "ブックマーク解除" : "ブックマーク"}
    >
      {bookmarked ? <IconStarFill /> : <IconStar />}
    </button>
  );
}
