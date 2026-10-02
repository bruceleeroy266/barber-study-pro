-- ============================================================================
-- PO-1B — Pilot Activity / Session Observability database foundation
-- Database-only slice. No learner UI/runtime wiring in this migration.
--
-- Invariants:
--   * study telemetry is observational only
--   * server timestamps are authoritative
--   * overlapping tabs/devices share one elapsed-time budget per user
--   * idle credit is capped at 300 seconds
--   * direct authenticated telemetry mutation is prohibited
--   * H&A attendance/hour tables are not read or written
-- ============================================================================

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  surface_type text not null,
  surface_id text,
  opened_at timestamptz not null default clock_timestamp(),
  first_active_at timestamptz,
  last_active_at timestamptz,
  last_credited_at timestamptz,
  ended_at timestamptz,
  active_seconds integer not null default 0,
  end_reason text,
  quiz_attempt_id uuid references public.quiz_attempts(id) on delete set null,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),

  constraint study_sessions_surface_type_check
    check (surface_type in ('lesson','flashcards','quiz','remediation','reassessment')),
  constraint study_sessions_active_seconds_check
    check (active_seconds >= 0),
  constraint study_sessions_end_reason_check
    check (
      end_reason is null
      or end_reason in ('explicit_end','idle_timeout','auth_end','recovered_abandonment')
    ),
  constraint study_sessions_ended_after_opened_check
    check (ended_at is null or ended_at >= opened_at),
  constraint study_sessions_first_active_after_opened_check
    check (first_active_at is null or first_active_at >= opened_at),
  constraint study_sessions_last_requires_first_check
    check (last_active_at is null or first_active_at is not null),
  constraint study_sessions_quiz_attempt_surface_check
    check (quiz_attempt_id is null or surface_type = 'quiz')
);

create table if not exists public.study_session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  event_type text not null,
  surface_type text not null,
  surface_id text,
  quiz_attempt_id uuid references public.quiz_attempts(id) on delete set null,
  received_at timestamptz not null default clock_timestamp(),
  client_event_at timestamptz,
  credited_seconds integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,

  constraint study_session_events_event_type_check
    check (event_type in ('qualifying_activity','heartbeat','explicit_end','quiz_attempt_linked')),
  constraint study_session_events_surface_type_check
    check (surface_type in ('lesson','flashcards','quiz','remediation','reassessment')),
  constraint study_session_events_credit_check
    check (credited_seconds between 0 and 300),
  constraint study_session_events_metadata_object_check
    check (jsonb_typeof(metadata) = 'object')
);

create index if not exists idx_study_sessions_user_opened
  on public.study_sessions(user_id, opened_at desc);

create index if not exists idx_study_sessions_school_user_opened
  on public.study_sessions(school_id, user_id, opened_at desc);

create index if not exists idx_study_sessions_active_user
  on public.study_sessions(user_id, last_active_at desc)
  where ended_at is null;

create index if not exists idx_study_sessions_quiz_attempt
  on public.study_sessions(quiz_attempt_id)
  where quiz_attempt_id is not null;

create index if not exists idx_study_sessions_surface
  on public.study_sessions(user_id, surface_type, surface_id, opened_at desc);

create index if not exists idx_study_session_events_session_received
  on public.study_session_events(session_id, received_at);

create index if not exists idx_study_session_events_user_received
  on public.study_session_events(user_id, received_at desc);

create index if not exists idx_study_session_events_school_received
  on public.study_session_events(school_id, received_at desc);

create index if not exists idx_study_session_events_quiz_attempt
  on public.study_session_events(quiz_attempt_id)
  where quiz_attempt_id is not null;

alter table public.study_sessions enable row level security;
alter table public.study_session_events enable row level security;

drop policy if exists study_sessions_student_select on public.study_sessions;
create policy study_sessions_student_select
  on public.study_sessions
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists study_sessions_school_staff_select on public.study_sessions;
create policy study_sessions_school_staff_select
  on public.study_sessions
  for select to authenticated
  using (
    public.is_school_staff(school_id)
    and public.user_school_id(user_id) = school_id
  );

drop policy if exists study_sessions_platform_admin_select on public.study_sessions;
create policy study_sessions_platform_admin_select
  on public.study_sessions
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists study_session_events_student_select on public.study_session_events;
create policy study_session_events_student_select
  on public.study_session_events
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists study_session_events_school_staff_select on public.study_session_events;
create policy study_session_events_school_staff_select
  on public.study_session_events
  for select to authenticated
  using (
    public.is_school_staff(school_id)
    and public.user_school_id(user_id) = school_id
  );

drop policy if exists study_session_events_platform_admin_select on public.study_session_events;
create policy study_session_events_platform_admin_select
  on public.study_session_events
  for select to authenticated
  using (public.is_platform_admin());

revoke all on public.study_sessions from anon, authenticated;
revoke all on public.study_session_events from anon, authenticated;
grant select on public.study_sessions to authenticated;
grant select on public.study_session_events to authenticated;
grant select, insert, update, delete on public.study_sessions to service_role;
grant select, insert, update, delete on public.study_session_events to service_role;

-- --------------------------------------------------------------------------
-- Start a logical session. Opening a surface never grants study seconds.
-- --------------------------------------------------------------------------
create or replace function public.begin_study_session(
  p_surface_type text,
  p_surface_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile record;
  v_session_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select role, school_id, coalesce(is_disabled, false) as is_disabled, approval_status
    into v_profile
  from public.profiles
  where id = v_user_id
  limit 1;

  if not found then
    raise exception 'Profile not found';
  end if;

  if v_profile.role not in ('student', 'apprentice') then
    raise exception 'Learner role required';
  end if;

  if v_profile.school_id is null then
    raise exception 'School assignment required';
  end if;

  if v_profile.is_disabled or coalesce(v_profile.approval_status, '') <> 'approved' then
    raise exception 'Active approved learner account required';
  end if;

  if p_surface_type not in ('lesson','flashcards','quiz','remediation','reassessment') then
    raise exception 'Unsupported study surface';
  end if;

  insert into public.study_sessions (
    user_id,
    school_id,
    surface_type,
    surface_id
  )
  values (
    v_user_id,
    v_profile.school_id,
    p_surface_type,
    nullif(btrim(p_surface_id), '')
  )
  returning id into v_session_id;

  return v_session_id;
end;
$$;

-- --------------------------------------------------------------------------
-- Record a qualifying learning event or heartbeat.
-- One global elapsed-time budget per user prevents overlapping tabs/devices
-- from multiplying study duration.
-- --------------------------------------------------------------------------
create or replace function public.record_learning_activity(
  p_session_id uuid,
  p_event_type text,
  p_client_event_at timestamptz default null
)
returns table (
  credited_seconds integer,
  active_seconds integer,
  last_active_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile record;
  v_session public.study_sessions%rowtype;
  v_now timestamptz;
  v_global_last_credited_at timestamptz;
  v_elapsed_seconds integer := 0;
  v_credit_seconds integer := 0;
  v_timezone text := 'UTC';
  v_study_date date;
  v_new_active_seconds integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_event_type not in ('qualifying_activity','heartbeat') then
    raise exception 'Unsupported study activity event';
  end if;

  select role, school_id, coalesce(is_disabled, false) as is_disabled, approval_status
    into v_profile
  from public.profiles
  where id = v_user_id
  limit 1;

  if not found
     or v_profile.role not in ('student', 'apprentice')
     or v_profile.school_id is null
     or v_profile.is_disabled
     or coalesce(v_profile.approval_status, '') <> 'approved' then
    raise exception 'Active approved learner account required';
  end if;

  select *
    into v_session
  from public.study_sessions
  where id = p_session_id;

  if not found or v_session.user_id <> v_user_id then
    raise exception 'Study session not found';
  end if;

  if v_session.school_id <> v_profile.school_id then
    raise exception 'Study session school mismatch';
  end if;

  if v_session.ended_at is not null then
    raise exception 'Study session already ended';
  end if;

  if p_event_type = 'heartbeat' and v_session.first_active_at is null then
    raise exception 'Heartbeat requires prior qualifying activity';
  end if;

  perform pg_advisory_xact_lock(
    hashtext('po1b-study-session'),
    hashtext(v_user_id::text)
  );

  -- Re-read under the serialized user lock.
  select *
    into v_session
  from public.study_sessions
  where id = p_session_id
  for update;

  if v_session.ended_at is not null then
    raise exception 'Study session already ended';
  end if;

  v_now := clock_timestamp();

  select max(last_credited_at)
    into v_global_last_credited_at
  from public.study_sessions
  where user_id = v_user_id;

  if v_session.first_active_at is null then
    -- The first qualifying event proves recency, but not elapsed study time.
    v_credit_seconds := 0;

    update public.study_sessions
    set first_active_at = v_now,
        last_active_at = v_now,
        last_credited_at = v_now,
        updated_at = v_now
    where id = p_session_id
    returning study_sessions.active_seconds into v_new_active_seconds;
  else
    if v_global_last_credited_at is not null then
      v_elapsed_seconds := greatest(
        0,
        floor(extract(epoch from (v_now - v_global_last_credited_at)))::integer
      );
    end if;

    -- Five-minute idle ceiling: unobserved time beyond this is discarded.
    v_credit_seconds := least(v_elapsed_seconds, 300);

    update public.study_sessions
    set active_seconds = study_sessions.active_seconds + v_credit_seconds,
        last_active_at = v_now,
        last_credited_at = v_now,
        updated_at = v_now
    where id = p_session_id
    returning study_sessions.active_seconds into v_new_active_seconds;
  end if;

  insert into public.study_session_events (
    session_id,
    user_id,
    school_id,
    event_type,
    surface_type,
    surface_id,
    quiz_attempt_id,
    received_at,
    client_event_at,
    credited_seconds
  )
  values (
    v_session.id,
    v_user_id,
    v_session.school_id,
    p_event_type,
    v_session.surface_type,
    v_session.surface_id,
    v_session.quiz_attempt_id,
    v_now,
    p_client_event_at,
    v_credit_seconds
  );

  if v_credit_seconds > 0 then
    select sad.timezone
      into v_timezone
    from public.study_activity_days sad
    where sad.user_id = v_user_id
    order by sad.last_active_at desc
    limit 1;

    if v_timezone is null
       or not exists (select 1 from pg_timezone_names where name = v_timezone) then
      v_timezone := 'UTC';
    end if;

    v_study_date := (v_now at time zone v_timezone)::date;

    insert into public.study_activity_days (
      user_id,
      study_date,
      active_seconds,
      timezone,
      last_active_at
    )
    values (
      v_user_id,
      v_study_date,
      v_credit_seconds,
      v_timezone,
      v_now
    )
    on conflict (user_id, study_date)
    do update set
      active_seconds = study_activity_days.active_seconds + excluded.active_seconds,
      timezone = excluded.timezone,
      last_active_at = excluded.last_active_at;
  end if;

  return query
  select v_credit_seconds, v_new_active_seconds, v_now;
end;
$$;

-- --------------------------------------------------------------------------
-- End an owned session. Client callers may only explicitly end their session.
-- No duration is manufactured at close time.
-- --------------------------------------------------------------------------
create or replace function public.end_study_session(
  p_session_id uuid,
  p_reason text default 'explicit_end'
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.study_sessions%rowtype;
  v_now timestamptz;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_reason <> 'explicit_end' then
    raise exception 'Unsupported client end reason';
  end if;

  select *
    into v_session
  from public.study_sessions
  where id = p_session_id
  for update;

  if not found or v_session.user_id <> v_user_id then
    raise exception 'Study session not found';
  end if;

  if v_session.ended_at is not null then
    return;
  end if;

  v_now := clock_timestamp();

  update public.study_sessions
  set ended_at = v_now,
      end_reason = 'explicit_end',
      updated_at = v_now
  where id = p_session_id;

  insert into public.study_session_events (
    session_id,
    user_id,
    school_id,
    event_type,
    surface_type,
    surface_id,
    quiz_attempt_id,
    received_at,
    credited_seconds
  )
  values (
    v_session.id,
    v_session.user_id,
    v_session.school_id,
    'explicit_end',
    v_session.surface_type,
    v_session.surface_id,
    v_session.quiz_attempt_id,
    v_now,
    0
  );
end;
$$;

-- --------------------------------------------------------------------------
-- Link a quiz telemetry session to the already-persisted quiz attempt.
-- This function never mutates score, answers, mastery, readiness, or progress.
-- --------------------------------------------------------------------------
create or replace function public.link_study_quiz_attempt(
  p_session_id uuid,
  p_quiz_attempt_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.study_sessions%rowtype;
  v_attempt record;
  v_now timestamptz;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select *
    into v_session
  from public.study_sessions
  where id = p_session_id
  for update;

  if not found or v_session.user_id <> v_user_id then
    raise exception 'Study session not found';
  end if;

  if v_session.surface_type <> 'quiz' then
    raise exception 'Study session is not a quiz session';
  end if;

  select id, user_id, quiz_id
    into v_attempt
  from public.quiz_attempts
  where id = p_quiz_attempt_id
  limit 1;

  if not found or v_attempt.user_id <> v_user_id then
    raise exception 'Quiz attempt not found';
  end if;

  if v_session.surface_id is distinct from v_attempt.quiz_id then
    raise exception 'Quiz attempt does not match study session';
  end if;

  if v_session.quiz_attempt_id is not null then
    if v_session.quiz_attempt_id = p_quiz_attempt_id then
      return;
    end if;
    raise exception 'Study session already linked to another quiz attempt';
  end if;

  v_now := clock_timestamp();

  update public.study_sessions
  set quiz_attempt_id = p_quiz_attempt_id,
      updated_at = v_now
  where id = p_session_id;

  insert into public.study_session_events (
    session_id,
    user_id,
    school_id,
    event_type,
    surface_type,
    surface_id,
    quiz_attempt_id,
    received_at,
    credited_seconds
  )
  values (
    v_session.id,
    v_session.user_id,
    v_session.school_id,
    'quiz_attempt_linked',
    v_session.surface_type,
    v_session.surface_id,
    p_quiz_attempt_id,
    v_now,
    0
  );
end;
$$;

revoke all on function public.begin_study_session(text, text) from public, anon;
revoke all on function public.record_learning_activity(uuid, text, timestamptz) from public, anon;
revoke all on function public.end_study_session(uuid, text) from public, anon;
revoke all on function public.link_study_quiz_attempt(uuid, uuid) from public, anon;

grant execute on function public.begin_study_session(text, text) to authenticated;
grant execute on function public.record_learning_activity(uuid, text, timestamptz) to authenticated;
grant execute on function public.end_study_session(uuid, text) to authenticated;
grant execute on function public.link_study_quiz_attempt(uuid, uuid) to authenticated;

grant execute on function public.begin_study_session(text, text) to service_role;
grant execute on function public.record_learning_activity(uuid, text, timestamptz) to service_role;
grant execute on function public.end_study_session(uuid, text) to service_role;
grant execute on function public.link_study_quiz_attempt(uuid, uuid) to service_role;

comment on table public.study_sessions is
  'PO-1B observational learner study sessions. Never attendance or official hours.';
comment on table public.study_session_events is
  'PO-1B append-only operational study telemetry evidence. Never grading or attendance evidence.';
comment on function public.record_learning_activity(uuid, text, timestamptz) is
  'Credits server-authoritative de-duplicated active study seconds with a 300-second idle ceiling; never affects attendance, grading, mastery, remediation, or readiness.';

-- Legacy record_study_activity(integer,text) intentionally remains available
-- until the later PO-1B runtime cutover. This database-foundation slice does
-- not wire or disable the current StudyActivityTracker.
