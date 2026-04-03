import { getDb } from "@/lib/db";
import { VocabContent } from "./vocab-content";

export default function VocabPage() {
  const db = getDb();

  const quizzes = db
    .prepare(
      "SELECT id, quiz_number, word_range, created_at FROM vocab_quizzes ORDER BY quiz_number ASC"
    )
    .all() as {
    id: number;
    quiz_number: number;
    word_range: string;
    created_at: string;
  }[];

  return <VocabContent allQuizzes={quizzes} />;
}
