-- HA-4 — Chapters 1-18 Persistence + Immutable Evidence Hardening
--
-- Completed assessment/reassessment rows are historical evidence. Students may
-- create their own initial attempts through the existing authenticated path,
-- but may not rewrite or delete completed evidence. Reassessment rows are
-- server-authoritative and are likewise immutable to authenticated clients.
--
-- Service-role remediation RPCs remain able to append new evidence. No grading
-- threshold, mastery policy, or Chapter 19 behavior is changed here.

drop policy if exists "quiz_attempts_update" on public.quiz_attempts;
create policy "quiz_attempts_update" on public.quiz_attempts
  for update to authenticated
  using (
    auth.uid() = user_id
    and completed_at is null
    and coalesce(is_reassessment, false) = false
    and quiz_id <> 'quiz-19'
  )
  with check (
    auth.uid() = user_id
    and completed_at is null
    and coalesce(is_reassessment, false) = false
    and quiz_id <> 'quiz-19'
  );

drop policy if exists "quiz_attempts_delete" on public.quiz_attempts;
create policy "quiz_attempts_delete" on public.quiz_attempts
  for delete to authenticated
  using (
    auth.uid() = user_id
    and completed_at is null
    and coalesce(is_reassessment, false) = false
    and quiz_id <> 'quiz-19'
  );

-- Defense in depth: even privileged application code must not rewrite/delete
-- completed evidence accidentally. The service role may insert new attempts;
-- PostgreSQL superusers retain administrative recovery capability.
create or replace function public.prevent_completed_quiz_attempt_modification()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.completed_at is not null then
    raise exception 'Completed quiz attempt evidence is immutable';
  end if;

  if coalesce(old.is_reassessment, false) then
    raise exception 'Reassessment evidence is immutable';
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists enforce_completed_quiz_attempt_immutability on public.quiz_attempts;
create trigger enforce_completed_quiz_attempt_immutability
  before update or delete on public.quiz_attempts
  for each row execute function public.prevent_completed_quiz_attempt_modification();

comment on function public.prevent_completed_quiz_attempt_modification() is
  'HA-4: prevents UPDATE/DELETE of completed assessment and reassessment evidence while allowing append-only new attempts.';


-- The cycle's initial detection snapshot is historical evidence. Lifecycle
-- fields may advance, but the original detection evidence/identity may not be
-- rewritten after INSERT.
create or replace function public.prevent_remediation_detection_snapshot_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.user_id is distinct from old.user_id
    or new.concept_id is distinct from old.concept_id
    or new.chapter_id is distinct from old.chapter_id
    or new.cycle_number is distinct from old.cycle_number
    or new.detection_state is distinct from old.detection_state
    or new.detection_confidence is distinct from old.detection_confidence
    or new.detection_evidence is distinct from old.detection_evidence
    or new.targeted_at is distinct from old.targeted_at
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Initial remediation detection evidence is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_remediation_detection_snapshot_immutability
  on public.remediation_cycles;
create trigger enforce_remediation_detection_snapshot_immutability
  before update on public.remediation_cycles
  for each row execute function public.prevent_remediation_detection_snapshot_mutation();

comment on function public.prevent_remediation_detection_snapshot_mutation() is
  'HA-4: preserves the initial miss/detection snapshot while allowing lifecycle timestamps and outcomes to advance.';
