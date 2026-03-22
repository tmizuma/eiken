# 英検一級 Reading Practice App

英検一級の単語学習・長文読解練習用 Web アプリ。

## プロジェクト構成

```
├── app/              # Next.js アプリ (App Router)
├── db/               # SQLite データベース (master.db)
├── schema.sql        # DB スキーマ定義
├── seed/             # シードデータ (SQL)
│   ├── words/        # 単語データ (2000語)
│   ├── relations/    # 類義語・反語データ
│   └── reading_comprehension/  # 長文・設問データ
└── Makefile          # dev, build, db-reset コマンド
```

## よく使うコマンド

```bash
make dev          # 開発サーバー起動
make build        # ビルド
make db-reset     # DB を schema.sql + seed から再構築
```

## データベース

- SQLite (`db/master.db`)、`better-sqlite3` で接続
- スキーマ変更時は `schema.sql` を更新し、既存 DB には `ALTER TABLE` で適用する
- テーブル: `words`, `word_synonyms`, `word_antonyms`, `passages`, `passage_questions`, `question_choices`, `passage_words`

## 主な機能

- **単語一覧・詳細**: 2000語の閲覧、検索、覚えた/ブックマーク管理
- **長文問題**: 英文読解 + 3問のクイズ (内容理解2問 + 空所補充1問)
- **ステマー連携**: stemmer で単語の変形を検出し、長文中の該当単語をハイライト
