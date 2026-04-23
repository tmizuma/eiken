"use client";

import Link from "next/link";
import { useState } from "react";
import { IconBack, IconStarFill } from "@/lib/icons";

type Choice = {
  question_id: number;
  choice_number: number;
  choice_word: string;
  choice_meaning: string;
};

type BookmarkedQuestion = {
  id: number;
  quiz_id: number;
  question_number: number;
  sentence: string;
  explanation: string;
  correct_choice: number;
  correct_word_id: number | null;
  bookmarked: number;
  quiz_number: number;
  word_range: string;
  choices: Choice[];
};

function renderStem(sentence: string, blankWord?: string) {
  const parts = sentence.split(/(\(\s*\))/);
  return parts.map((part, i) =>
    /^\(\s*\)$/.test(part) ? (
      <span key={i} className="blank">
        {blankWord || "    "}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function BookmarkedContent({
  allQuestions,
}: {
  allQuestions: BookmarkedQuestion[];
}) {
  const [questions, setQuestions] = useState(allQuestions);
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});

  const totalCount = questions.length;

  async function toggleBookmark(questionId: number) {
    await fetch(`/api/vocab-questions/${questionId}/bookmark`, {
      method: "POST",
    });
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }

  function toggle(id: number) {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            QUIZ · BOOKMARKS
          </div>
          <h1 className="page-title sm">ブックマーク済みの問題</h1>
        </div>
        <div className="page-head-meta">{totalCount} 問</div>
      </div>

      {totalCount === 0 ? (
        <div className="empty">
          <p>ブックマークされた問題はありません。</p>
          <Link href="/vocab" className="btn ghost">
            語彙問題一覧に戻る
          </Link>
        </div>
      ) : (
        <div className="bm-list">
          {questions.map((q) => {
            const isOpen = !!openMap[q.id];
            const correct = q.choices.find(
              (c) => c.choice_number === q.correct_choice
            );
            return (
              <div key={q.id} className="card bm-item">
                <div className="bm-head">
                  <div className="bm-ref">
                    <span className="bm-set">セット {q.quiz_number}</span>
                    <span className="bm-sep">·</span>
                    <span className="bm-q">Q{q.question_number}</span>
                    {q.word_range && (
                      <>
                        <span className="bm-sep">·</span>
                        <span className="bm-range">単語 {q.word_range}</span>
                      </>
                    )}
                  </div>
                  <button
                    className="btn ghost bm-remove"
                    onClick={() => toggleBookmark(q.id)}
                  >
                    <span
                      style={{
                        color: "var(--bookmark)",
                        width: 14,
                        height: 14,
                        display: "inline-flex",
                      }}
                    >
                      <IconStarFill />
                    </span>
                    解除
                  </button>
                </div>
                <div className="bm-stem">
                  {renderStem(q.sentence, isOpen ? correct?.choice_word : undefined)}
                </div>
                {!isOpen ? (
                  <>
                    <div className="bm-choices">
                      {q.choices.map((c) => (
                        <div key={c.choice_number} className="bm-choice">
                          <span className="ec-num">{c.choice_number}</span>
                          <span>{c.choice_word}</span>
                        </div>
                      ))}
                    </div>
                    <button className="link-btn" onClick={() => toggle(q.id)}>
                      答えを見る →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bm-choices">
                      {q.choices.map((c) => (
                        <div
                          key={c.choice_number}
                          className={`bm-choice ${
                            q.correct_choice === c.choice_number ? "correct" : ""
                          }`}
                        >
                          <span className="ec-num">{c.choice_number}</span>
                          <span>
                            <strong>{c.choice_word}</strong> — {c.choice_meaning}
                          </span>
                          {q.correct_choice === c.choice_number && (
                            <span className="ec-tag">[正解]</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="expl-text" style={{ marginTop: 10 }}>
                        {q.explanation}
                      </div>
                    )}
                    <button className="link-btn" onClick={() => toggle(q.id)}>
                      答えを隠す
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <Link href="/vocab" className="back-link">
          <span className="ico">
            <IconBack />
          </span>{" "}
          語彙問題一覧に戻る
        </Link>
      </div>
    </>
  );
}
