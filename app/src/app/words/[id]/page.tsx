import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { stemmer } from "stemmer";
import { LearnButton } from "./learn-button";
import { BookmarkButton } from "./bookmark-button";
import { IconBack } from "@/lib/icons";
import { topicId } from "@/lib/topics";

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
  word_count: number;
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

  const passages = allPassages
    .filter((p) => {
      const tokens = p.content.match(/\b[a-zA-Z]+\b/g) || [];
      return tokens.some((t) => stemmer(t.toLowerCase()) === wordStem);
    })
    .map((p) => ({
      ...p,
      word_count: (p.content.match(/\b[a-zA-Z]+\b/g) || []).length,
    }));

  return (
    <>
      <Link href="/words" className="back-link">
        <span className="ico">
          <IconBack />
        </span>{" "}
        単語一覧に戻る
      </Link>

      <div className="word-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            No.{String(word.word_number).padStart(4, "0")}
          </div>
          <h1 className="word-title">{word.word}</h1>
          <div className="word-meta">
            {word.pronunciation && (
              <span className="ipa">{word.pronunciation}</span>
            )}
            {word.katakana && <span className="kana">{word.katakana}</span>}
          </div>
          <div className="word-meaning">{word.meaning}</div>
        </div>
        <div className="word-actions">
          <BookmarkButton
            wordId={word.id}
            initialBookmarked={word.bookmarked}
          />
          <LearnButton wordId={word.id} initialLearned={word.learned} />
        </div>
      </div>

      {word.example1_en && (
        <div className="word-section">
          <span className="eyebrow">例文 1</span>
          <p className="ex-en">{word.example1_en}</p>
          <p className="ex-ja">{word.example1_ja}</p>
        </div>
      )}

      {word.example2_en && (
        <div className="word-section">
          <span className="eyebrow">例文 2</span>
          <p className="ex-en">{word.example2_en}</p>
          <p className="ex-ja">{word.example2_ja}</p>
        </div>
      )}

      {synonyms.length > 0 && (
        <div className="word-section">
          <span className="eyebrow">類義語</span>
          <div className="syn-list">
            {synonyms.map((s) => (
              <Link key={s.id} href={`/words/${s.id}`} className="syn-item">
                <span className="syn-w">{s.word}</span>
                <span className="syn-m">{s.meaning}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {antonyms.length > 0 && (
        <div className="word-section">
          <span className="eyebrow">反語</span>
          <div className="syn-list">
            {antonyms.map((a) => (
              <Link key={a.id} href={`/words/${a.id}`} className="syn-item">
                <span className="syn-w">{a.word}</span>
                <span className="syn-m">{a.meaning}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {passages.length > 0 && (
        <div className="word-section">
          <span className="eyebrow">
            この単語を含む長文問題 ({passages.length})
          </span>
          <div className="rel-passages">
            {passages.map((p) => (
              <Link
                key={p.id}
                href={`/passages/${p.id}`}
                className="card hov rel-p"
              >
                <div className="rel-p-top">
                  {p.topic && (
                    <span className="topic" data-t={topicId(p.topic)}>
                      {p.topic}
                    </span>
                  )}
                  <span
                    style={{
                      color: "var(--ink-4)",
                      fontSize: 12,
                      fontFamily: "var(--f-mono)",
                    }}
                  >
                    {p.word_count} words
                  </span>
                </div>
                <div className="rel-p-title">{p.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
