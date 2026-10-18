-- 4D-4 DISPOSABLE ONLY: 573-row atomic executor prototype.
-- Synthetic staging; NEVER run against production or real Exam Ready bank.
BEGIN;
CREATE TEMP TABLE _4d4_manifest (
 source_question_id text PRIMARY KEY, domain text NOT NULL, prompt text NOT NULL,
 option_a text NOT NULL, option_b text NOT NULL, option_c text NOT NULL, option_d text NOT NULL,
 correct_option text NOT NULL, explanation text NOT NULL, content_version text NOT NULL
) ON COMMIT DROP;
INSERT INTO _4d4_manifest
SELECT '4d4-executor-'||g::text,
 CASE WHEN g<=274 THEN 'scientific_concepts' WHEN g<=330 THEN 'implements_equipment'
 WHEN g<=503 THEN 'hair_care_services' ELSE 'facial_hair_skin_care_services' END,
 'Synthetic '||g,'A','B','C','D','a','Synthetic explanation','exam-ready-573-v1'
FROM generate_series(1,573) g;

CREATE OR REPLACE FUNCTION pg_temp._4d4_execute(p_config_id uuid)
RETURNS void LANGUAGE plpgsql AS $fn$
DECLARE v_n integer; v_conf public.comprehensive_exam_configs%rowtype;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext('4d4-import'),hashtext(p_config_id::text));
 SELECT * INTO STRICT v_conf FROM public.comprehensive_exam_configs WHERE id=p_config_id FOR UPDATE;
 IF v_conf.status <> 'draft' OR v_conf.blueprint_version <> 'exam-ready-573-blueprint-v1'
 OR v_conf.question_bank_version <> 'exam-ready-573-v1' THEN
  RAISE EXCEPTION 'Import target must be exact versioned draft';
 END IF;
 SELECT count(*) INTO v_n FROM _4d4_manifest;
 IF v_n<>573 OR EXISTS (SELECT 1 FROM _4d4_manifest WHERE content_version<>'exam-ready-573-v1') THEN
  RAISE EXCEPTION 'Incomplete or invalid manifest';
 END IF;
 -- Reconcile ALL existing source IDs; any conflict with changed content is fatal.
 IF EXISTS (
 SELECT 1 FROM _4d4_manifest m JOIN public.comprehensive_exam_questions q USING(source_question_id)
 WHERE q.source_kind <> 'comprehensive_bank' OR q.domain IS DISTINCT FROM m.domain
 OR q.prompt IS DISTINCT FROM m.prompt OR q.option_a IS DISTINCT FROM m.option_a
 OR q.option_b IS DISTINCT FROM m.option_b OR q.option_c IS DISTINCT FROM m.option_c
 OR q.option_d IS DISTINCT FROM m.option_d OR q.correct_option IS DISTINCT FROM m.correct_option
 OR q.explanation IS DISTINCT FROM m.explanation OR q.content_version IS DISTINCT FROM m.content_version
 OR q.status <> 'active'
 ) THEN RAISE EXCEPTION 'Existing registry content collision'; END IF;
 INSERT INTO public.comprehensive_exam_questions
 (source_question_id,source_kind,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version)
 SELECT source_question_id,'comprehensive_bank',domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version
 FROM _4d4_manifest ON CONFLICT(source_question_id) DO NOTHING;
 -- Recheck after conflict to close race window; no overwrite allowed.
 IF (SELECT count(*) FROM _4d4_manifest m JOIN public.comprehensive_exam_questions q USING(source_question_id))<>573
 OR EXISTS (SELECT 1 FROM _4d4_manifest m JOIN public.comprehensive_exam_questions q USING(source_question_id)
 WHERE q.domain IS DISTINCT FROM m.domain OR q.prompt IS DISTINCT FROM m.prompt OR q.content_version IS DISTINCT FROM m.content_version)
 THEN RAISE EXCEPTION 'Post-insert registry mismatch'; END IF;
 INSERT INTO public.comprehensive_exam_config_questions(config_id,question_id,scored_eligible,unscored_eligible,is_active)
 SELECT p_config_id,q.id,true,true,true FROM _4d4_manifest m
 JOIN public.comprehensive_exam_questions q USING(source_question_id)
 ON CONFLICT(config_id,question_id) DO NOTHING;
 IF (SELECT count(*) FROM public.comprehensive_exam_config_questions WHERE config_id=p_config_id)<>573
 OR EXISTS (SELECT 1 FROM public.comprehensive_exam_config_questions
 WHERE config_id=p_config_id AND (NOT scored_eligible OR NOT unscored_eligible OR NOT is_active))
 THEN RAISE EXCEPTION 'Draft question links mismatch'; END IF;
END $fn$;

DO $test$
DECLARE v_config uuid:=gen_random_uuid(); v_n integer; v_first uuid;
BEGIN
 INSERT INTO public.comprehensive_exam_configs
 (id,slug,version,title,status,blueprint_version,question_bank_version,scoring_policy_version,time_limit_seconds,passing_percentage)
 VALUES(v_config,'4d4-executor-'||v_config::text,1,'Disposable','draft','exam-ready-573-blueprint-v1','exam-ready-573-v1','po1c-scoring-v1',5400,70);
 INSERT INTO public.comprehensive_exam_config_domains(config_id,domain,weight_percent,scored_question_count)
 VALUES(v_config,'scientific_concepts',35,35),(v_config,'implements_equipment',10,10),
 (v_config,'hair_care_services',40,40),(v_config,'facial_hair_skin_care_services',15,15);
 PERFORM pg_temp._4d4_execute(v_config);
 SELECT count(*) INTO v_n FROM public.comprehensive_exam_config_questions WHERE config_id=v_config;
 IF v_n<>573 THEN RAISE EXCEPTION 'First import not complete'; END IF;
 SELECT question_id INTO v_first FROM public.comprehensive_exam_config_questions WHERE config_id=v_config ORDER BY question_id LIMIT 1;
 PERFORM pg_temp._4d4_execute(v_config);
 IF (SELECT count(*) FROM public.comprehensive_exam_config_questions WHERE config_id=v_config)<>573 OR
 v_first IS DISTINCT FROM (SELECT question_id FROM public.comprehensive_exam_config_questions WHERE config_id=v_config ORDER BY question_id LIMIT 1)
 THEN RAISE EXCEPTION 'Repeat import not idempotent'; END IF;
 -- Force a conflict after the first complete import; assert rollback and preserved content.
 UPDATE _4d4_manifest SET prompt='tampered' WHERE source_question_id='4d4-executor-1';
 BEGIN
  PERFORM pg_temp._4d4_execute(v_config);
  RAISE EXCEPTION 'Tampered manifest accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM='Tampered manifest accepted' THEN RAISE; END IF;
 END;
 IF (SELECT prompt FROM public.comprehensive_exam_questions WHERE source_question_id='4d4-executor-1')<>'Synthetic 1'
 THEN RAISE EXCEPTION 'Conflict mutated existing question'; END IF;
 RAISE NOTICE '4D4 full synthetic 573-row atomic executor, repeat and conflict PASS';
END $test$;
ROLLBACK;
