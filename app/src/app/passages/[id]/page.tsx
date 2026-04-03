import { getDb } from "@/lib/db";
import { PassageQuizContent } from "./quiz-content";

type Question = {
  id: number;
  question_number: number;
  question_type: string;
  question_text: string;
};

type Choice = {
  question_id: number;
  choice_number: number;
  choice_text: string;
};

export async function generateStaticParams() {
  const db = getDb();
  const rows = db.prepare("SELECT id FROM passages").all() as { id: number }[];
  return rows.map((r) => ({ id: String(r.id) }));
}

export default async function PassageQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const passage = db
    .prepare("SELECT id, title, content FROM passages WHERE id = ?")
    .get(Number(id)) as { id: number; title: string; content: string } | undefined;

  if (!passage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">データが見つかりません。</p>
      </div>
    );
  }

  const questions = db
    .prepare(
      "SELECT id, question_number, question_type, question_text FROM passage_questions WHERE passage_id = ? ORDER BY question_number"
    )
    .all(passage.id) as Question[];

  const questionIds = questions.map((q) => q.id);
  const choices =
    questionIds.length > 0
      ? (db
          .prepare(
            `SELECT question_id, choice_number, choice_text FROM question_choices WHERE question_id IN (${questionIds.map(() => "?").join(",")}) ORDER BY question_id, choice_number`
          )
          .all(...questionIds) as Choice[])
      : [];

  const words = db
    .prepare("SELECT id, word FROM words")
    .all() as { id: number; word: string }[];

  const data = {
    id: passage.id,
    title: passage.title,
    content: passage.content,
    questions: questions.map((q) => ({
      ...q,
      choices: choices.filter((c) => c.question_id === q.id),
    })),
    words,
  };

  return <PassageQuizContent data={data} />;
}
