"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";
import { IconArrowL, IconArrowR, IconStarFill } from "@/lib/icons";

type Quiz = {
  id: number;
  quiz_number: number;
  word_range: string;
  created_at: string;
};

export function VocabContent({ allQuizzes }: { allQuizzes: Quiz[] }) {
  return (
    <Suspense fallback={<div className="empty">読み込み中…</div>}>
      <VocabInner allQuizzes={allQuizzes} />
    </Suspense>
  );
}

const PER_PAGE = 40;

function VocabInner({ allQuizzes }: { allQuizzes: Quiz[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const totalCount = allQuizzes.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const offset = (page - 1) * PER_PAGE;
  const quizzes = useMemo(
    () => allQuizzes.slice(offset, offset + PER_PAGE),
    [allQuizzes, offset]
  );

  function navigate(p: number) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    router.push(qs ? `/vocab?${qs}` : "/vocab");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            QUIZ
          </div>
          <h1 className="page-title sm">語彙問題一覧</h1>
        </div>
        <div className="page-head-meta">{totalCount} セット</div>
      </div>

      <Link href="/vocab/bookmarked" className="bm-banner">
        <span
          style={{
            color: "var(--bookmark)",
            display: "inline-flex",
            width: 16,
            height: 16,
          }}
        >
          <IconStarFill />
        </span>
        <span>ブックマーク済みの問題を見る</span>
        <span
          style={{
            marginLeft: "auto",
            color: "var(--ink-3)",
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span className="ico">
            <IconArrowR />
          </span>
        </span>
      </Link>

      {quizzes.length === 0 ? (
        <div className="empty">
          <p>データがありません。</p>
        </div>
      ) : (
        <div className="vocab-grid">
          {quizzes.map((q) => (
            <Link key={q.id} href={`/vocab/${q.id}`} className="card hov vocab-card">
              <div className="vc-num">
                {String(q.quiz_number).padStart(2, "0")}
              </div>
              <div className="vc-body">
                <div className="vc-title">セット {q.quiz_number}</div>
                {q.word_range && (
                  <div className="vc-range">単語 {q.word_range}</div>
                )}
                {q.created_at && (
                  <div className="vc-created">{q.created_at.slice(0, 10)}</div>
                )}
              </div>
              <span className="ico">
                <IconArrowR />
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="pager">
        <div>
          全 {totalCount.toLocaleString()}セット中 {offset + 1}–
          {Math.min(offset + PER_PAGE, totalCount)}
        </div>
        <div className="pager-btns">
          <button
            className="btn ghost"
            disabled={page <= 1}
            onClick={() => navigate(page - 1)}
          >
            <span className="ico">
              <IconArrowL />
            </span>{" "}
            前のページ
          </button>
          <button
            className="btn ghost"
            disabled={page >= totalPages}
            onClick={() => navigate(page + 1)}
          >
            次のページ{" "}
            <span className="ico">
              <IconArrowR />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
