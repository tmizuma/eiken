---
name: php-worktree-setup
description: >
  Set up mercari-api-jp development environment in a git worktree directory.
  Handles composer install, Docker container setup with unique names to avoid
  conflicts with other worktrees, database loading, and test execution.

  IMPORTANT: This skill is ONLY applicable when:
  - Working in a git worktree of the mercari-api-jp repository
  - The worktree needs its own Docker containers (vendor/, DB, etc.)

  Use this skill when:
  - Setting up a new worktree for development
  - Starting test containers for a worktree
  - Running tests in a worktree environment
  - Troubleshooting worktree Docker container issues

  Keywords: worktree, setup, docker, compose, environment, container, test environment
---

# Worktree Environment Setup

## Quick Setup (Automated)

Run the setup script from the worktree project root:

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/setup-worktree-env.sh [SUFFIX]
```

- `SUFFIX` is optional. Defaults to `wt-{first-two-tokens}` of the directory name (e.g., `wt-BP-6828`).
- The script must be run from the mercari-api-jp project root (`pwd`).
- `${CLAUDE_SKILL_DIR}` はこのスキルのディレクトリを指す。スクリプトはスキル内に同梱されている。
- The script performs all steps: composer install, compose file generation, container startup, and DB loading.

## What the Script Does

1. **Generates `tool/test/env-worktree`** with container-name-based host references
2. **Generates `tool/test/compose-worktree.yaml`** with unique `container_name` and project `name`
3. **Runs `composer install`** if `vendor/` is missing
4. **Starts Docker containers** via `docker compose -f tool/test/compose-worktree.yaml up -d --wait`
5. **Loads test databases** (TiDB schemas, master data, Q4M queues)

## Running Tests

```bash
MAJ_EXEC_CONTAINER=mercari-api-php84-{SUFFIX} ./tool/test/bin/api-jp-test tests/path/to/TestFile.php
```

Tip: Export for convenience:

```bash
export MAJ_EXEC_CONTAINER=mercari-api-php84-{SUFFIX}
```

## Container Management

```bash
# Stop containers
docker compose -f tool/test/compose-worktree.yaml down

# Restart containers
docker compose -f tool/test/compose-worktree.yaml up -d --wait
```

## Why This Is Needed

`tool/test/compose.yaml` has hardcoded `container_name` values (e.g., `mercari-api-db`). Multiple worktrees sharing these names would conflict. This skill generates a separate compose file with unique names per worktree, along with a matching env file so containers can discover each other.

## Naming Convention

| Resource | Pattern |
|----------|---------|
| Compose project | `mercari-api-jp-{SUFFIX}` |
| DB container | `mercari-api-db-{SUFFIX}` |
| Q4M container | `mercari-api-q4m-{SUFFIX}` |
| Memcached container | `mercari-api-memcached-{SUFFIX}` |
| PHP container | `mercari-api-php84-{SUFFIX}` |
| Docker network | `mercari-api-jp-{SUFFIX}_default` |
