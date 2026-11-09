# SEC-SCHOOL-ISOLATION-02C — Targeted Validation Report

Date: 2026-11-09
Environment: isolated QA Supabase project `ssbtzoukmvafcfympayd`
Status: PARTIAL PASS / BLOCKED — no production release
No production deployment, merge, or migration authorized or performed.

## Exact branch and evidence
- Branch: `security/sec-school-isolation-02a-20261109`
- Test artifact: `supabase/tests/security/sec_school_isolation_02c_synthetic_rollback.sql`
- SQL artifact file blob SHA: `dbe797a8ce0fc0f16a3380fa8cf803d5dabfdbfa`
- QA grant migration from 02B remains in place. No additional QA grants or production changes were made in 02C.

## Tests executed with real QA PostgreSQL roles

PASS: Anonymous role direct calls to the four protected privileged functions each raised insufficient_privilege.
PASS: Authenticated database role direct calls to the same four functions each raised insufficient_privilege.
PASS: With synthetic schools and synthetic users in one transaction, `service_role` successfully ran:
1. `record_detection_state_transition` on School B synthetic student;
2. `record_follow_up_evidence` for a completed synthetic Chapter 2 quiz attempt;
3. `check_sustained_performance_reset_eligibility` with eligible result after 40 days;
4. `execute_sustained_performance_reset`, producing a reset record and inactive tracking.
PASS: School A's synthetic student's tracking remained active, with zero evidence and no reset.
PASS: Explicit ROLLBACK followed by independent verification found zero remaining synthetic auth users, schools, quiz attempts, tracking rows, or resets.
PASS: The committed SQL script was retrieved from its branch and executed successfully in QA, returning `PASS: 8 denied calls, synthetic Chapter 2 privileged RPC flow, cross-school preservation, ROLLBACK`.

## Important limitation
This verifies the real database RPC sequence, not a full authenticated HTTP request using a student JWT and the application route. The `authenticated` database-role tests validate direct EXECUTE revocation, not an end-to-end logged-in user session.

## Verified runtime compatibility blocker
QA `service_role` lacks direct SELECT grant on `public.sustained_performance_tracking`; a query with `SET LOCAL ROLE service_role` failed with SQLSTATE 42501. Inspection also showed no direct service_role SELECT on `follow_up_evidence` or `sustained_performance_resets`. This matters because `src/lib/escalation/supabase-client.ts` `getTrackingState` performs a direct `SELECT` on `sustained_performance_tracking`. The 02B four-function execute grant repair does not establish that this read succeeds. This dependency is a verified blocker to certifying the complete student Chapter 2 application workflow. No permission widening was applied in this task.

## Targeted Vitest status
BLOCKED / NOT RUN. The available container had Node/npm and Git installed but no Vitest package, node_modules, or accessible GitHub network clone (host could not resolve). No approved safe isolated CI runner was established for the branch. Do not report any Vitest pass/fail count or assume CI executed. Existing new Vitest file from 02B remains unexecuted.

## Closure / next bounded decision
- Four RPC EXECUTE denials: PASS.
- Synthetic privileged RPC lifecycle: PASS.
- Synthetic test rollback: PASS.
- Full authenticated Chapter 2 route: NOT VERIFIED, and existing read grant compatibility is suspect.
- Targeted Vitest: BLOCKED.
- SEC-SCHOOL-ISOLATION-02C: PARTIAL PASS / BLOCKED; production HOLD.

Next candidate task (separate approval): repair only the confirmed QA `service_role` read compatibility for `sustained_performance_tracking` if required by the validated route, then run targeted Vitest on a safe isolated checkout and authenticated synthetic Chapter 2 route. Avoid a broad security rewrite. STOP here.
