---
name: sentence-translator
description: transcript-memory アプリ (`transcript-memory/app.db`) の `sentences` テーブルから `translated=0` の行を取り出し、フラッシュカード用の自然な日本語訳を生成して `text_ja` に保存し `translated=1` を立てるスキル。`/sentence-translator` や `/sentence-translator 5` (特定 ID 指定)、「未翻訳の文を翻訳して」「フラッシュカードの和訳を作って」などで起動する。
---

# 文翻訳スキル (sentence-translator)

`transcript-memory` の詳細画面で右クリック登録された文 (`sentences` テーブル, `translated=0`) に、フラッシュカード学習用の日本語訳を付与する。

## 引数

- **指定なし** → `translated=0` の全レコードを古い順に処理
- **`<id>`** または **`<id>,<id>,...`** → そのカードのみ処理 (translated=1 でも上書き)
  - 例: `/sentence-translator 5`、`/sentence-translator 5,8,9`

## ワークフロー

### Step 0: DB 接続

DB パスは `transcript-memory/app.db`。`sentences` テーブルのスキーマ:

```
id INTEGER PK,
meeting_id INTEGER,           -- 出典 meeting (任意)
text_en TEXT NOT NULL,
text_ja TEXT,
translated INTEGER (0|1),
learned INTEGER (0|1),
created_at, updated_at
```

### Step 1: 出典コンテキストの取得 (任意だが推奨)

文だけでは曖昧な代名詞・固有名詞があるので、`meeting_id` がセットされている場合は対応する meeting のサニタイズ済み本文の前後を確認する。

```sql
SELECT s.id, s.text_en, s.meeting_id, m.title, m.transcript_sanitized
FROM sentences s
LEFT JOIN meetings m ON s.meeting_id = m.id
WHERE s.translated = 0
ORDER BY s.id ASC;
```

`transcript_sanitized` 中に `text_en` が現れるはずなので、その前後 1〜2 発話を見て話者・話題を把握する。コンテキストが取れない場合は文単独で訳す。

### Step 2: 個別ワード辞書の参照

固有名詞の表記揺れを避けるため `custom_words` を必ず確認する。

```sql
SELECT word, description FROM custom_words ORDER BY word COLLATE NOCASE;
```

`text_en` に登場する単語が辞書に含まれていれば、訳でも英語表記のまま残す (例: `Stargazer` を「スターゲイザー」とカタカナ化しない)。

### Step 3: 日本語訳の作成

フラッシュカードの表 (問題) に表示される日本語訳を作る。裏 (解答) は英文。学習者が日本語を見て英文を思い出せるよう、英文との対応関係を保ちつつ自然な日本語にする。

ガイドライン:

- **意訳しすぎない**: 英文を見たときに「なるほどこう言うのか」と気付ける程度に対応関係を保つ。
- **直訳しすぎない**: 日本語として違和感のある語順や不自然な受け身は避ける。
- **専門用語・固有名詞**: 英語のまま残してよい (custom_words の語、API 名、サービス名、技術用語など)。
- **代名詞**: 文だけで意味が通らなければコンテキストから補って明示する (例: `it` → 「その仕様」)。
- **語尾**: 砕けた会話なら「〜だね」「〜だよ」、フォーマルなら「〜です／ます」。原文のレジスタに合わせる。
- **長さ**: 改行は入れない。フラッシュカード表面は 1〜2 行で読める分量にする。

例:

```
text_en : "I think we should push the deadline to next Friday."
text_ja : 「締切は来週の金曜まで延ばすべきだと思う。」

text_en : "The Stargazer team is blocked on the API migration."
text_ja : 「Stargazer チームは API 移行で詰まってる。」
```

### Step 4: DB 更新

`better-sqlite3` で UPDATE する。1 件ずつでも良いが、同じトランザクションでまとめると速い。

```bash
cd transcript-memory && node -e "
const Database = require('better-sqlite3');
const db = new Database('app.db');
const updates = [
  { id: 5, text_ja: '締切は来週の金曜まで延ばすべきだと思う。' },
  { id: 8, text_ja: 'Stargazer チームは API 移行で詰まってる。' },
];
const stmt = db.prepare('UPDATE sentences SET text_ja=?, translated=1, updated_at=? WHERE id=?');
const now = new Date().toISOString();
const tx = db.transaction((rows) => { for (const r of rows) stmt.run(r.text_ja, now, r.id); });
tx(updates);
console.log('updated', updates.length);
"
```

### Step 5: 完了報告

各カードについて以下を 1 行で報告:

- ID
- text_en (短縮表示可)
- 生成した text_ja
- 出典 meeting_id (あれば)

最後に処理件数のサマリを出す。

## 注意事項

- `text_en` は **絶対に変更しない**。翻訳は `text_ja` 側にだけ書く。
- `translated=1` を必ずセットする (これでフラッシュカードクイズに出題対象として乗る)。
- `learned` フラグは触らない (学習進捗はユーザ操作)。
- ID 指定で再翻訳した場合は `text_ja` を上書きする。
- 解釈に余地がある文は、`meeting_id` から本文を辿って文脈を確認する。それでも判断がつかなければ最も自然な解釈を採用する。
