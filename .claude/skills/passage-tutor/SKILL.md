---
name: passage-tutor
description: 指定した長文パッセージの内容・問題・解答を読み込み、ユーザの質問に答える家庭教師スキル。「この文の構造がわからない」「なぜこの選択肢が正解？」などの質問に対応する。/passage-tutor や「パッセージについて質問」「長文の解説」などで起動する。
---

# 長文パッセージ家庭教師

## 引数の確認

ユーザから以下のいずれかでパッセージを指定してもらう。指定がなければ確認する。

- **URL**: `http://localhost:3000/passages/30` のような形式 → ID部分を抽出
- **パッセージ番号**: `30` のような数字

## ワークフロー

### Step 1: パッセージデータの読み込み

SQLite DBからパッセージの全情報を取得する:

```bash
sqlite3 db/master.db <<'SQL'
SELECT id, title, content, content_ja FROM passages WHERE id = {id};
SQL
```

```bash
sqlite3 db/master.db <<'SQL'
SELECT pq.question_number, pq.question_type, pq.question_text, pq.explanation, pq.correct_choice,
       qc.choice_number, qc.choice_text
FROM passage_questions pq
JOIN question_choices qc ON qc.question_id = pq.id
WHERE pq.passage_id = {id}
ORDER BY pq.question_number, qc.choice_number;
SQL
```

### Step 2: 内容の把握（内部処理、出力しない）

取得したデータを内部で理解する:
- 英文本文の内容と構造
- 日本語訳
- 各問題の設問・選択肢・正解・解説

### Step 3: ユーザへの案内

以下のように簡潔に案内する:

```
「{タイトル}」を読み込みました。質問をどうぞ。
```

**重要**: この時点では解説・要約・内容説明を一切行わないこと。ユーザが質問するまで待つ。

### Step 4: 質問への回答

ユーザの質問に応じて適切に回答する。以下は想定される質問の例:

- **文構造の解説**: 特定の文やフレーズの文法構造を分解して説明
- **語彙の説明**: 単語やイディオムの意味・用法を解説
- **問題の解説**: なぜその選択肢が正解/不正解なのかを説明
- **段落の要約**: 特定の段落の内容を日本語で説明
- **文脈の理解**: 文章の論理展開や著者の主張を説明

回答時の注意:
- 英検一級レベルの学習者に適した解説を行う
- 必要に応じて英文本文や日本語訳を引用する
- 文法用語は適切に使いつつ、わかりやすく説明する
- 聞かれたことだけに答え、余計な解説を加えない
