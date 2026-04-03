"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";

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
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">読み込み中...</div>}>
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

  function navigate(p: number, q: string, hl: boolean, bm: boolean = bookmarkedOnly) {
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

  function toggleHideLearned() {
    const next = !hideLearned;
    setHideLearned(next);
    navigate(1, query, next, bookmarkedOnly);
  }

  function toggleBookmarkedOnly() {
    const next = !bookmarkedOnly;
    setBookmarkedOnly(next);
    navigate(1, query, hideLearned, next);
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
      prev.map((w) => (w.id === wordId ? { ...w, bookmarked: data.bookmarked } : w))
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">単語一覧</h1>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="単語・意味を検索..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            検索
          </button>
        </div>
      </form>

      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={hideLearned}
            onChange={toggleHideLearned}
            className="rounded"
          />
          覚えた単語を非表示
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={bookmarkedOnly}
            onChange={toggleBookmarkedOnly}
            className="rounded"
          />
          ブックマークのみ
        </label>
      </div>

      {pageWords.length === 0 ? (
        <p className="text-gray-500">該当する単語がありません。</p>
      ) : (
        <>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 w-16">No.</th>
                <th className="py-2 pr-4">英単語</th>
                <th className="py-2 pr-4">意味</th>
                <th className="py-2 pr-4 w-16">長文</th>
                <th className="py-2 w-10"></th>
                <th className="py-2 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {pageWords.map((w) => (
                <tr
                  key={w.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    w.learned ? "opacity-50" : ""
                  }`}
                >
                  <td className="py-2 pr-4 text-gray-500">{w.word_number}</td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/words/${w.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {w.word}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-gray-700">{w.meaning}</td>
                  <td className="py-2 pr-4 text-center">
                    {w.passage_count > 0 && (
                      <Link
                        href={`/words/${w.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {w.passage_count}
                      </Link>
                    )}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => toggleBookmark(w.id)}
                      className={`text-base ${
                        w.bookmarked
                          ? "text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      {w.bookmarked ? "\u2605" : "\u2606"}
                    </button>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => toggleLearn(w.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        w.learned
                          ? "bg-gray-200 text-gray-600"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {w.learned ? "v" : "覚えた"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500">
              {totalCount}件中 {offset + 1}-
              {Math.min(offset + PER_PAGE, totalCount)}件
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <button
                  onClick={() => navigate(page - 1, query, hideLearned)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                >
                  前へ
                </button>
              )}
              {page < totalPages && (
                <button
                  onClick={() => navigate(page + 1, query, hideLearned)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                >
                  次へ
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
