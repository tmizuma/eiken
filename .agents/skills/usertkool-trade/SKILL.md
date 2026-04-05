---
name: usertkool-trade
description: UserTkoolでseller/buyerを作成し、出品・購入までの一連のフローを実行する。shipping_method、eKYCなどを指定可能。
---

# UserTkool Trade Skill

Seller/Buyerを作成し、商品の出品から購入までを一括で実行するスキルです。

## Inputs

- **shipping_method** (optional): 配送方法。デフォルトは `14`（らくらく配送）。`17` はゆうゆう配送。指定なしで匿名配送なし。
- **ekyc** (optional): eKYC済みにするかどうか。デフォルトは `true`。
- **price** (optional): 商品価格。デフォルトは `1000`。
- **item_name** (optional): 商品名。デフォルトは `TestItem`。ASCII文字のみ使用すること（日本語不可）。

## Instructions

### 1. Sellerを作成

`mcp__usertkool__execute_commands` を使って Seller を作成する。

- メールアドレスは `tamizuma+seller-<5文字のランダム英数字>@mercari.com` 形式で指定する。ランダム文字列は都度生成して重複を防ぐ。
- デフォルトでは `--ekyc` フラグを付ける。
- コマンド例: `/user-tkool create tamizuma+seller-a3k9x@mercari.com --ekyc`
- レスポンスから Seller の `User ID`, `Password`, `Email` を記録する。
- **作成後、必ずポイントを50000付与する**: `/user-tkool add point <SELLER_USER_ID> 50000`

### 2. Buyerを作成

同様に Buyer を作成する。

- メールアドレスは `tamizuma+buyer-<5文字のランダム英数字>@mercari.com` 形式で指定する。ランダム文字列は都度生成して重複を防ぐ。
- デフォルトでは `--ekyc` フラグを付ける。
- コマンド例: `/user-tkool create tamizuma+buyer-f7m2p@mercari.com --ekyc`
- レスポンスから Buyer の `User ID`, `Password`, `Email` を記録する。
- **作成後、必ずポイントを50000付与する**: `/user-tkool add point <BUYER_USER_ID> 50000`

### 3. Buyerに残高を付与

Buyer が商品を購入できるよう、残高（funds）の付与を試みる。

- 付与額は商品価格以上にする（デフォルト: 商品価格 + 1000 で余裕を持たせる）。
- コマンド例: `/user-tkool add funds <BUYER_USER_ID> <amount>`
- FTAがfalseで失敗した場合は無視してよい（ステップ2で付与済みのポイントで購入可能）。

### 4. Sellerが商品を出品

Seller が商品を出品する。

- **重要: 商品名はASCII文字のみを使用すること。日本語を使うと InvisibleItemException が発生する。**
- デフォルトの配送方法は `--shippingMethod 14`（らくらく配送）。
- コマンド例: `/user-tkool sell <item_name> <price> --userID <SELLER_USER_ID> --password <SELLER_PASSWORD> --shippingMethod 14`
- レスポンスから `Item ID`（URLの末尾部分、例: `m12345678901`）を記録する。

### 5. Buyerが商品を購入

Buyer が出品された商品を購入する。

- まず `funds_paid`（残高払い）で購入を試みる。
- コマンド例: `/user-tkool buy --itemID <ITEM_ID> --buyerID <BUYER_USER_ID> --buyerPassword <BUYER_PASSWORD> --paidMethod funds_paid`
- **`funds_paid` が失敗した場合（FTAがfalse等）、`point_paid`（ポイント払い）にフォールバックする。**
- フォールバックコマンド例: `/user-tkool buy --itemID <ITEM_ID> --buyerID <BUYER_USER_ID> --buyerPassword <BUYER_PASSWORD> --paidMethod point_paid`
- レスポンスから `Transaction Evidence ID` を記録する。

### 6. 結果を表形式で出力

以下の形式で結果を出力する:

```
| 項目 | 値 |
|------|-----|
| **Seller ID** | <SELLER_USER_ID> (eKYC済み) |
| **Seller Email** | <SELLER_EMAIL> |
| **Buyer ID** | <BUYER_USER_ID> (eKYC済み) |
| **Buyer Email** | <BUYER_EMAIL> |
| **Item ID** | <ITEM_ID> |
| **Transaction Evidence ID** | <TRANSACTION_EVIDENCE_ID> |
| **Price** | <PRICE> |
| **Shipping Method** | <SHIPPING_METHOD> |
```

## Notes

- 商品名に日本語を使うと `InvisibleItemException` が発生するため、必ずASCII文字のみを使う。
- eKYC済みユーザーはFTA（資金移動口座）が有効になるため、`funds_paid` で支払いが可能。ただしdev環境ではFTAがfalseになる場合があるため、`point_paid` へのフォールバックを必ず行う。
- ユーザー作成時に必ず50000ポイントを付与することで、FTAの状態に関わらず購入が可能になる。
- 既存のユーザーをSeller/Buyerとして指定された場合は、新規作成せずにそのユーザーを使用する。
