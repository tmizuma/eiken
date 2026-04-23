"use client";

import { useState } from "react";
import { IconCheck } from "@/lib/icons";

export function DoneButton({
  passageId,
  initialDone,
}: {
  passageId: number;
  initialDone: number;
}) {
  const [done, setDone] = useState(initialDone);

  async function toggle() {
    const res = await fetch(`/api/passages/${passageId}/done`, {
      method: "POST",
    });
    const data = await res.json();
    setDone(data.done);
  }

  return (
    <button className={`btn ${done ? "accent" : "primary"}`} onClick={toggle}>
      {done && (
        <span className="ico">
          <IconCheck />
        </span>
      )}
      {done ? "DONE" : "この問題を DONE にする"}
    </button>
  );
}
