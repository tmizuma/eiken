import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const questions = db
    .prepare(
      `SELECT vq.id, vq.quiz_id, vq.question_number, vq.sentence, vq.explanation, vq.correct_choice, vq.correct_word_id, vq.bookmarked,
              vqz.quiz_number, vqz.word_range
       FROM vocab_questions vq
       JOIN vocab_quizzes vqz ON vq.quiz_id = vqz.id
       WHERE vq.bookmarked = 1
       ORDER BY vq.id`
    )
    .all() as {
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

  return Response.json({ questions: questionsWithChoices, totalCount: questions.length });
}
