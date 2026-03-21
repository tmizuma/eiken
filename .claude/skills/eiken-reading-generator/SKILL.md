---
name: eiken-reading-generator
description: 英検一級レベルの長文読解問題（内容理解2問＋空所補充1問）を生成し、SQLite DBに登録するスキル。ユーザからトピックと単語範囲を受け取り、指定範囲の英検一級単語を10-20語使用した500-800語の英文パッセージと4択問題3問を作成する。/eiken-reading-generator や「長文問題を作って」「reading問題を生成」などで起動する。
---

# 英検一級 長文読解問題ジェネレーター

## 引数の確認

ユーザから以下の2つの引数を受け取る。指定がなければ確認する。

1. **トピック**: 教育 / 科学 / 心理 / 文化 / メディア / 歴史 / 経済 / 政治 / 環境 / 生物 / フリー / おまかせ
   - **フリー**: トピックは自由。どの長文からも参照されていない単語を優先的に使用する
2. **単語範囲**: 例 `1-500`（eiken_grade_1.md の通し番号の範囲）

## ワークフロー

### Step 1: 出題傾向の把握

[references/eiken-reading-format.md](references/eiken-reading-format.md) を読み、英検一級の出題形式を把握する。

### Step 2: 単語の選定

1. `sqlite3 db/master.db` でDBに接続し、指定範囲の未習得単語を取得する:
   ```sql
   SELECT word_number, word, meaning FROM words
   WHERE word_number BETWEEN {start} AND {end} AND learned = 0;
   ```
   DBが未構築の場合は `eiken_grade_1.md` から読み取る（その場合learned判定はスキップ）
2. 覚えた単語（パッセージで使用禁止）の一覧も取得する:
   ```sql
   SELECT word FROM words
   WHERE word_number BETWEEN {start} AND {end} AND learned = 1;
   ```
3. **トピックが「フリー」の場合**: どの長文からも参照されていない単語を優先的に使用する。以下のクエリで未参照の単語を取得し、ここから優先的に10-20語を選ぶ:
   ```sql
   SELECT w.word_number, w.word, w.meaning FROM words w
   LEFT JOIN passage_words pw ON w.id = pw.word_id
   WHERE w.word_number BETWEEN {start} AND {end} AND w.learned = 0 AND pw.word_id IS NULL
   ORDER BY w.word_number;
   ```
   未参照単語から自然に組み込める単語を選び、それらに合うトピックを自由に決めてパッセージを作成する。未参照単語だけで足りない場合は参照済み単語も補完的に使ってよい
4. **トピックが「フリー」以外の場合**: 指定範囲の全単語に目を通した上で、トピックとの相性を考慮し、未習得単語から10-20語を選定する。リストの先頭から順に選ぶのではなく、範囲全体を把握してから最適な単語を選ぶこと
5. **重要**: 単語を使うことにこだわるあまり文章が不自然にならないこと。自然に組み込める単語のみ選ぶ

### Step 2.5: 既存タイトルの確認

パッセージを作成する前に、既存の全タイトルを確認し、似たようなテーマと重複しないようにする:
```sql
SELECT id, title, topic FROM passages ORDER BY id;
```
既存タイトルとテーマが被らない、異なる切り口のパッセージを作成すること。

### Step 3: パッセージの作成

以下の要件で英文パッセージを作成する:

- **語数**: 500-800語
- **文体**: アカデミックとジャーナリスティックの中間。一文あたりの語彙数は多め、挿入句を適度に使用
- **構成**: 導入 → 展開（複数段落）→ 結論。4-6段落構成
- **空所**: 文中1箇所に `[BLANK]` を配置。空所は句～節レベル（動詞句、名詞句、修飾節のいずれか）
- **難易度**: 英検一級レベル。抽象的・専門的な内容を含む
- **事実性**: 実在する事象・人物・研究に基づいた内容にすること。固有名詞、歴史的事実、科学的知見を捏造しない。架空の団体名・概念名・人名を使わない
- **選定した単語**: 文中に自然に組み込む。不自然な使用は避ける
- **覚えた単語の除外**: Step 2で取得した `learned = 1` の単語はパッセージ中に使用しないこと

### Step 4: 問題の作成

3問を以下の構成で作成する:

**問1 (comprehension)**: 内容理解問題
- パッセージ前半の内容に関する問題
- 設問文 + 4択。パラフレーズを活用

**問2 (comprehension)**: 内容理解問題
- パッセージ後半の内容に関する問題
- 設問文 + 4択。パラフレーズを活用

**問3 (fill_in_blank)**: 空所補充問題
- 設問文: `Choose the best option to fill in the blank [BLANK] in the passage.`
- 4択: 句～節レベルの選択肢（単語1語ではない）
- 正解は文脈の論理的な流れから導かれるもの

**ディストラクター作成の原則**:
- 一見正解に見える巧みな誤答を作る
- 部分的に正しいが全体として不正確な選択肢を含める
- 選定した英検一級単語の理解がないと解けない良問にする
- 正解のパラフレーズと、微妙にずれた表現を混ぜる

### Step 5: 日本語訳・解説の作成

- パッセージ全体の日本語訳を作成
- 各問題の解説を作成（なぜその選択肢が正解/不正解かを説明）

### Step 6: INSERT文の出力

`seed/reading_comprehension/` 配下にSQLファイルを出力する。
ファイル名: `passage_{連番}.sql`（既存ファイルを確認し、連番を決定する）

DBスキーマ (`schema.sql`) に従い、以下のテーブルへのINSERTを生成:

```sql
-- passages テーブル
INSERT INTO passages (id, title, topic, content, content_ja) VALUES
({id}, '{title}', '{topic}', '{content with [BLANK]}', '{content_ja}');

-- passage_questions テーブル (3問)
INSERT INTO passage_questions (id, passage_id, question_number, question_type, question_text, explanation, correct_choice) VALUES
({id}, {passage_id}, 1, 'comprehension', '{question}', '{explanation}', {correct}),
({id}, {passage_id}, 2, 'comprehension', '{question}', '{explanation}', {correct}),
({id}, {passage_id}, 3, 'fill_in_blank', 'Choose the best option to fill in the blank [BLANK] in the passage.', '{explanation}', {correct});

-- question_choices テーブル (各問4択)
INSERT INTO question_choices (question_id, choice_number, choice_text) VALUES
({q_id}, 1, '{choice}'),
({q_id}, 2, '{choice}'),
({q_id}, 3, '{choice}'),
({q_id}, 4, '{choice}'),
...;

-- passage_words テーブル (使用した単語のマッピング)
-- word_id は words テーブルの id（word_number ではない）
-- DBが未構築の場合はサブクエリで対応:
INSERT INTO passage_words (passage_id, word_id)
SELECT {passage_id}, id FROM words WHERE word_number = {word_number};
```

**注意事項**:
- シングルクォート内のアポストロフィは `''` にエスケープ
- passage の id は既存データと衝突しないよう、seed/reading_comprehension/ 内の既存ファイルを確認して決定
- passage_words には、実際に文中で使用した単語のみ登録

### Step 7: SQLの実行

```bash
sqlite3 db/master.db < seed/reading_comprehension/passage_{n}.sql
```

実行後、簡単な確認クエリを実行して登録結果を表示する。
