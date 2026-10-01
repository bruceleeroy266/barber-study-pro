-- A21-5 — Chapters 19-21 authoritative first-attempt evidence hardening.
-- Extends the certified Chapter 19 boundary to Chapters 20-21, whose
-- canonical micro-check/activity routes already derive correctness server-side.

drop policy if exists chapter_micro_check_attempts_student_insert on public.chapter_micro_check_attempts;
create policy chapter_micro_check_attempts_student_insert
on public.chapter_micro_check_attempts
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and chapter_id not in ('ch-19', 'ch-20', 'ch-21')
);

drop policy if exists chapter_activity_evidence_student_insert on public.chapter_activity_evidence;
create policy chapter_activity_evidence_student_insert
on public.chapter_activity_evidence
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and chapter_id not in ('ch-19', 'ch-20', 'ch-21')
);

drop policy if exists "quiz_attempts_update" on public.quiz_attempts;
create policy "quiz_attempts_update" on public.quiz_attempts
for update to authenticated
using (
  auth.uid() = user_id
  and quiz_id not in ('quiz-19', 'quiz-20', 'quiz-21')
)
with check (
  auth.uid() = user_id
  and quiz_id not in ('quiz-19', 'quiz-20', 'quiz-21')
);

drop policy if exists "quiz_attempts_delete" on public.quiz_attempts;
create policy "quiz_attempts_delete" on public.quiz_attempts
for delete to authenticated
using (
  auth.uid() = user_id
  and quiz_id not in ('quiz-19', 'quiz-20', 'quiz-21')
);

comment on table public.chapter_micro_check_attempts is
  'Immutable first-attempt lesson micro-check evidence. Chapters 19-21 are server-authoritative; earlier certified chapters retain their existing authenticated first-attempt insert path.';

comment on table public.chapter_activity_evidence is
  'Immutable first-attempt flashcard/scenario evidence. Chapters 19-21 are server-authoritative; earlier certified chapters retain their existing authenticated first-attempt insert path.';
