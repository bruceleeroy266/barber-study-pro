-- ============================================================================
-- PO-1C.3 — Comprehensive Exam Attempt Runtime
--
-- Runtime/database slice only.
-- Implements:
--   * active-config discovery
--   * start/resume with per-user/config advisory locking
--   * exactly 110 persisted question snapshots (100 scored + 10 unscored)
--   * exact 35/10/40/15 scored blueprint
--   * server-authoritative timer / refresh recovery
--   * answer + flag persistence
--   * private scoring/finalization
--   * idempotent submit/expiration
--   * PO-1B comprehensive_exam activity linkage
--
-- No polished simulator UI, staff oversight UI, or readiness adapter.
-- ============================================================================

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter table public.comprehensive_exam_attempts
  add column if not exists time_limit_seconds_snapshot integer,
  add column if not exists passing_percentage_snapshot integer;

alter table public.comprehensive_exam_attempts
  drop constraint if exists comprehensive_exam_attempts_time_limit_snapshot_check;
alter table public.comprehensive_exam_attempts
  add constraint comprehensive_exam_attempts_time_limit_snapshot_check
  check (time_limit_seconds_snapshot is null or time_limit_seconds_snapshot > 0);

alter table public.comprehensive_exam_attempts
  drop constraint if exists comprehensive_exam_attempts_passing_snapshot_check;
alter table public.comprehensive_exam_attempts
  add constraint comprehensive_exam_attempts_passing_snapshot_check
  check (
    passing_percentage_snapshot is null
    or passing_percentage_snapshot between 0 and 100
  );

-- --------------------------------------------------------------------------
-- Private safe payload builder. This function intentionally never returns:
--   * is_scored
--   * correct_option_snapshot
--   * explanation_snapshot
-- --------------------------------------------------------------------------
create or replace function private.comprehensive_exam_attempt_payload(
  p_attempt_id uuid
)
returns jsonb
language sql
security definer
set search_path = public, private, pg_temp
as $$
  select jsonb_build_object(
    'attemptId', a.id,
    'configId', a.config_id,
    'configVersion', a.config_version,
    'status', a.status,
    'startedAt', a.started_at,
    'expiresAt', a.expires_at,
    'completedAt', a.completed_at,
    'completionReason', a.completion_reason,
    'attemptNumber', a.attempt_number,
    'timeLimitSeconds', a.time_limit_seconds_snapshot,
    'passingPercentage', a.passing_percentage_snapshot,
    'remainingSeconds',
      case
        when a.status = 'active'
          then greatest(
            0,
            floor(extract(epoch from (a.expires_at - clock_timestamp())))::integer
          )
        else 0
      end,
    'answeredCount', (
      select count(*)::integer
      from public.comprehensive_exam_attempt_items i
      where i.attempt_id = a.id
        and i.selected_option is not null
    ),
    'flaggedCount', (
      select count(*)::integer
      from public.comprehensive_exam_attempt_items i
      where i.attempt_id = a.id
        and i.flagged
    ),
    'items',
      case
        when a.status = 'active' then coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'position', i.position,
              'prompt', i.prompt_snapshot,
              'optionA', i.option_a_snapshot,
              'optionB', i.option_b_snapshot,
              'optionC', i.option_c_snapshot,
              'optionD', i.option_d_snapshot,
              'selectedOption', i.selected_option,
              'answeredAt', i.answered_at,
              'flagged', i.flagged
            )
            order by i.position
          )
          from public.comprehensive_exam_attempt_items i
          where i.attempt_id = a.id
        ), '[]'::jsonb)
        else '[]'::jsonb
      end,
    'result',
      case
        when a.status <> 'active' then jsonb_build_object(
          'scoredCorrect', a.scored_correct,
          'scoredTotal', a.scored_total,
          'percentage', a.percentage,
          'passed', a.passed,
          'domainBreakdown', a.domain_breakdown,
          'elapsedSeconds', a.elapsed_seconds,
          'flaggedAtSubmit', a.flagged_at_submit,
          'unansweredAtSubmit', a.unanswered_at_submit
        )
        else null
      end
  )
  from public.comprehensive_exam_attempts a
  where a.id = p_attempt_id;
$$;

revoke execute on function private.comprehensive_exam_attempt_payload(uuid)
  from public, anon, authenticated;

-- --------------------------------------------------------------------------
-- Private one-way finalizer. Ordinary authenticated callers cannot execute it.
-- It scores only persisted snapshots and is idempotent.
-- --------------------------------------------------------------------------
create or replace function private.finalize_comprehensive_exam_attempt(
  p_attempt_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_attempt public.comprehensive_exam_attempts%rowtype;
  v_now timestamptz := clock_timestamp();
  v_reason text := p_reason;
  v_status text;
  v_scored_correct integer;
  v_unscored_correct integer;
  v_flagged integer;
  v_unanswered integer;
  v_domain_breakdown jsonb;
  v_percentage integer;
  v_passed boolean;
begin
  if p_reason not in ('student_submit','timer_expired','recovered_finalize') then
    raise exception 'Unsupported finalization reason';
  end if;

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found then
    raise exception 'Comprehensive exam attempt not found';
  end if;

  if v_attempt.status <> 'active' then
    return private.comprehensive_exam_attempt_payload(v_attempt.id);
  end if;

  if v_reason = 'student_submit' and v_now >= v_attempt.expires_at then
    v_reason := 'timer_expired';
  end if;

  if v_attempt.passing_percentage_snapshot is null then
    raise exception 'Attempt scoring policy snapshot is missing';
  end if;

  select
    count(*) filter (
      where is_scored
        and selected_option is not null
        and selected_option = correct_option_snapshot
    )::integer,
    count(*) filter (
      where not is_scored
        and selected_option is not null
        and selected_option = correct_option_snapshot
    )::integer,
    count(*) filter (where flagged)::integer,
    count(*) filter (where selected_option is null)::integer
  into
    v_scored_correct,
    v_unscored_correct,
    v_flagged,
    v_unanswered
  from public.comprehensive_exam_attempt_items
  where attempt_id = v_attempt.id;

  select coalesce(
    jsonb_object_agg(
      domain,
      jsonb_build_object(
        'correct', correct_count,
        'total', total_count,
        'percentage',
          case
            when total_count = 0 then 0
            else round(correct_count * 100.0 / total_count)::integer
          end
      )
    ),
    '{}'::jsonb
  )
  into v_domain_breakdown
  from (
    select
      domain,
      count(*)::integer as total_count,
      count(*) filter (
        where selected_option is not null
          and selected_option = correct_option_snapshot
      )::integer as correct_count
    from public.comprehensive_exam_attempt_items
    where attempt_id = v_attempt.id
      and is_scored
    group by domain
  ) d;

  v_percentage := round(v_scored_correct * 100.0 / 100)::integer;
  v_passed := v_percentage >= v_attempt.passing_percentage_snapshot;

  v_status := case v_reason
    when 'student_submit' then 'completed'
    when 'timer_expired' then 'expired'
    when 'recovered_finalize' then 'recovered_finalized'
  end;

  update public.comprehensive_exam_attempts
  set
    status = v_status,
    completed_at = v_now,
    completion_reason = v_reason,
    elapsed_seconds = greatest(
      0,
      floor(
        extract(
          epoch from (
            least(v_now, expires_at) - started_at
          )
        )
      )::integer
    ),
    scored_correct = v_scored_correct,
    scored_total = 100,
    percentage = v_percentage,
    passed = v_passed,
    unscored_correct = v_unscored_correct,
    unscored_total = 10,
    domain_breakdown = v_domain_breakdown,
    flagged_at_submit = v_flagged,
    unanswered_at_submit = v_unanswered,
    readiness_sync_status = 'pending',
    updated_at = v_now
  where id = v_attempt.id;

  insert into public.comprehensive_exam_attempt_events (
    attempt_id,
    user_id,
    school_id,
    event_type,
    received_at,
    metadata
  )
  values (
    v_attempt.id,
    v_attempt.user_id,
    v_attempt.school_id,
    case v_reason
      when 'student_submit' then 'submitted'
      when 'timer_expired' then 'expired'
      when 'recovered_finalize' then 'recovered_finalized'
    end,
    v_now,
    jsonb_build_object('reason', v_reason)
  );

  begin
    perform public.end_study_session(v_attempt.study_session_id, 'explicit_end');
  exception when others then
    insert into public.comprehensive_exam_attempt_events (
      attempt_id,
      user_id,
      school_id,
      event_type,
      received_at,
      metadata
    )
    values (
      v_attempt.id,
      v_attempt.user_id,
      v_attempt.school_id,
      'telemetry_end_failed',
      clock_timestamp(),
      jsonb_build_object('message', sqlerrm)
    );
  end;

  return private.comprehensive_exam_attempt_payload(v_attempt.id);
end;
$$;

revoke execute on function private.finalize_comprehensive_exam_attempt(uuid, text)
  from public, anon, authenticated;

-- --------------------------------------------------------------------------
-- Safe active-config summary.
-- --------------------------------------------------------------------------
create or replace function public.get_active_comprehensive_exam_config()
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_config record;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select
    c.id,
    c.slug,
    c.version,
    c.title,
    c.time_limit_seconds,
    c.passing_percentage,
    c.scored_question_count,
    c.unscored_question_count,
    c.blueprint_version
  into v_config
  from public.comprehensive_exam_configs c
  where c.status = 'active'
  order by c.activated_at desc
  limit 1;

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'configId', v_config.id,
    'slug', v_config.slug,
    'version', v_config.version,
    'title', v_config.title,
    'timeLimitSeconds', v_config.time_limit_seconds,
    'passingPercentage', v_config.passing_percentage,
    'scoredQuestionCount', v_config.scored_question_count,
    'unscoredQuestionCount', v_config.unscored_question_count,
    'blueprintVersion', v_config.blueprint_version
  );
end;
$$;

revoke execute on function public.get_active_comprehensive_exam_config()
  from public, anon;
grant execute on function public.get_active_comprehensive_exam_config()
  to authenticated, service_role;

-- --------------------------------------------------------------------------
-- Start or resume one attempt. Generation is atomic:
-- 100 exact scored items (35/10/40/15) + 10 unique unscored items.
-- --------------------------------------------------------------------------
create or replace function public.start_or_resume_comprehensive_exam(
  p_config_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile record;
  v_config public.comprehensive_exam_configs%rowtype;
  v_existing public.comprehensive_exam_attempts%rowtype;
  v_attempt_id uuid := gen_random_uuid();
  v_study_session_id uuid;
  v_attempt_number integer;
  v_previous_attempt_id uuid;
  v_now timestamptz;
  v_item_count integer;
  v_scientific_count integer;
  v_implements_count integer;
  v_hair_count integer;
  v_facial_count integer;
  v_unscored_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select
    role,
    school_id,
    coalesce(is_disabled, false) as is_disabled,
    approval_status
  into v_profile
  from public.profiles
  where id = v_user_id
  limit 1;

  if not found
     or v_profile.role not in ('student','apprentice')
     or v_profile.school_id is null
     or v_profile.is_disabled
     or coalesce(v_profile.approval_status, '') <> 'approved' then
    raise exception 'Active approved learner account required';
  end if;

  perform pg_advisory_xact_lock(
    hashtext(v_user_id::text),
    hashtext(p_config_id::text)
  );

  v_now := clock_timestamp();

  select *
    into v_config
  from public.comprehensive_exam_configs
  where id = p_config_id
    and status = 'active'
  for share;

  if not found then
    raise exception 'Active comprehensive exam configuration not found';
  end if;

  if v_config.time_limit_seconds is null
     or v_config.time_limit_seconds <= 0
     or v_config.passing_percentage is null
     or v_config.passing_percentage not between 0 and 100 then
    raise exception 'Comprehensive exam configuration is incomplete';
  end if;

  select *
    into v_existing
  from public.comprehensive_exam_attempts
  where user_id = v_user_id
    and config_id = p_config_id
    and status = 'active'
  limit 1
  for update;

  if found then
    if v_now >= v_existing.expires_at then
      return private.finalize_comprehensive_exam_attempt(
        v_existing.id,
        'timer_expired'
      );
    end if;

    insert into public.comprehensive_exam_attempt_events (
      attempt_id,
      user_id,
      school_id,
      event_type,
      received_at
    )
    values (
      v_existing.id,
      v_existing.user_id,
      v_existing.school_id,
      'attempt_resumed',
      v_now
    );

    return private.comprehensive_exam_attempt_payload(v_existing.id);
  end if;

  select coalesce(max(attempt_number), 0) + 1
    into v_attempt_number
  from public.comprehensive_exam_attempts
  where user_id = v_user_id
    and config_id = p_config_id;

  select id
    into v_previous_attempt_id
  from public.comprehensive_exam_attempts
  where user_id = v_user_id
    and config_id = p_config_id
    and status <> 'active'
  order by attempt_number desc
  limit 1;

  v_study_session_id := public.begin_study_session(
    'comprehensive_exam',
    v_attempt_id::text
  );

  insert into public.comprehensive_exam_attempts (
    id,
    user_id,
    school_id,
    config_id,
    config_version,
    blueprint_version,
    question_bank_version,
    scoring_policy_version,
    status,
    started_at,
    expires_at,
    scored_total,
    unscored_total,
    attempt_number,
    previous_attempt_id,
    study_session_id,
    readiness_sync_status,
    time_limit_seconds_snapshot,
    passing_percentage_snapshot
  )
  values (
    v_attempt_id,
    v_user_id,
    v_profile.school_id,
    v_config.id,
    v_config.version,
    v_config.blueprint_version,
    v_config.question_bank_version,
    v_config.scoring_policy_version,
    'active',
    v_now,
    v_now + make_interval(secs => v_config.time_limit_seconds),
    100,
    10,
    v_attempt_number,
    v_previous_attempt_id,
    v_study_session_id,
    'pending',
    v_config.time_limit_seconds,
    v_config.passing_percentage
  );

  with scored_ranked as (
    select
      q.*,
      row_number() over (
        partition by q.domain
        order by gen_random_uuid()
      ) as domain_rank
    from public.comprehensive_exam_config_questions cq
    join public.comprehensive_exam_questions q
      on q.id = cq.question_id
    where cq.config_id = v_config.id
      and cq.is_active
      and cq.scored_eligible
      and q.status = 'active'
  ),
  scored as (
    select s.*, true as is_scored
    from scored_ranked s
    where
      (s.domain = 'scientific_concepts' and s.domain_rank <= 35)
      or (s.domain = 'implements_equipment' and s.domain_rank <= 10)
      or (s.domain = 'hair_care_services' and s.domain_rank <= 40)
      or (s.domain = 'facial_hair_skin_care_services' and s.domain_rank <= 15)
  ),
  unscored as (
    select q.*, null::bigint as domain_rank, false as is_scored
    from public.comprehensive_exam_config_questions cq
    join public.comprehensive_exam_questions q
      on q.id = cq.question_id
    where cq.config_id = v_config.id
      and cq.is_active
      and cq.unscored_eligible
      and q.status = 'active'
      and not exists (
        select 1
        from scored s
        where s.id = q.id
      )
    order by gen_random_uuid()
    limit 10
  ),
  picked as (
    select * from scored
    union all
    select * from unscored
  ),
  ordered as (
    select
      p.*,
      row_number() over (order by gen_random_uuid())::smallint as position
    from picked p
  )
  insert into public.comprehensive_exam_attempt_items (
    attempt_id,
    question_id,
    position,
    domain,
    is_scored,
    prompt_snapshot,
    option_a_snapshot,
    option_b_snapshot,
    option_c_snapshot,
    option_d_snapshot,
    correct_option_snapshot,
    explanation_snapshot
  )
  select
    v_attempt_id,
    o.id,
    o.position,
    o.domain,
    o.is_scored,
    o.prompt,
    perm.option_texts[1],
    perm.option_texts[2],
    perm.option_texts[3],
    perm.option_texts[4],
    case array_position(perm.option_labels, o.correct_option)
      when 1 then 'a'
      when 2 then 'b'
      when 3 then 'c'
      when 4 then 'd'
      else null
    end,
    o.explanation
  from ordered o
  cross join lateral (
    select
      array_agg(x.option_text order by x.rnd) as option_texts,
      array_agg(x.option_label order by x.rnd) as option_labels
    from (
      select
        v.option_label,
        v.option_text,
        random() as rnd
      from (
        values
          ('a'::text, o.option_a),
          ('b'::text, o.option_b),
          ('c'::text, o.option_c),
          ('d'::text, o.option_d)
      ) v(option_label, option_text)
    ) x
  ) perm;

  select
    count(*)::integer,
    count(*) filter (
      where is_scored and domain = 'scientific_concepts'
    )::integer,
    count(*) filter (
      where is_scored and domain = 'implements_equipment'
    )::integer,
    count(*) filter (
      where is_scored and domain = 'hair_care_services'
    )::integer,
    count(*) filter (
      where is_scored and domain = 'facial_hair_skin_care_services'
    )::integer,
    count(*) filter (where not is_scored)::integer
  into
    v_item_count,
    v_scientific_count,
    v_implements_count,
    v_hair_count,
    v_facial_count,
    v_unscored_count
  from public.comprehensive_exam_attempt_items
  where attempt_id = v_attempt_id;

  if v_item_count <> 110
     or v_scientific_count <> 35
     or v_implements_count <> 10
     or v_hair_count <> 40
     or v_facial_count <> 15
     or v_unscored_count <> 10 then
    raise exception 'Generated question set failed comprehensive exam blueprint';
  end if;

  insert into public.comprehensive_exam_attempt_events (
    attempt_id,
    user_id,
    school_id,
    event_type,
    received_at,
    metadata
  )
  values (
    v_attempt_id,
    v_user_id,
    v_profile.school_id,
    'attempt_started',
    v_now,
    jsonb_build_object(
      'questionCount', 110,
      'scoredCount', 100,
      'unscoredCount', 10,
      'configVersion', v_config.version
    )
  );

  return private.comprehensive_exam_attempt_payload(v_attempt_id);
end;
$$;

revoke execute on function public.start_or_resume_comprehensive_exam(uuid)
  from public, anon;
grant execute on function public.start_or_resume_comprehensive_exam(uuid)
  to authenticated, service_role;

-- --------------------------------------------------------------------------
-- Refresh/recovery. Expired active attempts are finalized before return.
-- --------------------------------------------------------------------------
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

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found or v_attempt.user_id <> v_user_id then
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

revoke execute on function public.get_comprehensive_exam_attempt(uuid)
  from public, anon;
grant execute on function public.get_comprehensive_exam_attempt(uuid)
  to authenticated, service_role;

-- --------------------------------------------------------------------------
-- Persist one answer. Server expiration is checked before mutation.
-- Telemetry is best-effort and cannot invalidate a safely stored answer.
-- --------------------------------------------------------------------------
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

  if not found or v_attempt.user_id <> v_user_id then
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

revoke execute on function public.save_comprehensive_exam_answer(uuid, integer, text)
  from public, anon;
grant execute on function public.save_comprehensive_exam_answer(uuid, integer, text)
  to authenticated, service_role;

-- --------------------------------------------------------------------------
-- Persist/unpersist one flag. Flags are review state only.
-- --------------------------------------------------------------------------
create or replace function public.set_comprehensive_exam_flag(
  p_attempt_id uuid,
  p_position integer,
  p_flagged boolean
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

  if p_position not between 1 and 110 then
    raise exception 'Invalid exam question position';
  end if;

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found or v_attempt.user_id <> v_user_id then
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
    flagged = p_flagged,
    flag_updated_at = v_now,
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
    case when p_flagged then 'flag_set' else 'flag_cleared' end,
    v_item_id,
    v_now,
    jsonb_build_object('position', p_position)
  );

  return jsonb_build_object(
    'attemptId', v_attempt.id,
    'position', p_position,
    'flagged', p_flagged,
    'savedAt', v_now,
    'status', 'active'
  );
end;
$$;

revoke execute on function public.set_comprehensive_exam_flag(uuid, integer, boolean)
  from public, anon;
grant execute on function public.set_comprehensive_exam_flag(uuid, integer, boolean)
  to authenticated, service_role;

-- --------------------------------------------------------------------------
-- Idempotent submit. Private finalizer performs authoritative scoring.
-- --------------------------------------------------------------------------
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

  select *
    into v_attempt
  from public.comprehensive_exam_attempts
  where id = p_attempt_id
  for update;

  if not found or v_attempt.user_id <> v_user_id then
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

revoke execute on function public.submit_comprehensive_exam_attempt(uuid)
  from public, anon;
grant execute on function public.submit_comprehensive_exam_attempt(uuid)
  to authenticated, service_role;

-- --------------------------------------------------------------------------
-- Student-safe immutable history summaries. No answer key or unscored score.
-- --------------------------------------------------------------------------
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

revoke execute on function public.get_my_comprehensive_exam_history()
  from public, anon;
grant execute on function public.get_my_comprehensive_exam_history()
  to authenticated, service_role;

-- No ordinary authenticated role receives direct access to attempt_items.
-- Correctness/scoring secrets remain available only inside privileged RPCs.
