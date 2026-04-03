import { getDb } from "@/lib/db";
import { stemmer } from "stemmer";
import { ResultContent } from "./result-content";

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

export async function generateStaticParams() {
  const db = getDb();
  const rows = db.prepare("SELECT id FROM passages").all() as { id: number }[];
  return rows.map((r) => ({ id: String(r.id) }));
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const contentTokens = new Set(
    (passage.content.match(/\b[a-zA-Z]+\b/g) || []).map((t) => stemmer(t.toLowerCase()))
  );
  const matchedWords = allWords.filter((w) => contentTokens.has(stemmer(w.word.toLowerCase())));

  const data = {
    id: passage.id,
    title: passage.title,
    content: passage.content,
    content_ja: passage.content_ja,
    done: passage.done,
    questions: questions.map((q) => ({
      ...q,
      choices: choices.filter((c) => c.question_id === q.id),
    })),
    matchedWords,
    allWords: allWords.map((w) => ({ id: w.id, word: w.word })),
  };

  return <ResultContent data={data} />;
}
