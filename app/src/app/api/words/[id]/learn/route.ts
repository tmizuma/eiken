import { getDb } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const word = db
    .prepare("SELECT id, learned FROM words WHERE id = ?")
    .get(Number(id)) as { id: number; learned: number } | undefined;

  if (!word) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const newLearned = word.learned ? 0 : 1;
  db.prepare("UPDATE words SET learned = ? WHERE id = ?").run(newLearned, word.id);

  return Response.json({ learned: newLearned });
}
