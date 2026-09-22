-- Harden active study tracking against multi-tab/window inflation.
--
-- The original RPC credited every heartbeat independently, so two visible tabs
-- could add ~120 seconds for one real minute. This version serializes writes
-- per user and caps each increment by wall-clock time since the user's most
-- recent accepted heartbeat across every study-date row. Duplicate/concurrent
-- heartbeats therefore share one elapsed-time budget instead of multiplying it.
create or replace function public.record_study_activity(
  p_seconds integer default 60,
  p_timezone text default 'UTC'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_timezone text;
  v_study_date date;
  v_requested_seconds integer;
  v_credit_seconds integer;
  v_elapsed_seconds integer;
  v_latest_active_at timestamptz;
  v_now timestamptz;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select name into v_timezone
  from pg_timezone_names
  where name = p_timezone
  limit 1;

  v_timezone := coalesce(v_timezone, 'UTC');
  v_requested_seconds := greatest(1, least(coalesce(p_seconds, 60), 60));

  -- Serialize study-time writes for one user across tabs/windows/devices.
  -- clock_timestamp() is intentionally captured AFTER the lock so a request
  -- that waited behind another heartbeat sees the true elapsed wall time.
  perform pg_advisory_xact_lock(
    hashtext('record_study_activity'),
    hashtext(v_user_id::text)
  );

  v_now := clock_timestamp();
  v_study_date := (v_now at time zone v_timezone)::date;

  -- Use the newest accepted heartbeat across ALL date rows. This prevents
  -- duplicate credit not only across tabs but also across midnight boundaries
  -- or clients reporting different valid timezones.
  select max(last_active_at)
    into v_latest_active_at
  from public.study_activity_days
  where user_id = v_user_id;

  if v_latest_active_at is null then
    v_credit_seconds := v_requested_seconds;
  else
    v_elapsed_seconds := greatest(
      0,
      floor(extract(epoch from (v_now - v_latest_active_at)))::integer
    );
    v_credit_seconds := least(v_requested_seconds, v_elapsed_seconds);
  end if;

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
end;
$$;

revoke all on function public.record_study_activity(integer, text) from public;
grant execute on function public.record_study_activity(integer, text) to authenticated;
