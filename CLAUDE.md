# 英検一級 Reading Practice App

英検一級の単語学習・長文読解練習用 Web アプリ。

## プロジェクト構成

```
├── app/              # Next.js アプリ (App Router) - localhost:3000
├── word-memory/      # 英単語復習リスト (Node.js) - localhost:3001
├── db/               # SQLite データベース (master.db)
├── schema.sql        # DB スキーマ定義
├── seed/             # シードデータ (SQL)
│   ├── words/        # 単語データ (2000語)
│   ├── relations/    # 類義語・反語データ
│   └── reading_comprehension/  # 長文・設問データ
└── Makefile          # up, dev, build, db-reset コマンド
```

## よく使うコマンド

```bash
make up           # 両アプリ同時起動 (app:3000 + word-memory:3001)
make dev          # app のみ起動
make word-memory  # word-memory のみ起動
make build        # app ビルド
make db-reset     # DB を schema.sql + seed から再構築
```

## アプリケーション

### app (localhost:3000)
- 英検一級の単語一覧・詳細、長文読解クイズ
- Next.js 16 + React 19 + Tailwind CSS + better-sqlite3
- 詳細は `app/CLAUDE.md` を参照

### word-memory (localhost:3001)
- 英単語の学習ログ記録・間隔反復による復習管理
- Node.js + better-sqlite3、フレームワーク不使用 (生 HTTP サーバー)
- 詳細は `word-memory/CLAUDE.md` を参照

## データベース

- **app**: SQLite (`db/master.db`)、`better-sqlite3` で接続
- **word-memory**: SQLite (`word-memory/app.db`)、独立した DB
- スキーマ変更時は `schema.sql` を更新し、既存 DB には `ALTER TABLE` で適用する
- テーブル (app): `words`, `word_synonyms`, `word_antonyms`, `passages`, `passage_questions`, `question_choices`, `passage_words`

## 主な機能

- **単語一覧・詳細**: 2000語の閲覧、検索、覚えた/ブックマーク管理
- **長文問題**: 英文読解 + 3問のクイズ (内容理解2問 + 空所補充1問)
- **ステマー連携**: stemmer で単語の変形を検出し、長文中の該当単語をハイライト
- **英単語復習リスト**: 学習ログの記録、間隔反復 (1/3/7/14/30日) による復習管理
