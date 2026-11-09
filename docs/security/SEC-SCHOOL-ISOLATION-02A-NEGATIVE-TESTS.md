# SEC-SCHOOL-ISOLATION-02A — Prepared Negative Authorization Test Matrix

Date: 2026-11-09
Status: TEST DESIGN / CASES PREPARED — **NOT EXECUTED**
Target: isolated Supabase QA only; no production users, grades, or school records.

## Isolation and setup requirements

- Capture an exact isolated Git commit and QA migration version before executing any tests.
- Use two **synthetic** school tenants (School A and School B), with two synthetic student identities and separate instructor/admin identities. Do not reuse an actual Elevate account or real learner records.
- Create only synthetic `quiz_attempts`, `sustained_performance_tracking`, `remediation_cycles`, and eligible follow-up evidence required by the cases, then clean up within isolated QA.
- Run tests with actual distinct anon, authenticated A/B, and authorized server-role execution contexts; never run every case as postgres and claim it proves RLS.
- Never print tokens, publishable secrets, service-role keys, passwords, student identifiers, or sensitive evidence in logs.
- Assert both response and absence of database changes for every denial test.
- The existing external API-key/gateway intermittent failure is a distinct INFRA BLOCKED result, **not** a security denial PASS.

## Negative tests (all must deny)

| ID | Caller | Operation | Expected |
| --- | --- | --- | --- |
| N01 | Anonymous database role | `check_sustained_performance_reset_eligibility` for School B | Permission denied; no tracking data |
| N02 | Anonymous role | `record_detection_state_transition` for School B | Permission denied; tracking unchanged |
| N03 | Anonymous role | `record_follow_up_evidence` for School B | Permission denied; no evidence or counter change |
| N04 | Anonymous role | `execute_sustained_performance_reset` for eligible School B fixture | Permission denied; reset and escalations unchanged |
| N05 | Authenticated School A student | All four functions with a School B user ID | Permission denied; no leak or mutation |
| N06 | Authenticated School A instructor | All four functions with a School B user ID | Permission denied; no leak or mutation |
| N07 | Authenticated School A school admin | All four functions with a School B user ID | Permission denied; no leak or mutation |
| N08 | Authenticated School B student | Direct RPC calls targeting another School B student | Permission denied; no leak or mutation |
| N09 | Unauthenticated HTTP | `POST /api/remediation/detect` | HTTP 401; no state changes |
| N10 | Authenticated Student A | Pass Student B's completed `quizAttemptId` to detection route | HTTP 403 or intentionally indistinguishable 404; no state changes |
| N11 | Authenticated Student A | Pass a chapter that does not match own attempt | HTTP 400; no state changes |
| N12 | Any browser-accessible route | Supply userId, forged mapping-verification, or tracking IDs to bypass ownership | Rejected/ignored; server-derived identity only |

## Positive and regression controls (must allow)

| ID | Caller | Operation | Expected |
| --- | --- | --- | --- |
| P01 | Authorized authenticated student | Complete own Chapter 2 quiz and call detection endpoint | Approved orchestration and sustained-performance bookkeeping |
| P02 | Authorized server-only execution | Call all four RPCs through validated API flow | Executes with correct target, preserving idempotency and evidence rules |
| P03 | Authorized instructor | View permitted school student progress in existing instructor workflow | Read-only visibility unchanged |
| P04 | School A / School B | Independently view each school's authorized records | No cross-tenant mixing |
| P05 | Deliberately absent server secret in isolated test | Attempt server-only lifecycle | Fail closed with safe error; no fallback to public key |
| P06 | Instructor/administrator support workflows | Authorized reads and audited support actions | Preserved for relevant routes; not broadened by this fix |

## Harness implementation requirements for next task

1. Write executable pgTAP authorization and grants assertions for the *exact four signatures* plus synthetic role fixtures. Prove `has_function_privilege('anon'|'authenticated', ..., 'EXECUTE') = false` and `has_function_privilege('service_role', ..., 'EXECUTE') = true` only if authorized server path is confirmed.
2. Write route-level Vitest integration tests/mocks for authentication, exact-attempt ownership, chapter binding, absent server secret, and no RPC calls on denial.
3. Add a deliberately tampered School B user ID case for every function.
4. Verify database rows remain unchanged on denied mutations. Use transaction rollback and isolated fixtures, not live records.
5. Do not mark cases PASS based only on testing source-string presence or a UI button being hidden.
6. Preserve a real authorized Chapter 2 control as a guard against breaking Elevate-like user flows.
7. Record exact test commands, exit codes, fixture identifiers (non-secret), and commit SHA when tests are actually run.

## Gate

This document is a prepared specification, **not executable tests or PASS evidence**. The next authorized task may implement tests and migration exclusively on the isolated branch and approved QA. If any negative test unexpectedly succeeds, mark BLOCKED and investigate only that confirmed issue. Do not merge or deploy.

**STOP after 02A design and test preparation.**
