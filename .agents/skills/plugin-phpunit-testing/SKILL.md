---
name: phpunit-testing
description: |
  Skill for PHPUnit testing in the mercari-api-jp repository.

  IMPORTANT: This skill is ONLY applicable when:
  - Working in the mercari-api-jp repository
  - Using ./tool/test/bin/api-jp-test for test execution
  - The repository has Mercari\Test\Mercari_PHPUnit_Framework_TestCase base class

  Use this skill when:
  - Running PHPUnit tests (api-jp-test command)
  - Creating new test files
  - Writing test cases for services, commands, or controllers
  - Using fixtures (TestDataFixture)
  - Starting/stopping test environment (api-jp-test-env)
  - Understanding test file placement conventions

  Keywords: test, PHPUnit, api-jp-test, fixture, TestCase, unit test, functional test, mercari-api-jp, Mercari_PHPUnit_Framework_TestCase, TestDataFixture
---

# PHPUnit Testing for mercari-api-jp

## Test Execution Commands

```bash
# Run specific test file (RECOMMENDED)
./tool/test/bin/api-jp-test tests/path/to/TestFile.php

# Run specific test method
./tool/test/bin/api-jp-test tests/path/to/TestFile.php --filter=testMethodName

# Start test environment if needed
./tool/test/bin/api-jp-test-env up

# Stop test environment
./tool/test/bin/api-jp-test-env down
```

## Test File Placement

| Code Location | Test Location |
|---|---|
| `src/Domain/Service.php` | `tests/Domain/ServiceTest.php` |
| `src/Command/FooCommand.php` | `tests/Command/FooCommandTest.php` |
| `app/models/user.php` | `app/tests/unit/UserTest.php` |
| Controllers | `tests/FunctionalTests/ControllerTest.php` |

## Test Framework

- **Base Class**: `\Mercari\Test\Mercari_PHPUnit_Framework_TestCase`
- **Fixtures**: `tests/Test/fixtures/tables/*.yml` with `\Mercari\Test\TestDataFixture`

## Test Structure Template

```php
<?php

declare(strict_types=1);

namespace Mercari\Tests\Domain;

use Mercari\Test\Mercari_PHPUnit_Framework_TestCase;

class ServiceTest extends Mercari_PHPUnit_Framework_TestCase
{
    public function testMethodName_normalCase(): void
    {
        // Arrange
        $service = new Service();

        // Act
        $result = $service->method();

        // Assert
        $this->assertEquals($expected, $result);
    }

    public function testMethodName_errorCase(): void
    {
        $this->expectException(SomeException::class);

        $service = new Service();
        $service->methodWithInvalidInput();
    }
}
```

## テストの粒度（新規テスト作成時の原則）

- **すべての層でテストを書く**
- **各層は直下の依存のみモックする**（2層以上下をモックしない）
- **末端層はインテグレーションテスト**（DBフィクスチャを使い実際のデータ操作を検証する）
- **各層のテストは自層の責務のみに集中する**（下位層の動作は下位層のテストで保証する）

| 層 | テストの関心事 | モック対象 |
|----|---------------|-----------|
| **Entry層**（Controller / Command） | 入力の受け取り、依存の組み立て、最終的な成否判定・レスポンス構築 | 直下の層をモック |
| **中間層**（Service / Processor） | ビジネスロジック、条件分岐、複数の下位層の制御フロー | 直下の層をモック |
| **末端層**（Repository / Executor） | 実際のDB操作、外部API呼び出し | DBはフィクスチャで実データ、外部サービスのみモック |

**既存テストファイルへの追加時**: 既存テストが上記の原則と異なるスタイル（例: Controller層でDBフィクスチャを使用）の場合は、**既存のスタイルに合わせることを優先**する。秩序を乱さないことが重要。

## ガイドライン

- **対象テストのみ実行**: 変更に関連するテストのみ実行する
- **全テスト実行を避ける**: 実行時間の都合上、ローカルでの全テスト実行は非現実的
- **PHP以外の変更時はテスト不要**: SQLスキーマ、ドキュメント、設定ファイルのみの変更ではテスト不要
- **DataProviderの活用**: 複数シナリオのテストは `@dataProvider` を使用する

## DataProvider (Table-Driven Tests) - RECOMMENDED

When testing multiple scenarios, **always prefer DataProvider** over multiple individual test methods. This approach provides:
- Better readability with clear input/output mapping
- Easier maintenance when adding new test cases
- Reduced code duplication

### Basic DataProvider Example

```php
<?php

declare(strict_types=1);

namespace Mercari\Tests\Domain;

use Mercari\Test\Mercari_PHPUnit_Framework_TestCase;
use PHPUnit\Framework\Attributes\DataProvider;

class CalculatorTest extends Mercari_PHPUnit_Framework_TestCase
{
    #[DataProvider('additionDataProvider')]
    public function testAdd(int $a, int $b, int $expected): void
    {
        $calculator = new Calculator();
        $this->assertSame($expected, $calculator->add($a, $b));
    }

    public static function additionDataProvider(): array
    {
        return [
            'positive numbers' => [1, 2, 3],
            'negative numbers' => [-1, -2, -3],
            'zero' => [0, 0, 0],
            'mixed' => [-1, 2, 1],
        ];
    }
}
```

### DataProvider with Complex Objects

```php
#[DataProvider('validationDataProvider')]
public function testValidate(array $input, bool $expectedValid, ?string $expectedError): void
{
    $validator = new Validator();
    $result = $validator->validate($input);

    $this->assertSame($expectedValid, $result->isValid());
    $this->assertSame($expectedError, $result->getError());
}

public static function validationDataProvider(): array
{
    return [
        'valid input' => [
            'input' => ['name' => 'John', 'email' => 'john@example.com'],
            'expectedValid' => true,
            'expectedError' => null,
        ],
        'missing name' => [
            'input' => ['email' => 'john@example.com'],
            'expectedValid' => false,
            'expectedError' => 'Name is required',
        ],
        'invalid email' => [
            'input' => ['name' => 'John', 'email' => 'invalid'],
            'expectedValid' => false,
            'expectedError' => 'Invalid email format',
        ],
    ];
}
```

### Exception Testing with DataProvider

```php
#[DataProvider('exceptionDataProvider')]
public function testThrowsException(mixed $input, string $expectedException): void
{
    $this->expectException($expectedException);

    $service = new Service();
    $service->process($input);
}

public static function exceptionDataProvider(): array
{
    return [
        'null input' => [null, InvalidArgumentException::class],
        'empty string' => ['', InvalidArgumentException::class],
        'negative number' => [-1, OutOfRangeException::class],
    ];
}
```

### Best Practices for DataProvider

- **Use descriptive keys** for each test case (e.g., `'valid input'`, `'missing required field'`)
- **Use named parameters** in complex cases for clarity
- **Keep data provider static** (required in PHPUnit 10+)
- **Group related scenarios** in the same data provider

## Using Fixtures

```php
use Mercari\Test\TestDataFixture;

class MyTest extends Mercari_PHPUnit_Framework_TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        TestDataFixture::load('tests/Test/fixtures/tables/my_table.yml');
    }
}
```

## Fixture File Format (YAML)

```yaml
# tests/Test/fixtures/tables/my_table.yml
my_table:
  - id: 1
    name: "Test Item"
    status: 1
    created: "2024-01-01 00:00:00"
```

## Mocking External Services

```php
use PHPUnit\Framework\MockObject\MockObject;

class MyServiceTest extends Mercari_PHPUnit_Framework_TestCase
{
    public function testWithMock(): void
    {
        /** @var ExternalService&MockObject $mock */
        $mock = $this->createMock(ExternalService::class);
        $mock->method('call')->willReturn(['success' => true]);

        $service = new MyService($mock);
        $result = $service->process();

        $this->assertTrue($result);
    }
}
```

## CI環境の FakeClientService（Mock不要なケース）

`app/config/core_ci.php` で多くの外部マイクロサービスが **FakeClientService / Stub** に差し替えられている。
これらのサービスを呼び出すコードをテストする際は、**Mock/Stubを自分で作る必要がなく、DBフィクスチャを正しく用意するだけで動作する**。

### Fakeが設定済みの主なサービス

| サービス | Fake クラス |
|---------|------------|
| PrivateMessageService | `Mercari\PrivateMessage\Migration\FakeClientService` |
| NotificationService (in-app) | `Mercari\Notification\Grpc\FakeClientService` |
| PushNotificationService | `Mercari\Push\Grpc\FakeClientService` |
| EmailService | `Mercari\Email\MicroSvc\FakeClientService` |
| Merpay Wallet | `Mercari\Merpay\Wallet\MicroSvc\FakeClientService` |
| KycService | `Mercari\KycService\MicroSvc\ClientServiceStub` |
| PubSub | `Mercari\PubSub\Adapter\MockAdapter` |

全リストは `app/config/core_ci.php` を参照（60以上のFake/Stubが登録されている）。

### 例: 通知送信のテストでMockが不要

```php
// ❌ 不要: NotificationExecutor を mock する必要はない
$mock = $this->createMock(NotificationExecutor::class);

// ✅ 正解: 実際の NotificationExecutor をそのまま使い、フィクスチャだけ用意する
$processor = new EarlyPayoutDebtReminderCommandProcessor(
    new NotificationExecutor(),       // そのまま new する
    new ReminderRecordExecutor()
);
```

### 注意: `user_applications` フィクスチャが必要

`NotificationService::notify()` は内部で `User::hasApplication(Application::MERCARI)` をチェックし、`user_applications` テーブルにレコードがなければ **通知を静かにスキップする**（エラーにならず `null` を返す）。

通知を送信するテストでは、ユーザーフィクスチャに加えて **`user_applications` レコードも必ず作成すること**:

```php
use Mercari\Application\Model\Application;
use Mercari\Application\Model\UserApplication;

private function createUser(int $user_id): void
{
    TestDataFixture::file('users')
        ->schema('default_user')
        ->with(['id' => $user_id, /* ... */])
        ->create();

    // これがないと NotificationService::notify() が通知をスキップする
    TestDataFixture::createDefaultRecord(UserApplication::TABLE_NAME, [
        'user_id'        => $user_id,
        'application_id' => Application::MERCARI,
    ]);
}
```

### Fakeが設定されていないサービスの場合

`core_ci.php` にFakeが登録されていない外部サービスを使う場合は、従来通り `$this->createMock()` でMockを作成する必要がある。

## Test Naming Conventions

- `test{MethodName}_normalCase` - Normal case (success path)
- `test{MethodName}_errorCase` - Error case (failure path)
- `test{MethodName}_{Condition}` - Specific condition
