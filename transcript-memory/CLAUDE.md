# 会議トランスクリプト管理 (transcript-memory)

英語ミーティングの音声から文字起こしされたトランスクリプトを登録・閲覧・編集するアプリ。
登録直後は誤転写を含む raw 状態で保存され、Claude Code Skill `/transcript-sanitizer` を介して文脈特定・話者特定・誤転写修正・タイトル/日付の自動生成を行う。

## 技術スタック

- Node.js (フレームワーク不使用、生 `http.createServer`)
- better-sqlite3 (SQLite)
- HTML テンプレートをサーバー側で直接生成

## ディレクトリ構造

```
├── server.js   # サーバー全体 (ルーティング・DB・HTML)
├── app.db      # SQLite DB (起動時に自動作成)
└── package.json
```

## 起動

```bash
node server.js          # localhost:3002
make transcript-memory  # 親ディレクトリから
make up                 # 3アプリ同時起動
```

## DB スキーマ

`meetings` テーブル:

| カラム | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | 詳細画面に表示される meeting id |
| `title` | TEXT | サニタイズ後に Skill が自動生成 |
| `meeting_date` | TEXT | YYYY-MM-DD。Skill が自動推定 |
| `transcript_raw` | TEXT NOT NULL | 文字起こしそのまま |
| `transcript_sanitized` | TEXT | `Speaker: ...` 形式の整形済み本文 (英語) |
| `transcript_sanitized_ja` | TEXT | サニタイズ時に同時生成される日本語訳。行構成・話者ラベルは英語側と揃える |
| `speakers` | TEXT | JSON 配列 (例: `["Alice","Bob","unknown"]`) |
| `sanitized` | INTEGER NOT NULL DEFAULT 0 | 0=raw / 1=処理済み。詳細画面の toggle ボタンで切替可能 |
| `created_at` | TEXT NOT NULL | |
| `updated_at` | TEXT | |

`participants` テーブル (グローバル参加者リスト):

| カラム | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | |
| `name` | TEXT NOT NULL UNIQUE | サニタイズで使う正式名称 |
| `description` | TEXT | 役職・チームなど任意 |
| `created_at` | TEXT NOT NULL | |

`custom_words` テーブル (個別ワード辞書):

| カラム | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | |
| `word` | TEXT NOT NULL UNIQUE | 文字起こしで誤認識されやすい固有名詞・社内用語 |
| `description` | TEXT | 文脈ヒント。サニタイズで置換判断に使う |
| `created_at` | TEXT NOT NULL | |

`sentences` テーブル (フラッシュカード):

| カラム | 型 | 説明 |
| --- | --- | --- |
| `id` | INTEGER PK | |
| `meeting_id` | INTEGER | 出典 meeting (右クリック登録時に自動セット) |
| `text_en` | TEXT NOT NULL | 登録された英文 |
| `text_ja` | TEXT | `/sentence-translator` Skill で生成される日本語訳 |
| `translated` | INTEGER NOT NULL DEFAULT 0 | 0=未翻訳 / 1=翻訳済み。クイズ対象は `translated=1 AND learned=0` |
| `learned` | INTEGER NOT NULL DEFAULT 0 | 1=覚えた (クイズから除外、一覧から復活可能) |
| `created_at`, `updated_at` | TEXT | |

## ルーティング

- `GET /` 一覧 (filter: `unsanitized` / `sanitized`)
- `GET /new` 新規登録フォーム
- `POST /create` raw として登録 (sanitized=0)
- `GET /meetings/:id` 詳細 (話者ごとにアバター付き、EN/JA 切替、ID 表示)
- `POST /meetings/:id/edit` 更新
- `POST /meetings/:id/delete` 削除
- `GET /participants` 参加者一覧・追加フォーム
- `POST /participants/create` / `POST /participants/:id/delete`
- `GET /words` 個別ワード一覧・追加フォーム
- `POST /words/create` / `POST /words/:id/delete`
- `POST /flashcards/create` (JSON API) — 詳細画面の右クリック登録から呼ばれる
- `GET /flashcards` フラッシュカード一覧 (filter: `active`/`learned`/`untranslated`)
- `GET /flashcards/quiz` JA→EN 反転クイズ (前へ/次へ/シャッフル/覚えた)
- `GET /flashcards/:id/edit` / `POST /flashcards/:id/edit`
- `POST /flashcards/:id/delete` / `POST /flashcards/:id/toggle-learned`

## フラッシュカード登録フロー

1. 詳細画面 (EN ペイン) で文を選択 → 右クリック → 「この文をカード登録」
2. `POST /flashcards/create` が呼ばれ、`text_en` + `meeting_id` で `translated=0` のレコードが作成される
3. `/sentence-translator` Skill が `translated=0` 全件を翻訳して `text_ja` を埋める
4. クイズ画面 (`/flashcards/quiz`) で出題される (JA → クリックで EN)
5. 「覚えた」を押すと `learned=1` になりクイズから除外。一覧画面で「学習中に戻す」で復活

## サニタイズ済み本文のフォーマット

`transcript_sanitized` は1行1発話の `Speaker: utterance` 形式。連続行は前の発話の継続として扱われる。

```
Alice: Hi everyone, thanks for joining.
Bob: Sure. So about the deadline...
Alice: Yeah, I think we should push it to next Friday.
```

詳細画面では話者ごとに色分けされたアバター（イニシャル）と発話バブルで表示される。

## サニタイズの起動方法

未サニタイズの行があるときは Claude Code で `/transcript-sanitizer` を呼び出す。Skill 側が DB を読み、各レコードを更新する。
