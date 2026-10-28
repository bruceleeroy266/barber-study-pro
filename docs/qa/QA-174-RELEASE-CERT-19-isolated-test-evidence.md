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

## RELEASE-CERT-20 — Authenticated test provisioning gate (2026-10-28)

- CI run [#40739024443](https://github.com/bruceleeroy266/barber-study-pro/actions/runs/40739024443) at commit `8b37e2dfc0c059ca4d39064c2789c305d41dad27` completed **success** on both Verify Build and Pilot Onboarding Certification jobs.
- Isolated QA project `ssbtzoukmvafcfympayd` still contains dedicated QA identities from **one** school only (verified by read-only school-count query).
- Connected Supabase capabilities provide SQL/project administration but no authenticated test-user provisioning/sign-in action. Generating database profile rows alone would not create valid Auth sessions and would falsely certify an application-level test. No such claim is made.
- The previous rollback-only database exercise remains evidence of RPC creation/idempotency, initial cycle progression and event immutability. **No signed-in School A / School B HTTP or browser test, cross-school denial, reassessment or evaluation was executed.**
- **NO-GO.** Provision real Auth-managed dedicated School B instructor and student users in the isolated project, obtain a supported authenticated QA application/browser test environment, and exercise same-school success and cross-school rejection before release. No merge/deployment.

## RELEASE-CERT-26 — 2026-10-28: QA Auth restored / School B provisioned

- Browser automation successfully opened Supabase Authentication > Users for isolated project `ssbtzoukmvafcfympayd`, without login redirect. One transient permissions-fetch popup appeared earlier, but a later run successfully opened the Add user modal.
- Created QA-only school record `QA-174 School B (isolated test)`, id `863c0a4a-efe2-4034-adff-6d5ee6c32168`.
- Created through the Auth admin UI (confirmed), with auto-confirm and without email invites:
  - Instructor `qa174-schoolb-instructor-20261028@example.com`, id `b37adf55-eff8-41de-86c3-5508a4eaada3`.
  - Student `qa174-schoolb-student-20261028@example.com`, id `bf2eb821-8adf-43c8-9b5c-0ccf43b7a71e`.
- Supabase SQL verified the two generated profile records were set to `approved`, correct instructor/student roles and School B ID; school metrics disabled.
- Discovered a READY Vercel preview for the draft QA-174 integration branch, but **could not verify preview environment is bound to isolated QA Supabase**. Default environment variables include production and preview targets; do not assume isolation.
- **Not executed:** authenticated positive/negative cross-school application calls, full remediation lifecycle, final exact-head CI after this documentation update. Release **NO-GO**. Do not deploy/merge.
