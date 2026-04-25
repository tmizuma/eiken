---
name: transcript-sanitizer
description: transcript-memory アプリ (`transcript-memory/app.db`) の `sanitized=0` の meeting を取り出し、参加者・個別ワードを参照しながら文脈特定・話者特定・誤転写修正を行ってサニタイズ済み英語本文・日本語訳・タイトル・会議日・話者リストを自動生成して DB を更新する。`/transcript-sanitizer` や `/transcript-sanitizer 12` (特定 ID 指定)、「未サニタイズのトランスクリプトを処理して」「meeting 15 をサニタイズし直して」などで起動する。
---

# 会議トランスクリプト サニタイザー

## 目的とスタンス

- 対象ユーザは **英語学習者**。読んでストーリー・文法を正しく追えることが最優先。
- 元音声に対する 100% の忠実性は不要。**多少意味が変わっても深刻ではない**。むしろ意味不明な誤転写をそのまま残すほうが害が大きい。
- 一方で、内容が完全に虚構になるほどの大改変はしない。固有名詞・数字・主張は文脈から一意に推測できる範囲に留める。

## 引数

- **指定なし** → `sanitized=0` の全レコードを古い順に処理
- **`<id>`** または **`<id>,<id>,...`** → その meeting のみ処理 (sanitized が 1 でも対象に含み、再サニタイズとして上書きする)
  - 例: `/transcript-sanitizer 12`、`/transcript-sanitizer 12,15,20`

## 必ず最初に実行: 当該 meeting の参加者・個別ワードの読み込み

サニタイズを始める前に、以下を必ず読み込む。

### この meeting の参加者

各 meeting の参加者は `meeting_participants` 中間テーブルで紐付けられている。**この meeting に紐付いた参加者だけ** を取得する。

```bash
# {ID} は処理対象の meeting id
sqlite3 transcript-memory/app.db <<'SQL'
SELECT p.id, p.name, p.description
FROM meeting_participants mp
JOIN participants p ON p.id = mp.participant_id
WHERE mp.meeting_id = {ID}
ORDER BY p.name COLLATE NOCASE;
SQL
```

- 登録された参加者がこの会議の全出席者であり、すべての発話はこの中の誰かが行ったものとして扱う。マッピングは Step 3 で文脈から推論する。
- 取得結果が 0 件の場合はサニタイズを中止し、ユーザに「詳細画面で参加者を登録してください」と促す。ID 指定で呼ばれた場合も同様。
- 表記ゆれ (`Alice` / `Alyce` 等) は participants 側の正式名称に統一する。

### 個別ワード (グローバル)

`custom_words` はグローバル辞書。常に全件読み込む。

```bash
sqlite3 transcript-memory/app.db "SELECT id, word, description FROM custom_words ORDER BY word COLLATE NOCASE;"
```

- 社内プロジェクトコードネームや固有名詞は文字起こしで誤認識されやすい (`Mercari` → `mercury`, `Stargazer` → `stuck razor` 等)。発話文脈と発音類似度から、相当しそうな単語を custom_words から拾って置換する。`description` の文脈ヒントを必ず参照する。

## ワークフロー

### Step 0: DB 接続

DB パスは `transcript-memory/app.db` (プロジェクトルートからの相対)。`sqlite3` または `better-sqlite3` を使う。

`meetings` のスキーマ:
```
id INTEGER PK,
title TEXT, meeting_date TEXT,
transcript_raw TEXT NOT NULL,
transcript_sanitized TEXT,
transcript_sanitized_ja TEXT,
speakers TEXT,                 -- JSON array
sanitized INTEGER (0|1),
created_at TEXT, updated_at TEXT
```

### Step 1: 対象レコードの取得

引数なし:
```sql
SELECT id, transcript_raw, created_at FROM meetings WHERE sanitized = 0 ORDER BY id ASC;
```

ID 指定あり:
```sql
SELECT id, transcript_raw, created_at FROM meetings WHERE id IN (...) ORDER BY id ASC;
```

各レコードに対して Step 2 以降を実行する。

### Step 2: 文脈の特定

raw トランスクリプトを精読し、以下を読み取る。

- 何の会議か (1on1 / sprint planning / customer interview / casual chat / 技術相談 / etc.)
- ドメイン (engineering, design, sales, education, …)
- 主要トピック・議題
- 会議のおおよその雰囲気 (formal / casual)

これらは後段でのタイトル生成・誤転写修正の判断基盤になる。

### Step 3: 発話者の特定

すべての発話を登録参加者のいずれかにマップする。raw のラベル (`Speaker 1:` 等) は不正確・欠落していることが多いので、文脈から論理的に推論する。

#### 推論に使う手がかり (優先度の高い順)

1. **既存ラベルの突き合わせ**: `Alice:` / `Speaker A:` のようなラベルがあれば、発音類似 (`Sergei` ↔ `Selvey`) や一貫性 (`Speaker A` は常に同じ人) で登録参加者と紐付ける。
2. **直接の呼びかけ**: `"Amenbo, what do you think?"` の直後の発話は Amenbo の可能性が高い。ただし割り込みもあるので、続く内容と矛盾しないか確認する。
3. **一人称・自己言及**: `"I've been working on partner invoice..."` のように担当領域を述べていれば、その分野の担当者 (description 参照) が話者と推定できる。
4. **役割・スタイルの一貫性**: 説明側 (presenter)・質問側 (reviewer)・まとめ役 (manager) は原則一貫する。description の役職 (manager / tech lead / engineer 等) と整合する話者を選ぶ。
5. **第三者言及**: `"As Nagai-san said..."` のような言及があれば、その時点の話者は Nagai 以外。
6. **トピックの連続性**: 直前の発話への応答・補足が同一人物の継続か別人の応答か、内容の論理的つながりで判断する。

これらで **一人に絞り込めれば** その参加者にマップする。手がかりが矛盾する場合は、より上位の手がかりや description との整合を優先する。

#### `unknown` の用途

どの参加者かを論理的に決めきれない発話のみ **小文字 `unknown`** を使う (例: ごく短い相槌で誰の声か手がかりが無い、複数候補が等しく成立する)。手がかりがある以上は最も妥当な参加者を選ぶこと。

複数の不明話者を区別する必要がある場合のみ `unknown 1`, `unknown 2` のように番号を付ける。

#### 出力

実際に発話に登場した参加者を `["Amenbo","Sergei","Nagai","Inoue"]` のように `speakers` カラム (JSON 文字列) に保存する。`unknown` が出てきた場合のみ末尾に追加する。

### Step 4: 誤転写の修正

raw 中の以下を **原文の意図を保ちつつ** 修正する。

- 同音異義語の取り違え (`their / there / they're`, `to / too / two`)
- 単語の境界誤り、機械的な綴りミス、句読点の欠落
- 不自然な大文字小文字
- **個別ワード (custom_words) の誤認識**: 発音類似 + `description` の文脈ヒントで合致するものに置換 (例: 「mercury が新機能を出す」→ `Mercari`)。確信が持てない場合は元の表記のまま残す
- 言いよどみ (`um, uh, you know`) はテンポ感を残す程度にいくつかは保持してよいが、過剰なフィラー反復 (`I I I think...`) は1回に整理

**やらないこと**:

- 主張・結論・数字を勝手に書き換える
- 元になかった発話を捏造する
- 議論を要約・短縮する
- アメリカ英語・イギリス英語のどちらかへ強制統一する

### Step 5: タイトルと会議日の決定

- **title**: 内容を 1 行 (理想 30〜60 文字, 英語) で表す。例: `"Sprint Planning: Q2 Roadmap Alignment"`、`"1on1: Career Path Discussion with Bob"`。
- **meeting_date**: トランスクリプト中に明示的な日付が出てきたら採用 (YYYY-MM-DD)。出てこなければ `created_at` の日付部分:
  ```sql
  SELECT date(created_at) FROM meetings WHERE id = ?;
  ```

### Step 6: サニタイズ済み英語本文 (transcript_sanitized)

`Speaker: utterance` 形式で 1 発話 1 行。長い発話は段落区切りに `\n` を入れてよい。アプリの詳細表示はこの形式をパースして話者ごとにアバター付きで描画する。話者ラベルは participants に登録された正式名 or `unknown`。

```
Alice: Thanks for joining today. I want to start with the Q2 roadmap.
Bob: Sure. So my main concern is the API migration deadline.
unknown: Sorry, can you repeat that?
Alice: Right. Let's break that into two phases.
```

**Step 6 はサブエージェントに分割しないこと**。話者マッピングと custom_words 置換は全文を通した一貫性が要 (`Speaker A` が一貫して誰か、同じ語が前後で別解釈されないか) で、分割すると境界で整合が壊れる。完成したら `/tmp/transcript_sanitizer_meeting_{ID}_en.txt` に書き出してから Step 7 に進む。

### Step 7: 日本語訳 (transcript_sanitized_ja)

英語本文と **同じ行構成** で日本語訳を作る。話者ラベルは英語側と完全一致させる (アプリは行同士を独立表示するので順序ズレが起きると分かりづらくなる)。

```
Alice: 今日は集まってくれてありがとう。Q2 のロードマップから始めたい。
Bob: もちろん。気になっているのは API 移行の締切なんだ。
unknown: ごめん、もう一度言ってもらえる？
Alice: 了解。じゃあ2フェーズに分けよう。
```

訳のスタンス: 自然な日本語。直訳調にせず、英語学習者がストーリーを把握できる粒度。専門用語は英語のまま残してよい。

#### サブエージェント並列化

Step 6 が完成して話者ラベル・行構成が確定した後なので、Step 7 は **行範囲で分割して並列翻訳できる**。長い transcript はサブエージェントに分担させて高速化する。

**判断基準**: 英文の行数 (空行を除く実発話行) で判断する。

- **150 行以下** → 単一パスで翻訳 (サブエージェント起動コスト > 翻訳コスト)
- **150 行超** → `general-purpose` サブエージェントで並列化。1 サブエージェントあたり 80〜120 行を目安に 2〜4 分割する

**並列化の手順**:

1. `/tmp/transcript_sanitizer_meeting_{ID}_en.txt` を行範囲で分割し、`/tmp/transcript_sanitizer_meeting_{ID}_en_part{N}.txt` (N=1,2,...) に書き出す。分割は **必ず空行 or 話者切替の境界で行う** (発話の途中で切らない)。
2. 各サブエージェントに以下を指示する単一メッセージで並列起動 (1 メッセージ内に複数の Agent tool use):
   - 入力ファイルパス: `/tmp/transcript_sanitizer_meeting_{ID}_en_part{N}.txt`
   - 出力ファイルパス: `/tmp/transcript_sanitizer_meeting_{ID}_ja_part{N}.txt`
   - **絶対遵守の制約**:
     - 入力ファイルの行数と完全一致する出力を書く (空行は空行のまま)
     - 各行の話者ラベル (`Sergei:`, `unknown:` 等) は入力と完全一致させる。ラベル後のコロン+半角スペースも維持
     - 話者ラベル以降のテキスト部分のみを日本語訳に置換する
   - **訳のスタンス**: 自然な日本語、直訳調にしない、英語学習者がストーリーを把握できる粒度、専門用語 (API 名・コードネーム・technical term) は英語のまま残す
   - 用語統一のため custom_words のリスト (`word`, `description`) もプロンプトに含める
3. 全パートが完成したら順番に結合し、行数が英文側と一致するか **必ず検証** する:
   ```bash
   wc -l /tmp/transcript_sanitizer_meeting_{ID}_en.txt /tmp/transcript_sanitizer_meeting_{ID}_ja.txt
   ```
   一致しなければ該当パートを再実行する。
4. 結合された日本語訳を Step 8 で DB に書き込む。

### Step 8: DB 更新

`better-sqlite3` を使った Node.js ワンライナーで UPDATE する:

```bash
cd transcript-memory && node -e "
const Database = require('better-sqlite3');
const db = new Database('app.db');
db.prepare(\`UPDATE meetings
  SET title=?, meeting_date=?, transcript_sanitized=?, transcript_sanitized_ja=?, speakers=?, sanitized=1, updated_at=?
  WHERE id=?\`).run(
  'Sprint Planning: Q2 Roadmap',
  '2026-04-22',
  'Alice: ...\nBob: ...',
  'Alice: ...\nBob: ...',
  JSON.stringify(['Alice','Bob','unknown']),
  new Date().toISOString(),
  12
);
console.log('updated 12');
"
```

複数レコードを処理する場合は配列でループする。

### Step 9: 完了報告

各レコードについて以下を報告する。

- Meeting ID
- 推定したタイトル
- 推定した会議日
- 検出した話者リスト (participants にマッチしたもの / unknown)
- 個別ワード置換の例 (raw → 修正後を 2〜3 件、置換した custom_word の id とともに)
- その他主要な誤転写修正例 (2〜3 件)

最後に処理件数のサマリを出す。

## 注意事項

- `transcript_raw` は **絶対に変更しない**。サニタイズは `transcript_sanitized` / `transcript_sanitized_ja` 側にだけ書く。
- 日本語訳の行数・話者ラベルは英語側と揃える。
- 不明話者は **小文字 `unknown`** に統一する。
- 同じ meeting を再サニタイズする場合は ID 指定で実行し、`transcript_sanitized` / `transcript_sanitized_ja` / `speakers` / `title` / `meeting_date` を上書きする (`sanitized=1` のまま)。
- アプリ側 (`transcript-memory/server.js`) は `Speaker: 発話` 形式のパースに依存している。出力フォーマットを厳守すること。
- 複数レコードがある場合も、一度に 1 レコードずつ処理する。
