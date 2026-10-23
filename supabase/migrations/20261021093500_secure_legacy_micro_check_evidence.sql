-- QUIZ-MICRO-ANALYTICS-3O: legacy micro-check answers are graded by authenticated
-- server routes before the service-role insert. Never accept client-authored
-- correctness/metadata through the Data API, including for Chapters 1-18.
--
-- Existing records remain unchanged. SELECT owner/staff policies remain in place.
-- The trusted server routes use the service_role and do not depend on this grant.
drop policy if exists chapter_micro_check_attempts_student_insert on public.chapter_micro_check_attempts;
revoke insert on table public.chapter_micro_check_attempts from authenticated;
-- Keep legitimate service-role inserts working.
grant insert on table public.chapter_micro_check_attempts to service_role;
