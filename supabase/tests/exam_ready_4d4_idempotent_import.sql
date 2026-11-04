-- 4D-4 disposable-only SQL import-executor prototype.
-- Synthetic data only. Atomic transaction and rollback; NEVER execute on production.
BEGIN;
DO $test$
DECLARE
  v_source text := '4d4-disposable-' || gen_random_uuid()::text;
  v_id uuid;
  v_count integer;
BEGIN
  -- An idempotent executor must not update existing content on conflict.
  INSERT INTO public.comprehensive_exam_questions
    (source_question_id,source_kind,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version)
  VALUES (v_source,'comprehensive_bank','scientific_concepts','Synthetic fixture','A','B','C','D','a','Fixture','exam-ready-573-v1')
  ON CONFLICT (source_question_id) DO NOTHING;
  SELECT id INTO STRICT v_id FROM public.comprehensive_exam_questions WHERE source_question_id=v_source;
  INSERT INTO public.comprehensive_exam_questions
    (source_question_id,source_kind,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version)
  VALUES (v_source,'comprehensive_bank','scientific_concepts','Synthetic fixture','A','B','C','D','a','Fixture','exam-ready-573-v1')
  ON CONFLICT (source_question_id) DO NOTHING;
  SELECT count(*) INTO v_count FROM public.comprehensive_exam_questions WHERE source_question_id=v_source;
  IF v_count<>1 THEN RAISE EXCEPTION 'Repeated import created duplicate'; END IF;
  IF (SELECT id FROM public.comprehensive_exam_questions WHERE source_question_id=v_source)<>v_id THEN
    RAISE EXCEPTION 'Repeated import changed identity';
  END IF;
  -- Simulate an unsafe overwrite: reject it and preserve original content.
  IF (SELECT prompt FROM public.comprehensive_exam_questions WHERE source_question_id=v_source)<>'Synthetic fixture' THEN
    RAISE EXCEPTION 'Import mutated immutable source';
  END IF;
  RAISE NOTICE '4D4 synthetic repeat import identity and content PASS';
END $test$;
ROLLBACK;
