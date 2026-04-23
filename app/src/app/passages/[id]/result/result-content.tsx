"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { renderContent, getSelectedTokenIndices } from "@/lib/render-content";
import { DoneButton } from "./done-button";
import { topicId } from "@/lib/topics";

type Question = {
  id: number;
  question_number: number;
  question_type: string;
  question_text: string;
  explanation: string;
  correct_choice: number;
  choices: { choice_number: number; choice_text: string }[];
};

type PassageResultData = {
  id: number;
  title: string;
  content: string;
  content_ja: string;
  done: number;
  topic: string;
  questions: Question[];
  matchedWords: { id: number; word: string; meaning: string }[];
  allWords: { id: number; word: string }[];
};

export function ResultContent({ data }: { data: PassageResultData }) {
  return (
    <Suspense fallback={<div className="empty">読み込み中…</div>}>
      <ResultInner data={data} />
    </Suspense>
  );
}

function ResultInner({ data }: { data: PassageResultData }) {
  const searchParams = useSearchParams();
  const passageRef = useRef<HTMLDivElement>(null);
  const undoStack = useRef<Set<number>[]>([]);
  const [highlights, setHighlights] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = sessionStorage.getItem(`highlights-${data.id}`);
    if (saved) setHighlights(new Set(JSON.parse(saved)));
  }, [data.id]);

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

  const userAnswers: Record<number, number> = {};
  for (const q of data.questions) {
    const val = searchParams.get(`a${q.question_number}`);
    if (val) userAnswers[q.question_number] = Number(val);
  }

  const correctCount = data.questions.filter(
    (q) => userAnswers[q.question_number] === q.correct_choice
  ).length;

  const scoreColor =
    correctCount === data.questions.length
      ? "var(--ok)"
      : correctCount >= data.questions.length / 2
        ? "var(--ink)"
        : "var(--bad)";

  return (
    <>
      <div className="result-head">
        <div>
          {data.topic && (
            <span className="topic" data-t={topicId(data.topic)}>
              {data.topic}
            </span>
          )}
          <h1 className="page-title sm" style={{ marginTop: 8 }}>
            {data.title}
          </h1>
        </div>
        <div className="score-badge">
          <div className="score-num">
            <span style={{ color: scoreColor }}>{correctCount}</span>
            <span style={{ color: "var(--ink-4)" }}>
              /{data.questions.length}
            </span>
          </div>
          <div className="score-label">正解</div>
        </div>
      </div>

      <div className="word-section">
        <span className="eyebrow">英文</span>
        <div ref={passageRef} onMouseUp={handleMouseUp} className="prose">
          {renderContent(data.content, data.allWords, {
            highlights,
            onRemoveGroup: removeHighlightGroup,
          })}
        </div>
      </div>

      {data.content_ja && (
        <div className="word-section">
          <span className="eyebrow">日本語訳</span>
          <div className="prose-ja">{data.content_ja}</div>
        </div>
      )}

      <div className="word-section">
        <span className="eyebrow">解説</span>
        {data.questions.map((q) => {
          const userAnswer = userAnswers[q.question_number];
          const isCorrect = userAnswer === q.correct_choice;

          return (
            <div key={q.question_number} className="expl-card">
              <div className="expl-head">
                <span className={`q-mark ${isCorrect ? "ok" : "bad"}`}>
                  {isCorrect ? "O" : "X"}
                </span>
                <span className="q-label">Q{q.question_number}</span>
                <span className={`q-verdict ${isCorrect ? "ok" : "bad"}`}>
                  {isCorrect ? "正解" : "不正解"}
                </span>
              </div>
              <div className="q-text" style={{ marginBottom: 12 }}>
                {q.question_text}
              </div>
              <div className="expl-choices">
                {q.choices.map((c) => {
                  const isCorrectChoice = c.choice_number === q.correct_choice;
                  const isUserChoice = c.choice_number === userAnswer;
                  let cls = "expl-choice";
                  if (isCorrectChoice) cls += " correct";
                  else if (isUserChoice) cls += " user-wrong";
                  else cls += " neutral";
                  return (
                    <div key={c.choice_number} className={cls}>
                      <span className="ec-num">{c.choice_number}</span>
                      <span className="ec-text">{c.choice_text}</span>
                      {isCorrectChoice && (
                        <span className="ec-tag">[正解]</span>
                      )}
                      {isUserChoice && !isCorrectChoice && (
                        <span className="ec-tag bad">[あなたの回答]</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="expl-text">{q.explanation}</div>
              )}
            </div>
          );
        })}
      </div>

      {data.matchedWords.length > 0 && (
        <div className="word-section">
          <span className="eyebrow">
            この長文で使用されている単語 ({data.matchedWords.length})
          </span>
          <div className="used-words">
            {data.matchedWords.map((w) => (
              <Link
                key={w.id}
                href={`/words/${w.id}`}
                target="_blank"
                className="used-word"
              >
                <span className="uw-w">{w.word}</span>
                <span className="uw-m">{w.meaning}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="result-footer">
        <DoneButton passageId={data.id} initialDone={data.done} />
        <Link href="/passages" className="btn ghost">
          一覧に戻る
        </Link>
      </div>
    </>
  );
}
