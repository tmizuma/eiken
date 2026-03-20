# Next.js / SQLite を使った英検一級 Reading Part 練習アプリの実装

eiken_grade_1.md には英検一級の単語帳のデータがあります。この単語帳からランダムに単語を抽出して、500~800words くらいの英検一級の Reading レベルの文章と、内容理解の 4 択問題を 3 問表示するような Web アプリを作成してください。

## 進捗状況

- [x] DB スキーマ設計 (`schema.sql`)
- [x] 英単語データ作成 (`seed/words/` 配下に 50 個ずつ分割した SQL ファイル × 40 = 1939 単語分。元データに 61 件の欠損あり)
- [x] 長文読解問題生成スキル作成 (`.claude/skills/eiken-reading-generator/`)
- [x] 類義語・反語データの作成 (`seed/relations/` 配下。類義語 543 ペア、反語 269 ペア)
- [x] DB ファイルの作成 (`db/master.db` にスキーマ適用 + 全 seed データ投入済み)
- [x] 長文読解問題データの作成 (スキル `/eiken-reading` で随時生成。現在 1 問作成済み)
- [ ] Next.js Web アプリの実装

## リポジトリ構成

```
eiken/
├── schema.sql                  # DB スキーマ定義
├── instruction.md              # この実装指示書
├── db/
│   └── master.db               # SQLite DB ファイル (構築済み)
├── seed/
│   ├── words/                  # 英単語 INSERT 文 (1939 語分)
│   │   ├── 1-50.sql
│   │   ├── 51-100.sql
│   │   └── ...                 # 50 個ずつ、計 40 ファイル
│   ├── relations/              # 類義語・反語 INSERT 文
│   │   ├── synonyms_1-500.sql
│   │   ├── antonyms_1-500.sql
│   │   └── ...                 # 4 範囲分 × 2 (synonyms/antonyms)
│   └── reading_comprehension/  # 長文問題 INSERT 文 (スキルで随時生成)
│       └── passage_{n}.sql
└── .claude/
    └── skills/
        └── eiken-reading-generator/  # 長文問題生成スキル
```

## DB 構成

詳細は `schema.sql` を参照。主要テーブル:

- `words` — 英単語 2000 語 (learned フラグで「覚えた」管理)
- `word_synonyms` / `word_antonyms` — 類義語・反語の中間テーブル
- `passages` — 長文パッセージ
- `passage_questions` — 設問 (1 パッセージにつき 3 問: 内容理解 2 問 + 空所補充 1 問)
- `question_choices` — 選択肢 (1 設問につき 4 択)
- `passage_words` — パッセージで使用した英検一級単語のマッピング

## Web アプリ要件

### 要件 1: 単語解説ページ

- 2000 個の単語解説ページを作成する
  - eiken_grade_1.md にある単語の解説ページ。1 ページ 1 単語
    1. 英単語 / 日本語の意味 / 発音記号 / カタカナ / 例文と例文日本語訳それぞれ二つ / 2000 この中に類似語、反語があればそれのリンク
- 「覚えた!」ボタンを追加して、これを押すと覚えたものとしてマークされる (DB の `words.learned` を更新)

### 要件 2: 単語一覧ページ

- ページネーションで 100 個ずつ一覧を表示する
- 検索バーがあり、LIKE '%<input>%' で検索できるようにする (2000 個程度なのでパフォーマンス懸念はなしとする)
- 一覧には No. / 英単語 / 日本語の意味を表示
- 英単語をクリックすると、要件 1 の解説ページに遷移

### 要件 3: 長文問題一覧ページ

- Title のみが表示されており、クリックすると要件 4 の長文クイズページに遷移する
- 50 title ずつページネーション (検索なし)

### 要件 4: 長文クイズページ

- 画面を左右に分割し、左に長文、右にクイズ (4 択問題 ×3) が表示される
- 回答ボタンを押すと、解説ページに遷移する (解説ページにどの回答を選んだかを引き継ぐ)
- クイズセクションの toggle があり、開いたり閉じたりすることができる

### 要件 5: 解説ページ

- 何問正解したかと、英文、英文の日本語訳、解説が表示される
- この長文で使用されている eiken_grade_1 の単語一覧とその意味もまとめて表示する。単語をクリックすると詳細ページに遷移できる (new tab)
- 英文の中にも 2000 英単語のものはリンク形式にして、英単語解説ページに遷移できるようにする (new tab)

---

## データ作成要件

Web アプリケーションは一部の機能を除き、あくまでビュワー (覚えたボタンのみ DB 更新が必要)。

全てのデータは DB (SQLite) に保存する。個人利用なので、`db/master.db` はこのリポジトリに直接配置して OK。

### Step 1: 英単語データ — 完了

- `schema.sql` でテーブル定義済み
- `seed/words/` 配下に 1939 単語分の INSERT 文を作成済み (元データに 61 件の欠損あり)

### Step 2: 類義語・反語データ — 完了

- `seed/relations/` 配下に INSERT 文を作成済み (INSERT OR IGNORE で冪等)
- 類義語 543 ペア (双方向 1086 行)、反語 269 ペア (双方向 538 行)

### Step 3: 長文問題データ — 完了 (随時追加可能)

- `/eiken-reading` スキルで生成可能
- トピックと単語範囲を指定すると、パッセージ + 問題 3 問の INSERT 文を `seed/reading_comprehension/` に出力する
- `learned = 1` の単語はパッセージから除外される
- 現在 1 問作成済み

### Step 4: DB 構築 — 完了

`db/master.db` に全データ投入済み。ゼロから再構築する場合:

```bash
mkdir -p db
sqlite3 db/master.db < schema.sql
for f in seed/words/*.sql; do sqlite3 db/master.db < "$f"; done
for f in seed/relations/*.sql; do sqlite3 db/master.db < "$f"; done
for f in seed/reading_comprehension/*.sql; do sqlite3 db/master.db < "$f"; done
```
