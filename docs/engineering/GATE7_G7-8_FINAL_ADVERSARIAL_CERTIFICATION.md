# G7-8 — Final Adversarial Communications Certification

**Project:** ASCYN PRO  
**Gate:** Gate 7 — Communications Reliability  
**Slice:** G7-8 — Final Adversarial Certification  
**Baseline:** production `main` at `a6df1edff8f5f2e3736767e88df35449811430f7`  
**Status:** FINAL CERTIFICATION IN PROGRESS — G7-8-S1 GREEN

## Product Boundary
> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **COEXIST**. No DO NOT BUILD capability is introduced.

**Guarded integration zone contact:** NONE.

## 1. Purpose

G7-8 is the final Gate 7 adversarial certification. It adds no new communications product scope.

It must prove, on one current production baseline, that:
- COM-1 original messaging/bulletin boundaries still hold;
- COM-2 expanded same-school messaging permissions still hold;
- G7-3 through G7-7 reliability protections coexist without regression;
- live Supabase schema/RLS/functions/grants match the source contract;
- exact-head CI and Vercel preview pass;
- merged production main and production Vercel reach READY.

## 2. Permission matrix under certification

### Allowed
- student/apprentice ↔ actively assigned instructor;
- student/apprentice ↔ same-school school admin/admin;
- instructor ↔ assigned student/apprentice;
- instructor ↔ same-school school admin/admin;
- school admin/admin ↔ same-school student/apprentice;
- school admin/admin ↔ same-school instructor.

### Blocked
- student ↔ student;
- student/apprentice ↔ unassigned instructor;
- instructor ↔ unrelated student/apprentice;
- cross-school messaging;
- disabled/rejected actor or recipient;
- schoolless platform-admin private-message browsing;
- injected unauthorized recipient/thread IDs;
- ordinary service-role bypass.

## 3. Gate 7 reliability matrix under certification

### G7-3 — exactly-once and concurrency
- one active pair thread;
- sender operation ID uniqueness;
- same operation retry returns persisted message;
- edited intent receives a new operation identity;
- UI locks remain defense-in-depth only.

### G7-4 — read/unread convergence
- one read row per message/reader;
- repeated/concurrent reads are harmless;
- actor's own sends never count unread;
- unread is computed from persisted evidence;
- refresh/multi-tab state converges.

### G7-5 — archive and relationship races
- archive vs send is serialized;
- archived thread is non-sendable;
- repeated archive converges;
- stale assignment/disabled/school-move state cannot authorize new action;
- historical evidence remains retained.

### G7-6 — bulletin reliability
- publish is atomic;
- publish retries are exactly-once;
- audience RLS remains authoritative;
- acknowledgment is exactly-once;
- server/database time controls scheduling and expiration.

### G7-7 — failure/mobile refresh
- stale asynchronous responses cannot overwrite newer mobile UI state;
- stale failures do not appear after navigation away;
- unchanged retry preserves operation identity;
- changed user intent gets a new operation identity;
- refresh reconstructs from persisted server truth;
- diagnostics remain content-minimal and user errors remain safe.

## 4. Live production object verification — initial pass

Verified on live Supabase:
- RLS enabled: `communication_threads`;
- RLS enabled: `communication_messages`;
- RLS enabled: `communication_message_reads`;
- RLS enabled: `bulletins`;
- RLS enabled: `bulletin_audiences`;
- RLS enabled: `bulletin_acknowledgments`;
- `uq_communication_threads_one_active_pair` present;
- `uq_communication_messages_sender_operation` present;
- `uq_bulletins_author_operation` present;
- `communication_message_insert_race_guard` trigger present;
- `communication_message_reads_unique` present;
- `bulletin_acknowledgments_unique` present;
- `communication_unread_counts()` is SECURITY INVOKER;
- `publish_bulletin_atomic(...)` is SECURITY INVOKER.

## 5. G7-8-S1 — SECURITY BLOCKER

### Finding
`public.communication_pair_authorized(uuid, uuid, uuid)` is intentionally SECURITY DEFINER so it can evaluate canonical pair eligibility across RLS-protected profile/assignment data.

Live grants correctly deny `anon` and `PUBLIC`, but `authenticated` has EXECUTE.

The function currently accepts arbitrary:
- `p_actor_id`;
- `p_recipient_id`;
- `p_school_id`;

without requiring the authenticated caller to be one of the two supplied people.

### Impact
The function does **not** by itself create a message/thread authorization bypass because surrounding thread/message RLS still requires `auth.uid()` to be an actual participant.

However, a signed-in user can directly call the RPC as a boolean authorization/relationship oracle for two other user IDs if those IDs are known. That is unnecessary cross-user information exposure and fails the final Gate 7 privacy/adversarial standard.

### Repair implemented
A new migration adds an authenticated-caller membership guard before privileged pair evaluation.

Required invariant now implemented:

> `auth.uid() = p_actor_id OR auth.uid() = p_recipient_id`

The repair preserves:
- thread INSERT policy use when the caller may occupy either participant column;
- message INSERT policy use;
- G7-5 race-guard use;
- current same-school and assignment rules;
- `anon` / `PUBLIC` execute denial.

Migration:
- `supabase/migrations/20261007200500_g7_8_s1_pair_authorization_caller_guard.sql`

### Certification state
**G7-8-S1: GREEN.**

Verified:
- Engineering Verification #1732 passed on repair head `fac1787e8668e95e751348b197caeaaa8890fa1b`;
- full TypeScript/lint/unit/build suite passed;
- disposable local Supabase started successfully with the migration applied;
- build against disposable Supabase passed;
- true pilot/onboarding certification passed;
- exact-head Vercel preview reached READY;
- live production migration `g7_8_s1_pair_authorization_caller_guard` applied successfully;
- live function retains SECURITY DEFINER where required for canonical relationship lookup;
- caller-membership guard is present;
- `authenticated` retains execute;
- `anon` and `PUBLIC` cannot execute;
- legitimate student caller → assigned instructor returns true;
- legitimate instructor caller as the recipient orientation returns true;
- unrelated authenticated caller probing the same pair returns false;
- student → same-school admin returns true;
- student → student returns false;
- cross-school pair returns false.

The Supabase security advisor still generically flags the helper because it is intentionally SECURITY DEFINER and callable by authenticated users. That generic advisory is expected for this design; the specific G7-8-S1 oracle exposure is mitigated by the enforced caller-membership predicate and direct production verification.

## 6. Existing automated evidence

G7-8 reuses and must keep GREEN:
- `com-1e-final-communications-certification.test.ts`;
- `com-2j-final-certification.test.ts`;
- `g7-3-message-thread-idempotency.test.ts`;
- `g7-4-read-unread-convergence.test.ts`;
- `g7-5-archive-relationship-races.test.ts`;
- `g7-6-bulletin-reliability.test.ts`;
- `g7-7-failure-mobile-refresh.test.ts`.

## 7. Final adversarial matrix result

### COM-1 boundaries
PASS:
- Realtime remains deferred;
- no service-role communication bypass was introduced;
- messaging and bulletins remain separate;
- archive and bulletin runtime boundaries remain intact.

### COM-2 permission model
PASS:
- allowed role relationships remain allowed;
- student-to-student remains blocked;
- unassigned/cross-school relationships remain blocked;
- database helper + RLS remain authoritative;
- schoolless platform-admin private-message browsing remains blocked by product/runtime rules.

### Gate 7 reliability matrix
PASS:
- G7-3 exactly-once message/thread convergence;
- G7-4 read/unread convergence;
- G7-5 archive/relationship race protection;
- G7-6 atomic/idempotent bulletin publish + ack/server-time rules;
- G7-7 failure/mobile refresh convergence;
- G7-8-S1 caller-membership privacy hardening.

### Live production structural verification
PASS:
- RLS enabled on all six communications/bulletin tables;
- all Gate 7 uniqueness indexes present;
- message insert race trigger present;
- read and acknowledgment uniqueness present;
- unread and bulletin RPCs remain SECURITY INVOKER;
- pair authorization helper retains guarded SECURITY DEFINER behavior.

## 8. Gate-close rule

G7-8 may be marked GREEN only after:
1. G7-8-S1 is repaired;
2. full COM-1 + COM-2 permission regression passes;
3. all Gate 7 reliability tests pass;
4. disposable-Supabase adversarial checks pass;
5. live Supabase RLS/index/constraint/function/grant verification passes;
6. Engineering Verification passes on exact head;
7. exact-head Vercel preview is READY;
8. PR merges;
9. production main is the exact merge commit;
10. production Vercel is READY;
11. representative production-safe communication checks pass.

Until then, Gate 7 remains open.
