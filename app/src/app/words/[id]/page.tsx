import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { stemmer } from "stemmer";
import { LearnButton } from "./learn-button";
import { BookmarkButton } from "./bookmark-button";

interface Word {
  id: number;
  word_number: number;
  word: string;
  meaning: string;
  pronunciation: string;
  katakana: string;
  example1_en: string;
  example1_ja: string;
  example2_en: string;
  example2_ja: string;
  learned: number;
  bookmarked: number;
}

interface RelatedWord {
  id: number;
  word: string;
  meaning: string;
}

interface RelatedPassage {
  id: number;
  title: string;
  topic: string;
}

export async function generateStaticParams() {
  const db = getDb();
  const rows = db.prepare("SELECT id FROM words").all() as { id: number }[];
  return rows.map((r) => ({ id: String(r.id) }));
}

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const word = db
    .prepare("SELECT * FROM words WHERE id = ?")
    .get(Number(id)) as Word | undefined;

  if (!word) notFound();

  const synonyms = db
    .prepare(
      "SELECT w.id, w.word, w.meaning FROM word_synonyms s JOIN words w ON w.id = s.synonym_word_id WHERE s.word_id = ?"
    )
    .all(word.id) as RelatedWord[];

  const antonyms = db
    .prepare(
      "SELECT w.id, w.word, w.meaning FROM word_antonyms a JOIN words w ON w.id = a.antonym_word_id WHERE a.word_id = ?"
    )
    .all(word.id) as RelatedWord[];

  const wordStem = stemmer(word.word.toLowerCase());
  const allPassages = db
    .prepare("SELECT id, title, topic, content FROM passages ORDER BY id")
    .all() as (RelatedPassage & { content: string })[];

  const passages = allPassages.filter((p) => {
    const tokens = p.content.match(/\b[a-zA-Z]+\b/g) || [];
    return tokens.some((t) => stemmer(t.toLowerCase()) === wordStem);
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/words"
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; 単語一覧に戻る
      </Link>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">{word.word}</h1>
          <p className="text-gray-500 text-sm mt-1">
            No.{word.word_number}
          </p>
        </div>
        <div className="flex gap-2">
          <BookmarkButton wordId={word.id} initialBookmarked={word.bookmarked} />
          <LearnButton wordId={word.id} initialLearned={word.learned} />
        </div>
      </div>

      <p className="text-lg mb-1">{word.meaning}</p>
      <p className="text-gray-500 text-sm mb-1">{word.pronunciation}</p>
      <p className="text-gray-500 text-sm mb-6">{word.katakana}</p>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
          例文 1
        </h2>
        <p className="mb-1">{word.example1_en}</p>
        <p className="text-gray-600 text-sm">{word.example1_ja}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
          例文 2
        </h2>
        <p className="mb-1">{word.example2_en}</p>
        <p className="text-gray-600 text-sm">{word.example2_ja}</p>
      </section>

      {synonyms.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            類義語
          </h2>
          <ul className="space-y-1">
            {synonyms.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/words/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {s.word}
                </Link>
                <span className="text-gray-500 text-sm ml-2">{s.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {antonyms.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            反語
          </h2>
          <ul className="space-y-1">
            {antonyms.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/words/${a.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {a.word}
                </Link>
                <span className="text-gray-500 text-sm ml-2">{a.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {passages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            この単語を含む長文問題
          </h2>
          <ul className="space-y-2">
            {passages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/passages/${p.id}`}
                  className="block border border-gray-200 rounded px-3 py-2 hover:border-blue-400 transition-colors"
                >
                  <span className="text-blue-600 hover:underline">{p.title}</span>
                  {p.topic && (
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {p.topic}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
