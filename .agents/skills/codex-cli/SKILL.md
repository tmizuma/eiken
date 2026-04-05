---
name: codex-cli
description: OpenAI Codex CLI に関する質問に回答するスキル。Codex CLI のインストール、設定、AGENTS.md、スキル作成、MCP連携、コマンドリファレンスなどの質問に対応する。「Codex」「codex cli」「codex の使い方」「codex skills」「AGENTS.md」「codex 設定」などのキーワードで起動する。
---

# OpenAI Codex CLI ガイド

OpenAI Codex CLI に関する質問に、最新の公式ドキュメントを参照して回答する。

## 必須ワークフロー: 回答前に公式ドキュメントを参照

**すべての質問に対し、回答前に必ず以下の手順を実行すること。**

1. ユーザの質問に関連するトピックを特定する
2. WebSearch または WebFetch で最新の公式ドキュメントを取得する
3. 取得した情報に基づいて回答する
4. 回答末尾に参照した公式ドキュメントのURLを記載する

内部知識だけで回答してはならない。必ずドキュメントを確認すること。

## 公式ドキュメントURL一覧

質問のトピックに応じて、以下のURLから情報を取得する:

| トピック | URL |
|---|---|
| Codex CLI 概要 | https://developers.openai.com/codex/cli |
| コマンドリファレンス | https://developers.openai.com/codex/cli/reference |
| AGENTS.md ガイド | https://developers.openai.com/codex/guides/agents-md |
| スキル (Agent Skills) | https://developers.openai.com/codex/skills |
| 高度な設定 (config) | https://developers.openai.com/codex/config-advanced |
| モデル一覧 | https://developers.openai.com/codex/models |
| Agents SDK 連携 | https://developers.openai.com/codex/guides/agents-sdk |
| 変更履歴 | https://developers.openai.com/codex/changelog |
| GitHub リポジトリ | https://github.com/openai/codex |

## 検索戦略

- 上記URLで見つからない場合: ウェブ検索 で `site:developers.openai.com codex <キーワード>` を検索
- GitHub の実装詳細が必要な場合: ウェブ検索 で `site:github.com/openai/codex <キーワード>` を検索
- 最新の変更情報: changelog URL を WebFetch で取得

## 回答フォーマット

```
[質問への回答]

---
**参照ドキュメント:**
- [ページタイトル](URL)
```
