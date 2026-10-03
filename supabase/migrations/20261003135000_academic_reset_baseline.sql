-- ============================================================================
-- RISE / QA academic reset baseline
--
-- Purpose:
--   Provide one explicit, auditable, authorization-checked reset for learning
--   evidence so designated test students can be re-run against the current
--   ASCYN PRO progress model without deleting identity or operational records.
--
-- Preserved by design:
--   profiles, schools, enrollments, instructor assignments, attendance,
--   hour logs/adjustments, schedules, communications, bulletins, instructor
--   notes, security logs, and historical sustained-performance reset records.
--
-- Reset by design:
--   chapter progress, quiz evidence, missed questions, micro-checks,
--   remediation/reassessment state, comprehensive exam attempts, learning
--   telemetry, flagged flashcards, activity evidence, and (optionally)
--   formal gradebook/assessment rows.
-- ============================================================================

create table if not exists public.academic_reset_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  reason text not null,
  include_gradebook boolean not null default false,
  reset_counts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint academic_reset_events_reason_nonempty
    check (length(trim(reason)) > 0),
  constraint academic_reset_events_counts_object
    check (jsonb_typeof(reset_counts) = 'object')
);

alter table public.academic_reset_events enable row level security;

revoke all on public.academic_reset_events from anon, authenticated;
grant select on public.academic_reset_events to authenticated;
grant all on public.academic_reset_events to service_role;

drop policy if exists "Academic reset events: authorized read" on public.academic_reset_events;
create policy "Academic reset events: authorized read"
on public.academic_reset_events
for select
to authenticated
using (
  public.is_platform_admin()
  or exists (
    select 1
    from public.profiles actor
    where actor.id = auth.uid()
      and actor.role in ('school_admin', 'admin')
      and actor.school_id is not null
      and actor.school_id = academic_reset_events.school_id
  )
);

create or replace function public.reset_student_academic_state(
  p_student_id uuid,
  p_reason text,
  p_include_gradebook boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor_id uuid := auth.uid();
  v_target_role text;
  v_target_school_id uuid;
  v_count integer;
  v_counts jsonb := '{}'::jsonb;
  v_reset_event_id uuid;
begin
  if v_actor_id is null then
    raise exception 'Authentication required';
  end if;

  if p_student_id is null then
    raise exception 'Student is required';
  end if;

  if p_reason is null or length(trim(p_reason)) = 0 then
    raise exception 'Reset reason is required';
  end if;

  if not exists (
    select 1 from public.profiles where id = v_actor_id
  ) then
    raise exception 'Authorized actor profile not found';
  end if;

  select role, school_id
    into v_target_role, v_target_school_id
  from public.profiles
  where id = p_student_id;

  if v_target_role is null then
    raise exception 'Student profile not found';
  end if;

  if v_target_role not in ('student', 'apprentice') then
    raise exception 'Academic reset is limited to student/apprentice profiles';
  end if;

  if not public.is_platform_admin() then
    raise exception 'Platform administrator authorization required';
  end if;

  -- Prevent concurrent reset/write races for the same student.
  perform pg_advisory_xact_lock(
    hashtext('academic-reset'),
    hashtext(p_student_id::text)
  );

  -- Comprehensive exam rows must be removed before study sessions because
  -- attempts can reference a study_session with ON DELETE RESTRICT.
  delete from public.comprehensive_exam_attempts
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('comprehensive_exam_attempts', v_count);

  -- Learning telemetry is academic evidence, not attendance/hour evidence.
  delete from public.study_sessions
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('study_sessions', v_count);

  delete from public.study_activity_days
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('study_activity_days', v_count);

  delete from public.flagged_flashcards
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('flagged_flashcards', v_count);

  delete from public.chapter_activity_evidence
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('chapter_activity_evidence', v_count);

  delete from public.chapter_micro_check_attempts
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('chapter_micro_check_attempts', v_count);

  delete from public.missed_questions
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('missed_questions', v_count);

  delete from public.follow_up_evidence
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('follow_up_evidence', v_count);

  delete from public.concept_question_pool_exhaustion
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('concept_question_pool_exhaustion', v_count);

  delete from public.reassessment_question_history
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('reassessment_question_history', v_count);

  -- Break the evaluation back-reference before deleting remediation cycles.
  update public.remediation_cycles
  set evaluation_id = null
  where user_id = p_student_id
    and evaluation_id is not null;

  delete from public.remediation_cycles
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('remediation_cycles', v_count);

  delete from public.quiz_attempts
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('quiz_attempts', v_count);

  delete from public.student_progress
  where user_id = p_student_id;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('student_progress', v_count);

  -- Retire active sustained-performance windows so old evidence cannot roll
  -- forward into the new baseline. Historical reset rows remain auditable.
  update public.sustained_performance_tracking
  set
    is_active = false,
    continuity_broken_at = coalesce(continuity_broken_at, now()),
    updated_at = now()
  where user_id = p_student_id
    and is_active = true;
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('retired_sustained_tracking', v_count);

  -- Pending machine-created escalations are no longer current after a reset.
  -- Instructor-owned work (acknowledged/in_progress/resolved) is preserved.
  update public.instructor_escalations
  set
    status = 'expired',
    expired_at = coalesce(expired_at, now()),
    updated_at = now()
  where user_id = p_student_id
    and status = 'pending';
  get diagnostics v_count = row_count;
  v_counts := v_counts || jsonb_build_object('expired_pending_escalations', v_count);

  if p_include_gradebook then
    delete from public.grades
    where student_id = p_student_id;
    get diagnostics v_count = row_count;
    v_counts := v_counts || jsonb_build_object('grades', v_count);

    delete from public.assessments
    where student_id = p_student_id;
    get diagnostics v_count = row_count;
    v_counts := v_counts || jsonb_build_object('assessments', v_count);
  else
    v_counts := v_counts || jsonb_build_object(
      'grades', 0,
      'assessments', 0
    );
  end if;

  insert into public.academic_reset_events (
    student_id,
    school_id,
    requested_by,
    reason,
    include_gradebook,
    reset_counts
  )
  values (
    p_student_id,
    v_target_school_id,
    v_actor_id,
    trim(p_reason),
    p_include_gradebook,
    v_counts
  )
  returning id into v_reset_event_id;

  return jsonb_build_object(
    'reset_event_id', v_reset_event_id,
    'student_id', p_student_id,
    'school_id', v_target_school_id,
    'include_gradebook', p_include_gradebook,
    'counts', v_counts
  );
end;
$$;

revoke all on function public.reset_student_academic_state(uuid, text, boolean)
  from public, anon;
grant execute on function public.reset_student_academic_state(uuid, text, boolean)
  to authenticated;
comment on function public.reset_student_academic_state(uuid, text, boolean) is
  'Authorization-checked academic reset for designated test/pilot students. Preserves identity, enrollment, attendance, hours, communications, notes, schedules, and security/audit history.';
