# 英単語復習リスト (word-memory)

英単語の学習ログを記録し、間隔反復で復習をサポートするアプリ。

## 技術スタック

- Node.js (フレームワーク不使用、生 `http.createServer`)
- better-sqlite3 (SQLite)
- HTML テンプレートをサーバー側で直接生成 (SPA ではない)
- highlight.js (コードブロックのシンタックスハイライト)

## ディレクトリ構造

```
├── server.js          # メインサーバー (ルーティング・DB・HTML生成すべて1ファイル)
├── app.db             # SQLite データベース
├── scripts/
│   ├── shift-dates.js # 学習日の一括シフト
│   └── build-static.js
└── package.json
```

## 起動

```bash
node server.js         # localhost:3001 で起動
# または親ディレクトリから
make word-memory
make up                # app と同時起動
```

## DB スキーマ

`study_logs` テーブル1つのみ:
- `id`, `study_date` (学習日), `text` (Markdown), `created_at`, `bookmarked` (0/1)

## 主な機能

- **トップページ** (`/`): 間隔反復テーブル (1/3/7/14/30日前の学習ログ一覧)、日付オフセット移動
- **新規登録** (`/new`): 学習日 + Markdown テキストでログ作成
- **ログ一覧** (`/logs`): 全ログ表示、ブックマークフィルタ
- **ログ詳細** (`/logs/:id`): Markdown レンダリング、編集フォーム、ブックマークトグル

## アーキテクチャ特徴

- server.js に全ロジックが集約 (ルーティング・DB・HTML テンプレート)
- `layout()` 関数で共通 HTML ラッパーを提供
- フォーム送信は POST → 302 リダイレクトパターン (PRG)
