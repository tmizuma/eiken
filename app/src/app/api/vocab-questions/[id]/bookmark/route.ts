import { getDb } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const row = db
    .prepare("SELECT bookmarked FROM vocab_questions WHERE id = ?")
    .get(Number(id)) as { bookmarked: number } | undefined;

  if (!row) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const newBookmarked = row.bookmarked ? 0 : 1;
  db.prepare("UPDATE vocab_questions SET bookmarked = ? WHERE id = ?").run(newBookmarked, Number(id));
  return Response.json({ bookmarked: newBookmarked });
}
