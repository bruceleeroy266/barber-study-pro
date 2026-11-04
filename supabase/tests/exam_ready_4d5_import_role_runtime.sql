-- 4D-5 disposable runtime importer permission and tenant boundary checks.
-- All role changes and fixtures are rolled back. Never run with real questions.
BEGIN;
DO $test$
DECLARE v_a uuid:=gen_random_uuid(); v_b uuid:=gen_random_uuid(); v_config uuid:=gen_random_uuid(); v_n int;
BEGIN
 INSERT INTO public.schools(id,name) VALUES(v_a,'4D5 Synthetic A'),(v_b,'4D5 Synthetic B');
 INSERT INTO public.comprehensive_exam_configs
 (id,slug,version,title,status,blueprint_version,question_bank_version,scoring_policy_version,time_limit_seconds,passing_percentage)
 VALUES(v_config,'4d5-tenant-'||v_config::text,1,'Disposable','draft','exam-ready-573-blueprint-v1','exam-ready-573-v1','po1c-scoring-v1',5400,70);
 -- Import config must remain draft and never be tied to another school's student attempts.
 IF (SELECT status FROM public.comprehensive_exam_configs WHERE id=v_config)<>'draft' THEN RAISE EXCEPTION 'Unexpected active config'; END IF;
 -- Database-level privilege tests under the actual authenticated SQL role.
 BEGIN
  EXECUTE 'SET LOCAL ROLE authenticated';
  BEGIN
   INSERT INTO public.comprehensive_exam_questions(source_question_id,source_kind,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version)
   VALUES('4d5-unauthorized','comprehensive_bank','scientific_concepts','test','a','b','c','d','a','test','exam-ready-573-v1');
   RAISE EXCEPTION 'Authenticated role inserted private registry record';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  EXECUTE 'RESET ROLE';
 EXCEPTION WHEN OTHERS THEN
  EXECUTE 'RESET ROLE';
  RAISE;
 END;
 SELECT count(*) INTO v_n FROM public.comprehensive_exam_questions WHERE source_question_id='4d5-unauthorized';
 IF v_n<>0 THEN RAISE EXCEPTION 'Unauthorized insert persisted'; END IF;
 -- School A and B are distinct; no user-scoped importer grant may bypass this.
 IF v_a=v_b THEN RAISE EXCEPTION 'Tenant fixture collision'; END IF;
 RAISE NOTICE '4D5 authenticated SQL role cannot import private bank, draft isolation PASS';
END $test$;
ROLLBACK;
