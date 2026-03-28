import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = Number(id);
  const db = getDb();

  const quiz = db
    .prepare("SELECT id, quiz_number, word_range FROM vocab_quizzes WHERE id = ?")
    .get(quizId) as
    | { id: number; quiz_number: number; word_range: string }
    | undefined;

  if (!quiz) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const questions = db
    .prepare(
      "SELECT id, question_number, sentence, explanation, correct_choice, correct_word_id, bookmarked FROM vocab_questions WHERE quiz_id = ? ORDER BY question_number"
    )
    .all(quizId) as {
    id: number;
    question_number: number;
    sentence: string;
    explanation: string;
    correct_choice: number;
    correct_word_id: number | null;
    bookmarked: number;
  }[];

  const questionIds = questions.map((q) => q.id);
  const choices =
    questionIds.length > 0
      ? (db
          .prepare(
            `SELECT question_id, choice_number, choice_word, choice_meaning FROM vocab_question_choices WHERE question_id IN (${questionIds.map(() => "?").join(",")}) ORDER BY question_id, choice_number`
          )
          .all(...questionIds) as {
          question_id: number;
          choice_number: number;
          choice_word: string;
          choice_meaning: string;
        }[])
      : [];

  const questionsWithChoices = questions.map((q) => ({
    ...q,
    choices: choices.filter((c) => c.question_id === q.id),
  }));

  return Response.json({ quiz, questions: questionsWithChoices });
}
