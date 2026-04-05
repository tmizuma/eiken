---
name: php-worktree-cleanup
description: >
  Clean up Docker resources created by the worktree-setup skill in mercari-api-jp.
  Stops and removes containers/networks, and deletes generated compose/env files.

  IMPORTANT: This skill is ONLY applicable when:
  - Working inside a mercari-api-jp git worktree
  - The worktree was set up with worktree-setup skill (compose-worktree.yaml exists)

  Use this skill when:
  - Development on a worktree branch is complete
  - Freeing up Docker resources from unused worktrees
  - Cleaning up before removing a worktree directory

  Keywords: worktree, cleanup, teardown, docker down, container stop, remove
---

# Worktree Docker Cleanup

## Usage

Run the cleanup script from the worktree project root:

```bash
bash scripts/cleanup-worktree.sh
```

## What the Script Does

1. **Stops Docker containers and removes networks** via `docker compose -f tool/test/compose-worktree.yaml down`
2. **Deletes generated files**: `tool/test/compose-worktree.yaml`, `tool/test/env-worktree`

## Manual Cleanup

```bash
docker compose -f tool/test/compose-worktree.yaml down
rm tool/test/compose-worktree.yaml tool/test/env-worktree
```

## After Cleanup

The worktree directory and git branch are left intact. Remove them manually when ready:

```bash
# From the main repo
git worktree remove /path/to/worktree
git branch -d BRANCH-NAME
git push origin --delete BRANCH-NAME
```
