---
name: skill-reviewer
description: リポジトリ内のSkillsがAnthropicベストプラクティスに準拠しているかレビューします。Skillの品質改善、構造最適化、descriptionの改善提案を行います。
---

# Skill Reviewer

`.claude/skills/`配下の Skills を Anthropic ベストプラクティスと構造的な観点からレビュー。

## 起動条件

- 「Skill をレビュー」「Skill の品質チェック」「Skill 改善」
- `/skill-reviewer`、`/skill-review`、`/review-skills`

## レビュープロセス

### Step 1: 全ファイル取得

Glob ツールと Read ツールを使用:

- `.claude/skills/**/SKILL.md` パターンで Skills 一覧を取得
- `CLAUDE.md` を読み取り

### Step 2: 4 つの観点でレビュー

1. **個別品質チェック** - 各 Skill のベストプラクティス準拠
2. **CLAUDE.md ↔ Skills 重複** - 内容の重複・不整合
3. **Skills 間重複** - 複数 Skill 間の内容重複
4. **配置適正性** - どこに書くべきかの判定

---

## 1. 個別品質チェック（Anthropic Best Practices）

### Metadata

- [ ] `name`: 64 文字以下、小文字・数字・ハイフンのみ
- [ ] `name`: 動名詞形推奨（例: `processing-pdfs`）
- [ ] `description`: 何をするか + いつ使うか
- [ ] `description`: 三人称で記述

### Conciseness

- [ ] 500 行以下
- [ ] Claude が既知の内容を説明していない
- [ ] 各段落がトークンコストを正当化できる

### Structure

- [ ] 複雑な内容は別ファイルに分離
- [ ] 参照は 1 レベルのみ
- [ ] 100 行以上なら目次がある

### Workflow

- [ ] 複雑なタスクには明確なステップ
- [ ] チェックリストで進捗追跡可能
- [ ] フィードバックループがある

---

## 2. CLAUDE.md ↔ Skills 重複チェック

### 重複パターン

| パターン           | 問題                       | 対処             |
| ------------------ | -------------------------- | ---------------- |
| **同一内容の重複** | トークン浪費、メンテ二重化 | 一箇所に集約     |
| **矛盾する記述**   | 混乱、不整合な動作         | 正確な方を残す   |
| **部分的重複**     | どちらを参照すべきか不明   | 参照関係を明確化 |

### チェック方法

1. CLAUDE.md の各セクションを抽出
2. 各 Skill の SKILL.md と比較
3. 以下を検出:
   - 同じルール/制約の記述
   - 同じコード例/パターン
   - 同じ用語定義

### 重複例

```
❌ CLAUDE.md: "新規フィールドは必ずオプショナル（?）で追加"
❌ schema-safety-guardian: "新フィールドはオプショナル（?）で追加"
→ CLAUDE.mdに残し、Skillからは「CLAUDE.mdの後方互換性ルールに従う」と参照
```

---

## 3. Skills 間重複チェック

### チェック項目

- [ ] 複数 Skill で同じコード例が存在しないか
- [ ] 複数 Skill で同じルール/制約が記述されていないか
- [ ] 複数 Skill で同じ用語説明がないか
- [ ] 責務が重複する Skill がないか

### 重複例

```
❌ api-scaffold-generator: "zodでリクエストバリデーション"
❌ schema-safety-guardian: "Zodスキーマも同時に更新"
→ 共通の「Zodバリデーションガイド」を作るか、片方から参照
```

---

## 4. 配置適正性チェック

### CLAUDE.md に書くべき内容

| 内容                     | 理由           |
| ------------------------ | -------------- |
| プロジェクト全体のルール | 常に適用される |
| 技術スタック・構成       | 文脈として必要 |
| 絶対的な禁止事項         | 例外なく適用   |
| ディレクトリ構造         | 全体理解に必要 |
| 開発コマンド             | 頻繁に使用     |

### Skills に書くべき内容

| 内容               | 理由             |
| ------------------ | ---------------- |
| 特定タスクの手順   | 必要時のみロード |
| ドメイン固有の詳細 | コンテキスト限定 |
| 長いコード例       | トークン節約     |
| チェックリスト     | タスク固有       |
| 参照ファイル一覧   | 詳細情報         |

### 誤配置パターン

| 状況                         | 問題                 | 対処                         |
| ---------------------------- | -------------------- | ---------------------------- |
| Skill にプロジェクトルール A | 常時適用されない     | CLAUDE.md へ移動             |
| CLAUDE.md に長い手順         | 常時コンテキスト消費 | Skill へ移動                 |
| Skill に他 Skill 参照情報    | Skill 間依存         | CLAUDE.md へ移動または共通化 |

---

## 評価出力テンプレート

```markdown
# Skills Review Report

## サマリー

| Skill   | 品質     | 重複 | 配置 | 総合       |
| ------- | -------- | ---- | ---- | ---------- |
| skill-a | ⭐⭐⭐   | ⚠️   | ✅   | 改善必要   |
| skill-b | ⭐⭐⭐⭐ | ✅   | ⚠️   | 軽微な改善 |

## CLAUDE.md ↔ Skills 重複

### 発見された重複

1. **[高]** CLAUDE.md L60-64 ↔ schema-safety-guardian L20-25
   - 内容: 後方互換性ルール
   - 推奨: CLAUDE.md を正とし、Skill から参照

### 矛盾する記述

- なし

## Skills 間重複

### 発見された重複

1. **[中]** api-scaffold-generator ↔ schema-safety-guardian
   - 内容: Zod スキーマ関連
   - 推奨: 共通参照を作成

## 配置の問題

### Skills に書くべき内容が CLAUDE.md にある

- なし

### CLAUDE.md に書くべき内容が Skills にある

1. **[低]** superadmin-guide L18-23
   - 内容: 認証の共通パターン
   - 推奨: 検討（頻度次第）

## 個別 Skill レビュー

### skill-a

#### 品質スコア: ⭐⭐⭐☆☆

**良い点**

- ...

**改善点**
| 項目 | 現状 | 推奨 | 優先度 |
|------|------|------|--------|
| description | "〜します" | "〜を行う" | 中 |

## アクションリスト（優先度順）

### 高優先度

1. [ ] CLAUDE.md L60-64 の内容を schema-safety-guardian から削除し参照に変更

### 中優先度

1. [ ] api-scaffold-generator と schema-safety-guardian の Zod 関連を整理

### 低優先度

1. [ ] 各 Skill の description を三人称に統一
```

---

## 優先度ガイド

| 優先度 | 基準                               |
| ------ | ---------------------------------- |
| 高     | 矛盾、重大な重複、Skill 発見に影響 |
| 中     | 部分重複、構造の問題、効率への影響 |
| 低     | 命名規則、スタイル、推奨事項       |

## 参照

- [Anthropic Skill Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- CLAUDE.md - プロジェクトルール
