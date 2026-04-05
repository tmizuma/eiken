---
name: kb-add
description: ローカルSQLiteナレッジベースにナレッジを登録する。ユーザーが「これを覚えて」「ナレッジとして保存」「知見を登録」「KBに追加」などの文脈で使用する。
---

# KB Add

`~/.claude/knowledge/kb.db` にナレッジを登録する。

## DB初期化

DBが存在しない場合、`~/.claude/knowledge/schema.sql` を読んで実行する：

```bash
sqlite3 ~/.claude/knowledge/kb.db < ~/.claude/knowledge/schema.sql
```

## SQLの注意事項

値にシングルクォートが含まれる可能性がある。SQLリテラル内のシングルクォートは `''` にエスケープすること。

例: `It''s a test`

## 登録フロー

### 1. ナレッジ内容の整理

ユーザーの入力から以下を構成する：
- **title**: 簡潔なタイトル
- **description**: 1-2文の概要
- **message**: ナレッジ本文（詳細な情報）
- **tags**: 関連するタグ（最低1つ必須）

### 2. 重複チェック

登録前にtitleで類似ナレッジがないか確認する：
```sql
SELECT id, title, description FROM knowledge WHERE title LIKE '%keyword%';
```

類似ナレッジが見つかった場合、ユーザーに「既存のナレッジがありますが、新規登録しますか？それとも既存を更新しますか？」と確認する。

### 3. タグの確認

既存タグ一覧を取得：
```sql
SELECT name FROM tags ORDER BY name;
```

- 既存タグに該当するものがあればそれを使う
- 新しいタグが必要な場合、**必ずユーザーに確認する**：「`xxx` というタグを新たに追加しますか？」
- ユーザーが承認したら新規タグを追加：
```sql
INSERT INTO tags (name) VALUES ('new_tag');
```
- タグは最低1つ必須。ユーザーがタグを指定しない場合、適切なタグを提案する

### 4. ナレッジの登録

```sql
INSERT INTO knowledge (title, description, message) VALUES ('title', 'desc', 'message');
```

### 5. タグの紐付け

```sql
INSERT INTO knowledge_tags (knowledge_id, tag_id)
SELECT last_insert_rowid(), id FROM tags WHERE name IN ('tag1', 'tag2');
```

### 6. 登録結果の確認

登録したナレッジをユーザーに提示して確認する。
