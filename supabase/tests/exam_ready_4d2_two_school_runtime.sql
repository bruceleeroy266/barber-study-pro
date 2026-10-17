-- LOCAL DISPOSABLE DATABASE ONLY: real start/resume RPC with two schools.
-- All fixture rows and attempts are rolled back; no production import/activation.
BEGIN;
DO $test$
DECLARE
  school_a uuid := gen_random_uuid(); school_b uuid := gen_random_uuid();
  user_a uuid := gen_random_uuid(); user_b uuid := gen_random_uuid();
  config_id uuid := gen_random_uuid();
  attempt_a uuid; attempt_b uuid; resumed uuid;
  response jsonb; v_item_count integer; mismatch integer; snapshot_before text; snapshot_after text;
BEGIN
  INSERT INTO public.schools(id,name) VALUES (school_a,'4D2 Disposable School A'),(school_b,'4D2 Disposable School B');
  INSERT INTO auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at)
  VALUES (user_a,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','4d2-school-a@example.test','',now(),now(),now()),
         (user_b,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','4d2-school-b@example.test','',now(),now(),now());
  INSERT INTO public.profiles(id,email,full_name,role,school_id,approval_status,is_disabled)
  VALUES (user_a,'4d2-school-a@example.test','4D2 A','student',school_a,'approved',false),
         (user_b,'4d2-school-b@example.test','4D2 B','student',school_b,'approved',false)
  ON CONFLICT(id) DO UPDATE SET role='student',school_id=excluded.school_id,approval_status='approved',is_disabled=false;
  INSERT INTO public.comprehensive_exam_configs(id,slug,version,title,status,blueprint_version,question_bank_version,scoring_policy_version,time_limit_seconds,passing_percentage,activated_at)
  VALUES (config_id,'4d2-isolated-runtime',1,'4D2 Isolated','active','exam-ready-573-blueprint-v1','exam-ready-573-v1','po1c-scoring-v1',5400,70,now());
  -- Runtime's version guard requires the exact approved slug.
  UPDATE public.comprehensive_exam_configs SET slug='nic-barber-theory-exam-ready' WHERE id=config_id;
  INSERT INTO public.comprehensive_exam_config_domains(config_id,domain,weight_percent,scored_question_count)
  VALUES (config_id,'scientific_concepts',35,35),(config_id,'implements_equipment',10,10),
    (config_id,'hair_care_services',40,40),(config_id,'facial_hair_skin_care_services',15,15);
  INSERT INTO public.comprehensive_exam_questions(source_question_id,source_kind,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version)
  SELECT '4d2-disposable-'||series.question_number,'certified_original',
    CASE WHEN series.question_number<=274 THEN 'scientific_concepts' WHEN series.question_number<=330 THEN 'implements_equipment' WHEN series.question_number<=503 THEN 'hair_care_services' ELSE 'facial_hair_skin_care_services' END,
    '4D2 synthetic question '||series.question_number,'A','B','C','D','a','4D2 fixture','exam-ready-573-v1'
  FROM generate_series(1,573) AS series(question_number);
  INSERT INTO public.comprehensive_exam_config_questions(config_id,question_id,scored_eligible,unscored_eligible,is_active)
  SELECT config_id,id,true,true,true FROM public.comprehensive_exam_questions WHERE source_question_id LIKE '4d2-disposable-%';

  PERFORM set_config('request.jwt.claim.sub',user_a::text,true);
  response := public.start_or_resume_comprehensive_exam(config_id);
  attempt_a := (response->>'attemptId')::uuid;
  IF attempt_a IS NULL THEN RAISE EXCEPTION 'School A attempt not created'; END IF;
  SELECT count(*) INTO v_item_count FROM public.comprehensive_exam_attempt_items WHERE attempt_id=attempt_a;
  IF v_item_count<>110 THEN RAISE EXCEPTION 'School A item count %',v_item_count; END IF;
  SELECT count(*) INTO mismatch FROM (
    SELECT domain,is_scored,count(*) AS qty FROM public.comprehensive_exam_attempt_items WHERE attempt_id=attempt_a GROUP BY domain,is_scored
  ) actual WHERE qty<>CASE WHEN is_scored THEN CASE domain WHEN 'scientific_concepts' THEN 35 WHEN 'implements_equipment' THEN 10 WHEN 'hair_care_services' THEN 40 ELSE 15 END
  ELSE CASE domain WHEN 'scientific_concepts' THEN 4 WHEN 'implements_equipment' THEN 1 WHEN 'hair_care_services' THEN 4 ELSE 1 END END;
  IF mismatch<>0 THEN RAISE EXCEPTION 'School A quota mismatch'; END IF;
  IF response::text LIKE '%correct_option_snapshot%' OR response::text LIKE '%is_scored%' THEN RAISE EXCEPTION 'Answer key leaked in RPC'; END IF;
  SELECT md5(string_agg(question_id::text||':'||prompt_snapshot||':'||correct_option_snapshot,',' ORDER BY position)) INTO snapshot_before
  FROM public.comprehensive_exam_attempt_items WHERE attempt_id=attempt_a;
  resumed := (public.start_or_resume_comprehensive_exam(config_id)->>'attemptId')::uuid;
  IF resumed IS DISTINCT FROM attempt_a THEN RAISE EXCEPTION 'Resume created a new attempt'; END IF;
  SELECT md5(string_agg(question_id::text||':'||prompt_snapshot||':'||correct_option_snapshot,',' ORDER BY position)) INTO snapshot_after
  FROM public.comprehensive_exam_attempt_items WHERE attempt_id=attempt_a;
  IF snapshot_before IS DISTINCT FROM snapshot_after THEN RAISE EXCEPTION 'Resume changed immutable snapshots'; END IF;

  PERFORM set_config('request.jwt.claim.sub',user_b::text,true);
  response := public.start_or_resume_comprehensive_exam(config_id);
  attempt_b := (response->>'attemptId')::uuid;
  IF attempt_b IS NULL OR attempt_b=attempt_a THEN RAISE EXCEPTION 'School B attempt not independent'; END IF;
  SELECT count(*) INTO v_item_count FROM public.comprehensive_exam_attempts WHERE id IN(attempt_a,attempt_b) AND
    ((id=attempt_a AND user_id=user_a AND school_id=school_a) OR (id=attempt_b AND user_id=user_b AND school_id=school_b));
  IF v_item_count<>2 THEN RAISE EXCEPTION 'Attempt tenant ownership mismatch'; END IF;
  -- Authenticated student B must not read school A's attempt via RLS.
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO v_item_count FROM public.comprehensive_exam_attempts WHERE id=attempt_a;
  RESET ROLE;
  IF v_item_count<>0 THEN RAISE EXCEPTION 'Cross-school attempt visible to student B'; END IF;
  RAISE NOTICE '4D2 two-school real RPC: independent attempts, 110 quotas, resume, immutable snapshots, RLS PASS';
END $test$;
ROLLBACK;
