-- QUIZ-MICRO-ANALYTICS-3O server-scored quiz insert boundary.
-- Existing records are preserved. Students read their own score records but
-- cannot manufacture score/percentage/answers_json by direct Data API calls.
-- The trusted server endpoint validates auth, question IDs and grades.
drop policy if exists "quiz_attempts_insert" on public.quiz_attempts;
drop policy if exists "Users can insert own quiz attempts" on public.quiz_attempts;
revoke insert on public.quiz_attempts from authenticated;
grant insert on public.quiz_attempts to service_role;
