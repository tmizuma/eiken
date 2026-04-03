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
│   ├── api/                        # API routes (ローカル dev 用、静的エクスポート時は除外)
│   │   ├── words/                  # GET: 単語一覧 (検索・フィルタ対応)
│   │   │   └── [id]/
│   │   │       ├── learn/          # POST: 覚えたトグル
│   │   │       └── bookmark/       # POST: ブックマークトグル
│   │   ├── passages-list/          # GET: 長文一覧
│   │   ├── passages/[id]/          # GET: 長文詳細
│   │   │   └── done/              # POST: 完了トグル
│   │   ├── vocab-quizzes/          # GET: 語彙クイズ一覧
│   │   │   └── [id]/              # GET: 語彙クイズ詳細
│   │   └── vocab-questions/
│   │       ├── bookmarked/         # GET: ブックマーク済み問題
│   │       └── [id]/bookmark/      # POST: ブックマークトグル
│   ├── words/
│   │   ├── page.tsx                # Server Component: DB→全単語取得
│   │   ├── words-content.tsx       # Client Component: 検索・フィルタ・ページネーション
│   │   └── [id]/
│   │       ├── page.tsx            # Server Component + generateStaticParams
│   │       ├── learn-button.tsx
│   │       └── bookmark-button.tsx
│   ├── passages/
│   │   ├── page.tsx                # Server Component: DB→全長文取得
│   │   ├── passages-content.tsx    # Client Component: トピックフィルタ・ページネーション
│   │   └── [id]/
│   │       ├── page.tsx            # Server Component + generateStaticParams
│   │       ├── quiz-content.tsx    # Client Component: クイズUI
│   │       └── result/
│   │           ├── page.tsx        # Server Component: 正解データ取得
│   │           ├── result-content.tsx # Client Component: searchParams→採点表示
│   │           └── done-button.tsx
│   └── vocab/
│       ├── page.tsx                # Server Component: DB→全クイズ取得
│       ├── vocab-content.tsx       # Client Component: ページネーション
│       ├── bookmarked/
│       │   ├── page.tsx            # Server Component: ブックマーク済み問題取得
│       │   └── bookmarked-content.tsx # Client Component: 答え表示/非表示
│       └── [id]/
│           ├── page.tsx            # Server Component + generateStaticParams
│           ├── quiz-content.tsx    # Client Component: 4択クイズUI
│           └── result/
│               ├── page.tsx        # Server Component: 正解データ取得
│               ├── result-content.tsx # Client Component: searchParams→採点表示
│               └── bookmark-button.tsx
└── lib/
    ├── db.ts                       # DB 接続 (シングルトン, WAL/readonly切替)
    └── render-content.tsx          # 長文中の単語ハイライト用ユーティリティ
```

## DB 接続

`getDb()` が `../db/master.db` へのシングルトン接続を返す。WAL モード + foreign_keys ON。
- `DB_READONLY=true`: 読み取り専用モード (WAL無効化)
- `DB_PATH`: DBファイルパスの上書き

## ページ設計パターン

全ページが **Server Component (page.tsx) + Client Component (*-content.tsx)** の2層構造:

1. **Server Component**: DB から直接データ取得 → Client Component に props で渡す
2. **Client Component**: 検索・フィルタ・ページネーション・クイズ操作など UI インタラクション
3. **動的ルート**: `generateStaticParams` で全ID列挙 (静的エクスポート対応)
4. **結果ページ**: Server Component で正解データ取得、Client Component で `useSearchParams` からユーザ回答を読み取り採点

この構造により、ローカル dev (SSR) と静的エクスポート (SSG) の両方で動作する。

## API パターン (ローカル dev 用)

- トグル系 API (learn, bookmark, done) は POST で現在値を反転して返す
- 一覧 API はクエリパラメータでフィルタリング (`q`, `hide_learned`, `bookmarked`, `page`)
- レスポンスは `Response.json()` で返す
- 静的エクスポート時は API routes を一時除外してビルド

## フロントエンドパターン

- 一覧ページ: Server Component でデータ取得 → Client Component で `useSearchParams` + クライアント側フィルタ
- 詳細ページ: Server Component (async) でデータ取得
- トグルボタン: 独立した Client Component (`LearnButton`, `BookmarkButton`, `DoneButton`)
- 楽観的 UI 更新: クリック時に即座にローカル状態を更新
