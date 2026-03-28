"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Choice = {
  question_id: number;
  choice_number: number;
  choice_word: string;
  choice_meaning: string;
};

type BookmarkedQuestion = {
  id: number;
  quiz_id: number;
  question_number: number;
  sentence: string;
  explanation: string;
  correct_choice: number;
  correct_word_id: number | null;
  bookmarked: number;
  quiz_number: number;
  word_range: string;
  choices: Choice[];
};

function renderSentence(sentence: string, correctWord?: string) {
  if (correctWord) {
    return sentence.replace(/\(\s*\)/, correctWord);
  }
  return sentence;
}

export default function BookmarkedQuestionsPage() {
  const [questions, setQuestions] = useState<BookmarkedQuestion[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/vocab-questions/bookmarked")
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions);
        setTotalCount(data.totalCount);
      });
  }, []);

  async function toggleBookmark(questionId: number) {
    await fetch(`/api/vocab-questions/${questionId}/bookmark`, { method: "POST" });
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setTotalCount((prev) => prev - 1);
  }

  function toggleAnswer(questionId: number) {
    setShowAnswer((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ブックマーク済みの問題</h1>
        <span className="text-sm text-gray-500">{totalCount} 問</span>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">ブックマークされた問題はありません。</p>
          <Link href="/vocab" className="text-blue-600 hover:underline">
            語彙問題一覧に戻る
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const correctChoice = q.choices.find((c) => c.choice_number === q.correct_choice);
            const isRevealed = showAnswer[q.id];

            return (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">
                    セット {q.quiz_number} - Q{q.question_number} (単語 {q.word_range})
                  </span>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className="px-2 py-0.5 rounded text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200 transition-colors"
                  >
                    ★ 解除
                  </button>
                </div>

                <p className="text-gray-800 mb-3">
                  {isRevealed
                    ? renderSentence(q.sentence, correctChoice?.choice_word)
                    : q.sentence}
                </p>

                {!isRevealed ? (
                  <>
                    <div className="space-y-1 mb-3">
                      {q.choices.map((c) => (
                        <p key={c.choice_number} className="text-sm text-gray-700">
                          {c.choice_number}. {c.choice_word}
                        </p>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      答えを見る
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 mb-3">
                      {q.choices.map((c) => (
                        <p
                          key={c.choice_number}
                          className={
                            c.choice_number === q.correct_choice
                              ? "text-sm text-green-700 font-semibold"
                              : "text-sm text-gray-700"
                          }
                        >
                          {c.choice_number}. {c.choice_word}
                          <span className="text-gray-500 ml-2">{c.choice_meaning}</span>
                          {c.choice_number === q.correct_choice && (
                            <span className="ml-2 text-green-600">[正解]</span>
                          )}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{q.explanation}</p>
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      答えを隠す
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <Link href="/vocab" className="text-blue-600 hover:underline">
          語彙問題一覧に戻る
        </Link>
      </div>
    </div>
  );
}
