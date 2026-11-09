# SEC-SCHOOL-ISOLATION-02A — Minimum Authorization Repair Design

Date: 2026-11-09
Status: DESIGN ONLY — NOT IMPLEMENTED, TESTED, MERGED, OR DEPLOYED
Base: `75bf191a575b965cdb4daa2146369b871f56a311`
Database inspected: isolated QA `ssbtzoukmvafcfympayd`
Scope: Four Phase 6C-2c sustained-performance RPCs only.

## Evidence and classification

All four functions are in `public`, owned by `postgres`, defined with `SECURITY DEFINER`, and currently have EXECUTE accessible to `anon` and `authenticated`. Their definitions do not check `auth.uid()` or an authorized school membership.

| Function | Effect | Consequence of unchecked caller-controlled p_user_id |
| --- | --- | --- |
| `check_sustained_performance_reset_eligibility(uuid,text)` | Read tracking status | Cross-user status read |
| `record_detection_state_transition(uuid,text,text,text,jsonb)` | Insert/update tracking | Unauthorized state alteration |
| `record_follow_up_evidence(uuid,text,text,uuid,boolean,integer)` | Insert evidence/update counters | Unauthorized evidence update if data preconditions pass |
| `execute_sustained_performance_reset(uuid,text,uuid)` | Reset tracking and remediation state | Unauthorized reset if eligibility preconditions pass |

This is a confirmed authorization-design deficiency; no unauthenticated HTTP exploit attempt or cross-school mutation has been executed.

## Verified application dependencies

- `src/app/api/remediation/detect/route.ts`: authenticated `POST`; checks quiz attempt ownership, completion, and chapter, then invokes Chapter 2 sustained-performance synchronization (lines 34–118, 141–181 on base).
- `src/lib/escalation/chapter-2-sustained-runtime.ts`: invokes all four through the service interface.
- `src/lib/escalation/sustained-performance-service.ts`: delegates to database client.
- `src/lib/escalation/supabase-client.ts`: four direct RPC calls; its constructor currently uses `config.serviceRoleKey ?? config.anonKey` and factory obtains `SUPABASE_SERVICE_ROLE_KEY` (lines 30–48, 185–305, 438–451).
- GitHub code search of base found no other direct uses of `createSupabaseEscalationClient(` besides route, library definition, and documentation example. This search is not a complete proof of runtime reachability.
- `src/__tests__/migrations/phase-6c2c-escalation-reset.test.ts` currently contains migration-structure assertions, not authenticated cross-school denial tests.

## Minimal proposed code/migration changes — NOT YET APPLIED

1. Create a NEW migration on the isolated branch following the repository's existing migration conventions and the installed CLI's `supabase migration new --help` guidance. Do not run it against production.
2. For each exact function signature, revoke `EXECUTE` from `PUBLIC`, `anon`, and `authenticated`; explicitly grant execution to `service_role` only if the validated server path requires it. Ensure overloaded signatures are enumerated rather than silently omitted. These are *proposed* DDL statements, not executed SQL.
3. In `src/lib/escalation/supabase-client.ts`, remove the fallback to `anonKey` for privileged sustained-performance calls; a missing server secret must fail closed. Confirm this module is never bundled into browser code; consider a server-only import boundary. Never log or expose the secret.
4. Preserve `/api/remediation/detect` authenticated-user and exact-attempt ownership checks and call the RPCs with the *verified* `user.id`. Do not accept a target user ID or a mapping-verification assertion from the client's request.
5. Keep the existing academic eligibility, evidence, deduplication, and Chapter 2 scoring logic unchanged. Validate that service-role access is required and still functions in isolated QA.
6. As defense in depth, consider internal authorization predicates or relocation to a non-exposed schema if a future feature needs browser-accessible RPCs. That is a separate design decision, not a reason to expand this targeted repair.

### Crucial caveats

- Service-role access bypasses RLS by design; it must be restricted to a server-only code path that enforces ownership. A grant-only fix is not sufficient if an alternate server route can be invoked without authorization.
- PostgreSQL default PUBLIC EXECUTE and explicit grants must be checked after any `CREATE OR REPLACE FUNCTION`; never accidentally re-grant browser roles.
- If this application actually requires direct `authenticated` execution of any of the four RPCs, stop and redesign that function with authoritative caller checks; do not silently break production behavior.
- The separate Supabase anon-key gateway intermittency remains an independent QA hold. Do not use its failures as proof that authorization is secure.
- Preserve Elevate instructor read-only visibility, students' assessments, and the non-blocking Chapter 2 lifecycle behavior.

## Hard gate for subsequent execution

PASS only after exact-signature grants are verified, unauthenticated and cross-school tests deny, authorized Chapter 2 tests succeed, and no exposed alternate path bypasses checks. STOP and report BLOCKED if reliable isolated testing or legitimate call compatibility cannot be established. No production schema modifications, merges, or deployments without separate explicit approval.
