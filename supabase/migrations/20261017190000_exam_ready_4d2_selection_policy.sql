-- EXAM-MERGE-4D-2: additive runtime policy reconciliation.
-- Apply ONLY after separate database execution approval and isolated QA.
-- No import, activation, or changes to existing attempt snapshots.
-- Legacy configurations retain the 10-global-unscored policy.

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
  v_exp_scientific_count integer;
  v_exp_implements_count integer;
  v_exp_hair_count integer;
  v_exp_facial_count integer;
  v_distinct_question_count integer;
  v_config_domain_count integer;
  v_config_domain_mismatches integer;
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

  -- Only the explicitly versioned Exam Ready blueprint receives the new policy.
  -- Older configurations retain their prior 10-global-experimental behavior.
  if v_config.blueprint_version = 'exam-ready-573-blueprint-v1' then
    if v_config.slug <> 'nic-barber-theory-exam-ready'
       or v_config.version <> 1
       or v_config.question_bank_version <> 'exam-ready-573-v1'
       or v_config.scoring_policy_version <> 'po1c-scoring-v1'
       or v_config.scored_question_count <> 100
       or v_config.unscored_question_count <> 10 then
      raise exception 'Exam Ready versioned configuration mismatch';
    end if;

    select count(*)::integer,
      count(*) filter (where
        (domain = 'scientific_concepts' and weight_percent = 35 and scored_question_count = 35)
        or (domain = 'implements_equipment' and weight_percent = 10 and scored_question_count = 10)
        or (domain = 'hair_care_services' and weight_percent = 40 and scored_question_count = 40)
        or (domain = 'facial_hair_skin_care_services' and weight_percent = 15 and scored_question_count = 15)
      )::integer
    into v_config_domain_count, v_config_domain_mismatches
    from public.comprehensive_exam_config_domains
    where config_id = v_config.id;

    if v_config_domain_count <> 4 or v_config_domain_mismatches <> 4 then
      raise exception 'Exam Ready domain blueprint mismatch';
    end if;
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
  unscored_ranked as (
    select
      q.id,
      q.domain,
      row_number() over (partition by q.domain order by gen_random_uuid()) as experimental_rank,
      row_number() over (order by gen_random_uuid()) as legacy_rank
    from public.comprehensive_exam_config_questions cq
    join public.comprehensive_exam_questions q
      on q.id = cq.question_id
    where cq.config_id = v_config.id
      and cq.is_active
      and cq.unscored_eligible
      and q.status = 'active'
      and not exists (select 1 from scored s where s.id = q.id)
  ),
  unscored as (
    -- Preserve the scored UNION ALL row shape; the ranking columns stay private.
    select q.*, null::bigint as domain_rank, false as is_scored
    from unscored_ranked u
    join public.comprehensive_exam_questions q on q.id = u.id
    where
      (v_config.blueprint_version = 'exam-ready-573-blueprint-v1' and (
        (u.domain = 'scientific_concepts' and u.experimental_rank <= 4)
        or (u.domain = 'implements_equipment' and u.experimental_rank <= 1)
        or (u.domain = 'hair_care_services' and u.experimental_rank <= 4)
        or (u.domain = 'facial_hair_skin_care_services' and u.experimental_rank <= 1)
      ))
      or (v_config.blueprint_version <> 'exam-ready-573-blueprint-v1' and u.legacy_rank <= 10)
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
    count(*) filter (where not is_scored)::integer,
    count(*) filter (where not is_scored and domain = 'scientific_concepts')::integer,
    count(*) filter (where not is_scored and domain = 'implements_equipment')::integer,
    count(*) filter (where not is_scored and domain = 'hair_care_services')::integer,
    count(*) filter (where not is_scored and domain = 'facial_hair_skin_care_services')::integer,
    count(distinct question_id)::integer
  into
    v_item_count,
    v_scientific_count,
    v_implements_count,
    v_hair_count,
    v_facial_count,
    v_unscored_count,
    v_exp_scientific_count,
    v_exp_implements_count,
    v_exp_hair_count,
    v_exp_facial_count,
    v_distinct_question_count
  from public.comprehensive_exam_attempt_items
  where attempt_id = v_attempt_id;

  if v_item_count <> 110
     or v_scientific_count <> 35
     or v_implements_count <> 10
     or v_hair_count <> 40
     or v_facial_count <> 15
     or v_unscored_count <> 10
     or v_distinct_question_count <> 110
     or (v_config.blueprint_version = 'exam-ready-573-blueprint-v1' and (
       v_exp_scientific_count <> 4
       or v_exp_implements_count <> 1
       or v_exp_hair_count <> 4
       or v_exp_facial_count <> 1
     )) then
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
