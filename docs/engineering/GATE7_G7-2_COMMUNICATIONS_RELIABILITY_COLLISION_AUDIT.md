# G7-2 — Communications Reliability Collision Audit

**Project:** ASCYN PRO  
**Gate:** Gate 7 — Communications Reliability  
**Slice:** G7-2 — Reliability Collision Audit  
**Status:** AUDIT / NO RUNTIME CHANGE  
**Baseline:** production `main` at `6cea104a94ea70a4631e80f9ecdefd75b94a6e8d`

## Executive finding

Gate 7 cannot proceed directly into message/thread idempotency because production Supabase is not at parity with the current COM-2 runtime.

Current application code expects the generic COM-2 participant model:
- `participant_one_id`
- `participant_two_id`
- `communication_pair_authorized(...)`
- COM-2 thread/message/read RLS

Live production Supabase still exposes the older COM-1 student/instructor-only schema and RLS:
- `communication_threads.student_id` NOT NULL
- `communication_threads.instructor_id` NOT NULL
- no `participant_one_id`
- no `participant_two_id`
- legacy student/instructor RLS policies
- migration history does not show the COM-2 migration family

Because current runtime selects/inserts generic participant columns, this is a production-blocking schema/runtime drift for expanded messaging.

## Live production evidence

At audit time:
- communication threads: 0
- messages: 0
- message read receipts: 0
- bulletins: 0
- bulletin acknowledgments: 0

This means no real production communication evidence exists yet to expose concurrency failures, but live schema/constraint/RLS parity can be audited directly.

## Collision matrix

| Area | Current protection | Rating | Finding |
|---|---|---|---|
| Production COM-2 schema parity | Repo migrations only | RED | Current runtime expects COM-2 columns/RLS that live Supabase does not have. |
| Message send duplicate protection | UI locks (`sendLockedRef`) | RED | No database/server idempotency key; response-loss/retry can duplicate messages. |
| Active one-to-one thread creation | lookup then insert | RED | No canonical-pair uniqueness constraint; concurrent creates can produce duplicate active threads. |
| Message read receipts | DB unique `(message_id, reader_id)` + 23505 retry handling | GREEN | Strong exactly-once read evidence already exists. |
| Unread computation | persisted incoming messages minus persisted read receipts | YELLOW | Definition is sound, but multi-tab/refresh/concurrency convergence is not adversarially certified. |
| Thread archive persistence | DB status + runtime send check + message RLS checks active status | YELLOW | Persisted model exists, but repeat archive behavior and archive/send races are not certified. |
| Bulletin acknowledgment | DB unique `(bulletin_id, student_id)` + 23505 retry handling | GREEN | Strong exactly-once acknowledgment evidence already exists. |
| Bulletin publish | draft insert → audience insert → publish update | RED | Multi-step non-transactional operation can leave partial drafts/audiences and duplicate submissions can create duplicate bulletins. |
| Bulletin archive | persisted update | YELLOW | Persisted but repeat/archive race behavior not tested. |
| Stale authorization | runtime/RLS intent present | RED until parity restored | Current live RLS is older than runtime permission model; cannot certify stale-state behavior against current COM-2 rules. |
| Failure visibility | messaging logs + safe messaging errors | YELLOW | Messaging generally fails visibly; bulletin paths may surface raw DB text and partial-state failures. |
| Realtime dependency | none | GREEN | Request/refresh model remains intentional and compatible with Gate 7. |

## Required repair order

### G7-2H — Production Communications Schema Reconciliation
This becomes the immediate blocker repair before G7-3.

Required:
1. inventory all COM-2 migrations missing from live Supabase;
2. verify ordering/dependencies against every migration applied after them;
3. certify migrations against a disposable Supabase instance from current `main`;
4. confirm they are forward-safe with zero production communication rows;
5. apply only the certified missing migrations;
6. verify live columns, constraints, grants, RLS, helper functions, triggers, and audit behavior;
7. run representative permission-matrix smoke checks;
8. verify exact production code + schema parity.

No new communications feature is authorized by G7-2H.

### G7-3 — Message + Thread Idempotency Foundation
Only after production schema parity is GREEN:
- add server/database message operation identity;
- make same-operation retries exactly-once;
- add canonical active-pair uniqueness/concurrency protection;
- preserve current COM-2 permissions.

### G7-4 onward
Continue the locked G7-1 sequence after G7-3.

## Existing protections to preserve

Do not rewrite working protections:
- read receipt unique constraint;
- duplicate-read 23505 handling;
- bulletin acknowledgment unique constraint;
- duplicate-ack 23505 handling;
- persisted unread calculation basis;
- persisted archive status;
- no Realtime requirement;
- current COM-2 permission matrix.

## G7-2 decision

**Gate 7 status: YELLOW.**

G7-1 contract is production-locked.  
G7-2 found a RED production schema/runtime parity blocker plus additional reliability gaps.

Implementation must not begin with ordinary idempotency work while live Supabase is behind current runtime.

## Next task

**G7-2H — Certify and reconcile the missing COM-2 production migrations, then verify live Communications schema/RLS parity before G7-3.**
