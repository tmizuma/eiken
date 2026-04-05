---
name: php-batch-creating
description: |
  Guides the creation of batch commands (CLI commands for bin/console) in the mercari-api-jp repository.

  IMPORTANT: This skill is ONLY applicable when:
  - Working in the mercari-api-jp repository
  - The repository has src/Command/ directory and extends \Mercari\Console\Command
  - Using bin/console for CLI command execution

  Use this skill when:
  - Creating a new batch command (Command class extending \Mercari\Console\Command)
  - Implementing scheduled/cron jobs
  - Writing CLI commands for bin/console
  - Setting up Kubernetes CronJob definitions
  - Implementing patterns like dry-run, days-offset, DB::disconnect_all(), sleep intervals

  Keywords: batch, command, cron, scheduled job, bin/console, symfony/console, Command class, mercari-api-jp, Mercari\Console\Command
---

# バッチコマンド実装パターン

mercari-api-jpのバッチコマンド実装パターン。

## ファイル構成

実装パターンはCLAUDE.mdの「実装パターン」セクションに従う。

```
src/
├── Command/
│   └── {FeatureName}Command.php              # Entry層（CLI引数処理、依存の組み立て）
├── {Feature}/
│   ├── Command/
│   │   ├── {FeatureName}Command.php          # データ転送オブジェクト
│   │   └── {FeatureName}CommandProcessor.php  # ビジネスロジック、制御フロー
│   ├── Query/
│   │   ├── {FeatureName}Query.php            # 読み取り用データ転送オブジェクト
│   │   └── {FeatureName}QueryProcessor.php   # 対象レコード取得
│   └── Executor/
│       └── {ActionType}Executor.php          # 個別操作（必要な場合のみ）
tests/
├── Command/
│   └── {FeatureName}CommandTest.php
└── {Feature}/
    ├── Command/
    │   └── {FeatureName}CommandProcessorTest.php
    ├── Query/
    │   └── {FeatureName}QueryProcessorTest.php
    └── Executor/
        └── {ActionType}ExecutorTest.php
```

---

## Entry層（Command Class）

`src/Command/` に配置。`\Mercari\Console\Command` を継承。

```php
<?php

declare(strict_types=1);

namespace Mercari\Command;

use Mercari\Console\Command;
use Mercari\DateTime\DateTime as MercariDateTime;
use Mercari\{Feature}\Command\{FeatureName}CommandProcessor;
use Mercari\{Feature}\Query\{FeatureName}Query;
use Mercari\{Feature}\Query\{FeatureName}QueryProcessor;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class {FeatureName}Command extends Command
{
    protected function configure(): void
    {
        $this
            ->setName('mercari:{feature-name}')
            ->setDescription('Command description')
            ->addOption('days-offset', 'd', InputOption::VALUE_OPTIONAL, 'Target date offset', 0)
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Dry run mode');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $days_offset = (int) $input->getOption('days-offset');
        $dry_run = (bool) $input->getOption('dry-run');

        $target_date = MercariDateTime::now();
        if ($days_offset > 0) {
            $target_date = $target_date->subDays($days_offset);
        }

        // 依存の組み立て（Entry層の責務）
        $query_processor = new {FeatureName}QueryProcessor();
        $command_processor = new {FeatureName}CommandProcessor(
            // 必要な依存をコンストラクタで渡す
        );

        // 実行
        // ...

        return 0;
    }
}
```

### 標準オプション

| オプション | 短縮 | 説明 |
|-----------|------|------|
| `--days-offset` | `-d` | 日付オフセット（過去日付の処理用） |
| `--dry-run` | - | ドライランモード |
| `--limit` | `-l` | 処理件数制限（必要に応じて） |

---

## 重要な実装パターン

### 1. DB接続の切断

外部サービス呼び出し前にDB接続を切断する:

```php
if (!$dry_run) {
    DB::disconnect_all();
}
```

### 2. スリープインターバル

大量レコード処理時のパフォーマンス劣化を防止:

```php
if ($processed % self::SLEEP_INTERVAL === 0) {
    sleep(self::SLEEP_SECONDS);
}
```

### 3. ログ出力

CLAUDE.mdのログガイドラインに従う。バッチ処理では `notice` レベルを使用:

```php
Log::notice('Start', [
    'target_date' => $target_date_string,
    'dry_run' => $dry_run,
]);

Log::notice('End', [
    'processed' => $processed,
    'success' => $success,
    'failed' => $failed,
    'duration_sec' => round(microtime(true) - $start_time, 2),
]);
```

### 4. 再実行可能性（冪等性）

```php
if ($this->isAlreadyProcessed($record)) {
    continue;
}
$this->recordProcessed($record);  // 成功後に記録
```

### 5. コンソール出力の禁止

OutputInterfaceをServiceに渡して `writeln()` しない。`Log::notice()` のみを使用する。
理由: バッチはKubernetes上で実行され、ログはCloud Loggingで閲覧する。

---

## テスト

テストパターンの詳細は `/phpunit-testing` スキルを参照。

バッチコマンドの主なテストシナリオ:
- `testExecute_normalCase` - 正常実行
- `testExecute_dryRun` - ドライランモードでデータが変更されないことを確認

---

## コマンド実行

```bash
bin/console mercari:{feature-name}
bin/console mercari:{feature-name} --dry-run
bin/console mercari:{feature-name} --days-offset=1 --dry-run
```

---

## Kubernetes設定

デプロイ設定は [references/kubernetes.md](references/kubernetes.md) を参照。

---

## チェックリスト

### mercari-api-jp

- [ ] Commandクラスを `src/Command/` に配置
- [ ] ビジネスロジックを `src/{Feature}/` に配置
- [ ] `\Mercari\Console\Command` を継承
- [ ] `--dry-run` オプションを実装
- [ ] `--days-offset` オプションを実装（日付ベースの処理の場合）
- [ ] 開始・終了ログを出力
- [ ] 外部サービス呼び出し前に `DB::disconnect_all()` を実行
- [ ] スリープインターバルを実装（大量処理の場合）
- [ ] 再実行可能性を確保（処理済みチェック）
- [ ] テストを作成

### Kubernetes（別リポジトリ）

[references/kubernetes.md](references/kubernetes.md) のチェックリストを参照。
