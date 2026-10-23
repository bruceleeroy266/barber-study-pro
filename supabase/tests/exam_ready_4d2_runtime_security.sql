-- Runtime security smoke checks against the ACTUAL installed SQL function.
-- Disposable Supabase only. No question import, config activation or user creation.
BEGIN;
DO $test$
DECLARE
  v_definition text;
  v_count integer;
BEGIN
  SELECT pg_get_functiondef('public.start_or_resume_comprehensive_exam(uuid)'::regprocedure)
    INTO v_definition;
  IF v_definition IS NULL OR position('v_exp_scientific_count <> 4' in v_definition) = 0
     OR position('v_distinct_question_count <> 110' in v_definition) = 0
     OR position('v_profile.school_id is null' in v_definition) = 0
     OR position('pg_advisory_xact_lock' in v_definition) = 0 THEN
    RAISE EXCEPTION '4D-2 installed runtime definition missing critical policy guards';
  END IF;

  -- Explicitly unauthenticated request must fail before creating an attempt.
  PERFORM set_config('request.jwt.claim.sub', '', true);
  BEGIN
    PERFORM public.start_or_resume_comprehensive_exam(gen_random_uuid());
    RAISE EXCEPTION 'SECURITY FAILURE: unauthenticated attempt accepted';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'Authentication required' THEN RAISE; END IF;
  END;

  -- Authenticated but unregistered user must also fail before creating an attempt.
  PERFORM set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
  BEGIN
    PERFORM public.start_or_resume_comprehensive_exam(gen_random_uuid());
    RAISE EXCEPTION 'SECURITY FAILURE: unregistered learner accepted';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'Active approved learner account required' THEN RAISE; END IF;
  END;

  SELECT count(*) INTO v_count FROM public.comprehensive_exam_attempts;
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'Unexpected pre-existing attempts in disposable test database: %', v_count;
  END IF;
  RAISE NOTICE '4D-2 installed runtime guards: anonymous and unregistered users rejected';
END $test$;
ROLLBACK;
