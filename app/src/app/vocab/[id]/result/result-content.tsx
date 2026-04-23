"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { QuestionBookmarkButton } from "./bookmark-button";
import { IconBack } from "@/lib/icons";

type Choice = {
  question_id: number;
  choice_number: number;
  choice_word: string;
  choice_meaning: string;
};

type Question = {
  id: number;
  question_number: number;
  sentence: string;
  explanation: string;
  correct_choice: number;
  correct_word_id: number | null;
  bookmarked: number;
  choices: Choice[];
};

type VocabResultData = {
  quiz: { id: number; quiz_number: number; word_range: string };
  questions: Question[];
};

export function VocabResultContent({ data }: { data: VocabResultData }) {
  return (
    <Suspense fallback={<div className="empty">読み込み中…</div>}>
      <VocabResultInner data={data} />
    </Suspense>
  );
}

function VocabResultInner({ data }: { data: VocabResultData }) {
  const searchParams = useSearchParams();

  const userAnswers: Record<number, number> = {};
  for (const q of data.questions) {
    const val = searchParams.get(`a${q.question_number}`);
    if (val) userAnswers[q.question_number] = Number(val);
  }

  const correctCount = data.questions.filter(
    (q) => userAnswers[q.question_number] === q.correct_choice
  ).length;
  const rate = correctCount / data.questions.length;

  const bigColor =
    rate >= 0.8 ? "var(--ok)" : rate >= 0.5 ? "var(--ink)" : "var(--bad)";

  return (
    <>
      <Link href="/vocab" className="back-link">
        <span className="ico">
          <IconBack />
        </span>{" "}
        語彙問題一覧に戻る
      </Link>

      <div className="vr-score-section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          SET {String(data.quiz.quiz_number).padStart(2, "0")}
          {data.quiz.word_range ? ` · 単語 ${data.quiz.word_range}` : ""}
        </div>
        <h1 className="vr-title">結果</h1>
        <div className="vr-big">
          <span className="vr-correct" style={{ color: bigColor }}>
            {correctCount}
          </span>
          <span className="vr-divider">/</span>
          <span className="vr-total">{data.questions.length}</span>
        </div>
        <div className="vr-label">正解 ({Math.round(rate * 100)}%)</div>
      </div>

      <div className="word-section">
        <span className="eyebrow">振り返り</span>
        {data.questions.map((q) => {
          const userAnswer = userAnswers[q.question_number];
          const isCorrect = userAnswer === q.correct_choice;
          return (
            <div key={q.question_number} className="expl-card">
              <div className="expl-head">
                <span className={`q-mark ${isCorrect ? "ok" : "bad"}`}>
                  {isCorrect ? "O" : "X"}
                </span>
                <span className="q-label">Q{q.question_number}</span>
                <div style={{ marginLeft: "auto" }}>
                  <QuestionBookmarkButton
                    questionId={q.id}
                    initialBookmarked={q.bookmarked}
                  />
                </div>
              </div>
              <div className="vr-stem">{q.sentence}</div>
              <div className="expl-choices">
                {q.choices.map((c) => {
                  const isCorrectChoice =
                    q.correct_choice === c.choice_number;
                  const isUser = userAnswer === c.choice_number;
                  let cls = "expl-choice";
                  if (isCorrectChoice) cls += " correct";
                  else if (isUser) cls += " user-wrong";
                  else cls += " neutral";
                  return (
                    <div key={c.choice_number} className={cls}>
                      <span className="ec-num">{c.choice_number}</span>
                      <span className="ec-text">
                        <strong>{c.choice_word}</strong> — {c.choice_meaning}
                      </span>
                      {isCorrectChoice && (
                        <span className="ec-tag">[正解]</span>
                      )}
                      {isUser && !isCorrectChoice && (
                        <span className="ec-tag bad">[あなたの回答]</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="expl-text">{q.explanation}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="result-footer">
        <Link href="/vocab" className="btn primary">
          一覧に戻る
        </Link>
      </div>
    </>
  );
}
