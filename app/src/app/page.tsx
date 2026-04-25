import Link from "next/link";
import { getDb } from "@/lib/db";
import { IconExt } from "@/lib/icons";

export default function Home() {
  const db = getDb();
  const wordCount = db.prepare("SELECT COUNT(*) as count FROM words").get() as { count: number };
  const learnedCount = db
    .prepare("SELECT COUNT(*) as count FROM words WHERE learned = 1")
    .get() as { count: number };
  const passageCount = db.prepare("SELECT COUNT(*) as count FROM passages").get() as { count: number };
  const passageDoneCount = db
    .prepare("SELECT COUNT(*) as count FROM passages WHERE done = 1")
    .get() as { count: number };
  const vocabQuizCount = db
    .prepare("SELECT COUNT(*) as count FROM vocab_quizzes")
    .get() as { count: number };

  const passageOpen = passageCount.count - passageDoneCount.count;

  type Card = {
    key: string;
    eyebrow: string;
    title: string;
    sub: string;
    stat: string;
    meta: string;
    href: string;
    external?: boolean;
  };
  const cards: Card[] = [
    {
      key: "words",
      eyebrow: "LEXICON",
      title: "単語一覧",
      sub: "英検一級 2000語を網羅",
      stat: `${wordCount.count.toLocaleString()} 語`,
      meta: `習得済み ${learnedCount.count} 語`,
      href: "/words",
    },
    {
      key: "passages",
      eyebrow: "READING",
      title: "長文問題",
      sub: "精読と設問による読解練習",
      stat: `${passageCount.count} 問`,
      meta: `未完了 ${passageOpen} 問`,
      href: "/passages",
    },
    {
      key: "vocab",
      eyebrow: "QUIZ",
      title: "語彙問題",
      sub: "4択で素早く確認",
      stat: `${vocabQuizCount.count} セット`,
      meta: "1 セット 10 問",
      href: "/vocab",
    },
    {
      key: "review",
      eyebrow: "SPACED REVIEW",
      title: "英単語復習リスト",
      sub: "間隔反復の学習ログ",
      stat: "別タブ",
      meta: "word-memory",
      href: "http://localhost:3001",
      external: true,
    },
    {
      key: "transcript",
      eyebrow: "MEETING",
      title: "会議トランスクリプト",
      sub: "文字起こしのサニタイズとフラッシュカード",
      stat: "別タブ",
      meta: "transcript-memory",
      href: "http://localhost:3002",
      external: true,
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 44 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          DASHBOARD · 英検一級
        </div>
        <h1 className="page-title" style={{ fontSize: 42, maxWidth: 640 }}>
          今日の読解、
          <br />
          静かに、着実に。
        </h1>
        <p
          style={{
            color: "var(--ink-3)",
            fontSize: 15,
            marginTop: 16,
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          {wordCount.count.toLocaleString()}語の語彙、精読問題、語彙クイズ、そして間隔反復の復習ノート。
          <br />
          一つずつ、丁寧に読み進めましょう。
        </p>
      </div>

      <div className="home-grid">
        {cards.map((c) =>
          c.external ? (
            <a
              key={c.key}
              href={c.href}
              className="card hov home-card"
              target="_blank"
              rel="noreferrer"
            >
              <div className="home-card-top">
                <span className="eyebrow">{c.eyebrow}</span>
                <span className="ico">
                  <IconExt />
                </span>
              </div>
              <div className="home-card-mid">
                <h2>{c.title}</h2>
                <p>{c.sub}</p>
              </div>
              <div className="home-card-btm">
                <span className="stat">{c.stat}</span>
                <span className="meta">{c.meta}</span>
              </div>
            </a>
          ) : (
            <Link key={c.key} href={c.href} className="card hov home-card">
              <div className="home-card-top">
                <span className="eyebrow">{c.eyebrow}</span>
              </div>
              <div className="home-card-mid">
                <h2>{c.title}</h2>
                <p>{c.sub}</p>
              </div>
              <div className="home-card-btm">
                <span className="stat">{c.stat}</span>
                <span className="meta">{c.meta}</span>
              </div>
            </Link>
          )
        )}
      </div>
    </>
  );
}
