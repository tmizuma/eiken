"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowR,
  IconStar,
  IconStarFill,
} from "@/lib/icons";

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

type QuizData = {
  quiz: {
    id: number;
    quiz_number: number;
    word_range: string;
  };
  questions: Question[];
};

function renderStem(sentence: string, blankWord?: string) {
  const parts = sentence.split(/(\(\s*\))/);
  return parts.map((part, i) =>
    /^\(\s*\)$/.test(part) ? (
      <span key={i} className="blank">
        {blankWord || "    "}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function VocabQuizContent({ data }: { data: QuizData }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [bookmarks, setBookmarks] = useState<Record<number, number>>(() => {
    const bm: Record<number, number> = {};
    data.questions.forEach((q) => {
      bm[q.id] = q.bookmarked;
    });
    return bm;
  });

  const question = data.questions[currentQuestion];
  const totalQuestions = data.questions.length;
  const userAnswer = answers[question.question_number];
  const isAnswered = userAnswer !== undefined;
  const isCorrect = userAnswer === question.correct_choice;
  const isLast = currentQuestion === totalQuestions - 1;

  function handleChoice(choiceNumber: number) {
    if (isAnswered) return;
    setAnswers((prev) => ({
      ...prev,
      [question.question_number]: choiceNumber,
    }));
    setShowResult(true);
  }

  function handleNext() {
    setShowResult(false);
    if (isLast) {
      const qs = data.questions
        .map((q) => `a${q.question_number}=${answers[q.question_number]}`)
        .join("&");
      router.push(`/vocab/${data.quiz.id}/result?${qs}`);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  async function toggleBookmark(questionId: number) {
    const res = await fetch(`/api/vocab-questions/${questionId}/bookmark`, {
      method: "POST",
    });
    const d = await res.json();
    setBookmarks((prev) => ({ ...prev, [questionId]: d.bookmarked }));
  }

  const progress =
    ((currentQuestion + (isAnswered ? 1 : 0)) / totalQuestions) * 100;
  const correctChoice = question.choices.find(
    (c) => c.choice_number === question.correct_choice
  );

  return (
    <>
      <div className="vq-head">
        <div>
          <div className="eyebrow">
            SET {String(data.quiz.quiz_number).padStart(2, "0")}
            {data.quiz.word_range ? ` · 単語 ${data.quiz.word_range}` : ""}
          </div>
        </div>
        <div className="vq-count">
          <span style={{ color: "var(--ink)" }}>{currentQuestion + 1}</span>
          <span style={{ color: "var(--ink-4)" }}>/{totalQuestions}</span>
        </div>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="vq-stem">
        {renderStem(
          question.sentence,
          showResult ? correctChoice?.choice_word : undefined
        )}
      </div>

      <div className="vq-choices">
        {question.choices.map((c) => {
          const chosen = userAnswer === c.choice_number;
          const isCorrectChoice = question.correct_choice === c.choice_number;
          let cls = "vq-choice";
          if (showResult) {
            if (isCorrectChoice) cls += " correct";
            else if (chosen) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button
              key={c.choice_number}
              className={cls}
              onClick={() => handleChoice(c.choice_number)}
              disabled={isAnswered}
            >
              <span className="vqc-num">{c.choice_number}</span>
              <span className="vqc-w">{c.choice_word}</span>
              {showResult && <span className="vqc-m">{c.choice_meaning}</span>}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="vq-feedback">
          <div className="vqf-head">
            <span className={`vqf-verdict ${isCorrect ? "ok" : "bad"}`}>
              {isCorrect ? "正解" : "不正解"}
            </span>
            <button
              className="star"
              aria-pressed={!!bookmarks[question.id]}
              onClick={() => toggleBookmark(question.id)}
              title={
                bookmarks[question.id] ? "ブックマーク解除" : "ブックマーク"
              }
            >
              {bookmarks[question.id] ? <IconStarFill /> : <IconStar />}
            </button>
          </div>

          {question.explanation && (
            <p className="vqf-expl">{question.explanation}</p>
          )}

          <div className="vqf-meanings">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              選択肢の意味
            </div>
            {question.choices.map((c) => (
              <div
                key={c.choice_number}
                className={`vqf-m ${
                  question.correct_choice === c.choice_number ? "correct" : ""
                }`}
              >
                <span className="vqfm-w">{c.choice_word}</span>
                <span className="vqfm-meaning">{c.choice_meaning}</span>
              </div>
            ))}
          </div>

          <button className="btn accent vq-next" onClick={handleNext}>
            {isLast ? "結果を見る" : "次へ"}{" "}
            <span className="ico">
              <IconArrowR />
            </span>
          </button>
        </div>
      )}
    </>
  );
}
