#!/usr/bin/env bash
# Database-enforced REPEATABLE READ snapshot isolation, disposable only.
set -euo pipefail
DB_CONTAINER="$(docker ps --filter 'name=supabase_db_' --format '{{.Names}}' | head -1)"
[[ -n "$DB_CONTAINER" ]] || exit 1
schema="exam_ready_4d5_snapshot"
sql() { docker exec -i "$DB_CONTAINER" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -At "$@"; }
cleanup() { sql -c "DROP SCHEMA IF EXISTS $schema CASCADE;" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup
sql -c "CREATE SCHEMA $schema; CREATE TABLE $schema.registry (source_question_id text PRIMARY KEY); INSERT INTO $schema.registry VALUES ('fixture-1');" >/dev/null
log="$(mktemp)"
trap 'cleanup; rm -f "$log"' EXIT
# A real database transaction must keep its snapshot despite a concurrent insert.
sql <<SQL >"$log" 2>&1 &
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT 'before:'||count(*) FROM $schema.registry;
SELECT pg_sleep(4);
SELECT 'after:'||count(*) FROM $schema.registry;
COMMIT;
SQL
reader=$!
sleep 2
sql -c "INSERT INTO $schema.registry VALUES ('fixture-2');" >/dev/null
wait "$reader"
grep -qx 'before:1' "$log" || { cat "$log"; exit 1; }
grep -qx 'after:1' "$log" || { cat "$log"; exit 1; }
count="$(sql -c "SELECT count(*) FROM $schema.registry;")"
[[ "$count" == 2 ]] || { echo "Concurrent committed row not visible to new snapshot: $count"; exit 1; }
echo '4D-5 database REPEATABLE READ consistent snapshot under concurrent insert PASS'
