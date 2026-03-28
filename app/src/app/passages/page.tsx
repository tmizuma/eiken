"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

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

type Passage = {
  id: number;
  title: string;
  topic: string;
  word_range: string;
  done: number;
  created_at: string;
  word_count: number;
};

export default function PassagesPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">読み込み中...</div>}>
      <PassagesContent />
    </Suspense>
  );
}

function PassagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const selectedTopic = searchParams.get("topic") || "";
  const doneFilter = searchParams.get("done") || "";

  const [passages, setPassages] = useState<Passage[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [topicCounts, setTopicCounts] = useState<{ topic: string; cnt: number }[]>([]);

  const PER_PAGE = 50;

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (selectedTopic) params.set("topic", selectedTopic);
    if (doneFilter) params.set("done", doneFilter);
    const res = await fetch(`/api/passages-list?${params}`);
    const data = await res.json();
    setPassages(data.passages);
    setTotalCount(data.totalCount);
    setTopicCounts(data.topicCounts);
  }, [page, selectedTopic, doneFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function navigate(p: number, topic?: string, done?: string) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (topic) params.set("topic", topic);
    if (done) params.set("done", done);
    const qs = params.toString();
    router.push(qs ? `/passages?${qs}` : "/passages");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">長文問題一覧</h1>
        <span className="text-sm text-gray-500">{totalCount} 問</span>
      </div>

      {/* トピックフィルタ */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => navigate(1, undefined, doneFilter || undefined)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            !selectedTopic
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          }`}
        >
          すべて
        </button>
        {topicCounts.map((tc) => (
          <button
            key={tc.topic}
            onClick={() =>
              navigate(
                1,
                tc.topic === selectedTopic ? undefined : tc.topic,
                doneFilter || undefined
              )
            }
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              tc.topic === selectedTopic
                ? TOPIC_ACTIVE[tc.topic] || "bg-gray-800 text-white"
                : TOPIC_COLORS[tc.topic] || "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {tc.topic} ({tc.cnt})
          </button>
        ))}
      </div>

      {/* DONE フィルタ */}
      <div className="flex gap-2 mb-6">
        {[
          { label: "全て", value: "" },
          { label: "未完了", value: "0" },
          { label: "DONE", value: "1" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => navigate(1, selectedTopic || undefined, opt.value || undefined)}
            className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
              doneFilter === opt.value
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {passages.length === 0 ? (
        <p className="text-gray-500">データがありません。</p>
      ) : (
        <div className="space-y-3">
          {passages.map((p) => (
            <Link
              key={p.id}
              href={`/passages/${p.id}`}
              className={`block border rounded-lg p-4 transition-all ${
                p.done
                  ? "border-gray-200 bg-gray-50 opacity-60"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                {p.done === 1 && (
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center text-xs">
                    v
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <h2
                    className={`font-medium mb-2 truncate ${
                      p.done ? "text-gray-500 line-through" : "text-gray-900"
                    }`}
                  >
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
                    <span>{p.word_count} words</span>
                    {p.created_at && <span>{p.created_at.slice(0, 10)}</span>}
                    {p.word_range && <span>単語 {p.word_range}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {page > 1 ? (
          <button
            onClick={() => navigate(page - 1, selectedTopic || undefined, doneFilter || undefined)}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            前のページ
          </button>
        ) : (
          <span />
        )}
        {page < totalPages ? (
          <button
            onClick={() => navigate(page + 1, selectedTopic || undefined, doneFilter || undefined)}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            次のページ
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
