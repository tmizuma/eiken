---
name: php-notification-sending
description: |
  Provides patterns for sending notifications (email, push, private message, in-app) in the mercari-api-jp repository.

  IMPORTANT: This skill is ONLY applicable when:
  - Working in the mercari-api-jp repository
  - Using Mercari\Email\EmailService, PrivateMessageService, PushNotificationService, or NotificationService
  - The repository has src/Notification/ directory and NotificationServiceNotify base class

  Use this skill when:
  - Sending emails (EmailService)
  - Sending private messages (PrivateMessageService)
  - Sending push notifications (PushNotificationService)
  - Creating in-app notifications (NotificationService)
  - Implementing notification templates
  - Using Consistency keys for idempotency
  - Creating NotificationServiceNotify subclasses

  Keywords: email, push, notification, private message, EmailService, PushNotificationService, NotificationService, PrivateMessageService, mercari-api-jp, Consistency, mercari-notification-template
---

# 通知実装パターン

mercari-api-jpの通知送信パターン。

## 通知チャネル一覧

- **Email**: EmailServiceで送信
- **Private Message**: アプリ内「お知らせ」タブに表示されるメッセージ
- **In-App Notification**: アプリ内通知。Private Messageへのリンクを設定可能
- **Push Notification**: プッシュ通知。Private Messageへのリンクを設定可能

## 外部テンプレートサービス

テンプレートは `mercari-notification-template` リポジトリで管理。

## 外部テンプレート対応表

| チャネル | 外部テンプレート | UUID取得 | 備考 |
|---------|----------------|----------|------|
| Private Message | ✅ | ✅ | `ClientService::addWithTemplate()` がUUIDを返す |
| Push Notification | ✅ | - | テンプレートで `extra.id` を定義 |
| In-App Notification | ✅ | - | `getIntent()` で設定 |
| Email | ✅ | - | 制約なし |

## Email

```php
use Mercari\Email\EmailService;

(new EmailService())->sendCustomerWithTemplate(
    [$userId],                // ユーザーID配列
    'template-key',           // mercari-notification-templateのテンプレートキー
    $templateVariables,       // テンプレート変数配列
    $language,                // 'ja' or 'en'
    $consistency              // オプション: 冪等性用Consistencyオブジェクト
);
```

## Private Message

### 外部テンプレートで送信（UUIDも取得可能）

`ClientService::addWithTemplate()` は外部テンプレートを使用しつつUUIDを返すため、Push/In-App通知の遷移先としても使用可能。

```php
use Mercari\PrivateMessage\Migration\ClientService;

$client = new ClientService();
$uuid = $client->addWithTemplate(
    $user,
    'template-key',
    $templateVariables,
    $language,
    $consistency
);
// $uuid をPush/In-App通知の遷移先に使用可能
```

### privateMessageWithTemplate（UUIDが不要な場合）

```php
PrivateMessageService::privateMessageWithTemplate(
    $user,
    'template-key',
    $user->getLanguage(),
    $variables,
    $consistency
);
// 戻り値: void（UUID取得不可）
```

## Push Notification

外部テンプレートを使用。テンプレートで `privateMessageID` を `extra.id` に定義。

```php
// 1. Private Messageを送信しUUIDを取得
$uuid = $client->addWithTemplate($user, 'pm-template-key', $variables, $language, $consistency);

// 2. Push通知を送信（privateMessageIDをテンプレートに渡す）
PushNotificationService::sendPushNotificationCustomerWithTemplate(
    $user,
    $push_template_key,
    [
        'itemName' => $item->getName(),
        'privateMessageID' => $uuid,
    ],
    false,
    $consistency,
    $item,
    $language,
);
```

## In-App Notification

### 1. Notificationクラスを作成

`src/Notification/` に配置。メッセージテンプレートは `mercari-notification-template` で管理。

```php
namespace Mercari\Notification;

use Mercari\PushNotification\Entity\Intent\NewsDetailActivity;
use NotificationServiceNotify;
use Override;

class MyFeatureNotification extends NotificationServiceNotify
{
    #[Override]
    public function getArgs(): array
    {
        return [
            'variable_name' => $this->getData('variable_name'),
        ];
    }

    #[Override]
    public function getIntent(): array
    {
        $uuid = $this->getData('private_message_uuid');
        if ($uuid === null) {
            return [];
        }
        return (new NewsDetailActivity())
            ->setPrivateMessageUuid($uuid)
            ->jsonSerialize();
    }

    #[Override]
    public function getMessage()
    {
        return null;  // 外部テンプレートがメッセージを生成
    }

    #[Override]
    public function init($user_id = null): void
    {
    }

    #[Override]
    public function getConsistencyKey(): ?string
    {
        $targetDate = $this->getData('target_date');
        $entityId = $this->getData('entity_id');
        if ($targetDate === null || $entityId === null) {
            return null;
        }
        return sprintf(
            'prefix:notification:%s:%d:%s',
            $targetDate,
            $this->getUserId(),
            $entityId
        );
    }
}
```

### 2. 通知を送信

```php
$notification = new MyFeatureNotification();
$notification->setUserId($userId);
$notification->setData('variable_name', $value);
$notification->setData('target_date', $targetDate);
$notification->setData('entity_id', $entityId);
$notification->setData('private_message_uuid', $uuid);
NotificationService::notify($notification);
```

## Consistency Key（冪等性）

バッチ再実行時の重複送信を防止する。

### ConsistencyKeyFormatを定義

`src/YourFeature/ConsistencyKeyFormat.php` に機能固有のenumを作成:

```php
namespace Mercari\YourFeature;

enum ConsistencyKeyFormat: string
{
    case PRIVATE_MESSAGE = 'mercari-api-jp:notification:feature_name:pm:%s:%d:%s';
    case EMAIL = 'mercari-api-jp:notification:feature_name:email:%s:%d:%s';
    case NOTIFICATION = 'mercari-api-jp:notification:feature_name:notification:%s:%d:%s';
}
```

### Consistencyオブジェクトを作成

```php
use Mercari\Notification\Model\ConsistencyLifetimeSeconds;
use Mercari\Platform\Notification\V1\Consistency;
use Mercari\Platform\Notification\V1\Consistency\Mode as ConsistencyMode;

$consistency = new Consistency([
    'key' => sprintf($keyFormat->value, $targetDate, $userId, $entityId),
    'mode' => ConsistencyMode::AT_LEAST_ONCE,
    'lifetime_seconds' => ConsistencyLifetimeSeconds::ONE_DAY->value,
]);
```

## 実装フロー

### Push/In-App通知からPrivate Messageへ遷移させる場合

```
1. Private Messageを送信（addWithTemplate） → UUID取得
2. Push通知を送信（外部テンプレート、UUIDをprivateMessageIDとして渡す）
3. In-App通知を送信（外部テンプレート、UUIDをintentに設定）
4. Emailを送信（外部テンプレート）

全チャネルでConsistency Keyを使用
```

### Private Message単独送信の場合

```
1. Private Messageを送信（privateMessageWithTemplate）
→ UUID取得不要なのでprivateMessageWithTemplate()で十分
```

## ファイル配置

| 種類 | 配置場所 |
|------|----------|
| Notificationクラス | `src/Notification/{ClassName}.php` |
| ビジネスロジック | `src/{Feature}/` |
| ConsistencyKeyFormat | `src/{Feature}/ConsistencyKeyFormat.php` |
| メッセージキー | `app/config/messages/ja_JP/default.php` |
| テスト | `tests/{Feature}/{ClassName}Test.php` |
