-- SEC-RELEASE-02D-1D: Comprehensive exam RPC existing-session revocation.
-- Source-only migration for disposable LOCAL verification; NOT approved for production.
-- Preserve existing RPC signatures, ownership checks, scoring and return payloads.
-- School reassignment invalidates access to historical tenant attempts; no implicit cross-tenant transfer.
BEGIN;

create or replace function public.get_comprehensive_exam_attempt(
  p_attempt_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt public.comprehensive_exam_attempts%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Re-evaluate database-current identity on every invocation, including
  -- calls made with an access token issued before account revocation.
  if not exists (
    select 1 from public.profiles p
    where p.id = v_user_id
      and p.role in ('student', 'apprentice')
      and p.school_id is not null
      and p.approval_status = 'approved'
      and p.is_disabled is false
      and p.requires_password_change is false
  ) then
    raise exception 'Active approved learner account required';
  end if;

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found or v_attempt.user_id <> v_user_id
     or not exists (
       select 1 from public.profiles p
       where p.id = v_user_id
         and p.school_id = v_attempt.school_id
         and p.approval_status = 'approved'
         and p.is_disabled is false
     ) then
    raise exception 'Comprehensive exam attempt not found';
  end if;

  if v_attempt.status = 'active'
     and clock_timestamp() >= v_attempt.expires_at then
    return private.finalize_comprehensive_exam_attempt(
      v_attempt.id,
      'timer_expired'
    );
  end if;

  return private.comprehensive_exam_attempt_payload(v_attempt.id);
end;
$$;

create or replace function public.save_comprehensive_exam_answer(
  p_attempt_id uuid,
  p_position integer,
  p_selected_option text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt public.comprehensive_exam_attempts%rowtype;
  v_item_id uuid;
  v_now timestamptz;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Re-evaluate database-current identity on every invocation, including
  -- calls made with an access token issued before account revocation.
  if not exists (
    select 1 from public.profiles p
    where p.id = v_user_id
      and p.role in ('student', 'apprentice')
      and p.school_id is not null
      and p.approval_status = 'approved'
      and p.is_disabled is false
      and p.requires_password_change is false
  ) then
    raise exception 'Active approved learner account required';
  end if;

  if p_position not between 1 and 110 then
    raise exception 'Invalid exam question position';
  end if;

  if p_selected_option not in ('a','b','c','d') then
    raise exception 'Invalid selected option';
  end if;

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found or v_attempt.user_id <> v_user_id
     or not exists (
       select 1 from public.profiles p
       where p.id = v_user_id
         and p.school_id = v_attempt.school_id
         and p.approval_status = 'approved'
         and p.is_disabled is false
     ) then
    raise exception 'Comprehensive exam attempt not found';
  end if;

  if v_attempt.status <> 'active' then
    return private.comprehensive_exam_attempt_payload(v_attempt.id);
  end if;

  v_now := clock_timestamp();

  if v_now >= v_attempt.expires_at then
    return private.finalize_comprehensive_exam_attempt(
      v_attempt.id,
      'timer_expired'
    );
  end if;

  update public.comprehensive_exam_attempt_items
  set
    selected_option = p_selected_option,
    answered_at = v_now,
    updated_at = v_now
  where attempt_id = v_attempt.id
    and position = p_position
  returning id into v_item_id;

  if v_item_id is null then
    raise exception 'Exam question not found';
  end if;

  insert into public.comprehensive_exam_attempt_events (
    attempt_id,
    user_id,
    school_id,
    event_type,
    item_id,
    received_at,
    metadata
  )
  values (
    v_attempt.id,
    v_attempt.user_id,
    v_attempt.school_id,
    'answer_saved',
    v_item_id,
    v_now,
    jsonb_build_object('position', p_position)
  );

  begin
    perform *
    from public.record_learning_activity(
      v_attempt.study_session_id,
      'qualifying_activity',
      null
    );
  exception when others then
    null;
  end;

  return jsonb_build_object(
    'attemptId', v_attempt.id,
    'position', p_position,
    'selectedOption', p_selected_option,
    'savedAt', v_now,
    'status', 'active'
  );
end;
$$;

create or replace function public.submit_comprehensive_exam_attempt(
  p_attempt_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt public.comprehensive_exam_attempts%rowtype;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Re-evaluate database-current identity on every invocation, including
  -- calls made with an access token issued before account revocation.
  if not exists (
    select 1 from public.profiles p
    where p.id = v_user_id
      and p.role in ('student', 'apprentice')
      and p.school_id is not null
      and p.approval_status = 'approved'
      and p.is_disabled is false
      and p.requires_password_change is false
  ) then
    raise exception 'Active approved learner account required';
  end if;

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found or v_attempt.user_id <> v_user_id
     or not exists (
       select 1 from public.profiles p
       where p.id = v_user_id
         and p.school_id = v_attempt.school_id
         and p.approval_status = 'approved'
         and p.is_disabled is false
     ) then
    raise exception 'Comprehensive exam attempt not found';
  end if;

  if v_attempt.status <> 'active' then
    return private.comprehensive_exam_attempt_payload(v_attempt.id);
  end if;

  return private.finalize_comprehensive_exam_attempt(
    v_attempt.id,
    case
      when clock_timestamp() >= v_attempt.expires_at
        then 'timer_expired'
      else 'student_submit'
    end
  );
end;
$$;

create or replace function public.get_my_comprehensive_exam_history()
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_history jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Re-evaluate database-current identity on every invocation, including
  -- calls made with an access token issued before account revocation.
  if not exists (
    select 1 from public.profiles p
    where p.id = v_user_id
      and p.role in ('student', 'apprentice')
      and p.school_id is not null
      and p.approval_status = 'approved'
      and p.is_disabled is false
      and p.requires_password_change is false
  ) then
    raise exception 'Active approved learner account required';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'attemptId', a.id,
        'configId', a.config_id,
        'attemptNumber', a.attempt_number,
        'status', a.status,
        'startedAt', a.started_at,
        'completedAt', a.completed_at,
        'completionReason', a.completion_reason,
        'scoredCorrect', a.scored_correct,
        'scoredTotal', a.scored_total,
        'percentage', a.percentage,
        'passed', a.passed,
        'domainBreakdown', a.domain_breakdown,
        'elapsedSeconds', a.elapsed_seconds,
        'flaggedAtSubmit', a.flagged_at_submit,
        'unansweredAtSubmit', a.unanswered_at_submit,
        'activeSeconds', s.active_seconds
      )
      order by a.started_at desc
    ),
    '[]'::jsonb
  )
  into v_history
  from public.comprehensive_exam_attempts a
  left join public.study_sessions s
    on s.id = a.study_session_id
  where a.user_id = v_user_id;

  return v_history;
end;
$$;

COMMIT;
