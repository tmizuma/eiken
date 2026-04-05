---
name: php-linting
description: |
  Provides guidance for running and troubleshooting PHP linters (php-cs-fixer, PHPStan) in the mercari-api-jp repository.

  IMPORTANT: This skill is ONLY applicable when:
  - Working in a repository that uses php-cs-fixer and PHPStan
  - The repository has ./vendor/bin/php-cs-fixer and ./vendor/bin/phpstan
  - Files like .php-cs-fixer.php and phpstan.neon exist in the project root

  Use this skill when:
  - Running linter after completing PHP implementation (MUST run after code changes)
  - Troubleshooting PHP CS Fixer or PHPStan errors
  - Resolving specific PHPStan errors by level (type declarations, nullable types, array types)
  - Understanding php-cs-fixer configuration options
  - Fixing complex PSR-12 violations

  Keywords: php-cs-fixer, phpstan, format, lint, static analysis, PSR-12, code style, type error, mercari-api-jp
---

# PHP Code Quality Troubleshooting

This skill provides advanced troubleshooting for code quality issues. For basic commands, see Quick Reference in CLAUDE.md.

## Table of Contents

1. [PHPStan Error Resolution by Level](#phpstan-error-resolution-by-level)
2. [PHP CS Fixer Usage](#php-cs-fixer-usage)
3. [Common Error Patterns](#common-error-patterns)

---

## PHPStan Error Resolution by Level

### Level 1-2: Basic Errors

```php
// Error: Variable $foo might not be defined
// Fix: Initialize variable or add null check
$foo = $foo ?? null;
```

### Level 3-4: Return Types

```php
// Error: Method should return string but returns string|null
// Fix: Add nullable return type
function getName(): ?string { ... }

// Error: Method returns void but has return statement
// Fix: Change return type
function process(): int { return 0; }
```

### Level 5: Type Declarations (Current Standard)

```php
// Error: Parameter $data has no type hint
// Bad
function process($data) { ... }

// Good
function process(array $data): array { ... }
```

```php
// Error: Property has no type hint
// Bad
class Foo {
    private $value;
}

// Good
class Foo {
    private string $value;
}
```

### Level 6+: Strict Types (Future Goal)

```php
// Error: Cannot call method on mixed
// Fix: Add type assertion or instanceof check
if ($object instanceof User) {
    $object->getName();
}

// Or use assert
assert($object instanceof User);
$object->getName();
```

---

## Array Type Annotations

PHPStan requires precise array types:

```php
/**
 * Simple arrays
 * @param string[] $names          // Array of strings
 * @param array<int, string> $map  // Int keys, string values
 */

/**
 * Associative arrays (shapes)
 * @param array{id: int, name: string} $user
 * @param array{id: int, name?: string} $user  // Optional key
 */

/**
 * Nested arrays
 * @param array<int, array{id: int, items: string[]}> $data
 */

/**
 * Generic arrays
 * @template T
 * @param T[] $items
 * @return T|null
 */
```

---

## PHP CS Fixer Usage

### Commands

```bash
# Format all files (recommended for commit)
./composer.phar run php-cs-fixer

# Format specific file/directory
./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php src/Domain/MyClass.php

# Dry run (check without modifying)
./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --dry-run src/Domain/

# Show diff in dry run
./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --dry-run --diff src/Domain/
```

### Applied Rules

Configuration: `.php-cs-fixer.php`

| Rule Set / Rule | Description |
|-----------------|-------------|
| `@PSR12` | PSR-12 coding standard |
| `@PHP8x4Migration` | PHP 8.x migration rules |
| `no_unused_imports` | Remove unused use statements |
| `ordered_imports` | Sort imports alphabetically |
| `class_reference_name_casing` | Correct class name casing |
| `native_function_casing` | Lowercase native function names |

### Auto-Fixed Issues

| Issue | Before | After |
|-------|--------|-------|
| Import order | Random order | Alphabetical |
| Unused imports | `use Foo;` (unused) | Removed |
| Blank lines | Inconsistent | Normalized |
| Brace placement | Various | PSR-12 standard |
| Native type casing | `String`, `INT` | `string`, `int` |

### Issues NOT Auto-Fixed

These require manual intervention:

1. **Missing type declarations** - Add return types, parameter types
2. **PHPDoc errors** - Fix @param/@return mismatches
3. **Logic errors** - Dead code, unreachable statements

---

## Common Error Patterns

### 1. Nullable Type Mismatch

```php
// PHPStan: Method may return null but return type is User
// Error code: Method Foo::getUser() should return User but returns User|null

// Fix Option 1: Make return type nullable
function getUser(int $id): ?User { ... }

// Fix Option 2: Throw exception instead of returning null
function getUser(int $id): User {
    $user = $this->find($id);
    if ($user === null) {
        throw new UserNotFoundException($id);
    }
    return $user;
}
```

### 2. Mixed Type Issues

```php
// PHPStan: Cannot access property on mixed
$data = json_decode($json);
$data->id;  // Error!

// Fix: Specify type or assert
/** @var object{id: int} $data */
$data = json_decode($json);

// Or decode as array
$data = json_decode($json, true);
/** @var array{id: int} $data */
```

### 3. Dead Code Detection

```php
// PHPStan: Unreachable statement
function process(): int {
    return 1;
    $this->cleanup();  // Dead code!
}

// Fix: Remove or reorder
function process(): int {
    $this->cleanup();
    return 1;
}
```

### 4. Template Type Issues

```php
// PHPStan: Unable to resolve template type T
// Fix: Add @template annotation to class or method

/**
 * @template T of object
 * @param class-string<T> $class
 * @return T
 */
function create(string $class): object {
    return new $class();
}
```

---

## Ignoring Errors (Use Sparingly)

PHPStan 2.x uses identifier-based ignores:

```php
// Single line with identifier (PHPStan 2.x recommended)
/** @phpstan-ignore argument.type */
$result = $method($mixedValue);

// Multiple identifiers
/** @phpstan-ignore argument.type, return.type */

// With reason (preferred)
/** @phpstan-ignore argument.type (Legacy code, will be refactored in TICKET-123) */
$result = $legacyMethod();

// Legacy format (still works)
/** @phpstan-ignore-next-line */
$result = $legacyMethod();
```

**Do NOT ignore errors for new code.** Only use for legacy code with a plan to fix.

---

## 実装完了後の品質チェック手順

実装完了後、以下の手順で品質チェックを行う。

### 1. 変更されたPHPファイルを取得

```bash
git diff --name-only HEAD -- '*.php'
```

### 2. 各ファイルにリンターを実行

```bash
# 構文チェック
php -l <file>

# フォーマット
./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php <file>

# 静的解析
./vendor/bin/phpstan analyze --memory-limit=2G --no-progress <file>
```

### 3. セルフチェック（変更したPHPファイルを目視確認）

リンターでは検出できない項目を、変更したファイルを読み直して確認する。

#### 型宣言
- [ ] すべてのメソッド引数にネイティブ型宣言があるか
- [ ] すべてのメソッドに戻り値の型宣言があるか
- [ ] すべてのクラスプロパティに型宣言があるか

#### PHPDoc
- [ ] メソッドがthrowする可能性のあるすべての例外に `@throws` アノテーションがあるか（呼び出し先がthrowする例外も含む）
- [ ] ネイティブ型では不十分な場合（配列の中身の型など）にPHPDocで型を補完しているか

#### インポート
- [ ] 完全修飾クラス名ではなく `use` 文を使用しているか（`\Exception` → `use Exception;`）

#### 比較
- [ ] `==` / `!=` ではなく `===` / `!==` を使用しているか

#### 依存性の注入
- [ ] Entry層以外でクラス内部から `new` していないか（依存はコンストラクタで受け取る）

#### ログ
- [ ] `debug` 以外のログに構造化データ（第2引数の配列）があるか
- [ ] ログメッセージが先頭大文字の英語文章になっているか
- [ ] ログレベルが適切か（途中の層は `warning`、最終ハンドリングのみ `error`）
- [ ] バッチ処理では `notice`、API処理では `info` を使っているか

### 4. エラーを修正して再実行

### 5. テスト実行

`/phpunit-testing` スキルを使用してテストを実行する。
