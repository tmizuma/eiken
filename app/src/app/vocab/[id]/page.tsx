"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

type QuizData = {
  quiz: {
    id: number;
    quiz_number: number;
    word_range: string;
  };
  questions: Question[];
};

function renderSentence(sentence: string) {
  const parts = sentence.split(/(\(\s*\))/);
  return parts.map((part, i) =>
    /^\(\s*\)$/.test(part) ? (
      <span key={i} className="px-2 py-0.5 mx-1 bg-yellow-100 text-yellow-800 font-semibold rounded">
        ({"   "})
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function VocabQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [bookmarks, setBookmarks] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch(`/api/vocab-quizzes/${id}`)
      .then((r) => r.json())
      .then((d: QuizData) => {
        setData(d);
        const bm: Record<number, number> = {};
        d.questions.forEach((q) => { bm[q.id] = q.bookmarked; });
        setBookmarks(bm);
      });
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const question = data.questions[currentQuestion];
  const totalQuestions = data.questions.length;
  const userAnswer = answers[question.question_number];
  const isAnswered = userAnswer !== undefined;
  const isCorrect = userAnswer === question.correct_choice;
  const isLast = currentQuestion === totalQuestions - 1;

  function handleChoice(choiceNumber: number) {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [question.question_number]: choiceNumber }));
    setShowResult(true);
  }

  function handleNext() {
    setShowResult(false);
    if (isLast) {
      const qs = data!.questions
        .map((q) => `a${q.question_number}=${answers[q.question_number]}`)
        .join("&");
      router.push(`/vocab/${id}/result?${qs}`);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  async function toggleBookmark(questionId: number) {
    const res = await fetch(`/api/vocab-questions/${questionId}/bookmark`, { method: "POST" });
    const d = await res.json();
    setBookmarks((prev) => ({ ...prev, [questionId]: d.bookmarked }));
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 進捗 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-gray-900">
            セット {data.quiz.quiz_number}
          </h1>
          <span className="text-sm font-medium text-gray-500">
            Q{currentQuestion + 1} / {totalQuestions}
          </span>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all"
            style={{ width: `${((currentQuestion + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* 短文 */}
        <div className="text-lg leading-relaxed text-gray-800 mb-8">
          {renderSentence(question.sentence)}
        </div>

        {/* 4択 */}
        <div className="space-y-3 mb-8">
          {question.choices.map((c) => {
            let style = "border-gray-200 hover:border-blue-400 hover:shadow-sm cursor-pointer";

            if (showResult) {
              if (c.choice_number === question.correct_choice) {
                style = "border-green-500 bg-green-50 ring-2 ring-green-500";
              } else if (c.choice_number === userAnswer && !isCorrect) {
                style = "border-red-500 bg-red-50 ring-2 ring-red-500";
              } else {
                style = "border-gray-200 opacity-60";
              }
            } else if (userAnswer === c.choice_number) {
              style = "border-blue-500 bg-blue-50";
            }

            return (
              <button
                key={c.choice_number}
                onClick={() => handleChoice(c.choice_number)}
                disabled={isAnswered}
                className={`w-full text-left border rounded-lg p-4 transition-all ${style}`}
              >
                <span className="font-medium text-gray-900">
                  {c.choice_number}. {c.choice_word}
                </span>
              </button>
            );
          })}
        </div>

        {/* 結果表示 */}
        {showResult && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-lg font-bold ${isCorrect ? "text-green-700" : "text-red-600"}`}>
                {isCorrect ? "正解!" : "不正解"}
              </p>
              <button
                onClick={() => toggleBookmark(question.id)}
                className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
                  bookmarks[question.id]
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {bookmarks[question.id] ? "★ ブックマーク済み" : "☆ ブックマーク"}
              </button>
            </div>

            {/* 解説 */}
            <p className="text-gray-700 mb-4">{question.explanation}</p>

            {/* 全選択肢の意味 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-2">選択肢の意味</p>
              <div className="space-y-1">
                {question.choices.map((c) => (
                  <p key={c.choice_number} className="text-sm">
                    <span className={`font-medium ${c.choice_number === question.correct_choice ? "text-green-700" : "text-gray-700"}`}>
                      {c.choice_word}
                    </span>
                    <span className="text-gray-500 ml-2">{c.choice_meaning}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 次へボタン */}
        {showResult && (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {isLast ? "結果を見る" : "次へ"}
          </button>
        )}
      </div>
    </div>
  );
}
