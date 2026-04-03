"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { QuestionBookmarkButton } from "./bookmark-button";

type Choice = {
  question_id: number;
  choice_number: number;
  choice_word: string;
  choice_meaning: string;
};

type Question = {
  id: number;
  question_number: number;
  sentence: string;
  explanation: string;
  correct_choice: number;
  correct_word_id: number | null;
  bookmarked: number;
  choices: Choice[];
};

type VocabResultData = {
  quiz: { id: number; quiz_number: number; word_range: string };
  questions: Question[];
};

export function VocabResultContent({ data }: { data: VocabResultData }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500">読み込み中...</p></div>}>
      <VocabResultInner data={data} />
    </Suspense>
  );
}

function VocabResultInner({ data }: { data: VocabResultData }) {
  const searchParams = useSearchParams();

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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          セット {data.quiz.quiz_number} - 結果
        </h1>
        {data.quiz.word_range && (
          <p className="text-sm text-gray-500 mb-6">単語 {data.quiz.word_range}</p>
        )}

        {/* 正解数 */}
        <div className="text-center py-8 mb-8 border border-gray-200 rounded-lg">
          <p className="text-5xl font-bold mb-2">
            <span className={correctCount >= data.questions.length / 2 ? "text-green-600" : "text-red-600"}>
              {correctCount}
            </span>
            <span className="text-gray-400 text-3xl"> / {data.questions.length}</span>
          </p>
          <p className="text-gray-500">正解</p>
        </div>

        {/* 全問振り返り */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">振り返り</h2>
          <div className="space-y-6">
            {data.questions.map((q) => {
              const userAnswer = userAnswers[q.question_number];
              const isCorrect = userAnswer === q.correct_choice;

              return (
                <div key={q.question_number} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                          isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {isCorrect ? "O" : "X"}
                      </span>
                      <span className="font-medium text-gray-900">Q{q.question_number}</span>
                    </div>
                    <QuestionBookmarkButton questionId={q.id} initialBookmarked={q.bookmarked} />
                  </div>

                  <p className="text-gray-800 mb-3">{q.sentence}</p>

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
                          {c.choice_number}. {c.choice_word}
                          <span className="text-gray-500 ml-2 text-sm">{c.choice_meaning}</span>
                          {c.choice_number === q.correct_choice && (
                            <span className="ml-2 text-green-600 text-sm">[正解]</span>
                          )}
                          {c.choice_number === userAnswer && c.choice_number !== q.correct_choice && (
                            <span className="ml-2 text-red-500 text-sm">[あなたの回答]</span>
                          )}
                        </p>
                      );
                    })}
                  </div>

                  <p className="text-sm text-gray-600">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <Link href="/vocab" className="text-blue-600 hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
