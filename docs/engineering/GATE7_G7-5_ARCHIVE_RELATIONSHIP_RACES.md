# G7-5 — Archive + Relationship-Race Hardening

## Goal
Make archive/send and relationship-change races deterministic while preserving historical communication evidence.

## Findings repaired

### Archive vs send
Pre-G7-5, message INSERT RLS checked that a thread was active, but a simultaneous archive and send had no shared row lock. G7-5 adds a BEFORE INSERT race guard that locks the target thread before evaluating sendability and current pair authorization.

Result:
- send locks first → the authorized message persists, then archive may follow;
- archive locks first → the later send sees archived state and is rejected;
- no ghost/lost message depends on request timing luck.

### Repeated archive
The previous runtime updated only active threads and used a single-row response. A second archive returned an error. G7-5 treats an already archived, still-authorized thread as idempotent success and rechecks persisted state after an archive race.

### Stale relationships
New actions now recheck current canonical authorization:
- message send: existing INSERT RLS + new race guard;
- archive: current pair authorization in runtime and UPDATE RLS;
- read receipt: current pair authorization in INSERT RLS;
- thread create: existing canonical pair authorization.

### Disabled/rejected stale sessions
The server messaging actor now requires approved + non-disabled profile state. SELECT policies also require an eligible same-school actor so stale direct database sessions fail closed.

## Historical evidence
Assignment removal does not delete old threads/messages. Historical SELECT remains separate from current relationship authorization for otherwise eligible same-school participants. School moves isolate old rows by school. Disabled/rejected sessions cannot continue reading through ordinary authenticated policies until eligibility is restored.

## Race rule
New action authorization is evaluated from current persisted state. If a relationship/status change commits before the new action reaches its authoritative check, the new action fails. If an authorized action wins the relevant lock/commit first, its persisted result remains valid evidence.

## Non-goals
- no message deletion/editing;
- no unarchive feature;
- no Realtime;
- no permission expansion;
- no bulletin changes;
- no Gate 8 redesign.

## Exit criteria
G7-5 is GREEN only after full exact-head CI, disposable-Supabase certification, exact-head Vercel READY, live migration apply, live trigger/RLS verification, merge, and exact production READY verification.
