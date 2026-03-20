import { getDb } from "@/lib/db";

const PER_PAGE = 100;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const query = url.searchParams.get("q") || "";
  const hideLearned = url.searchParams.get("hide_learned") === "1";
  const offset = (page - 1) * PER_PAGE;

  const db = getDb();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (query) {
    const like = `%${query}%`;
    conditions.push("(word LIKE ? OR meaning LIKE ?)");
    params.push(like, like);
  }
  if (hideLearned) {
    conditions.push("learned = 0");
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRow = db
    .prepare(`SELECT COUNT(*) as count FROM words ${where}`)
    .get(...params) as { count: number };

  const words = db
    .prepare(
      `SELECT id, word_number, word, meaning, learned FROM words ${where} ORDER BY word_number LIMIT ? OFFSET ?`
    )
    .all(...params, PER_PAGE, offset) as {
    id: number;
    word_number: number;
    word: string;
    meaning: string;
    learned: number;
  }[];

  // 各単語の長文数を取得
  const passageCounts = new Map<number, number>();
  if (words.length > 0) {
    const ids = words.map((w) => w.id);
    const rows = db
      .prepare(
        `SELECT word_id, COUNT(*) as cnt FROM passage_words WHERE word_id IN (${ids.map(() => "?").join(",")}) GROUP BY word_id`
      )
      .all(...ids) as { word_id: number; cnt: number }[];
    for (const r of rows) {
      passageCounts.set(r.word_id, r.cnt);
    }
  }

  const wordsWithPassages = words.map((w) => ({
    ...w,
    passage_count: passageCounts.get(w.id) || 0,
  }));

  return Response.json({ words: wordsWithPassages, totalCount: countRow.count });
}
