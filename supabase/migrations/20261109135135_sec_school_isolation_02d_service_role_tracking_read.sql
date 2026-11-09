-- SEC-SCHOOL-ISOLATION-02D — ISOLATED QA CHANGE ONLY
-- Records precisely the QA migration applied as 20261109135135.
-- Requires separately approved production release and full Chapter 2 acceptance tests.
-- The existing escalation database client reads this table via service_role.
-- No grants to anon or authenticated; no academic data or RLS modifications.
BEGIN;
GRANT SELECT ON TABLE public.sustained_performance_tracking TO service_role;
COMMIT;
