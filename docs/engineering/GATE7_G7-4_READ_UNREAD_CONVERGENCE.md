# G7-4 — Read / Unread Convergence Hardening

## Goal
Make read receipt writes and unread counts converge to persisted database truth under repeated reads, concurrent tabs, retries, refreshes, and ordinary mobile navigation.

## Defect found
The pre-G7-4 read path loaded unread message IDs and inserted all missing receipts in one multi-row INSERT. If another tab inserted one overlapping receipt first, the unique constraint could raise `23505` and abort the whole batch. The runtime then treated that error as harmless success, potentially leaving other messages unread.

The inbox unread calculation also used separate message and receipt queries, so concurrent state changes could be observed from different snapshots.

## Repair
- read receipt writes now use `UPSERT ... ON CONFLICT DO NOTHING` semantics via Supabase `ignoreDuplicates`;
- duplicate receipt races no longer abort unrelated receipt inserts;
- `communication_unread_counts()` computes unread in one SQL statement;
- the function is `SECURITY INVOKER`, so existing thread/message/read RLS remains authoritative;
- inbox loading uses the canonical resolver;
- post-read reconciliation uses the same canonical resolver;
- the client uses the persisted remaining unread count instead of forcing local `0`.

## Locked unread definition
For the current actor and visible thread:

> unread = incoming persisted messages - that actor's persisted read receipts

The actor's own messages never contribute to their unread count.

## Convergence behavior
- repeated mark-read: harmless;
- same messages read in two tabs: one receipt/message/reader;
- refresh: recomputes from persisted evidence;
- stale browser state: corrected by the next server load;
- no Realtime dependency;
- no localStorage/sessionStorage unread authority.

## Non-goals
- no Realtime;
- no read-status redesign;
- no message permission changes;
- no archive changes;
- no bulletin changes;
- no new notification system.

## Certification
G7-4 is GREEN only after TypeScript, lint, regressions, production build, disposable-Supabase onboarding certification, exact-head Vercel READY, live unread-resolver migration, live function/grant verification, merge, and exact production READY verification.
