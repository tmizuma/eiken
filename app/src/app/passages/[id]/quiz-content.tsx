"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { renderContent, getSelectedTokenIndices } from "@/lib/render-content";
import { topicId } from "@/lib/topics";

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
  topic: string;
  word_range: string;
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

  const saveHighlights = useCallback(
    (next: Set<number>) => {
      sessionStorage.setItem(
        `highlights-${data.id}`,
        JSON.stringify([...next])
      );
    },
    [data.id]
  );

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

  const allAnswered = data.questions.every(
    (q) => answers[q.question_number] !== undefined
  );
  const answeredCount = data.questions.filter(
    (q) => answers[q.question_number] !== undefined
  ).length;

  function handleSubmit() {
    const qs = data.questions
      .map((q) => `a${q.question_number}=${answers[q.question_number]}`)
      .join("&");
    router.push(`/passages/${data.id}/result?${qs}`);
  }

  const wordCount = data.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="quiz-layout">
      <div className="quiz-reading">
        <div className="passage-head">
          {data.topic && (
            <span className="topic" data-t={topicId(data.topic)}>
              {data.topic}
            </span>
          )}
          {data.word_range && (
            <span className="pc-meta" style={{ marginLeft: 8 }}>
              単語 {data.word_range}
            </span>
          )}
        </div>
        <h1 className="passage-title">{data.title}</h1>
        <div ref={passageRef} onMouseUp={handleMouseUp} className="prose">
          {renderContent(data.content, data.words, {
            highlights,
            onRemoveGroup: removeHighlightGroup,
          })}
        </div>
        <div
          style={{
            textAlign: "right",
            color: "var(--ink-4)",
            fontFamily: "var(--f-mono)",
            fontSize: 12,
            marginTop: 24,
          }}
        >
          ({wordCount} words)
        </div>
      </div>

      <aside className={`quiz-side ${quizOpen ? "open" : "closed"}`}>
        <div className="quiz-side-head">
          <div>
            <div className="eyebrow">
              QUIZ · {data.questions.length} QUESTIONS
            </div>
            <h2
              style={{
                fontFamily: "var(--f-serif)",
                fontSize: 20,
                margin: "6px 0 0",
                fontWeight: 500,
              }}
            >
              読解設問
            </h2>
          </div>
          <button
            className="btn ghost"
            onClick={() => setQuizOpen((v) => !v)}
          >
            {quizOpen ? "閉じる" : "開く"}
          </button>
        </div>

        {quizOpen && (
          <>
            {data.questions.map((q) => (
              <div key={q.question_number} className="q-card">
                <div className="q-num">Q{q.question_number}</div>
                <div className="q-text">{q.question_text}</div>
                <div className="q-choices">
                  {q.choices.map((c) => {
                    const on =
                      answers[q.question_number] === c.choice_number;
                    return (
                      <label
                        key={c.choice_number}
                        className={`q-choice ${on ? "on" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`q${q.question_number}`}
                          checked={on}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.question_number]: c.choice_number,
                            }))
                          }
                        />
                        <span className="q-num-small">{c.choice_number}</span>
                        <span className="q-choice-text">{c.choice_text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              className="btn accent q-submit"
              disabled={!allAnswered}
              onClick={handleSubmit}
            >
              回答する
            </button>
            {!allAnswered && (
              <div
                style={{
                  color: "var(--ink-4)",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {answeredCount}/{data.questions.length} 回答済み
              </div>
            )}
          </>
        )}
      </aside>

      {timerEl &&
        createPortal(
          <>
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
            {String(elapsed % 60).padStart(2, "0")}
          </>,
          timerEl
        )}
    </div>
  );
}
