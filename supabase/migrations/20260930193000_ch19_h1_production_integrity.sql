-- C19-H1 — Production Integrity Hardening
--
-- Chapter 19 moves micro-check and activity evidence writes behind
-- authenticated server routes that derive canonical concept/correctness
-- data from repository-owned Chapter 19 banks. Direct authenticated writes
-- for ch-19 are therefore denied while the service role remains authoritative.
--
-- Initial Chapter 19 quiz attempts remain student-insertable through the
-- existing quiz UI, but once persisted students may no longer update/delete
-- quiz-19 evidence. Service-role remediation/reassessment writes are unchanged.

drop policy if exists chapter_micro_check_attempts_student_insert on public.chapter_micro_check_attempts;
create policy chapter_micro_check_attempts_student_insert
on public.chapter_micro_check_attempts
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and chapter_id <> 'ch-19'
);

drop policy if exists chapter_activity_evidence_student_insert on public.chapter_activity_evidence;
create policy chapter_activity_evidence_student_insert
on public.chapter_activity_evidence
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and chapter_id <> 'ch-19'
);

drop policy if exists "quiz_attempts_update" on public.quiz_attempts;
create policy "quiz_attempts_update" on public.quiz_attempts
  for update to authenticated
  using (
    auth.uid() = user_id
    and quiz_id <> 'quiz-19'
  )
  with check (
    auth.uid() = user_id
    and quiz_id <> 'quiz-19'
  );

drop policy if exists "quiz_attempts_delete" on public.quiz_attempts;
create policy "quiz_attempts_delete" on public.quiz_attempts
  for delete to authenticated
  using (
    auth.uid() = user_id
    and quiz_id <> 'quiz-19'
  );

comment on table public.chapter_micro_check_attempts is
  'Immutable first-attempt lesson micro-check evidence. Chapter 19 inserts are server-authoritative; other certified chapters retain their existing authenticated insert path.';

comment on table public.chapter_activity_evidence is
  'Immutable first-attempt flashcard/scenario evidence. Chapter 19 inserts are server-authoritative; other certified chapters retain their existing authenticated insert path.';
