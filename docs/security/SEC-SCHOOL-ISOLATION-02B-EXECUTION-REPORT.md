# SEC-SCHOOL-ISOLATION-02B — Execution Report

Date: 2026-11-09
Scope: four Chapter 2 sustained-performance RPCs only
Environment: isolated Supabase restore QA `ssbtzoukmvafcfympayd`
Status: PARTIAL PASS / BLOCKED — authorized end-to-end Chapter 2 behavior not certified

## Implementation completed on isolated GitHub branch

- `src/lib/escalation/supabase-client.ts`: privileged client constructor now throws `Server-side escalation credentials are required` if `serviceRoleKey` is absent. No fallback to `anonKey`.
- `supabase/migrations/20261109131846_sec_school_isolation_02b_revoke_privileged_rpc_execute.sql`: exact QA-applied migration (same Supabase migration version), revokes function EXECUTE from PUBLIC, anon, authenticated; grants service_role.
- `src/lib/escalation/__tests__/sec-school-isolation-02b-client.test.ts`: executable Vitest unit cases for absent service credentials and explicit server role. File committed; NOT EXECUTED because no approved safe repo runner was available in this task.
- `supabase/tests/security/sec_school_isolation_02b_rpc_grants.sql`: executable read-only SQL denial/allow assertions.

## QA evidence

1. Supabase apply_migration returned `success:true`, and list_migrations recorded version `20261109131846`, `sec_school_isolation_02b_revoke_privileged_rpc_execute`.
2. A read-only `pg_proc` query for each exact function showed `anon=false`, `authenticated=false`, `service_role=true`.
3. The committed read-only SQL DO assertion script executed in isolated QA without raising an exception (four exact signatures checked).
4. Within a READ ONLY transaction using `SET LOCAL ROLE service_role`, `check_sustained_performance_reset_eligibility` returned zero rows for an intentionally nonexistent synthetic user ID; transaction rolled back. This is limited *permission and non-mutating invocation* evidence, **not** a full authorized Chapter 2 flow.
5. After migration, security advisor count for anonymously-executable SECURITY DEFINER functions declined from five to one (remaining `handle_new_user` trigger); authenticated privileged function warnings declined from 39 to 35.

## Remaining blockers / mandatory next verification

- No full synthetic Chapter 2 attempt/evidence/reset fixtures were executed under the service role; positive Chapter 2 lifecycle is NOT CERTIFIED.
- No distinct student identities conducted an authenticated end-to-end detection/quiz flow in isolated QA.
- Vitest was committed but NOT EXECUTED. The environment lacks a confirmed isolated test runner and repo dependencies for this branch. Do not report Vitest PASS.
- No independent API HTTP / RPC exploit replay was executed. Effective database EXECUTE grants provide strong defense against ordinary API roles, but API-level regression still needs proof.
- Existing intermittently rejected Supabase QA anon-key gateway requests remain a separate verification concern, and cannot be counted as authorization-denial evidence.
- Confirm any runtime use of `SUPABASE_SERVICE_ROLE_KEY` in isolated QA and test the Chapter 2 route with a synthetic user's completed attempt. The route's nonblocking catch may hide lifecycle failures from the student quiz outcome.
- Do not apply/merge this migration to production. Adding it to repository migrations means release would change production RPC permissions; approval and end-to-end QA PASS are required.

## STOP and decision

RPC grant restriction: PASS in isolated QA.
Non-mutating service-role eligibility smoke: PASS for nonexistent synthetic identity only.
Chapter 2 positive workflow: BLOCKED / NOT VERIFIED.
End-to-end regression: BLOCKED / NOT VERIFIED.
Production release: HOLD.

No production modifications, deployment, or merge were performed. Stop here and do not expand scope.
