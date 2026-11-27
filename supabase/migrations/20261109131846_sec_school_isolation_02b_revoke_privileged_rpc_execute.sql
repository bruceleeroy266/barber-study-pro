-- SEC-SCHOOL-ISOLATION-02B — applied only to isolated restore QA
-- Supabase QA migration record version: 20261109131846
-- This file mirrors the exact successful isolated-QA migration.
-- It is NOT approved for production. No test data is touched.
BEGIN;
REVOKE EXECUTE ON FUNCTION public.check_sustained_performance_reset_eligibility(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.execute_sustained_performance_reset(uuid, text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_detection_state_transition(uuid, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_follow_up_evidence(uuid, text, text, uuid, boolean, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_sustained_performance_reset_eligibility(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.execute_sustained_performance_reset(uuid, text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_detection_state_transition(uuid, text, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_follow_up_evidence(uuid, text, text, uuid, boolean, integer) TO service_role;
COMMIT;
