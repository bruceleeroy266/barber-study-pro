-- C19-H2 — Shared Remediation RPC Security Hardening
--
-- The remediation/reassessment RPCs below are invoked only from trusted
-- server-side code using the Supabase service role. PostgreSQL grants EXECUTE
-- to PUBLIC by default for newly created functions, which made these
-- SECURITY DEFINER entry points callable through PostgREST by anon/authenticated
-- clients. Revoke those external grants and preserve service-role execution.
--
-- This migration intentionally does not change function bodies, remediation
-- thresholds, question selection, evidence validation, or Chapter 19 grading.

revoke execute on function public.create_remediation_cycle_with_assignments(
  uuid, text, text, integer, text, text, jsonb, text, jsonb
) from public, anon, authenticated;
grant execute on function public.create_remediation_cycle_with_assignments(
  uuid, text, text, integer, text, text, jsonb, text, jsonb
) to service_role;

revoke execute on function public.get_active_remediation_cycle_id(
  uuid, text
) from public, anon, authenticated;
grant execute on function public.get_active_remediation_cycle_id(
  uuid, text
) to service_role;

revoke execute on function public.consume_reservation_and_create_attempt(
  uuid, uuid, text, uuid, text, jsonb, integer, integer, boolean, text
) from public, anon, authenticated;
grant execute on function public.consume_reservation_and_create_attempt(
  uuid, uuid, text, uuid, text, jsonb, integer, integer, boolean, text
) to service_role;

revoke execute on function public.record_question_attempt(
  uuid, text, text, uuid, uuid, boolean
) from public, anon, authenticated;
grant execute on function public.record_question_attempt(
  uuid, text, text, uuid, uuid, boolean
) to service_role;

revoke execute on function public.check_and_record_pool_exhaustion(
  uuid, text, text, uuid, integer
) from public, anon, authenticated;
grant execute on function public.check_and_record_pool_exhaustion(
  uuid, text, text, uuid, integer
) to service_role;

revoke execute on function public.get_attempted_question_ids(
  uuid, text
) from public, anon, authenticated;
grant execute on function public.get_attempted_question_ids(
  uuid, text
) to service_role;

revoke execute on function public.has_attempted_question(
  uuid, text, text
) from public, anon, authenticated;
grant execute on function public.has_attempted_question(
  uuid, text, text
) to service_role;

revoke execute on function public.evaluate_remediation_cycle(
  uuid, text, text, jsonb, uuid[], text
) from public, anon, authenticated;
grant execute on function public.evaluate_remediation_cycle(
  uuid, text, text, jsonb, uuid[], text
) to service_role;

revoke execute on function public.validate_evaluation_evidence(
  uuid, uuid[]
) from public, anon, authenticated;
grant execute on function public.validate_evaluation_evidence(
  uuid, uuid[]
) to service_role;

revoke execute on function public.create_instructor_escalation(
  uuid, text, text, uuid, uuid[], integer, jsonb
) from public, anon, authenticated;
grant execute on function public.create_instructor_escalation(
  uuid, text, text, uuid, uuid[], integer, jsonb
) to service_role;

comment on function public.create_remediation_cycle_with_assignments(
  uuid, text, text, integer, text, text, jsonb, text, jsonb
) is 'Server-only remediation RPC. C19-H2 restricts EXECUTE to service_role.';

comment on function public.consume_reservation_and_create_attempt(
  uuid, uuid, text, uuid, text, jsonb, integer, integer, boolean, text
) is 'Server-only reassessment submission RPC. C19-H2 restricts EXECUTE to service_role.';

comment on function public.evaluate_remediation_cycle(
  uuid, text, text, jsonb, uuid[], text
) is 'Server-only remediation evaluation RPC. C19-H2 restricts EXECUTE to service_role.';
