---
name: kb-tags
description: ローカルSQLiteナレッジベースのタグ一覧を表示・検索する。ユーザーが「タグ一覧」「どんなタグがある」「タグを検索」「タグを管理」などの文脈で使用する。
---

# KB Tags

`~/.claude/knowledge/kb.db` のタグを管理・検索する。

## DB初期化

DBが存在しない場合、`~/.claude/knowledge/schema.sql` を読んで実行する：

```bash
sqlite3 ~/.claude/knowledge/kb.db < ~/.claude/knowledge/schema.sql
```

## タグ一覧の表示

各タグのナレッジ件数付きで表示する：

```sql
SELECT t.name, COUNT(kt.knowledge_id) as count
FROM tags t
LEFT JOIN knowledge_tags kt ON t.id = kt.tag_id
GROUP BY t.id
ORDER BY count DESC, t.name;
```

## タグの検索

ユーザーがキーワードでタグを探している場合：

```sql
SELECT t.name, COUNT(kt.knowledge_id) as count
FROM tags t
LEFT JOIN knowledge_tags kt ON t.id = kt.tag_id
WHERE t.name LIKE '%keyword%'
GROUP BY t.id
ORDER BY count DESC;
```

## タグの削除

ユーザーからタグ削除の要求があった場合、紐付くナレッジ件数を確認してから実行する。
ナレッジが紐付いている場合は必ずユーザーに確認する。

```sql
-- 紐付き確認
SELECT COUNT(1) FROM knowledge_tags WHERE tag_id = (SELECT id FROM tags WHERE name = 'tag_name');

-- 紐付き解除してからタグ削除
DELETE FROM knowledge_tags WHERE tag_id = (SELECT id FROM tags WHERE name = 'tag_name');
DELETE FROM tags WHERE name = 'tag_name';
```
