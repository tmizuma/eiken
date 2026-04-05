---
name: php-coding-conventions
description: |
  Provides PHP coding conventions and style guidelines for the mercari-api-jp repository.

  IMPORTANT: This skill is ONLY applicable when:
  - Working in the mercari-api-jp repository
  - Writing new PHP code or reviewing existing code

  Use this skill when:
  - Writing new PHP classes, methods, or functions
  - Reviewing code for style compliance
  - Understanding parameter design (required vs optional)
  - Learning import and exception documentation conventions

  Keywords: coding conventions, style guide, PHP, optional parameters, use statements, @throws, mercari-api-jp
---

# PHP Coding Conventions

Coding conventions for PHP development in mercari-api-jp.

## Table of Contents

1. [Avoid Unnecessary Optional Parameters](#avoid-unnecessary-optional-parameters)
2. [Always Import Classes](#always-import-classes)
3. [@throws Annotations](#throws-annotations)

---

## Avoid Unnecessary Optional Parameters

**All parameters should be explicitly required unless there is a clear, justified reason.**

Do not use nullable types (`?Type`) or default values (`= null`, `= []`, etc.) without a specific rationale. This ensures:
- Callers explicitly provide all necessary data
- No hidden assumptions about default behavior
- Easier to understand method contracts

```php
// Bad - Unnecessary optional parameters
function createUser(string $name, ?string $email = null, array $options = []): User
{
    // ...
}

// Good - All parameters are required
function createUser(string $name, string $email, array $options): User
{
    // ...
}
```

```php
// Bad - Default value without justification
function sendNotification(int $userId, string $message, bool $urgent = false): void
{
    // ...
}

// Good - Explicit parameter
function sendNotification(int $userId, string $message, bool $urgent): void
{
    // ...
}
```

### When Default Values ARE Acceptable

1. **Backward compatibility** - When adding parameters to existing public APIs
2. **Truly optional behavior** - When the parameter genuinely has a sensible default (e.g., pagination limit)
3. **Builder/configuration patterns** - When using fluent builders or configuration objects

```php
// Acceptable - Pagination has a sensible default
function listUsers(int $limit = 20, int $offset = 0): array
{
    // ...
}

// Acceptable - Adding new parameter to existing API for backward compatibility
// (Document why this is needed)
function legacyMethod(string $name, ?string $newParam = null): void
{
    // Added newParam in v2.0, kept optional for backward compatibility
}
```

### Document Optional Parameters

If you must use optional parameters, document the reason:

```php
/**
 * @param string|null $cacheKey Optional cache key. If null, caching is disabled.
 *                              This is intentionally optional because caching is
 *                              not always desired in batch processing contexts.
 */
function fetchData(int $id, ?string $cacheKey = null): array
{
    // ...
}
```

---

## Always Import Classes

Use `use` statements instead of fully qualified class names:

```php
// Bad - Fully qualified names
class MyService
{
    /**
     * @throws \Exception
     * @throws \InvalidArgumentException
     */
    public function process(): void
    {
        throw new \Exception('Error');
    }
}

// Good - Import with use statements
use Exception;
use InvalidArgumentException;

class MyService
{
    /**
     * @throws Exception
     * @throws InvalidArgumentException
     */
    public function process(): void
    {
        throw new Exception('Error');
    }
}
```

---

## @throws Annotations

Document all exceptions that a method may throw:

```php
use InvalidArgumentException;
use RuntimeException;
use Mercari\Exception\UserNotFoundException;

/**
 * Process user data.
 *
 * @param int $userId
 * @return User
 * @throws InvalidArgumentException If userId is negative
 * @throws UserNotFoundException If user does not exist
 * @throws RuntimeException If processing fails
 */
public function processUser(int $userId): User
{
    if ($userId < 0) {
        throw new InvalidArgumentException('User ID must be positive');
    }
    // ...
}
```

### Rules

- List each exception type that the method can throw
- Include exceptions thrown by called methods if not caught
- Use imported class names (not `\Exception`)
- Add brief description of when each exception is thrown
