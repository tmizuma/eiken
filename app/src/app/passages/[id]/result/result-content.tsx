"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { renderContent, getSelectedTokenIndices } from "@/lib/render-content";
import { DoneButton } from "./done-button";

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
  questions: Question[];
  matchedWords: { id: number; word: string; meaning: string }[];
  allWords: { id: number; word: string }[];
};

export function ResultContent({ data }: { data: PassageResultData }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500">読み込み中...</p></div>}>
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

  const userAnswers: Record<number, number> = {};
  for (const q of data.questions) {
    const val = searchParams.get(`a${q.question_number}`);
    if (val) userAnswers[q.question_number] = Number(val);
  }

  const correctCount = data.questions.filter(
    (q) => userAnswers[q.question_number] === q.correct_choice
  ).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>

        <p className="text-lg font-semibold mb-6">
          {correctCount}/{data.questions.length} 正解
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">英文</h2>
          <div
            ref={passageRef}
            onMouseUp={handleMouseUp}
            className="text-gray-800 leading-relaxed whitespace-pre-wrap"
          >
            {renderContent(data.content, data.allWords, { highlights, onRemoveGroup: removeHighlightGroup })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">日本語訳</h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {data.content_ja}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">解説</h2>
          <div className="space-y-6">
            {data.questions.map((q) => {
              const userAnswer = userAnswers[q.question_number];
              const isCorrect = userAnswer === q.correct_choice;

              return (
                <div key={q.question_number} className="border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-900 mb-3">
                    Q{q.question_number}. {q.question_text}
                  </p>

                  <div className="space-y-1 mb-3">
                    {q.choices.map((c) => {
                      let style = "text-gray-700";
                      if (c.choice_number === q.correct_choice) {
                        style = "text-green-700 font-semibold";
                      } else if (c.choice_number === userAnswer && !isCorrect) {
                        style = "text-red-600";
                      }
                      return (
                        <p key={c.choice_number} className={style}>
                          {c.choice_number}. {c.choice_text}
                          {c.choice_number === q.correct_choice && " [正解]"}
                          {c.choice_number === userAnswer && c.choice_number !== q.correct_choice && " [あなたの回答]"}
                        </p>
                      );
                    })}
                  </div>

                  <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-green-700" : "text-red-600"}`}>
                    {isCorrect ? "正解" : "不正解"}
                  </p>
                  <p className="text-sm text-gray-600">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </section>

        {data.matchedWords.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              この長文で使用されている単語一覧 ({data.matchedWords.length} 語)
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {data.matchedWords.map((w) => (
                <li key={w.id} className="text-sm">
                  <Link
                    href={`/words/${w.id}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {w.word}
                  </Link>
                  <span className="text-gray-500 ml-2">{w.meaning}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex items-center gap-4">
          <DoneButton passageId={data.id} initialDone={data.done} />
          <Link href="/passages" className="text-blue-600 hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
