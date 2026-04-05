#!/bin/bash
#
# mercari-api-jp worktree Docker cleanup script
#
# Usage: bash scripts/cleanup-worktree.sh
#
# Run from the mercari-api-jp project root.
# Stops and removes Docker containers, networks, and generated files
# created by the worktree-setup skill.

set -euo pipefail

# --- Resolve project root (use current working directory) ---
PROJECT_ROOT="$(pwd)"

COMPOSE_FILE="${PROJECT_ROOT}/tool/test/compose-worktree.yaml"
ENV_FILE="${PROJECT_ROOT}/tool/test/env-worktree"

echo "=== Worktree Docker Cleanup ==="
echo "  Project root : $PROJECT_ROOT"
echo ""

# --- 1. Stop Docker containers ---
if [[ -f "$COMPOSE_FILE" ]]; then
    echo ">>> Stopping Docker containers ..."
    docker compose -f "$COMPOSE_FILE" down
    echo "    Containers, networks removed"
else
    echo ">>> No compose-worktree.yaml found, nothing to stop"
    exit 0
fi

# --- 2. Remove generated files ---
echo ""
echo ">>> Removing generated files ..."

rm -f "$COMPOSE_FILE"
echo "    Removed: tool/test/compose-worktree.yaml"

rm -f "$ENV_FILE"
echo "    Removed: tool/test/env-worktree"

echo ""
echo "=== Cleanup Complete ==="
