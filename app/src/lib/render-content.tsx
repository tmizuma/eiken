import { Fragment } from "react";
import Link from "next/link";
import { stemmer } from "stemmer";

type WordMapping = {
  id: number;
  word: string;
};

type HighlightOptions = {
  highlights: Set<number>;
  onRemoveGroup: (indices: number[]) => void;
};

function isWordToken(token: string) {
  return /^[a-zA-Z]+$/.test(token);
}

/** 連続するハイライト済み単語を1グループとして取得 (改行で分断) */
function findHighlightGroup(
  tokens: string[],
  clickedIdx: number,
  highlights: Set<number>
): number[] {
  if (!highlights.has(clickedIdx)) return [];
  const group = [clickedIdx];

  // 左に展開
  let pos = clickedIdx;
  while (true) {
    let prev = -1;
    for (let j = pos - 1; j >= 0; j--) {
      if (isWordToken(tokens[j])) { prev = j; break; }
      if (tokens[j].includes("\n")) break;
    }
    if (prev === -1 || !highlights.has(prev)) break;
    group.push(prev);
    pos = prev;
  }

  // 右に展開
  pos = clickedIdx;
  while (true) {
    let next = -1;
    for (let j = pos + 1; j < tokens.length; j++) {
      if (isWordToken(tokens[j])) { next = j; break; }
      if (tokens[j].includes("\n")) break;
    }
    if (next === -1 || !highlights.has(next)) break;
    group.push(next);
    pos = next;
  }

  return group;
}

/** 非単語トークンが視覚的にハイライトされるべきか (左右の単語が両方ハイライト済み) */
function shouldFillGap(
  tokens: string[],
  i: number,
  highlights: Set<number>
): boolean {
  if (tokens[i].includes("\n")) return false;

  let left = -1;
  for (let j = i - 1; j >= 0; j--) {
    if (isWordToken(tokens[j])) { left = j; break; }
    if (tokens[j].includes("\n")) return false;
  }

  let right = -1;
  for (let j = i + 1; j < tokens.length; j++) {
    if (isWordToken(tokens[j])) { right = j; break; }
    if (tokens[j].includes("\n")) return false;
  }

  return left !== -1 && right !== -1 && highlights.has(left) && highlights.has(right);
}

export function renderContent(
  content: string,
  words: WordMapping[],
  highlightOpts?: HighlightOptions
) {
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
    if (isWordToken(token)) {
      const stem = stemmer(token.toLowerCase());
      const matched = stemMap.get(stem);
      const isHighlighted = highlightOpts?.highlights.has(i);

      const hlClass = isHighlighted ? "bg-yellow-200" : "";

      const handleClick = isHighlighted && highlightOpts
        ? (e: React.MouseEvent) => {
            const sel = window.getSelection();
            if (sel && !sel.isCollapsed) return; // ドラッグ選択中はスルー
            e.preventDefault();
            const group = findHighlightGroup(tokens, i, highlightOpts.highlights);
            highlightOpts.onRemoveGroup(group);
          }
        : undefined;

      if (matched) {
        return (
          <span key={i} data-tidx={highlightOpts ? i : undefined} className={hlClass} onClick={handleClick}>
            <Link
              href={`/words/${matched.id}`}
              target="_blank"
              className="text-blue-600 underline"
              onClick={isHighlighted ? (e) => e.preventDefault() : undefined}
            >
              {token}
            </Link>
          </span>
        );
      }

      return (
        <span key={i} data-tidx={highlightOpts ? i : undefined} className={hlClass} onClick={handleClick}>
          {token}
        </span>
      );
    }

    // 非単語トークン（スペース、句読点、改行等）
    const isFilled = highlightOpts && shouldFillGap(tokens, i, highlightOpts.highlights);

    return token.split("\n").map((line, j) => (
      <Fragment key={`${i}-${j}`}>
        {j > 0 && <br />}
        {isFilled && j === 0 ? <span className="bg-yellow-200">{line}</span> : line}
      </Fragment>
    ));
  });
}

/**
 * mouseup 時に呼び出し、選択範囲内の data-tidx を持つ単語トークンのインデックスを返す。
 * 選択はクリアしない（コピペを妨げないため）。
 */
export function getSelectedTokenIndices(containerEl: HTMLElement | null): number[] {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !containerEl) return [];

  const range = sel.getRangeAt(0);
  const spans = containerEl.querySelectorAll<HTMLElement>("[data-tidx]");
  const indices: number[] = [];

  for (const span of spans) {
    if (range.intersectsNode(span)) {
      indices.push(Number(span.dataset.tidx));
    }
  }

  return indices;
}
