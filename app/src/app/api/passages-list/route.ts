import { getDb } from "@/lib/db";

const PER_PAGE = 50;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const topic = url.searchParams.get("topic") || "";
  const doneFilter = url.searchParams.get("done") || ""; // "", "0", "1"
  const offset = (page - 1) * PER_PAGE;

  const db = getDb();

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (topic) {
    conditions.push("topic = ?");
    params.push(topic);
  }
  if (doneFilter === "0" || doneFilter === "1") {
    conditions.push("done = ?");
    params.push(Number(doneFilter));
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const totalCount = (
    db.prepare(`SELECT COUNT(*) as count FROM passages ${where}`).get(...params) as { count: number }
  ).count;

  const passages = db
    .prepare(
      `SELECT id, title, topic, word_range, done, created_at, LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count FROM passages ${where} ORDER BY id DESC LIMIT ? OFFSET ?`
    )
    .all(...params, PER_PAGE, offset) as {
    id: number;
    title: string;
    topic: string;
    word_range: string;
    done: number;
    created_at: string;
    word_count: number;
  }[];

  const topicCounts = db
    .prepare("SELECT topic, COUNT(*) as cnt FROM passages WHERE topic != '' GROUP BY topic ORDER BY topic")
    .all() as { topic: string; cnt: number }[];

  return Response.json({ passages, totalCount, topicCounts });
}
