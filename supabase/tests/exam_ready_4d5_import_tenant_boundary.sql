-- 4D-5 synthetic import tenant isolation: no student role may read private answer keys
-- or mutate registry/config links. Disposable database only.
BEGIN;
DO $test$
BEGIN
 IF has_table_privilege('authenticated','public.comprehensive_exam_questions','SELECT') THEN
  -- A table grant may be restricted by RLS; assert RLS is enabled if granted.
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.comprehensive_exam_questions'::regclass) THEN
   RAISE EXCEPTION 'Authenticated role has unprotected private registry SELECT';
  END IF;
 END IF;
 IF has_table_privilege('anon','public.comprehensive_exam_questions','SELECT') THEN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.comprehensive_exam_questions'::regclass) THEN
   RAISE EXCEPTION 'Anonymous role has unprotected private registry SELECT';
  END IF;
 END IF;
 IF has_table_privilege('authenticated','public.comprehensive_exam_config_questions','INSERT')
 OR has_table_privilege('authenticated','public.comprehensive_exam_config_questions','UPDATE')
 OR has_table_privilege('authenticated','public.comprehensive_exam_config_questions','DELETE')
 OR has_table_privilege('anon','public.comprehensive_exam_config_questions','INSERT')
 OR has_table_privilege('anon','public.comprehensive_exam_config_questions','UPDATE')
 OR has_table_privilege('anon','public.comprehensive_exam_config_questions','DELETE') THEN
  RAISE EXCEPTION 'Student/anonymous roles can alter exam question links';
 END IF;
 RAISE NOTICE '4D5 import registry/link grant and RLS boundary PASS';
END $test$;
ROLLBACK;
