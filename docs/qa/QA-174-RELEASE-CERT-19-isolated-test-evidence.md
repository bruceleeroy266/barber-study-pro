# QA-174-RELEASE-CERT-19 — Isolated remediation test evidence

Date: 2026-10-28. Target: Supabase project `ascyn-pro-restore-qa-oct21` (`ssbtzoukmvafcfympayd`). **NO-GO**.

## Verified
- Integration candidate draft PR #454: CI #40722628508 completed successfully for Verify Build and Pilot Onboarding Certification on pre-documentation commit `04add3dfa0b9d06a11f8bbcf18d1663b99f99e2a`.
- QA migrations previously applied; RLS/column privileges checked.
- QA database: only one dedicated QA instructor and one dedicated QA student, in one school; second school absent.
- `create_remediation_cycle_with_assignments` is SECURITY DEFINER, accessible to `service_role` but not `authenticated` or `anon`.
- On a dedicated QA student, a PL/pgSQL **rollback-only subtransaction** successfully executed cycle RPC creation, duplicate RPC idempotency, targeted→in_review cycle status change, assignment completion and a persisted-within-transaction audit event.
- Attempted `UPDATE` against that audit event was rejected by the immutable-event trigger. All test writes were intentionally rolled back via a sentinel exception. Four observable Boolean test rows: `cycle_created=true`, `duplicate_idempotency=true`, `cycle_progression=true`, `event_mutation_denied=true`.

## NOT verified
- Creation and authentication of actual School A and School B QA instructor/student users.
- Cross-school negative test via signed-in instructor server action / HTTP request.
- Full instructor/student authenticated frontend workflow, reassessment, evaluation and event chain.
- A new CI run on this later evidence-documentation commit.

## Release decision

**NO-GO.** Database-only isolated rollback tests provide partial technical evidence but do not satisfy the mandatory two-school authenticated end-to-end acceptance gate. Do not merge or deploy PR #452, #453 or draft #454 until that gate is demonstrated and explicit owner release authorization is granted.
