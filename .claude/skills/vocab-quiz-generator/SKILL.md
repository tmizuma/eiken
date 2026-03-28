# 英検一級 語彙4択問題ジェネレーター

## 引数の確認

ユーザから以下の引数を受け取る。指定がなければ確認する。

1. **単語範囲**: 例 `1-600`（words テーブルの word_number の範囲）
2. **セット数**: 生成するクイズセットの数（デフォルト: 1）

## ワークフロー

### Step 1: 英検1級語彙問題の形式

英検1級 大問1 の語彙問題は以下の形式:
- 短文（1-2文）の中に空所 `( )` が1箇所ある
- 4つの選択肢から最も適切な単語を選ぶ
- 選択肢は全て同じ品詞
- 文法問題ではなく、純粋に語彙力を問う
- 例: `The dishonest breeder left dogs in ( ) conditions.` → 1. exuberant 2. haughty 3. appalling 4. carnivorous

### Step 2: 使用済み単語の確認と正解単語の選出

1. 使用済み単語を確認:
   ```sql
   SELECT w.word_number, w.word FROM words w
   JOIN vocab_used_words vuw ON w.id = vuw.word_id
   WHERE w.word_number BETWEEN {start} AND {end};
   ```

2. 未使用かつ未習得の単語を取得（1セットにつき10語必要）:
   ```sql
   SELECT id, word_number, word, meaning, example1_en, example2_en FROM words
   WHERE word_number BETWEEN {start} AND {end}
   AND learned = 0
   AND id NOT IN (SELECT word_id FROM vocab_used_words)
   ORDER BY RANDOM() LIMIT {セット数 * 10};
   ```

3. 未使用単語が足りない場合は未習得の条件を外す:
   ```sql
   SELECT id, word_number, word, meaning, example1_en, example2_en FROM words
   WHERE word_number BETWEEN {start} AND {end}
   AND id NOT IN (SELECT word_id FROM vocab_used_words)
   ORDER BY RANDOM() LIMIT {セット数 * 10};
   ```

### Step 3: 既存クイズの確認

```sql
SELECT MAX(id) FROM vocab_quizzes;
SELECT MAX(quiz_number) FROM vocab_quizzes;
SELECT MAX(id) FROM vocab_questions;
```

### Step 4: 各問題の作成

各正解単語について以下を作成:

1. **短文**: 正解単語が自然に入る短文（1-2文）を作成。空所は `( )` で表記
   - 実在の事象・状況に基づいた自然な文
   - 空所の前後の文脈だけで正解が推測できる難易度
   - 英検1級レベルの文章

2. **誤答3つ**: 正解と同じ品詞の英単語を3つ作成
   - words テーブルの単語である必要はない
   - 英検1級レベルの語彙であること
   - 一見正解に見える巧みな誤答を含める
   - 正解と同じ品詞であること

3. **正解の配置**: 正解を1-4のいずれかにランダムに配置（偏らないように）

4. **解説文**: 以下を含む
   - なぜ正解が正しいかの説明
   - 全4つの選択肢の単語の意味（日本語）を含むこと（必須）

### Step 5: SQLファイルの出力

`seed/vocab_quiz/` 配下にSQLファイルを出力する。
ファイル名: `quiz_{連番}.sql`（既存ファイルを確認し、連番を決定）

```sql
-- vocab_quizzes テーブル
INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES
({id}, {quiz_number}, '{word_range e.g. 1~600}');

-- vocab_questions テーブル (10問)
INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
({id}, {quiz_id}, 1, '{sentence with ( )}', '{explanation}', {correct_choice}, {word_id}),
...
({id}, {quiz_id}, 10, '{sentence with ( )}', '{explanation}', {correct_choice}, {word_id});

-- vocab_question_choices テーブル (各問4択)
INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
({q_id}, 1, '{word}', '{meaning}'),
({q_id}, 2, '{word}', '{meaning}'),
({q_id}, 3, '{word}', '{meaning}'),
({q_id}, 4, '{word}', '{meaning}'),
...;

-- vocab_used_words テーブル (使用した単語の記録)
INSERT INTO vocab_used_words (word_id, quiz_id, question_id)
SELECT id, {quiz_id}, {question_id} FROM words WHERE word_number = {word_number};
...
```

**注意事項**:
- シングルクォート内のアポストロフィは `''` にエスケープ
- choice_meaning には必ず日本語の意味を入れる
- 正解番号（correct_choice）は1-4にバラけさせる

### Step 6: SQLの実行

```bash
sqlite3 db/master.db < seed/vocab_quiz/quiz_{n}.sql
```

実行後、簡単な確認クエリを実行して登録結果を表示する。
