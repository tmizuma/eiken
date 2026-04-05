---
name: kb-search
description: ローカルSQLiteナレッジベースからナレッジを検索・削除・更新する。ユーザーが過去の知見・ナレッジ・メモを探している時、「前に調べた」「以前の知見」「ナレッジを検索」「KBから探して」などの文脈、またはナレッジの削除・更新を求められた時に使用する。
---

# KB Search

`~/.claude/knowledge/kb.db` からナレッジを検索・削除・更新する。

## DB初期化

DBが存在しない場合、`~/.claude/knowledge/schema.sql` を読んで実行する：

```bash
sqlite3 ~/.claude/knowledge/kb.db < ~/.claude/knowledge/schema.sql
```

## SQLの注意事項

値にシングルクォートが含まれる可能性がある。SQLリテラル内のシングルクォートは `''` にエスケープすること。

例: `It''s a test`

## 検索フロー

### 1. タグ一覧の取得

まずタグ一覧を取得し、ユーザーの質問に関連しそうなタグを特定する：

```sql
SELECT id, name FROM tags ORDER BY name;
```

タグ数は少ないのでfull scanで問題ない。

### 2. 検索条件の構築

- ユーザーが明示的にタグを指定した場合、そのタグを検索条件に含める
- タグ指定がない場合、ステップ1で取得したタグ一覧から関連しそうなタグを選ぶ

### 3. COUNTで件数確認

結果を取得する前に必ずCOUNTを実行する。`COUNT(DISTINCT k.id)` を使うこと。

タグで検索：
```sql
SELECT COUNT(DISTINCT k.id) FROM knowledge k
JOIN knowledge_tags kt ON k.id = kt.knowledge_id
JOIN tags t ON kt.tag_id = t.id
WHERE t.name IN ('tag1', 'tag2');
```

### 4. 件数に応じた対応

- **20件未満**: そのまま取得に進む
- **20件以上**: タグ内でさらにLIKEキーワードを追加して絞る。再度COUNTで確認
- **0件**: タグ検索を諦め、LIKE検索にフォールバックする：
  1. ユーザーの質問からキーワードを抽出し、LIKE条件で検索
  2. それでも0件なら、キーワードを緩くする（部分文字列にする等）

LIKE検索のCOUNT：
```sql
SELECT COUNT(1) FROM knowledge WHERE message LIKE '%keyword%';
```

### 5. 結果の取得（LIMIT/OFFSET）

件数が適切な範囲に収まったら、LIMIT 5 OFFSET 0 で取得開始：

```sql
SELECT k.id, k.title, k.description, k.message,
  GROUP_CONCAT(t.name, ', ') as tags
FROM knowledge k
LEFT JOIN knowledge_tags kt ON k.id = kt.knowledge_id
LEFT JOIN tags t ON kt.tag_id = t.id
WHERE <conditions>
GROUP BY k.id
ORDER BY k.updated_at DESC
LIMIT 5 OFFSET 0;
```

### 6. 早期終了

結果を1件ずつ確認し、ユーザーの質問に対する確信度の高い情報が見つかった時点で検索を終了し、ユーザーに提示する。全件を見る必要はない。

見つからなければ OFFSET を進めて次の5件を取得する。

## ナレッジの削除

ユーザーから削除を求められた場合：

1. 削除対象のナレッジIDを確認（検索結果から特定、または明示的に指定）
2. 対象のtitle・descriptionをユーザーに提示し、削除してよいか確認する
3. 承認されたら削除を実行：

```sql
DELETE FROM knowledge_tags WHERE knowledge_id = <id>;
DELETE FROM knowledge WHERE id = <id>;
```

## ナレッジの更新

ユーザーから更新を求められた場合：

1. 更新対象のナレッジIDを確認（検索結果から特定、または明示的に指定）
2. 変更内容をユーザーに提示し、更新してよいか確認する
3. 承認されたら更新を実行：

```sql
UPDATE knowledge SET title = 'new_title', description = 'new_desc', message = 'new_message', updated_at = datetime('now') WHERE id = <id>;
```

タグの変更が必要な場合は、紐付けを一度削除してから再登録する：

```sql
DELETE FROM knowledge_tags WHERE knowledge_id = <id>;
INSERT INTO knowledge_tags (knowledge_id, tag_id) SELECT <id>, id FROM tags WHERE name IN ('tag1', 'tag2');
```
