# 英検一級 Reading Practice

英検一級レベルの単語学習と長文読解練習ができる Web アプリ。

## セットアップ

```bash
cd app && npm install
make db-reset  # DB 初期化 (初回のみ)
```

## 起動

```bash
make dev
```

http://localhost:3000

## 長文問題の追加

```
/eiken-reading-generator トピック / 単語範囲
```

例: `/eiken-reading-generator 科学 / 1-600`

### トピック一覧

| トピック | 説明 |
|---|---|
| 教育 | 教育制度・学習 |
| 科学 | 自然科学・テクノロジー |
| 心理 | 心理学・認知科学 |
| 文化 | 文化・言語・芸術 |
| メディア | 報道・ジャーナリズム |
| 歴史 | 歴史的事件・人物 |
| 経済 | 経済・金融・貿易 |
| 政治 | 政治制度・国際関係 |
| 環境 | 環境問題・気候変動 |
| 生物 | 生物学・生態系 |
| フリー | トピック自由。未使用単語を優先 |
| おまかせ | ランダム |

## 技術スタック

Next.js (App Router) / SQLite (better-sqlite3) / Tailwind CSS
