-- Synthetic disposable certification for the restricted temporary executor.
-- Requires the executor definition earlier in the SAME psql session.
BEGIN ISOLATION LEVEL REPEATABLE READ;
CREATE TEMP TABLE exam_ready_import_manifest (
 source_question_id text PRIMARY KEY,domain text NOT NULL,prompt text NOT NULL,
 option_a text NOT NULL,option_b text NOT NULL,option_c text NOT NULL,option_d text NOT NULL,
 correct_option text NOT NULL,explanation text NOT NULL,content_version text NOT NULL
) ON COMMIT DROP;
INSERT INTO exam_ready_import_manifest
SELECT '4d5-restricted-'||g::text,
 CASE WHEN g<=274 THEN 'scientific_concepts' WHEN g<=330 THEN 'implements_equipment'
 WHEN g<=503 THEN 'hair_care_services' ELSE 'facial_hair_skin_care_services' END,
 'Synthetic '||g,'A','B','C','D','a','Synthetic explanation','exam-ready-573-v1'
FROM generate_series(1,573) g;
DO $test$
DECLARE c uuid:=gen_random_uuid(); n int; school_a uuid:=gen_random_uuid(); school_b uuid:=gen_random_uuid();
BEGIN
 INSERT INTO public.comprehensive_exam_configs
 (id,slug,version,title,status,blueprint_version,question_bank_version,scoring_policy_version,time_limit_seconds,passing_percentage)
 VALUES(c,'4d5-restricted-'||c::text,1,'Disposable','draft','exam-ready-573-blueprint-v1','exam-ready-573-v1','po1c-scoring-v1',5400,70);
 INSERT INTO public.schools(id,name) VALUES(school_a,'4D5 Import Tenant A'),(school_b,'4D5 Import Tenant B');
 -- Both school contexts must be unable to invoke the exact restricted importer.
 FOR n IN 1..2 LOOP
 BEGIN
  PERFORM set_config('request.jwt.claims',json_build_object('role','authenticated','school_id',CASE WHEN n=1 THEN school_a ELSE school_b END)::text,true);
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM pg_temp.exam_ready_execute_import(c);
  RAISE EXCEPTION 'Authenticated import unexpectedly succeeded';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 WHEN raise_exception THEN
  IF SQLERRM='Authenticated import unexpectedly succeeded' THEN RAISE; END IF;
  IF SQLERRM NOT LIKE '%requires isolated database owner%' THEN RAISE; END IF;
 END;
 EXECUTE 'RESET ROLE';
 END LOOP;
 PERFORM pg_temp.exam_ready_execute_import(c);
 PERFORM pg_temp.exam_ready_execute_import(c);
 SELECT count(*) INTO n FROM public.comprehensive_exam_config_questions WHERE config_id=c;
 IF n<>573 THEN RAISE EXCEPTION 'Idempotent import links count mismatch'; END IF;
 UPDATE exam_ready_import_manifest SET prompt='Tampered' WHERE source_question_id='4d5-restricted-1';
 BEGIN
  PERFORM pg_temp.exam_ready_execute_import(c);
  RAISE EXCEPTION 'Changed content accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM='Changed content accepted' THEN RAISE; END IF;
 END;
 IF (SELECT prompt FROM public.comprehensive_exam_questions WHERE source_question_id='4d5-restricted-1')<>'Synthetic 1'
 THEN RAISE EXCEPTION 'Collision changed stored content'; END IF;
 RAISE NOTICE '4D5 restricted executor: pinned SHA256, two-school role denial, repeatable-read, 573 idempotency and collision PASS';
END $test$;
ROLLBACK;
