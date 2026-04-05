"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { renderContent, getSelectedTokenIndices } from "@/lib/render-content";

type Question = {
  id: number;
  question_number: number;
  question_type: string;
  question_text: string;
  choices: { choice_number: number; choice_text: string }[];
};

type PassageData = {
  id: number;
  title: string;
  content: string;
  questions: Question[];
  words: { id: number; word: string }[];
};

export function PassageQuizContent({ data }: { data: PassageData }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizOpen, setQuizOpen] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [timerEl, setTimerEl] = useState<HTMLElement | null>(null);
  const passageRef = useRef<HTMLDivElement>(null);
  const undoStack = useRef<Set<number>[]>([]);
  const [highlights, setHighlights] = useState<Set<number>>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`highlights-${data.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  useEffect(() => {
    setTimerEl(document.getElementById("header-timer"));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveHighlights = useCallback((next: Set<number>) => {
    sessionStorage.setItem(`highlights-${data.id}`, JSON.stringify([...next]));
  }, [data.id]);

  // Ctrl+Z / Cmd+Z でアンドゥ
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        const prev = undoStack.current.pop();
        if (prev !== undefined) {
          setHighlights(prev);
          saveHighlights(prev);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveHighlights]);

  function removeHighlightGroup(indices: number[]) {
    setHighlights((prev) => {
      undoStack.current.push(new Set(prev));
      const next = new Set(prev);
      for (const idx of indices) next.delete(idx);
      saveHighlights(next);
      return next;
    });
  }

  function handleMouseUp() {
    const indices = getSelectedTokenIndices(passageRef.current);
    if (indices.length === 0) return;
    setHighlights((prev) => {
      undoStack.current.push(new Set(prev));
      const next = new Set(prev);
      for (const idx of indices) next.add(idx);
      saveHighlights(next);
      return next;
    });
  }

  const allAnswered = data.questions.every((q) => answers[q.question_number] !== undefined);

  function handleSubmit() {
    const qs = data.questions
      .map((q) => `a${q.question_number}=${answers[q.question_number]}`)
      .join("&");
    router.push(`/passages/${data.id}/result?${qs}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{data.title}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={quizOpen ? "lg:w-1/2" : "w-full"}>
            <div
              ref={passageRef}
              onMouseUp={handleMouseUp}
              className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
            >
              {renderContent(data.content, data.words, { highlights, onRemoveGroup: removeHighlightGroup })}
            </div>
            <p className="mt-4 text-xs text-gray-400 text-right">
              ({data.content.split(/\s+/).filter(Boolean).length} words)
            </p>
          </div>

          <div className={quizOpen ? "lg:w-1/2" : "lg:w-auto"}>
            <button
              onClick={() => setQuizOpen(!quizOpen)}
              className={`mb-4 text-sm font-medium border rounded px-3 py-1 hover:bg-gray-50 ${
                quizOpen
                  ? "text-gray-700 border-gray-300"
                  : "text-blue-600 border-blue-300 bg-blue-50"
              }`}
            >
              {quizOpen ? "クイズを閉じる" : "クイズを開く"}
            </button>

            {quizOpen && (
              <div className="space-y-6">
                {data.questions.map((q) => (
                  <div key={q.question_number} className="border border-gray-200 rounded p-4">
                    <p className="font-medium text-gray-900 mb-3">
                      Q{q.question_number}. {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {q.choices.map((c) => (
                        <label
                          key={c.choice_number}
                          className="flex items-center gap-2 cursor-pointer text-gray-700"
                        >
                          <input
                            type="radio"
                            name={`q${q.question_number}`}
                            checked={answers[q.question_number] === c.choice_number}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.question_number]: c.choice_number,
                              }))
                            }
                          />
                          {c.choice_number}. {c.choice_text}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`w-full py-2 rounded font-medium text-white ${
                    allAnswered
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  回答する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {timerEl &&
        createPortal(
          <span className="text-lg font-mono font-bold text-blue-600 tabular-nums">
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
            {String(elapsed % 60).padStart(2, "0")}
          </span>,
          timerEl
        )}
    </div>
  );
}
