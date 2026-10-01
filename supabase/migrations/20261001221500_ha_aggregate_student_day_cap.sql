-- ============================================================================
-- H&A production hardening — aggregate 24-hour student/day cap
--
-- Enforces <= 1,440 effective approved minutes per student/date at the
-- database boundary for approvals and approved-hour adjustments. A transaction
-- advisory lock serializes competing writes for the same student/date.
-- ============================================================================

create or replace function public.ha_effective_approved_minutes_for_day(
  p_user_id uuid,
  p_date date,
  p_exclude_hour_log_id uuid default null
)
returns integer
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_total integer;
begin
  if exists (
    select 1
    from public.effective_hour_logs e
    where e.user_id = p_user_id
      and e.date = p_date
      and e.status = 'approved'
      and (p_exclude_hour_log_id is null or e.id <> p_exclude_hour_log_id)
      and e.integrity_status not in ('valid_unadjusted', 'valid_adjusted')
  ) then
    raise exception 'Cannot calculate daily approved hours because an existing hour chain is invalid'
      using errcode = '55000';
  end if;

  select coalesce(sum(e.effective_minutes), 0)::integer
    into v_total
  from public.effective_hour_logs e
  where e.user_id = p_user_id
    and e.date = p_date
    and e.status = 'approved'
    and (p_exclude_hour_log_id is null or e.id <> p_exclude_hour_log_id);

  return coalesce(v_total, 0);
end;
$$;

revoke execute on function public.ha_effective_approved_minutes_for_day(uuid, date, uuid)
  from public, anon, authenticated;
grant execute on function public.ha_effective_approved_minutes_for_day(uuid, date, uuid)
  to service_role;

create or replace function public.enforce_hour_logs_daily_approved_cap()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_existing_minutes integer;
begin
  if new.status <> 'approved' then
    return new;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(new.user_id::text || ':' || new.date::text, 0)
  );

  v_existing_minutes :=
    public.ha_effective_approved_minutes_for_day(new.user_id, new.date, new.id);

  if v_existing_minutes + new.minutes > 1440 then
    raise exception 'Daily approved hours cannot exceed 1440 minutes (24 hours)'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke execute on function public.enforce_hour_logs_daily_approved_cap()
  from public, anon, authenticated;
grant execute on function public.enforce_hour_logs_daily_approved_cap()
  to service_role;

drop trigger if exists trg_hour_logs_daily_approved_cap on public.hour_logs;
create trigger trg_hour_logs_daily_approved_cap
  before insert or update of status, minutes, user_id, date
  on public.hour_logs
  for each row
  when (new.status = 'approved')
  execute function public.enforce_hour_logs_daily_approved_cap();

create or replace function public.adjust_approved_hour(
  p_hour_log_id uuid,
  p_new_effective_minutes integer,
  p_reason text,
  p_expected_adjustment_version integer
)
returns table (
  adjustment_id uuid,
  adjustment_sequence integer,
  original_minutes integer,
  previous_effective_minutes integer,
  new_effective_minutes integer,
  delta_minutes integer,
  adjustment_version integer
)
set search_path = public, pg_temp
as $$
declare
  v_actor public.profiles%rowtype;
  v_hour public.hour_logs%rowtype;
  v_previous public.hour_adjustments%rowtype;
  v_adjustment public.hour_adjustments%rowtype;
  v_reason text;
  v_previous_effective integer;
  v_next_sequence integer;
  v_is_authorized boolean;
  v_other_daily_minutes integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select *
    into v_actor
  from public.profiles
  where id = auth.uid()
  limit 1;

  if not found
     or coalesce(v_actor.is_disabled, false)
     or coalesce(v_actor.approval_status, '') <> 'approved' then
    raise exception 'Active approved administrator account required'
      using errcode = '42501';
  end if;

  if p_hour_log_id is null then
    raise exception 'Hour log is required' using errcode = '22023';
  end if;

  if p_new_effective_minutes is null
     or p_new_effective_minutes < 0
     or p_new_effective_minutes > 1440 then
    raise exception 'Corrected minutes must be between 0 and 1440'
      using errcode = '22023';
  end if;

  if p_expected_adjustment_version is null
     or p_expected_adjustment_version < 0 then
    raise exception 'Expected adjustment version is required'
      using errcode = '22023';
  end if;

  v_reason := btrim(coalesce(p_reason, ''));
  if char_length(v_reason) < 10 or char_length(v_reason) > 500 then
    raise exception 'Adjustment reason must be between 10 and 500 characters'
      using errcode = '22023';
  end if;

  select *
    into v_hour
  from public.hour_logs
  where id = p_hour_log_id
  for update;

  if not found then
    raise exception 'Hour log not found' using errcode = 'P0002';
  end if;

  v_is_authorized :=
    (
      v_actor.role in ('admin', 'school_admin')
      and v_actor.school_id = v_hour.school_id
    )
    or (
      v_actor.role = 'admin'
      and v_actor.school_id is null
    )
    or v_actor.role = 'platform_super_admin';

  if not v_is_authorized then
    raise exception 'Not authorized to adjust this hour record'
      using errcode = '42501';
  end if;

  if v_hour.status <> 'approved' then
    raise exception 'Only approved hour records can be adjusted'
      using errcode = '55000';
  end if;

  if v_hour.adjustment_version <> p_expected_adjustment_version then
    raise exception 'Hour record changed since it was loaded; refresh before adjusting'
      using errcode = '40001';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(v_hour.user_id::text || ':' || v_hour.date::text, 0)
  );

  select *
    into v_previous
  from public.hour_adjustments
  where hour_log_id = v_hour.id
  order by adjustment_sequence desc
  limit 1;

  if found then
    if v_previous.adjustment_sequence <> v_hour.adjustment_version
       or v_previous.original_minutes <> v_hour.minutes
       or v_previous.school_id <> v_hour.school_id
       or v_previous.student_id <> v_hour.user_id
       or v_previous.source_type <> v_hour.source_type
       or v_previous.source_attendance_id is distinct from v_hour.source_attendance_id then
      raise exception 'Hour adjustment chain integrity check failed'
        using errcode = '55000';
    end if;

    v_previous_effective := v_previous.new_effective_minutes;
    v_next_sequence := v_previous.adjustment_sequence + 1;
  else
    if v_hour.adjustment_version <> 0 then
      raise exception 'Hour adjustment chain integrity check failed'
        using errcode = '55000';
    end if;

    v_previous_effective := v_hour.minutes;
    v_next_sequence := 1;
  end if;

  if p_new_effective_minutes = v_previous_effective then
    raise exception 'Corrected minutes must differ from the current official value'
      using errcode = '22023';
  end if;

  if v_hour.source_type = 'attendance' then
    if v_hour.source_attendance_id is null then
      raise exception 'Attendance-generated hour record is missing attendance provenance'
        using errcode = '55000';
    end if;

    if not exists (
      select 1
      from public.attendance_records ar
      where ar.id = v_hour.source_attendance_id
        and ar.school_id = v_hour.school_id
        and ar.user_id = v_hour.user_id
        and ar.date = v_hour.date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present = p_new_effective_minutes
        and ar.minutes_present >= 0
    ) then
      raise exception 'Attendance must match the corrected official minutes before adjustment'
        using errcode = '55000';
    end if;
  elsif v_hour.source_type = 'manual' then
    if v_hour.source_attendance_id is not null then
      raise exception 'Manual hour record has inconsistent attendance provenance'
        using errcode = '55000';
    end if;
  else
    raise exception 'Unknown hour source type' using errcode = '55000';
  end if;

  v_other_daily_minutes :=
    public.ha_effective_approved_minutes_for_day(v_hour.user_id, v_hour.date, v_hour.id);

  if v_other_daily_minutes + p_new_effective_minutes > 1440 then
    raise exception 'Daily approved hours cannot exceed 1440 minutes (24 hours)'
      using errcode = '23514';
  end if;

  insert into public.hour_adjustments (
    school_id,
    hour_log_id,
    student_id,
    adjustment_sequence,
    original_minutes,
    previous_effective_minutes,
    new_effective_minutes,
    reason,
    adjusted_by,
    adjusted_at,
    source_type,
    source_attendance_id,
    expected_hour_log_updated_at,
    previous_adjustment_id,
    created_at
  )
  values (
    v_hour.school_id,
    v_hour.id,
    v_hour.user_id,
    v_next_sequence,
    v_hour.minutes,
    v_previous_effective,
    p_new_effective_minutes,
    v_reason,
    auth.uid(),
    now(),
    v_hour.source_type,
    v_hour.source_attendance_id,
    coalesce(v_hour.updated_at, v_hour.created_at, now()),
    case when v_next_sequence = 1 then null else v_previous.id end,
    now()
  )
  returning * into v_adjustment;

  update public.hour_logs
  set adjustment_version = adjustment_version + 1
  where id = v_hour.id
    and adjustment_version = p_expected_adjustment_version;

  if not found then
    raise exception 'Hour record changed during adjustment; refresh and try again'
      using errcode = '40001';
  end if;

  return query
  select
    v_adjustment.id,
    v_adjustment.adjustment_sequence,
    v_adjustment.original_minutes,
    v_adjustment.previous_effective_minutes,
    v_adjustment.new_effective_minutes,
    v_adjustment.delta_minutes,
    p_expected_adjustment_version + 1;
end;
$$ language plpgsql security definer;

revoke execute on function public.adjust_approved_hour(uuid, integer, text, integer)
  from public, anon;
grant execute on function public.adjust_approved_hour(uuid, integer, text, integer)
  to authenticated;

comment on function public.ha_effective_approved_minutes_for_day(uuid, date, uuid) is
  'Internal H&A helper that returns effective approved minutes for one student/date and fails closed on invalid adjustment chains.';

comment on function public.enforce_hour_logs_daily_approved_cap() is
  'Database boundary enforcing a maximum of 1,440 effective approved minutes per student/date.';

comment on function public.adjust_approved_hour(uuid, integer, text, integer) is
  'Atomic, server-authoritative approved-hour correction path with row/version guards, attendance provenance checks, and aggregate 1,440-minute student/day enforcement.';
