import Link from "next/link";
import { getDb } from "@/lib/db";
import { renderContent } from "@/lib/render-content";
import { stemmer } from "stemmer";
import { DoneButton } from "./done-button";

type Question = {
  id: number;
  question_number: number;
  question_type: string;
  question_text: string;
  explanation: string;
  correct_choice: number;
};

type Choice = {
  question_id: number;
  choice_number: number;
  choice_text: string;
};

type WordMapping = {
  id: number;
  word: string;
  meaning: string;
};

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const passageId = Number(id);

  const db = getDb();

  const passage = db
    .prepare("SELECT id, title, content, content_ja, done FROM passages WHERE id = ?")
    .get(passageId) as
    | { id: number; title: string; content: string; content_ja: string; done: number }
    | undefined;

  if (!passage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">データが見つかりません。</p>
      </div>
    );
  }

  const questions = db
    .prepare(
      "SELECT id, question_number, question_type, question_text, explanation, correct_choice FROM passage_questions WHERE passage_id = ? ORDER BY question_number"
    )
    .all(passageId) as Question[];

  const questionIds = questions.map((q) => q.id);
  const choices =
    questionIds.length > 0
      ? (db
          .prepare(
            `SELECT question_id, choice_number, choice_text FROM question_choices WHERE question_id IN (${questionIds.map(() => "?").join(",")}) ORDER BY question_id, choice_number`
          )
          .all(...questionIds) as Choice[])
      : [];

  const allWords = db
    .prepare("SELECT id, word, meaning FROM words")
    .all() as WordMapping[];

  // 本文中に出現する単語をstemmerで検出
  const contentTokens = new Set(
    (passage.content.match(/\b[a-zA-Z]+\b/g) || []).map((t) => stemmer(t.toLowerCase()))
  );
  const matchedWords = allWords.filter((w) => contentTokens.has(stemmer(w.word.toLowerCase())));

  const userAnswers: Record<number, number> = {};
  for (const q of questions) {
    const val = sp[`a${q.question_number}`];
    if (val) userAnswers[q.question_number] = Number(val);
  }

  const correctCount = questions.filter(
    (q) => userAnswers[q.question_number] === q.correct_choice
  ).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{passage.title}</h1>

        <p className="text-lg font-semibold mb-6">
          {correctCount}/{questions.length} 正解
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">英文</h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {renderContent(passage.content, allWords)}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">日本語訳</h2>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {passage.content_ja}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">解説</h2>
          <div className="space-y-6">
            {questions.map((q) => {
              const qChoices = choices.filter((c) => c.question_id === q.id);
              const userAnswer = userAnswers[q.question_number];
              const isCorrect = userAnswer === q.correct_choice;

              return (
                <div key={q.question_number} className="border border-gray-200 rounded p-4">
                  <p className="font-medium text-gray-900 mb-3">
                    Q{q.question_number}. {q.question_text}
                  </p>

                  <div className="space-y-1 mb-3">
                    {qChoices.map((c) => {
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

        {matchedWords.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              この長文で使用されている単語一覧 ({matchedWords.length} 語)
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {matchedWords.map((w) => (
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
          <DoneButton passageId={passage.id} initialDone={passage.done} />
          <Link href="/passages" className="text-blue-600 hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
