# SEC-SCHOOL-ISOLATION-02D — Validation Report

Date: 2026-11-09
QA project: `ssbtzoukmvafcfympayd` (isolated restore QA)
Decision: **PARTIAL PASS / BLOCKED** — production release HOLD

## Changes made (isolated branch and QA only)

- QA migration `20261109135135_sec_school_isolation_02d_service_role_tracking_read` successfully applied:
  `GRANT SELECT ON TABLE public.sustained_performance_tracking TO service_role;`
- Matching branch migration: `supabase/migrations/20261109135135_sec_school_isolation_02d_service_role_tracking_read.sql`.
- Executable synthetic transaction regression: `supabase/tests/security/sec_school_isolation_02d_tracking_read_rollback.sql`. This extends 02C's fixture with a direct `service_role` SELECT of the student's tracking state.
- No RLS changes, no ordinary-user grants, no academic-record changes, no merge, no Vercel deployment, no production migration.

## Verified evidence

1. Post-migration PostgreSQL grant check returned `service_role SELECT = true`, `anon SELECT = false`, `authenticated SELECT = false` for `sustained_performance_tracking`.
2. A `BEGIN READ ONLY; SET LOCAL ROLE service_role` SELECT for a nonexistent synthetic target executed successfully and returned 0 rows, then rolled back.
3. The new branch SQL regression was fetched by exact path and executed in isolated QA. Returned:
   `PASS: service-role direct tracking read; eight forbidden RPC calls; synthetic Chapter 2 RPC lifecycle; cross-school preservation; ROLLBACK`.
4. The test specifically asserts role-specific direct SELECT, four denied RPC calls for each of the `anon` and `authenticated` roles, a synthetic School B Chapter 2 evidence/eligibility/reset sequence, and School A not being changed.
5. After rollback, an independent database query confirmed ZERO synthetic users, schools, quiz attempts, tracking rows, and reset rows remain.
6. GitHub Actions read-only search for this isolated branch returned `total_count: 0`; there is no independently observed CI Vitest run for the branch.

## Remaining acceptance gaps — NOT PASSED

- Targeted Vitest tests NOT RUN. The local execution container has Node/npm and git but cannot resolve github.com, contains no checked-out repository or usable Vitest installation, and no approved isolated branch runner was found. Existing and newly committed Vitest source files are **not execution evidence**.
- Authenticated synthetic student HTTP `POST /api/remediation/detect` not executed. No verified isolated QA application endpoint with separate JWT test identities and matching deployment revision was established.
- Direct PostgreSQL `SET ROLE authenticated` denial checks are not equivalent to a real JWT-authenticated application session.
- Existing `/api/remediation/detect` catches Chapter 2 lifecycle errors separately and may return successful primary quiz orchestration even if sustained-performance bookkeeping failed. A test must inspect persisted synthetic tracking/evidence, not merely an HTTP 200 response.
- The intermittent Supabase anon-key gateway problem remains a separate QA release hold; do not misinterpret HTTP failures as policy denials.
- No proof of complete application route behavior or deployment compatibility is asserted here.

## Fixed-scope next action and STOP

Grant repair and SQL-only regression: PASS. Full 02D certification: BLOCKED pending a genuinely isolated runnable Vitest checkout and QA-bound authenticated route; no more speculative refactoring. Preserve the production HOLD and return to the release decision only when both missing checks have real PASS evidence.

**STOP — do not merge, deploy, modify production, or expand the scope.**
