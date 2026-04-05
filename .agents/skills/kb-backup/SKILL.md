---
name: kb-backup
description: ローカルSQLiteナレッジベースのバックアップを作成・リストアする。ユーザーが「ナレッジのバックアップ」「KBバックアップ」「DBをダンプ」「バックアップから復元」などの文脈で使用する。
---

# KB Backup

`~/.claude/knowledge/kb.db` のバックアップを管理する。

## バックアップ作成

```bash
sqlite3 ~/.claude/knowledge/kb.db .dump > ~/.claude/knowledge/backup_$(date +%Y%m%d_%H%M%S).sql
```

## バックアップ一覧

```bash
ls -la ~/.claude/knowledge/backup_*.sql
```

## リストア

リストア前に必ずユーザーに確認する。既存DBが上書きされることを警告する。

```bash
rm -f ~/.claude/knowledge/kb.db
sqlite3 ~/.claude/knowledge/kb.db < ~/.claude/knowledge/backup_XXXXXXXX_XXXXXX.sql
```
