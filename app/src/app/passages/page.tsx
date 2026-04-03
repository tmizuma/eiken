import { getDb } from "@/lib/db";
import { PassagesContent } from "./passages-content";

export default function PassagesPage() {
  const db = getDb();

  const passages = db
    .prepare(
      "SELECT id, title, topic, word_range, done, created_at, LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count FROM passages ORDER BY id DESC"
    )
    .all() as {
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

  return <PassagesContent allPassages={passages} topicCounts={topicCounts} />;
}
