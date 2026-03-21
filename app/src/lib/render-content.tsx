import { Fragment } from "react";
import Link from "next/link";
import { stemmer } from "stemmer";

type WordMapping = {
  id: number;
  word: string;
};

export function renderContent(content: string, words: WordMapping[]) {
  const blankReplaced = content.replace(/\[BLANK\]/g, "\u00A0______\u00A0");

  if (words.length === 0) {
    return blankReplaced.split("\n").map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </Fragment>
    ));
  }

  // 各単語の語幹をマッピング
  const stemMap = new Map<string, WordMapping>();
  for (const w of words) {
    stemMap.set(stemmer(w.word.toLowerCase()), w);
  }

  // 単語境界で分割し、各トークンの語幹でマッチ
  const tokenPattern = /(\b[a-zA-Z]+\b)/g;
  const tokens = blankReplaced.split(tokenPattern);

  return tokens.map((token, i) => {
    if (/^[a-zA-Z]+$/.test(token)) {
      const stem = stemmer(token.toLowerCase());
      const matched = stemMap.get(stem);
      if (matched) {
        return (
          <Link
            key={i}
            href={`/words/${matched.id}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            {token}
          </Link>
        );
      }
    }

    // 非単語トークン（スペース、句読点、改行等）
    return token.split("\n").map((line, j) => (
      <Fragment key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </Fragment>
    ));
  });
}
