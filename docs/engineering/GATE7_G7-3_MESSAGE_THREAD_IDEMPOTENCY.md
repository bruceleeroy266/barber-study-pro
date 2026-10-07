# G7-3 — Message + Thread Idempotency Foundation

## Goal
Make one intentional message send persist at most once and make simultaneous creation of the same active one-to-one conversation resolve to one active thread.

## Database invariants

### Message intent
- `communication_messages.client_operation_id` stores the client operation UUID.
- unique partial index on `(sender_id, client_operation_id)`.
- pre-G7 historical rows may retain NULL operation IDs.
- an identical operation retry resolves to the already persisted row.
- reusing an operation ID for different content/thread is rejected as an unsafe conflict.

### Active conversation pair
- one active thread per school + unordered participant pair.
- uniqueness canonicalizes participant order with `least()` / `greatest()`.
- archived historical threads do not block a later active conversation.
- concurrent A→B and B→A creation cannot create two active rows.

## Runtime behavior
- existing lookup remains a fast path;
- database unique constraint is authoritative under concurrency;
- thread insert `23505` triggers a fresh active-pair lookup and returns `created:false`;
- message insert `23505` looks up the sender+operation identity;
- retry succeeds only when thread and body exactly match the original intent.

## Client behavior
- each unchanged draft owns one UUID generated in the browser;
- failures retain the UUID for safe retry;
- editing the draft creates a new intent and clears the UUID;
- confirmed success clears the UUID;
- existing UI send/compose locks remain defense-in-depth only.

## Non-goals
- no permission changes;
- no Realtime;
- no bulletin changes;
- no unread/archive semantic changes;
- no message editing/deleting;
- no group messaging.

## Certification
G7-3 is GREEN only after migration/runtime/client regressions, TypeScript, lint, unit tests, production build, disposable-Supabase onboarding certification, exact-head Vercel READY, live migration apply, live unique-index/grant verification, merge, and exact production READY verification.
