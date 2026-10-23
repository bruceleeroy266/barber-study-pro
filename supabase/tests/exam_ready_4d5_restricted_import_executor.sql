-- Stage 4D-5 restricted server-side import executor. NOT a migration or public RPC.
-- Use only inside a separately authorized disposable database transaction.
-- Caller MUST create and populate pg_temp.exam_ready_import_manifest with the
-- reviewed 573 question rows BEFORE invoking this function, in the SAME session.
-- Do not install this function persistently. Never execute against production.
CREATE OR REPLACE FUNCTION pg_temp.exam_ready_execute_import(p_config_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, public, pg_temp AS $executor$
DECLARE v_config public.comprehensive_exam_configs%rowtype; v_digest text;
BEGIN
 IF current_user <> 'postgres' OR session_user <> 'postgres' THEN
  RAISE EXCEPTION 'Importer requires isolated database owner session';
 END IF;
 IF current_setting('transaction_isolation') <> 'repeatable read' THEN
  RAISE EXCEPTION 'Importer requires database-enforced REPEATABLE READ transaction';
 END IF;
 IF to_regclass('pg_temp.exam_ready_import_manifest') IS NULL THEN
  RAISE EXCEPTION 'Reviewed manifest must be staged in session-local temporary table';
 END IF;
 PERFORM pg_advisory_xact_lock(hashtext('exam-ready-import'),hashtext(p_config_id::text));
 SELECT * INTO STRICT v_config FROM public.comprehensive_exam_configs WHERE id=p_config_id FOR UPDATE;
 IF v_config.status <> 'draft' OR v_config.blueprint_version <> 'exam-ready-573-blueprint-v1'
 OR v_config.question_bank_version <> 'exam-ready-573-v1' OR v_config.scoring_policy_version <> 'po1c-scoring-v1'
 OR v_config.time_limit_seconds <> 5400 OR v_config.passing_percentage <> 70 THEN
  RAISE EXCEPTION 'Unexpected draft configuration';
 END IF;
 IF (SELECT count(*) FROM pg_temp.exam_ready_import_manifest) <> 573
 OR (SELECT count(DISTINCT source_question_id) FROM pg_temp.exam_ready_import_manifest) <> 573
 OR (SELECT count(*) FROM pg_temp.exam_ready_import_manifest WHERE domain='scientific_concepts')<>274
 OR (SELECT count(*) FROM pg_temp.exam_ready_import_manifest WHERE domain='implements_equipment')<>56
 OR (SELECT count(*) FROM pg_temp.exam_ready_import_manifest WHERE domain='hair_care_services')<>173
 OR (SELECT count(*) FROM pg_temp.exam_ready_import_manifest WHERE domain='facial_hair_skin_care_services')<>70
 OR EXISTS (SELECT 1 FROM pg_temp.exam_ready_import_manifest WHERE content_version <> 'exam-ready-573-v1'
 OR source_question_id IS NULL OR prompt IS NULL OR correct_option NOT IN ('a','b','c','d')) THEN
  RAISE EXCEPTION 'Incomplete or invalid staged manifest';
 END IF;
 -- The fingerprint is pinned to the reviewed synthetic fixture for this disposable certification.\n -- Real-bank import MUST NOT be attempted until an independently reviewed digest\n -- replaces this fixture pin in a separately approved change.\n SELECT encode(digest(string_agg(concat_ws(E'\\x1f',source_question_id,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version),E'\\x1e' ORDER BY source_question_id),'sha256'),'hex')\n INTO v_digest FROM pg_temp.exam_ready_import_manifest;\n IF v_digest IS DISTINCT FROM 'b8b8fe128bfb5c67b76356eda0a47b43df762209e3a6acdb73f8ab04a9285735' THEN\n  RAISE EXCEPTION 'Unapproved manifest fingerprint';\n END IF;\n -- Verify all existing registry identities before any write, under the same snapshot.
 IF EXISTS (SELECT 1 FROM pg_temp.exam_ready_import_manifest m
 JOIN public.comprehensive_exam_questions q USING(source_question_id)
 WHERE q.source_kind <> 'comprehensive_bank' OR q.status <> 'active'
 OR q.domain IS DISTINCT FROM m.domain OR q.prompt IS DISTINCT FROM m.prompt
 OR q.option_a IS DISTINCT FROM m.option_a OR q.option_b IS DISTINCT FROM m.option_b
 OR q.option_c IS DISTINCT FROM m.option_c OR q.option_d IS DISTINCT FROM m.option_d
 OR q.correct_option IS DISTINCT FROM m.correct_option OR q.explanation IS DISTINCT FROM m.explanation
 OR q.content_version IS DISTINCT FROM m.content_version) THEN
  RAISE EXCEPTION 'Pre-insert registry collision';
 END IF;
 INSERT INTO public.comprehensive_exam_questions
 (source_question_id,source_kind,domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version)
 SELECT source_question_id,'comprehensive_bank',domain,prompt,option_a,option_b,option_c,option_d,correct_option,explanation,content_version
 FROM pg_temp.exam_ready_import_manifest ON CONFLICT(source_question_id) DO NOTHING;
 -- Recheck every row after conflict handling: no silent overwrite or partial import.
 IF (SELECT count(*) FROM pg_temp.exam_ready_import_manifest m JOIN public.comprehensive_exam_questions q USING(source_question_id))<>573
 OR EXISTS (SELECT 1 FROM pg_temp.exam_ready_import_manifest m
 JOIN public.comprehensive_exam_questions q USING(source_question_id)
 WHERE q.source_kind <> 'comprehensive_bank' OR q.status <> 'active'
 OR q.domain IS DISTINCT FROM m.domain OR q.prompt IS DISTINCT FROM m.prompt
 OR q.option_a IS DISTINCT FROM m.option_a OR q.option_b IS DISTINCT FROM m.option_b
 OR q.option_c IS DISTINCT FROM m.option_c OR q.option_d IS DISTINCT FROM m.option_d
 OR q.correct_option IS DISTINCT FROM m.correct_option OR q.explanation IS DISTINCT FROM m.explanation
 OR q.content_version IS DISTINCT FROM m.content_version) THEN
  RAISE EXCEPTION 'Post-insert registry collision';
 END IF;
 INSERT INTO public.comprehensive_exam_config_questions(config_id,question_id,scored_eligible,unscored_eligible,is_active)
 SELECT p_config_id,q.id,true,true,true FROM pg_temp.exam_ready_import_manifest m
 JOIN public.comprehensive_exam_questions q USING(source_question_id)
 ON CONFLICT(config_id,question_id) DO NOTHING;
 IF (SELECT count(*) FROM public.comprehensive_exam_config_questions WHERE config_id=p_config_id)<>573
 OR EXISTS (SELECT 1 FROM public.comprehensive_exam_config_questions l
 LEFT JOIN public.comprehensive_exam_questions q ON q.id=l.question_id
 LEFT JOIN pg_temp.exam_ready_import_manifest m ON m.source_question_id=q.source_question_id
 WHERE l.config_id=p_config_id AND (m.source_question_id IS NULL OR NOT l.scored_eligible OR NOT l.unscored_eligible OR NOT l.is_active)) THEN
  RAISE EXCEPTION 'Draft links incomplete or contaminated';
 END IF;
END $executor$;
