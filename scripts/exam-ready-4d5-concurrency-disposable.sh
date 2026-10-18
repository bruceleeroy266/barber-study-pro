#!/usr/bin/env bash
# Disposable Supabase only: two independent PostgreSQL sessions exercise the
# exact advisory-lock key scheme used by the 4D-4 synthetic executor.
set -euo pipefail
DB_CONTAINER="$(docker ps --filter 'name=supabase_db_' --format '{{.Names}}' | grep -E '^[tf]
[[ -n "$DB_CONTAINER" ]] || { echo 'Disposable database unavailable'; exit 1; }
KEY="4d5-concurrency-disposable"
LOCK="hashtext('4d4-import'),hashtext('$KEY')"
log="$(mktemp)"
docker exec "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c "BEGIN; SELECT pg_advisory_xact_lock($LOCK); SELECT pg_sleep(6); COMMIT;" > "$log" 2>&1 &
holder=$!
trap 'wait "$holder" 2>/dev/null || true; rm -f "$log"' EXIT
sleep 2
contended="$(docker exec "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -At -c "BEGIN; SELECT pg_try_advisory_xact_lock($LOCK); ROLLBACK;" | head -1)"
[[ "$contended" == 'f' ]] || { echo "Expected competing transaction to be blocked, got: $contended"; exit 1; }
wait "$holder"
released="$(docker exec "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -At -c "BEGIN; SELECT pg_try_advisory_xact_lock($LOCK); ROLLBACK;" | head -1)"
[[ "$released" == 't' ]] || { echo "Expected lock release after commit, got: $released"; exit 1; }
echo '4D-5 two-session advisory lock contention and release PASS (primitive only)'
 | head -1)"
[[ -n "$DB_CONTAINER" ]] || { echo 'Disposable database unavailable'; exit 1; }
KEY="4d5-concurrency-disposable"
LOCK="hashtext('4d4-import'),hashtext('$KEY')"
log="$(mktemp)"
docker exec "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c "BEGIN; SELECT pg_advisory_xact_lock($LOCK); SELECT pg_sleep(6); COMMIT;" > "$log" 2>&1 &
holder=$!
trap 'wait "$holder" 2>/dev/null || true; rm -f "$log"' EXIT
sleep 2
contended="$(docker exec "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -At -c "BEGIN; SELECT pg_try_advisory_xact_lock($LOCK); ROLLBACK;" | head -1)"
[[ "$contended" == 'f' ]] || { echo "Expected competing transaction to be blocked, got: $contended"; exit 1; }
wait "$holder"
released="$(docker exec "$DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -At -c "BEGIN; SELECT pg_try_advisory_xact_lock($LOCK); ROLLBACK;" | head -1)"
[[ "$released" == 't' ]] || { echo "Expected lock release after commit, got: $released"; exit 1; }
echo '4D-5 two-session advisory lock contention and release PASS (primitive only)'
