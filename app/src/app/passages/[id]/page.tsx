"use client";

import { use, useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  question_number: number;
  question_type: string;
  question_text: string;
  choices: { choice_number: number; choice_text: string }[];
};

type WordMapping = {
  id: number;
  word: string;
};

type PassageData = {
  id: number;
  title: string;
  content: string;
  questions: Question[];
  words: WordMapping[];
};

function renderContent(content: string, words: WordMapping[]) {
  const blankReplaced = content.replace(
    /\[BLANK\]/g,
    "\u00A0______\u00A0"
  );

  if (words.length === 0) {
    return blankReplaced.split("\n").map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </Fragment>
    ));
  }

  const sorted = [...words].sort((a, b) => b.word.length - a.word.length);
  const pattern = new RegExp(
    `\\b(${sorted.map((w) => w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi"
  );

  const parts = blankReplaced.split(pattern);

  return parts.map((part, i) => {
    const matched = sorted.find(
      (w) => w.word.toLowerCase() === part.toLowerCase()
    );
    if (matched) {
      return (
        <Link
          key={i}
          href={`/words/${matched.id}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          {part}
        </Link>
      );
    }
    return part.split("\n").map((line, j) => (
      <Fragment key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </Fragment>
    ));
  });
}

export default function PassageQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<PassageData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizOpen, setQuizOpen] = useState(true);

  useEffect(() => {
    fetch(`/api/passages/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const allAnswered = data.questions.every((q) => answers[q.question_number] !== undefined);

  function handleSubmit() {
    const qs = data!.questions
      .map((q) => `a${q.question_number}=${answers[q.question_number]}`)
      .join("&");
    router.push(`/passages/${id}/result?${qs}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{data.title}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={quizOpen ? "lg:w-1/2" : "w-full"}>
            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
              {renderContent(data.content, data.words)}
            </div>
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
    </div>
  );
}
