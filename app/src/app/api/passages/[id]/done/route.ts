import { getDb } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const row = db
    .prepare("SELECT done FROM passages WHERE id = ?")
    .get(Number(id)) as { done: number } | undefined;

  if (!row) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const newDone = row.done ? 0 : 1;
  db.prepare("UPDATE passages SET done = ? WHERE id = ?").run(newDone, Number(id));
  return Response.json({ done: newDone });
}
