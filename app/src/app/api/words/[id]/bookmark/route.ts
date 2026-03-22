import { getDb } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const word = db
    .prepare("SELECT id, bookmarked FROM words WHERE id = ?")
    .get(Number(id)) as { id: number; bookmarked: number } | undefined;

  if (!word) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const newBookmarked = word.bookmarked ? 0 : 1;
  db.prepare("UPDATE words SET bookmarked = ? WHERE id = ?").run(
    newBookmarked,
    word.id
  );

  return Response.json({ bookmarked: newBookmarked });
}
