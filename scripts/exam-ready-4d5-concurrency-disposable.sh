#!/usr/bin/env bash
# Disposable-only two-session advisory lock contention and release test.
set -euo pipefail
DB_CONTAINER="$(docker ps --filter 'name=supabase_db_' --format '{{.Names}}' | head -1)"
[[ -n "$DB_CONTAINER" ]] || { echo 'Disposable database unavailable'; exit 1; }
LOCK="hashtext('4d4-import'),hashtext('4d5-concurrency-disposable')"
log="$(mktemp)"
holder=''
cleanup() { [[ -z "$holder" ]] || wait "$holder" 2>/dev/null || true; rm -f "$log"; }
trap cleanup EXIT
docker exec "$DB_CONTAINER" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "BEGIN; SELECT pg_advisory_xact_lock($LOCK); SELECT pg_sleep(6); COMMIT;" > "$log" 2>&1 &
holder=$!
sleep 2
result() {
  docker exec "$DB_CONTAINER" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -At -c "BEGIN; SELECT pg_try_advisory_xact_lock($LOCK); ROLLBACK;" | grep -E '^[tf]$' | head -1
}
contended="$(result)"
[[ "$contended" == 'f' ]] || { echo "Expected competing transaction blocked, got $contended"; exit 1; }
wait "$holder"
holder=''
released="$(result)"
[[ "$released" == 't' ]] || { echo "Expected lock release, got $released"; exit 1; }
echo '4D-5 advisory lock contention and release PASS'
