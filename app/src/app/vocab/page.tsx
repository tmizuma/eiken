"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

type Quiz = {
  id: number;
  quiz_number: number;
  word_range: string;
  created_at: string;
};

export default function VocabPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">読み込み中...</div>}>
      <VocabContent />
    </Suspense>
  );
}

function VocabContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const PER_PAGE = 50;

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    const res = await fetch(`/api/vocab-quizzes?${params}`);
    const data = await res.json();
    setQuizzes(data.quizzes);
    setTotalCount(data.totalCount);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function navigate(p: number) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    router.push(qs ? `/vocab?${qs}` : "/vocab");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">語彙問題一覧</h1>
        <span className="text-sm text-gray-500">{totalCount} セット</span>
      </div>

      {/* ブックマーク問題へのリンク */}
      <div className="mb-6">
        <Link
          href="/vocab/bookmarked"
          className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
        >
          <span>★</span>
          ブックマーク済みの問題を見る
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-500">データがありません。</p>
      ) : (
        <div className="space-y-3">
          {quizzes.map((q) => (
            <Link
              key={q.id}
              href={`/vocab/${q.id}`}
              className="block border rounded-lg p-4 transition-all border-gray-200 hover:border-blue-400 hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-gray-900 mb-1">
                  セット {q.quiz_number}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {q.word_range && <span>単語 {q.word_range}</span>}
                  {q.created_at && <span>{q.created_at.slice(0, 10)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {page > 1 ? (
          <button
            onClick={() => navigate(page - 1)}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            前のページ
          </button>
        ) : (
          <span />
        )}
        {page < totalPages ? (
          <button
            onClick={() => navigate(page + 1)}
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
