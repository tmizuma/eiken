@AGENTS.md

# Next.js App (App Router)

## 技術スタック

- Next.js 16.2.0 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- better-sqlite3 (同期的 DB アクセス)
- stemmer (単語の語幹マッチング)

## ディレクトリ構造

```
src/
├── app/
│   ├── api/
│   │   ├── words/              # GET: 単語一覧 (検索・フィルタ対応)
│   │   │   └── [id]/
│   │   │       ├── learn/      # POST: 覚えたトグル
│   │   │       └── bookmark/   # POST: ブックマークトグル
│   │   ├── passages-list/      # GET: 長文一覧
│   │   └── passages/[id]/      # GET: 長文詳細
│   │       └── done/           # POST: 完了トグル
│   ├── words/                  # 単語一覧ページ (Client Component)
│   │   └── [id]/               # 単語詳細ページ (Server Component)
│   │       ├── learn-button.tsx
│   │       └── bookmark-button.tsx
│   └── passages/               # 長文一覧ページ
│       └── [id]/               # クイズページ
│           └── result/         # 結果ページ + DoneButton
└── lib/
    ├── db.ts                   # DB 接続 (シングルトン, WAL モード)
    └── render-content.tsx      # 長文中の単語ハイライト用ユーティリティ
```

## DB 接続

`getDb()` が `../db/master.db` へのシングルトン接続を返す。WAL モード + foreign_keys ON。

## API パターン

- トグル系 API (learn, bookmark, done) は POST で現在値を反転して返す
- 一覧 API はクエリパラメータでフィルタリング (`q`, `hide_learned`, `bookmarked`, `page`)
- レスポンスは `Response.json()` で返す

## フロントエンドパターン

- 一覧ページ: Client Component + `useSearchParams` で URL パラメータ管理
- 詳細ページ: Server Component (async) でデータ取得
- トグルボタン: 独立した Client Component (`LearnButton`, `BookmarkButton`, `DoneButton`)
- 楽観的 UI 更新: クリック時に即座にローカル状態を更新
