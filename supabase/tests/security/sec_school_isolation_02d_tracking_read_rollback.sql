-- SEC-SCHOOL-ISOLATION-02D — isolated QA regression, no permanent fixtures.
-- DO NOT RUN AGAINST PRODUCTION. All synthetic writes are rolled back.
-- Requires authority to create synthetic auth.users, and to SET ROLE for testing.
BEGIN;

-- Permission-denial probes: no fixture needed because caller must be rejected at EXECUTE grant.
SET LOCAL ROLE anon;
DO $denial$ DECLARE cmd text; denied boolean; BEGIN
FOREACH cmd IN ARRAY ARRAY[
$sql$select * from public.check_sustained_performance_reset_eligibility('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT')$sql$,
$sql$select public.record_detection_state_transition('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT','ch-2','currently_performing_well','{}'::jsonb)$sql$,
$sql$select public.record_follow_up_evidence('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT','ch-2','901b9a6b-4a62-4acb-a85e-000000000005'::uuid,true,1)$sql$,
$sql$select public.execute_sustained_performance_reset('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT',null::uuid)$sql$
] LOOP denied:=false; BEGIN EXECUTE cmd; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
IF NOT denied THEN RAISE EXCEPTION 'Expected anon role execution denial'; END IF;
END LOOP;
END $denial$;
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $denial$ DECLARE cmd text; denied boolean; BEGIN
FOREACH cmd IN ARRAY ARRAY[
$sql$select * from public.check_sustained_performance_reset_eligibility('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT')$sql$,
$sql$select public.record_detection_state_transition('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT','ch-2','currently_performing_well','{}'::jsonb)$sql$,
$sql$select public.record_follow_up_evidence('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT','ch-2','901b9a6b-4a62-4acb-a85e-000000000005'::uuid,true,1)$sql$,
$sql$select public.execute_sustained_performance_reset('901b9a6b-4a62-4acb-a85e-000000000002'::uuid,'SEC-02C-CONCEPT',null::uuid)$sql$
] LOOP denied:=false; BEGIN EXECUTE cmd; EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
IF NOT denied THEN RAISE EXCEPTION 'Expected authenticated role execution denial'; END IF;
END LOOP;
END $denial$;
RESET ROLE;

-- Synthetic fixture with two separate schools and students.
DO $setup$ DECLARE
a uuid:='901b9a6b-4a62-4acb-a85e-000000000001'; b uuid:='901b9a6b-4a62-4acb-a85e-000000000002';
sa uuid:='901b9a6b-4a62-4acb-a85e-000000000003'; sb uuid:='901b9a6b-4a62-4acb-a85e-000000000004';
BEGIN
IF EXISTS (SELECT 1 FROM auth.users WHERE id IN(a,b)) OR EXISTS(SELECT 1 FROM public.schools WHERE id IN(sa,sb))
THEN RAISE EXCEPTION 'Synthetic fixture UUID collision'; END IF;
INSERT INTO auth.users(id,instance_id,aud,role,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at) VALUES
(a,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','sec02c-a@invalid.example',now(),'{}','{"role":"student"}',now(),now()),
(b,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','sec02c-b@invalid.example',now(),'{}','{"role":"student"}',now(),now());
INSERT INTO public.schools(id,name,slug) VALUES(sa,'SEC-02C Synthetic School A','sec02c-synth-a'),(sb,'SEC-02C Synthetic School B','sec02c-synth-b');
UPDATE public.profiles SET school_id=sa,approval_status='approved' WHERE id=a;
UPDATE public.profiles SET school_id=sb,approval_status='approved' WHERE id=b;
INSERT INTO public.sustained_performance_tracking(user_id,concept_id,chapter_id,entered_cpw_at,last_verified_at) VALUES
(a,'SEC-02C-CONCEPT','ch-2',now()-interval '40 days',now()-interval '1 day'),
(b,'SEC-02C-CONCEPT','ch-2',now()-interval '40 days',now()-interval '1 day');
INSERT INTO public.quiz_attempts(id,user_id,quiz_id,score,total_questions,percentage,answers_json,completed_at)
VALUES('901b9a6b-4a62-4acb-a85e-000000000005',b,'quiz-2',1,1,100,'{"q1":"a"}',now());
END $setup$;

SET LOCAL ROLE service_role;
DO $call$ DECLARE e uuid; r uuid; BEGIN
-- Verify the exact direct read used by the application client succeeds as service_role.
IF NOT EXISTS (
  SELECT 1 FROM public.sustained_performance_tracking
  WHERE user_id='901b9a6b-4a62-4acb-a85e-000000000002'::uuid
    AND concept_id='SEC-02C-CONCEPT' AND is_active
) THEN RAISE EXCEPTION 'service_role direct tracking SELECT failed'; END IF;
PERFORM public.record_detection_state_transition('901b9a6b-4a62-4acb-a85e-000000000002','SEC-02C-CONCEPT','ch-2','currently_performing_well','{}');
e:=public.record_follow_up_evidence('901b9a6b-4a62-4acb-a85e-000000000002','SEC-02C-CONCEPT','ch-2','901b9a6b-4a62-4acb-a85e-000000000005',true,1);
IF e IS NULL THEN RAISE EXCEPTION 'Follow-up evidence not recorded'; END IF;
IF NOT EXISTS (SELECT 1 FROM public.check_sustained_performance_reset_eligibility('901b9a6b-4a62-4acb-a85e-000000000002','SEC-02C-CONCEPT') WHERE is_eligible)
THEN RAISE EXCEPTION '40-day synthetic user not eligible'; END IF;
r:=public.execute_sustained_performance_reset('901b9a6b-4a62-4acb-a85e-000000000002','SEC-02C-CONCEPT',NULL);
IF r IS NULL THEN RAISE EXCEPTION 'Reset did not return an ID'; END IF;
END $call$;
RESET ROLE;

DO $verify$ BEGIN
IF NOT EXISTS (SELECT 1 FROM public.sustained_performance_tracking WHERE user_id='901b9a6b-4a62-4acb-a85e-000000000002' AND NOT is_active AND reset_id IS NOT NULL AND follow_up_evidence_count=1)
THEN RAISE EXCEPTION 'School B tracking did not finish'; END IF;
IF NOT EXISTS (SELECT 1 FROM public.sustained_performance_resets WHERE user_id='901b9a6b-4a62-4acb-a85e-000000000002' AND follow_up_evidence_count=1)
THEN RAISE EXCEPTION 'School B reset record missing'; END IF;
IF NOT EXISTS (SELECT 1 FROM public.sustained_performance_tracking WHERE user_id='901b9a6b-4a62-4acb-a85e-000000000001' AND is_active AND reset_id IS NULL AND follow_up_evidence_count=0)
THEN RAISE EXCEPTION 'School A state changed'; END IF;
END $verify$;

ROLLBACK;
SELECT 'PASS: service-role direct tracking read; eight forbidden RPC calls; synthetic Chapter 2 RPC lifecycle; cross-school preservation; ROLLBACK' AS outcome;
