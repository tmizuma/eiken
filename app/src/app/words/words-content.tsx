"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import {
  IconArrowL,
  IconArrowR,
  IconCheck,
  IconSearch,
  IconStar,
  IconStarFill,
} from "@/lib/icons";

const PER_PAGE = 100;

type Word = {
  id: number;
  word_number: number;
  word: string;
  meaning: string;
  learned: number;
  bookmarked: number;
  passage_count: number;
};

export function WordsContent({ allWords }: { allWords: Word[] }) {
  return (
    <Suspense fallback={<div className="empty">読み込み中…</div>}>
      <WordsInner allWords={allWords} />
    </Suspense>
  );
}

function WordsInner({ allWords }: { allWords: Word[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const query = searchParams.get("q") || "";
  const hideLearnedParam = searchParams.get("hide_learned") === "1";
  const bookmarkedParam = searchParams.get("bookmarked") === "1";

  const [hideLearned, setHideLearned] = useState(hideLearnedParam);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(bookmarkedParam);
  const [searchInput, setSearchInput] = useState(query);
  const [words, setWords] = useState(allWords);

  const filtered = useMemo(() => {
    let result = words;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (w) => w.word.toLowerCase().includes(q) || w.meaning.includes(q)
      );
    }
    if (hideLearned) result = result.filter((w) => !w.learned);
    if (bookmarkedOnly) result = result.filter((w) => w.bookmarked);
    return result;
  }, [words, query, hideLearned, bookmarkedOnly]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const offset = (page - 1) * PER_PAGE;
  const pageWords = filtered.slice(offset, offset + PER_PAGE);

  function navigate(
    p: number,
    q: string,
    hl: boolean,
    bm: boolean = bookmarkedOnly
  ) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (q) params.set("q", q);
    if (hl) params.set("hide_learned", "1");
    if (bm) params.set("bookmarked", "1");
    const qs = params.toString();
    router.push(qs ? `/words?${qs}` : "/words");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(1, searchInput, hideLearned);
  }

  function toggleHideLearned(checked: boolean) {
    setHideLearned(checked);
    navigate(1, query, checked, bookmarkedOnly);
  }

  function toggleBookmarkedOnly(checked: boolean) {
    setBookmarkedOnly(checked);
    navigate(1, query, hideLearned, checked);
  }

  async function toggleLearn(wordId: number) {
    const res = await fetch(`/api/words/${wordId}/learn`, { method: "POST" });
    const data = await res.json();
    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, learned: data.learned } : w))
    );
  }

  async function toggleBookmark(wordId: number) {
    const res = await fetch(`/api/words/${wordId}/bookmark`, { method: "POST" });
    const data = await res.json();
    setWords((prev) =>
      prev.map((w) =>
        w.id === wordId ? { ...w, bookmarked: data.bookmarked } : w
      )
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            LEXICON
          </div>
          <h1 className="page-title sm">単語一覧</h1>
        </div>
        <div className="page-head-meta">
          全 {allWords.length.toLocaleString()}語中 {totalCount}件
        </div>
      </div>

      <div className="words-controls">
        <form
          onSubmit={handleSearch}
          className="search-row"
          style={{ flex: 1, maxWidth: 520 }}
        >
          <div className="input-with-icon">
            <span className="input-ico">
              <IconSearch />
            </span>
            <input
              className="input"
              placeholder="単語・意味を検索..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn primary">
            検索
          </button>
        </form>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <label className="check">
            <input
              type="checkbox"
              checked={hideLearned}
              onChange={(e) => toggleHideLearned(e.target.checked)}
            />
            覚えた単語を非表示
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={bookmarkedOnly}
              onChange={(e) => toggleBookmarkedOnly(e.target.checked)}
            />
            ブックマークのみ
          </label>
        </div>
      </div>

      {pageWords.length === 0 ? (
        <div className="empty">
          <p>該当する単語がありません。</p>
        </div>
      ) : (
        <>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 64 }}>No.</th>
                <th>英単語</th>
                <th>意味</th>
                <th style={{ width: 80, textAlign: "center" }}>長文</th>
                <th style={{ width: 56 }}></th>
                <th style={{ width: 96 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageWords.map((w) => (
                <tr key={w.id} className={w.learned ? "dim" : ""}>
                  <td className="num">{String(w.word_number).padStart(4, "0")}</td>
                  <td>
                    <Link href={`/words/${w.id}`} className="w-title">
                      {w.word}
                    </Link>
                  </td>
                  <td className="w-mean">{w.meaning}</td>
                  <td style={{ textAlign: "center" }}>
                    {w.passage_count > 0 ? (
                      <Link
                        href={`/words/${w.id}`}
                        style={{ fontFamily: "var(--f-mono)", fontSize: 12.5 }}
                      >
                        {w.passage_count}
                      </Link>
                    ) : (
                      <span style={{ color: "var(--ink-4)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="star"
                      aria-pressed={!!w.bookmarked}
                      onClick={() => toggleBookmark(w.id)}
                      title={w.bookmarked ? "ブックマーク解除" : "ブックマーク"}
                    >
                      {w.bookmarked ? <IconStarFill /> : <IconStar />}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`learned-btn ${w.learned ? "on" : ""}`}
                      onClick={() => toggleLearn(w.id)}
                    >
                      {w.learned && (
                        <span className="ico">
                          <IconCheck />
                        </span>
                      )}
                      <span>覚えた</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pager">
            <div>
              全 {totalCount.toLocaleString()}件中 {offset + 1}–
              {Math.min(offset + PER_PAGE, totalCount)}件
            </div>
            <div className="pager-btns">
              <button
                className="btn ghost"
                disabled={page <= 1}
                onClick={() => navigate(page - 1, query, hideLearned)}
              >
                <span className="ico">
                  <IconArrowL />
                </span>{" "}
                前へ
              </button>
              <button
                className="btn ghost"
                disabled={page >= totalPages}
                onClick={() => navigate(page + 1, query, hideLearned)}
              >
                次へ{" "}
                <span className="ico">
                  <IconArrowR />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
