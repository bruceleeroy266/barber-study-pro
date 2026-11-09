-- 4D-5 disposable-only import security checks. No real questions, no production.
BEGIN;
DO $test$
DECLARE n integer;
BEGIN
  -- Import executor must never become a persistent public RPC.
  SELECT count(*) INTO n FROM pg_proc p JOIN pg_namespace ns ON ns.oid=p.pronamespace
  WHERE ns.nspname='public' AND p.proname IN ('_4d4_execute','import_exam_ready_bank','execute_exam_ready_import');
  IF n<>0 THEN RAISE EXCEPTION 'Import executor exposed as persistent public RPC'; END IF;
  -- The anonymous role must not have direct registry write access.
  IF has_table_privilege('anon','public.comprehensive_exam_questions','INSERT')
     OR has_table_privilege('anon','public.comprehensive_exam_questions','UPDATE')
     OR has_table_privilege('anon','public.comprehensive_exam_questions','DELETE') THEN
     RAISE EXCEPTION 'Anonymous role can mutate private question registry';
  END IF;
  -- The authenticated role must not mutate the private question bank.
  IF has_table_privilege('authenticated','public.comprehensive_exam_questions','INSERT')
     OR has_table_privilege('authenticated','public.comprehensive_exam_questions','UPDATE')
     OR has_table_privilege('authenticated','public.comprehensive_exam_questions','DELETE') THEN
     RAISE EXCEPTION 'Authenticated role can mutate private question registry';
  END IF;
  -- Ensure no real Exam Ready source content is present in the disposable fixture DB.
  SELECT count(*) INTO n FROM public.comprehensive_exam_questions
  WHERE content_version='exam-ready-573-v1' AND source_question_id NOT LIKE '4d2-disposable-%'
  AND source_question_id NOT LIKE '4d4-%';
  IF n<>0 THEN RAISE EXCEPTION 'Unexpected non-fixture bank content in disposable database'; END IF;
  RAISE NOTICE '4D5 private registry write privileges and executor exposure PASS';
END $test$;
ROLLBACK;
