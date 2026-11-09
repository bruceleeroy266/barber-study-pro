-- Stage 4D-3: DISPOSABLE SUPABASE TEST ONLY. NEVER run on production.
-- Demonstrates atomic draft configuration/domain preparation without question imports.
BEGIN;
DO $test$
DECLARE
  v_id uuid := gen_random_uuid();
  v_slug text := '4d3-disposable-' || gen_random_uuid()::text;
  v_count integer;
BEGIN
  INSERT INTO public.comprehensive_exam_configs
    (id,slug,version,title,status,blueprint_version,question_bank_version,scoring_policy_version,time_limit_seconds,passing_percentage,scored_question_count,unscored_question_count)
  VALUES (v_id,v_slug,1,'4D3 Disposable Draft','draft','exam-ready-573-blueprint-v1','exam-ready-573-v1','po1c-scoring-v1',5400,70,100,10);
  INSERT INTO public.comprehensive_exam_config_domains(config_id,domain,weight_percent,scored_question_count)
  VALUES (v_id,'scientific_concepts',35,35),(v_id,'implements_equipment',10,10),
    (v_id,'hair_care_services',40,40),(v_id,'facial_hair_skin_care_services',15,15);
  SELECT count(*) INTO v_count FROM public.comprehensive_exam_config_domains WHERE config_id=v_id;
  IF v_count <> 4 THEN RAISE EXCEPTION 'Draft domain configuration incomplete'; END IF;
  IF (SELECT status FROM public.comprehensive_exam_configs WHERE id=v_id) <> 'draft' THEN
    RAISE EXCEPTION 'Draft configuration unexpectedly active';
  END IF;
  IF EXISTS(SELECT 1 FROM public.comprehensive_exam_config_questions WHERE config_id=v_id) THEN
    RAISE EXCEPTION 'Draft preparation unexpectedly linked questions';
  END IF;
  -- Intentional duplicate must fail without leaking a second row.
  BEGIN
    INSERT INTO public.comprehensive_exam_config_domains(config_id,domain,weight_percent,scored_question_count)
    VALUES (v_id,'scientific_concepts',35,35);
    RAISE EXCEPTION 'Duplicate domain accepted';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;
  SELECT count(*) INTO v_count FROM public.comprehensive_exam_config_domains WHERE config_id=v_id;
  IF v_count <> 4 THEN RAISE EXCEPTION 'Duplicate domain corrupted draft'; END IF;
  -- Deliberately fail after a partial insert: exception subtransaction must roll back both rows.
  BEGIN
    INSERT INTO public.comprehensive_exam_config_domains(config_id,domain,weight_percent,scored_question_count)
    VALUES (v_id,'scientific_concepts',35,35);
    RAISE EXCEPTION 'Partial import unexpectedly accepted';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
  SELECT count(*) INTO v_count FROM public.comprehensive_exam_config_domains WHERE config_id=v_id;
  IF v_count <> 4 THEN RAISE EXCEPTION 'Partial insert not rolled back'; END IF;
  -- A repeated draft config with the same slug/version must fail without mutating the first.
  BEGIN
    INSERT INTO public.comprehensive_exam_configs(slug,version,title,status,blueprint_version,question_bank_version,scoring_policy_version)
    VALUES(v_slug,1,'Conflicting draft','draft','tampered','tampered','tampered');
    RAISE EXCEPTION 'Duplicate configuration accepted';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
  IF (SELECT count(*) FROM public.comprehensive_exam_configs WHERE slug=v_slug) <> 1 THEN
    RAISE EXCEPTION 'Repeat execution corrupted configuration';
  END IF;
  RAISE NOTICE '4D3 disposable atomic draft preparation and duplicate rollback PASS';
END $test$;
ROLLBACK;
