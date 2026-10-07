# G7-2H — Production Communications Schema Reconciliation Certification

**Project:** ASCYN PRO  
**Gate:** Gate 7 — Communications Reliability  
**Slice:** G7-2H  
**Status:** CERTIFICATION / RECONCILIATION ONLY  
**Baseline:** `main` at `6cea104a94ea70a4631e80f9ecdefd75b94a6e8d`

## Production drift confirmed

Current application runtime expects the COM-2 generic two-participant model, but live Supabase remains on the older COM-1 student/instructor-only communication schema.

Live production evidence before reconciliation:
- communication threads: 0
- communication messages: 0
- communication message reads: 0
- bulletins: 0
- bulletin acknowledgments: 0
- no live `participant_one_id` / `participant_two_id` columns
- no live COM-2 canonical authorization helper
- legacy COM-1 thread/message/read RLS still active

## Certified reconciliation set

Apply exactly, in this order:

1. `20261003220000_com2c_database_rls_enforcement.sql`
2. `20261004011000_com2h_messaging_audit_failure_hardening.sql`
3. `20261004022000_com2_heavy_audit_archive_authorization.sql`

Do not replay COM-1 foundation migrations.

## Why the set is forward-safe

- COM-2C uses additive participant columns and backfills from legacy student/instructor evidence.
- Legacy student/instructor columns become nullable but remain preserved for compatible historical rows.
- Current production communication tables contain zero rows, eliminating data-conversion ambiguity for this reconciliation.
- Message/read evidence tables are not dropped or truncated.
- Read-receipt uniqueness is preserved.
- Bulletin tables are not altered by COM-2C.
- COM-2H only replaces/enriches the communication thread audit trigger.
- The heavy-audit migration only narrows thread UPDATE authorization to approved, active instructors and archived status.
- Ordinary authenticated clients retain least-privilege grants.

## Required exact-head certification before production apply

- TypeScript passes.
- Changed-file lint passes.
- Unit/regression tests pass.
- Production build passes.
- Disposable-Supabase Pilot Onboarding Certification passes.
- Exact-head Vercel preview is READY.
- No migration file is modified during this slice.

## Required live post-apply verification

Verify all of the following directly in production Supabase:

### Columns
- `communication_threads.participant_one_id`
- `communication_threads.participant_two_id`
- legacy `student_id` and `instructor_id` are nullable

### Constraints/indexes
- `communication_threads_participants_required`
- `communication_threads_legacy_pair_shape`
- participant indexes exist
- read-receipt uniqueness remains intact

### Functions/triggers
- `public.communication_pair_authorized(uuid,uuid,uuid)`
- `public.sync_communication_thread_participants()`
- `private.audit_communication_thread()`
- sync/audit triggers exist

### RLS
- thread SELECT/INSERT use generic participant IDs
- thread UPDATE policy is instructor-archive-only
- message INSERT rechecks current canonical pair authorization
- read INSERT remains recipient-only

### Grants
- authenticated thread access is limited to SELECT, INSERT approved columns, UPDATE status/updated_at
- messages remain SELECT + limited INSERT
- reads remain SELECT + limited INSERT
- no ordinary client delete grants

## Exit condition

G7-2H is GREEN only when:
1. exact-head CI passes;
2. the three certified migrations are applied to live Supabase;
3. live schema/RLS/grants/functions/triggers match current runtime;
4. production app deployment remains READY.

After G7-2H is GREEN, proceed to **G7-3 — Message + Thread Idempotency Foundation**.
