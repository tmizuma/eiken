#!/bin/bash
#
# mercari-api-jp worktree environment setup script
#
# Usage: bash scripts/setup-worktree-env.sh [SUFFIX]
#
# Run from the mercari-api-jp project root.
#
# SUFFIX: Short identifier for this worktree (e.g., "bp-6828").
#         Defaults to a name derived from the current directory.
#
# This script:
#   1. Generates tool/test/compose-worktree.yaml with unique container names
#   2. Generates tool/test/env-worktree with matching host references
#   3. Copies CLAUDE.md from master worktree (if available)
#   4. Runs composer install (if vendor/ is missing)
#   5. Starts Docker containers
#   6. Loads the test database

set -euo pipefail

# --- Resolve project root (use current working directory) ---
PROJECT_ROOT="$(pwd)"

# Validate that this looks like a mercari-api-jp project
if [[ ! -f "$PROJECT_ROOT/tool/test/compose.yaml" || ! -f "$PROJECT_ROOT/composer.phar" ]]; then
    echo "Error: Run this script from the mercari-api-jp project root." >&2
    exit 1
fi

# --- Determine suffix ---
if [[ -n "${1:-}" ]]; then
    SUFFIX="$1"
else
    # Derive from directory name, e.g. "BP-6828-early-payout-..." -> "wt-BP-6828"
    DIR_NAME="$(basename "$PROJECT_ROOT")"
    # Take first two dash-separated tokens (e.g. BP-6828)
    SHORT="$(echo "$DIR_NAME" | cut -d'-' -f1,2)"
    SUFFIX="wt-${SHORT}"
fi

COMPOSE_FILE="tool/test/compose-worktree.yaml"
ENV_FILE="tool/test/env-worktree"
PROJECT_NAME="mercari-api-jp-${SUFFIX}"

echo "=== Worktree Environment Setup ==="
echo "  Project root : $PROJECT_ROOT"
echo "  Suffix       : $SUFFIX"
echo "  Compose file : $COMPOSE_FILE"
echo "  Project name : $PROJECT_NAME"
echo ""

# --- 1. Generate env-worktree ---
echo ">>> Generating ${ENV_FILE} ..."

cat > "$ENV_FILE" <<EOF
DB_HOST=mercari-api-db-${SUFFIX}
MYSQL_ROOT_PASSWORD=rootpw
MYSQL_DATABASE=mercari_test
MYSQL_USER=user
MYSQL_PASSWORD=passw0rd
MERCARI_API_ENV=test
MQ_HOST=mercari-api-q4m-${SUFFIX}
MEMCACHED_HOST=mercari-api-memcached-${SUFFIX}
LOGI_MAINTENANCE_MODE_ENDPOINT_ACCESS_LIST=example@mercari.com
LOGI_AUTOMOBILE_SHIPPING_ENDPOINT_ACCESS_LIST=example@mercari.com
DD_INSTRUMENTATION_TELEMETRY_ENABLED=false
EOF

echo "    Created ${ENV_FILE}"

# --- 2. Generate compose-worktree.yaml ---
echo ">>> Generating ${COMPOSE_FILE} ..."

cat > "$COMPOSE_FILE" <<YAML
name: ${PROJECT_NAME}

services:
  db:
    image: gcr.io/mercari-coredb-tools-jp-prod/tidb:7.5.3
    container_name: mercari-api-db-${SUFFIX}
    env_file: env-worktree
    shm_size: 512m
  q4m:
    image: gcr.io/mercari-api-jp-prod/ci-q4m:v11
    container_name: mercari-api-q4m-${SUFFIX}
    env_file: env-worktree
    shm_size: 256m
    healthcheck:
      test: "mysql -h 127.0.0.1 -P 13306 -u root -p\$\$MYSQL_ROOT_PASSWORD -e 'SELECT 1;'"
      interval: 3s
      timeout: 3s
      retries: 10
      start_period: 30s
  memcached:
    image: memcached
    container_name: mercari-api-memcached-${SUFFIX}
    env_file: env-worktree
  php84:
    image: gcr.io/mercari-api-jp-prod/base84:v1.3
    container_name: mercari-api-php84-${SUFFIX}
    profiles: ["", "php84"]
    env_file: env-worktree
    depends_on:
      db:
        condition: service_started
      memcached:
        condition: service_started
      q4m:
        condition: service_healthy
    volumes:
      - \${PWD}:/opt/project
      - \${PWD}/tool/test/entrypoint.sh:/entrypoint.sh
    configs:
      - source: php_ini_84
        target: /usr/local/etc/php/conf.d/zzz-mercari.php.ini
    working_dir: /opt/project
    entrypoint: [ "/entrypoint.sh" ]
    command: sleep infinity
configs:
  php_ini_84:
    file: ./php84.php.ini

networks:
  default:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1460
YAML

echo "    Created ${COMPOSE_FILE}"

# --- 3. Copy CLAUDE.md from master worktree ---
MASTER_ROOT="$(dirname "$(dirname "$PROJECT_ROOT")")/mercari-api-jp"
if [[ -f "$MASTER_ROOT/CLAUDE.md" ]]; then
    echo ""
    echo ">>> Copying CLAUDE.md from master worktree ..."
    cp "$MASTER_ROOT/CLAUDE.md" "$PROJECT_ROOT/CLAUDE.md"
    echo "    Copied CLAUDE.md"
fi

# --- 4. Composer install ---
if [[ ! -d "vendor" ]]; then
    echo ""
    echo ">>> Running composer install ..."
    ./composer.phar -n --prefer-dist --ignore-platform-reqs install
else
    echo ""
    echo ">>> vendor/ already exists, skipping composer install"
fi

# --- 5. Start Docker containers ---
echo ""
echo ">>> Starting Docker containers ..."
docker compose -f "$COMPOSE_FILE" pull
docker compose -f "$COMPOSE_FILE" up -d --wait

# --- 6. Load test database ---
echo ""
echo ">>> Loading test database ..."

# Source worktree env for DB credentials
set -a
source "$ENV_FILE"
set +a

# Both dbsh and q4msh run mysql client FROM the Q4M container (which has mysql installed).
# TiDB container does not have a mysql client.
_dbsh() {
    docker exec -i -e MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" "${MQ_HOST}" \
        bash -c "mysql -h ${DB_HOST} -P 3306 -u root \"\$@\"" -- "$@"
}

_q4msh() {
    docker exec -i -e MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" "${MQ_HOST}" \
        bash -c "mysql -h ${MQ_HOST} -P 13306 -u root \"\$@\"" -- "$@"
}

echo "  === TiDB Setup ==="
for schema in sql/schema/*.sql; do
    db_name="mercari_test_$(basename "$schema" .sql)"
    echo "  Creating database: $db_name"
    _dbsh -e "DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name;"
    _dbsh "$db_name" < "$schema"
done

for master_file in sql/jp/*.sql; do
    basename_file=$(basename "$master_file" .sql)
    case "$basename_file" in
        jp_zip_code) target_db="mercari_test_jp_zip_code" ;;
        jp_yamato_kazai) target_db="mercari_test_yamato_kazai" ;;
        *) target_db="mercari_test_master" ;;
    esac
    echo "  Importing: $basename_file -> $target_db"
    _dbsh "$target_db" < "$master_file"
done

_dbsh -e "GRANT ALL ON *.* TO \`${MYSQL_USER}\`@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';"

echo "  === Q4M Setup ==="
_q4msh -e "
    CREATE DATABASE IF NOT EXISTS queue_mercari_test;
    USE queue_mercari_test;
    SET @drop_sql = (
        SELECT CONCAT('DROP TABLE IF EXISTS ', GROUP_CONCAT(table_name), ';')
        FROM information_schema.tables WHERE table_schema = 'queue_mercari_test'
    );
    SET @drop_sql = IFNULL(@drop_sql, 'SELECT 1;');
    PREPARE stmt FROM @drop_sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
"
_q4msh "queue_mercari_test" < "sql/queue/queue_mercari.sql"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To run tests:"
echo "  MAJ_EXEC_CONTAINER=mercari-api-php84-${SUFFIX} ./tool/test/bin/api-jp-test tests/path/to/TestFile.php"
echo ""
echo "To stop containers:"
echo "  docker compose -f ${COMPOSE_FILE} down"
