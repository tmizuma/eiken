import Link from "next/link";
import { getDb } from "@/lib/db";

const PER_PAGE = 50;

const TOPIC_COLORS: Record<string, string> = {
  "政治": "bg-red-100 text-red-700 border-red-200",
  "経済": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "科学": "bg-blue-100 text-blue-700 border-blue-200",
  "環境": "bg-green-100 text-green-700 border-green-200",
  "教育": "bg-purple-100 text-purple-700 border-purple-200",
  "心理": "bg-pink-100 text-pink-700 border-pink-200",
  "文化": "bg-orange-100 text-orange-700 border-orange-200",
  "メディア": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "歴史": "bg-amber-100 text-amber-700 border-amber-200",
  "生物": "bg-teal-100 text-teal-700 border-teal-200",
  "フリー": "bg-slate-100 text-slate-700 border-slate-200",
};

const TOPIC_ACTIVE: Record<string, string> = {
  "政治": "bg-red-600 text-white",
  "経済": "bg-yellow-600 text-white",
  "科学": "bg-blue-600 text-white",
  "環境": "bg-green-600 text-white",
  "教育": "bg-purple-600 text-white",
  "心理": "bg-pink-600 text-white",
  "文化": "bg-orange-600 text-white",
  "メディア": "bg-indigo-600 text-white",
  "歴史": "bg-amber-600 text-white",
  "生物": "bg-teal-600 text-white",
  "フリー": "bg-slate-600 text-white",
};

function buildHref(page: number, topic?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (topic) params.set("topic", topic);
  const qs = params.toString();
  return qs ? `/passages?${qs}` : "/passages";
}

export default async function PassagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page: pageParam, topic: topicParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const selectedTopic = typeof topicParam === "string" ? topicParam : "";
  const offset = (currentPage - 1) * PER_PAGE;

  const db = getDb();

  // 全トピック一覧と件数を取得
  const topicCounts = db
    .prepare(
      "SELECT topic, COUNT(*) as cnt FROM passages WHERE topic != '' GROUP BY topic ORDER BY topic"
    )
    .all() as { topic: string; cnt: number }[];

  // フィルタ適用
  const where = selectedTopic ? "WHERE topic = ?" : "";
  const queryParams: (string | number)[] = selectedTopic ? [selectedTopic] : [];

  const totalCount = (
    db
      .prepare(`SELECT COUNT(*) as count FROM passages ${where}`)
      .get(...queryParams) as { count: number }
  ).count;

  const passages = db
    .prepare(
      `SELECT id, title, topic, created_at FROM passages ${where} ORDER BY id DESC LIMIT ? OFFSET ?`
    )
    .all(...queryParams, PER_PAGE + 1, offset) as {
    id: number;
    title: string;
    topic: string;
    created_at: string;
  }[];

  const hasNext = passages.length > PER_PAGE;
  const items = hasNext ? passages.slice(0, PER_PAGE) : passages;

  const questionCounts = new Map<number, number>();
  if (items.length > 0) {
    const ids = items.map((p) => p.id);
    const rows = db
      .prepare(
        `SELECT passage_id, COUNT(*) as cnt FROM passage_questions WHERE passage_id IN (${ids.map(() => "?").join(",")}) GROUP BY passage_id`
      )
      .all(...ids) as { passage_id: number; cnt: number }[];
    for (const r of rows) {
      questionCounts.set(r.passage_id, r.cnt);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">長文問題一覧</h1>
        <span className="text-sm text-gray-500">{totalCount} 問</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/passages"
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            !selectedTopic
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          }`}
        >
          すべて
        </Link>
        {topicCounts.map((tc) => (
          <Link
            key={tc.topic}
            href={buildHref(1, tc.topic === selectedTopic ? undefined : tc.topic)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              tc.topic === selectedTopic
                ? TOPIC_ACTIVE[tc.topic] || "bg-gray-800 text-white"
                : TOPIC_COLORS[tc.topic] || "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {tc.topic} ({tc.cnt})
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">データがありません。</p>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/passages/${p.id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-gray-900 mb-2 truncate">
                    {p.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {p.topic && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          TOPIC_COLORS[p.topic] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.topic}
                      </span>
                    )}
                    <span>{questionCounts.get(p.id) || 0} 問</span>
                    {p.created_at && (
                      <span>{p.created_at.slice(0, 10)}</span>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-sm shrink-0">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1, selectedTopic || undefined)}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            前のページ
          </Link>
        ) : (
          <span />
        )}
        {hasNext ? (
          <Link
            href={buildHref(currentPage + 1, selectedTopic || undefined)}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            次のページ
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
