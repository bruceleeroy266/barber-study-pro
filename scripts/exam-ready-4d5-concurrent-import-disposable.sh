#!/usr/bin/env bash
# Two concurrent importer transactions, synthetic 573 rows, disposable DB only.
set -euo pipefail
DB_CONTAINER="$(docker ps --filter 'name=supabase_db_' --format '{{.Names}}' | head -1)"
[[ -n "$DB_CONTAINER" ]] || exit 1
schema="exam_ready_4d5_concurrency"
psql_run() { docker exec -i "$DB_CONTAINER" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -At "$@"; }
cleanup() { psql_run -c "DROP SCHEMA IF EXISTS $schema CASCADE;" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup
psql_run -c "CREATE SCHEMA $schema; CREATE TABLE $schema.registry (source_question_id text PRIMARY KEY, prompt text NOT NULL); CREATE TABLE $schema.links (config_id text NOT NULL, source_question_id text NOT NULL REFERENCES $schema.registry(source_question_id), PRIMARY KEY(config_id,source_question_id));" >/dev/null
# Both workers execute the same insert-only 573-row transaction; advisory lock
# serializes the entire operation and prevents duplicate links/rows.
worker() {
  local output="$1"
  psql_run <<SQL >"$output" 2>&1
BEGIN;
SELECT pg_advisory_xact_lock(hashtext('4d4-import'),hashtext('4d5-test-config'));
INSERT INTO $schema.registry(source_question_id,prompt)
SELECT '4d5-concurrent-'||g::text,'Synthetic '||g FROM generate_series(1,573) g
ON CONFLICT(source_question_id) DO NOTHING;
DO \$\$ BEGIN
 IF EXISTS (SELECT 1 FROM generate_series(1,573) g LEFT JOIN $schema.registry q
 ON q.source_question_id='4d5-concurrent-'||g::text WHERE q.prompt IS DISTINCT FROM 'Synthetic '||g::text)
 THEN RAISE EXCEPTION 'Concurrent registry mismatch'; END IF;
END \$\$;
INSERT INTO $schema.links(config_id,source_question_id)
SELECT '4d5-test-config',source_question_id FROM $schema.registry
ON CONFLICT(config_id,source_question_id) DO NOTHING;
SELECT pg_sleep(1);
COMMIT;
SQL
}
a="$(mktemp)"; b="$(mktemp)"
trap 'cleanup; rm -f "$a" "$b"' EXIT
worker "$a" & pid_a=$!
worker "$b" & pid_b=$!
wait "$pid_a" || { cat "$a"; exit 1; }
wait "$pid_b" || { cat "$b"; exit 1; }
counts="$(psql_run -c "SELECT (SELECT count(*) FROM $schema.registry)::text||':'||(SELECT count(*) FROM $schema.links)::text;")"
[[ "$counts" == '573:573' ]] || { echo "Concurrent importer wrong counts: $counts"; exit 1; }
echo '4D5 two-session importer transaction serialization, 573-row idempotency PASS'
