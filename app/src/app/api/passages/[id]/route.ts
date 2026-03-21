import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const passage = db
    .prepare("SELECT id, title, content FROM passages WHERE id = ?")
    .get(Number(id)) as { id: number; title: string; content: string } | undefined;

  if (!passage) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const questions = db
    .prepare(
      "SELECT id, question_number, question_type, question_text FROM passage_questions WHERE passage_id = ? ORDER BY question_number"
    )
    .all(passage.id) as {
    id: number;
    question_number: number;
    question_type: string;
    question_text: string;
  }[];

  const questionIds = questions.map((q) => q.id);
  const choices =
    questionIds.length > 0
      ? (db
          .prepare(
            `SELECT question_id, choice_number, choice_text FROM question_choices WHERE question_id IN (${questionIds.map(() => "?").join(",")}) ORDER BY question_id, choice_number`
          )
          .all(...questionIds) as {
          question_id: number;
          choice_number: number;
          choice_text: string;
        }[])
      : [];

  const words = db
    .prepare("SELECT id, word FROM words")
    .all() as { id: number; word: string }[];

  const result = {
    id: passage.id,
    title: passage.title,
    content: passage.content,
    questions: questions.map((q) => ({
      ...q,
      choices: choices.filter((c) => c.question_id === q.id),
    })),
    words,
  };

  return Response.json(result);
}
