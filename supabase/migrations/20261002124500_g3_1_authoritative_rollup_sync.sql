-- G3-1 — Repair authoritative PO-1B -> study_activity_days rollup sync.
--
-- study_sessions / study_session_events remain the source of truth.
-- The dashboard compatibility table is updated from credited authoritative events,
-- never from client-supplied seconds and never from H&A.

create or replace function public.sync_po1b_study_activity_day()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_timezone text := 'UTC';
  v_study_date date;
begin
  if new.credited_seconds <= 0 then
    return new;
  end if;

  select sad.timezone
    into v_timezone
  from public.study_activity_days sad
  where sad.user_id = new.user_id
  order by sad.last_active_at desc
  limit 1;

  if v_timezone is null
     or not exists (select 1 from pg_timezone_names where name = v_timezone) then
    v_timezone := 'UTC';
  end if;

  v_study_date := (new.received_at at time zone v_timezone)::date;

  insert into public.study_activity_days (
    user_id,
    study_date,
    active_seconds,
    timezone,
    last_active_at
  )
  values (
    new.user_id,
    v_study_date,
    new.credited_seconds,
    v_timezone,
    new.received_at
  )
  on conflict (user_id, study_date)
  do update set
    active_seconds = study_activity_days.active_seconds + excluded.active_seconds,
    timezone = excluded.timezone,
    last_active_at = greatest(study_activity_days.last_active_at, excluded.last_active_at);

  return new;
end;
$$;

drop trigger if exists trg_sync_po1b_study_activity_day
  on public.study_session_events;

create trigger trg_sync_po1b_study_activity_day
after insert on public.study_session_events
for each row
when (new.credited_seconds > 0)
execute function public.sync_po1b_study_activity_day();

-- Replace the runtime function so the event insert is the single rollup source.
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

  return query
  select v_credit_seconds, v_new_active_seconds, v_now;
end;
$$;

revoke all on function public.sync_po1b_study_activity_day() from public, anon, authenticated;
grant execute on function public.record_learning_activity(uuid, text, timestamptz) to authenticated;
