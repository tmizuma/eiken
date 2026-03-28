import { getDb } from "@/lib/db";

const PER_PAGE = 50;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const offset = (page - 1) * PER_PAGE;

  const db = getDb();

  const totalCount = (
    db.prepare("SELECT COUNT(*) as count FROM vocab_quizzes").get() as { count: number }
  ).count;

  const quizzes = db
    .prepare(
      "SELECT id, quiz_number, word_range, created_at FROM vocab_quizzes ORDER BY quiz_number ASC LIMIT ? OFFSET ?"
    )
    .all(PER_PAGE, offset) as {
    id: number;
    quiz_number: number;
    word_range: string;
    created_at: string;
  }[];

  return Response.json({ quizzes, totalCount });
}
