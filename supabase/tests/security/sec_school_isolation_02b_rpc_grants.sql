-- SEC-SCHOOL-ISOLATION-02B executable, read-only QA authorization assertion.
-- Run with psql -v ON_ERROR_STOP=1 -f ... against isolated QA ONLY.
-- This checks real PostgreSQL EXECUTE grants, not behavioral cross-school fixtures.
-- No table rows are written, and this script does not modify policies.
DO $isolation$
DECLARE
  target_signature text;
BEGIN
  FOREACH target_signature IN ARRAY ARRAY[
    'public.check_sustained_performance_reset_eligibility(uuid,text)',
    'public.execute_sustained_performance_reset(uuid,text,uuid)',
    'public.record_detection_state_transition(uuid,text,text,text,jsonb)',
    'public.record_follow_up_evidence(uuid,text,text,uuid,boolean,integer)'
  ]
  LOOP
    IF to_regprocedure(target_signature) IS NULL THEN
      RAISE EXCEPTION 'Missing required RPC: %', target_signature;
    END IF;

    IF has_function_privilege('anon', target_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'Anonymous RPC execution unexpectedly allowed: %', target_signature;
    END IF;

    IF has_function_privilege('authenticated', target_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'Authenticated RPC execution unexpectedly allowed: %', target_signature;
    END IF;

    IF NOT has_function_privilege('service_role', target_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'Authorized server RPC execution unexpectedly denied: %', target_signature;
    END IF;
  END LOOP;

  RAISE NOTICE 'PASS: four exact RPC signatures deny anon/authenticated and allow service_role.';
END
$isolation$;
