import { getDb } from "@/lib/db";
import { WordsContent } from "./words-content";

export default function WordsPage() {
  const db = getDb();

  const words = db
    .prepare(
      "SELECT id, word_number, word, meaning, learned, bookmarked FROM words ORDER BY word_number"
    )
    .all() as {
    id: number;
    word_number: number;
    word: string;
    meaning: string;
    learned: number;
    bookmarked: number;
  }[];

  // 各単語の長文数を取得
  const passageCounts = new Map<number, number>();
  const ids = words.map((w) => w.id);
  if (ids.length > 0) {
    const rows = db
      .prepare(
        `SELECT word_id, COUNT(*) as cnt FROM passage_words WHERE word_id IN (${ids.map(() => "?").join(",")}) GROUP BY word_id`
      )
      .all(...ids) as { word_id: number; cnt: number }[];
    for (const r of rows) {
      passageCounts.set(r.word_id, r.cnt);
    }
  }

  const allWords = words.map((w) => ({
    ...w,
    passage_count: passageCounts.get(w.id) || 0,
  }));

  return <WordsContent allWords={allWords} />;
}
