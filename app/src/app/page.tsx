import Link from "next/link";
import { getDb } from "@/lib/db";

export default function Home() {
  const db = getDb();
  const wordCount = db.prepare("SELECT COUNT(*) as count FROM words").get() as { count: number };
  const learnedCount = db.prepare("SELECT COUNT(*) as count FROM words WHERE learned = 1").get() as { count: number };
  const passageCount = db.prepare("SELECT COUNT(*) as count FROM passages").get() as { count: number };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">英検一級 Reading Practice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/words"
          className="block p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">単語一覧</h2>
          <p className="text-gray-600">
            {wordCount.count} 語 (習得済み: {learnedCount.count})
          </p>
        </Link>
        <Link
          href="/passages"
          className="block p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">長文問題</h2>
          <p className="text-gray-600">{passageCount.count} 問</p>
        </Link>
      </div>
    </div>
  );
}
