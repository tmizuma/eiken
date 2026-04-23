"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";
import { IconArrowL, IconArrowR, IconCheck } from "@/lib/icons";
import { topicId } from "@/lib/topics";

type Passage = {
  id: number;
  title: string;
  topic: string;
  word_range: string;
  done: number;
  created_at: string;
  word_count: number;
};

export function PassagesContent({
  allPassages,
  topicCounts,
}: {
  allPassages: Passage[];
  topicCounts: { topic: string; cnt: number }[];
}) {
  return (
    <Suspense fallback={<div className="empty">読み込み中…</div>}>
      <PassagesInner allPassages={allPassages} topicCounts={topicCounts} />
    </Suspense>
  );
}

const PER_PAGE = 50;

function PassagesInner({
  allPassages,
  topicCounts,
}: {
  allPassages: Passage[];
  topicCounts: { topic: string; cnt: number }[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const selectedTopic = searchParams.get("topic") || "";
  const doneFilter = searchParams.get("done") || "";

  const filtered = useMemo(() => {
    let result = allPassages;
    if (selectedTopic) result = result.filter((p) => p.topic === selectedTopic);
    if (doneFilter === "0") result = result.filter((p) => !p.done);
    if (doneFilter === "1") result = result.filter((p) => p.done === 1);
    return result;
  }, [allPassages, selectedTopic, doneFilter]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const offset = (page - 1) * PER_PAGE;
  const passages = filtered.slice(offset, offset + PER_PAGE);

  function navigate(p: number, topic?: string, done?: string) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (topic) params.set("topic", topic);
    if (done) params.set("done", done);
    const qs = params.toString();
    router.push(qs ? `/passages?${qs}` : "/passages");
  }

  const totalAllTopics = topicCounts.reduce((a, b) => a + b.cnt, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            READING
          </div>
          <h1 className="page-title sm">長文問題一覧</h1>
        </div>
        <div className="page-head-meta">
          {allPassages.length.toLocaleString()} 問
        </div>
      </div>

      <div className="filters-section">
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          TOPIC
        </div>
        <div className="topic-pills">
          <button
            className={`pill topic-filter ${!selectedTopic ? "active" : ""}`}
            onClick={() => navigate(1, undefined, doneFilter || undefined)}
          >
            すべて <span className="count">({totalAllTopics})</span>
          </button>
          {topicCounts.map((tc) => {
            const id = topicId(tc.topic);
            const active = selectedTopic === tc.topic;
            return (
              <button
                key={tc.topic}
                className={`pill topic-filter ${active ? "active" : ""}`}
                data-t={id}
                style={!active ? { color: `var(--t-${id})` } : undefined}
                onClick={() =>
                  navigate(1, active ? undefined : tc.topic, doneFilter || undefined)
                }
              >
                {tc.topic} <span className="count">({tc.cnt})</span>
              </button>
            );
          })}
        </div>

        <div
          className="eyebrow"
          style={{ marginBottom: 10, marginTop: 18 }}
        >
          STATUS
        </div>
        <div className="status-pills">
          {[
            { label: "全て", value: "" },
            { label: "未完了", value: "0" },
            { label: "DONE", value: "1" },
          ].map((opt) => (
            <button
              key={opt.value}
              className={`pill ${doneFilter === opt.value ? "active" : ""}`}
              onClick={() =>
                navigate(1, selectedTopic || undefined, opt.value || undefined)
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {passages.length === 0 ? (
        <div className="empty">
          <p>データがありません。</p>
        </div>
      ) : (
        <div className="passages-list">
          {passages.map((p) => (
            <Link
              key={p.id}
              href={`/passages/${p.id}`}
              className={`card hov passage-card ${p.done ? "done" : ""}`}
            >
              <div className="pc-left">
                {p.done === 1 && (
                  <span className="done-dot">
                    <IconCheck />
                  </span>
                )}
              </div>
              <div className="pc-mid">
                <div className="pc-top">
                  {p.topic && (
                    <span className="topic" data-t={topicId(p.topic)}>
                      {p.topic}
                    </span>
                  )}
                </div>
                <h3 className="pc-title">{p.title}</h3>
                <div className="pc-meta">
                  <span>{p.word_count} words</span>
                  {p.created_at && (
                    <>
                      <span className="dot-sep">·</span>
                      <span>{p.created_at.slice(0, 10)}</span>
                    </>
                  )}
                  {p.word_range && (
                    <>
                      <span className="dot-sep">·</span>
                      <span>単語 {p.word_range}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="pc-right">
                <span className="ico">
                  <IconArrowR />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pager">
        <div>全 {totalCount}件</div>
        <div className="pager-btns">
          <button
            className="btn ghost"
            disabled={page <= 1}
            onClick={() =>
              navigate(page - 1, selectedTopic || undefined, doneFilter || undefined)
            }
          >
            <span className="ico">
              <IconArrowL />
            </span>{" "}
            前のページ
          </button>
          <button
            className="btn ghost"
            disabled={page >= totalPages}
            onClick={() =>
              navigate(page + 1, selectedTopic || undefined, doneFilter || undefined)
            }
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
