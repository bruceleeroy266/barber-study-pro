-- G3-1 — Final authoritative rollup sync.
--
-- The certified source of truth is study_sessions.active_seconds. Keep the
-- dashboard compatibility rollup synchronized from the authoritative session
-- delta itself. This avoids any secondary event-delivery dependency.

drop trigger if exists trg_sync_po1b_study_activity_day
  on public.study_session_events;

create or replace function public.sync_po1b_session_delta_to_study_day()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_delta integer;
  v_timezone text := 'UTC';
  v_study_date date;
begin
  v_delta := greatest(0, new.active_seconds - old.active_seconds);

  if v_delta <= 0 then
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

  v_study_date := (coalesce(new.last_active_at, clock_timestamp()) at time zone v_timezone)::date;

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
    v_delta,
    v_timezone,
    coalesce(new.last_active_at, clock_timestamp())
  )
  on conflict (user_id, study_date)
  do update set
    active_seconds = study_activity_days.active_seconds + excluded.active_seconds,
    timezone = excluded.timezone,
    last_active_at = greatest(study_activity_days.last_active_at, excluded.last_active_at);

  return new;
end;
$$;

drop trigger if exists trg_sync_po1b_session_delta_to_study_day
  on public.study_sessions;

create trigger trg_sync_po1b_session_delta_to_study_day
after update of active_seconds on public.study_sessions
for each row
when (new.active_seconds > old.active_seconds)
execute function public.sync_po1b_session_delta_to_study_day();

revoke all on function public.sync_po1b_session_delta_to_study_day()
  from public, anon, authenticated;
