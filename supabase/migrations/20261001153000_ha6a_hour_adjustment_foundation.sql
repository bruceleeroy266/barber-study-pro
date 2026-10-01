-- ============================================================================
-- H&A-6A — Hour Adjustment Database Foundation
--
-- Adds an immutable approved-hour adjustment ledger and optimistic concurrency
-- guard without changing the existing instructor submission, admin review, or
-- attendance-generated rejected-resubmission contracts.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Approved hour rows receive a dedicated adjustment version.
--    Pending/rejected rows can never carry adjustment history.
-- ---------------------------------------------------------------------------
alter table public.hour_logs
  add column if not exists adjustment_version integer not null default 0;

alter table public.hour_logs
  drop constraint if exists hour_logs_adjustment_version_check;

alter table public.hour_logs
  add constraint hour_logs_adjustment_version_check
  check (
    adjustment_version >= 0
    and (status = 'approved' or adjustment_version = 0)
  );

comment on column public.hour_logs.adjustment_version is
  'Optimistic-concurrency version for immutable approved-hour adjustments. Starts at 0 and increments exactly once per accepted adjustment.';

-- ---------------------------------------------------------------------------
-- 2. Immutable adjustment ledger.
--    hour_logs remains the original approved evidence; this table records each
--    correction without overwriting or deleting that evidence.
-- ---------------------------------------------------------------------------
create table if not exists public.hour_adjustments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  hour_log_id uuid not null references public.hour_logs(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,

  adjustment_sequence integer not null check (adjustment_sequence > 0),

  original_minutes integer not null check (original_minutes > 0 and original_minutes <= 1440),
  previous_effective_minutes integer not null check (previous_effective_minutes >= 0 and previous_effective_minutes <= 1440),
  new_effective_minutes integer not null check (new_effective_minutes >= 0 and new_effective_minutes <= 1440),
  delta_minutes integer generated always as (new_effective_minutes - previous_effective_minutes) stored,

  reason text not null check (char_length(btrim(reason)) between 10 and 500),

  adjusted_by uuid not null references public.profiles(id) on delete restrict,
  adjusted_at timestamptz not null default now(),

  source_type text not null check (source_type in ('manual', 'attendance')),
  source_attendance_id uuid references public.attendance_records(id) on delete restrict,

  expected_hour_log_updated_at timestamptz not null,
  previous_adjustment_id uuid references public.hour_adjustments(id) on delete restrict,

  created_at timestamptz not null default now(),

  constraint hour_adjustments_log_sequence_unique unique (hour_log_id, adjustment_sequence),
  constraint hour_adjustments_previous_link_unique unique (previous_adjustment_id),
  constraint hour_adjustments_source_shape_check check (
    (source_type = 'manual' and source_attendance_id is null)
    or
    (source_type = 'attendance' and source_attendance_id is not null)
  ),
  constraint hour_adjustments_non_noop_check check (
    new_effective_minutes <> previous_effective_minutes
  )
);

create index if not exists idx_hour_adjustments_hour_log_id
  on public.hour_adjustments(hour_log_id);

create index if not exists idx_hour_adjustments_student_id
  on public.hour_adjustments(student_id);

create index if not exists idx_hour_adjustments_school_id
  on public.hour_adjustments(school_id);

create index if not exists idx_hour_adjustments_adjusted_at
  on public.hour_adjustments(adjusted_at desc);

create index if not exists idx_hour_adjustments_previous_adjustment_id
  on public.hour_adjustments(previous_adjustment_id)
  where previous_adjustment_id is not null;

comment on table public.hour_adjustments is
  'Append-only audit ledger for corrections to already-approved student hour records.';

comment on column public.hour_adjustments.original_minutes is
  'Minutes on the original approved hour_logs row; remains constant across the full adjustment chain.';

comment on column public.hour_adjustments.previous_effective_minutes is
  'Official effective minutes immediately before this adjustment.';

comment on column public.hour_adjustments.new_effective_minutes is
  'Official effective minutes after this adjustment.';

comment on column public.hour_adjustments.delta_minutes is
  'Database-generated difference: new_effective_minutes - previous_effective_minutes.';

-- ---------------------------------------------------------------------------
-- 3. Make adjustment history truly append-only.
--    Even privileged application/service writes cannot silently rewrite or
--    delete an existing adjustment row.
-- ---------------------------------------------------------------------------
create or replace function public.prevent_hour_adjustment_mutation()
returns trigger
set search_path = public, pg_temp
as $$
begin
  raise exception 'hour_adjustments are immutable; create a new adjustment instead'
    using errcode = '55000';
end;
$$ language plpgsql;

revoke execute on function public.prevent_hour_adjustment_mutation() from public;
grant execute on function public.prevent_hour_adjustment_mutation() to service_role;

drop trigger if exists trg_hour_adjustments_immutable on public.hour_adjustments;
create trigger trg_hour_adjustments_immutable
  before update or delete on public.hour_adjustments
  for each row execute function public.prevent_hour_adjustment_mutation();

-- ---------------------------------------------------------------------------
-- 4. RLS: students can see their own adjustment history; same-school staff can
--    inspect it; platform administrators can inspect all. No client INSERT,
--    UPDATE, or DELETE policy exists. Creation flows only through the RPC below.
-- ---------------------------------------------------------------------------
alter table public.hour_adjustments enable row level security;

grant select on public.hour_adjustments to authenticated;
revoke insert, update, delete on public.hour_adjustments from anon, authenticated;
grant select, insert, update, delete on public.hour_adjustments to service_role;

drop policy if exists hour_adjustments_select on public.hour_adjustments;
create policy hour_adjustments_select on public.hour_adjustments
for select to authenticated
using (
  student_id = auth.uid()
  or public.is_school_staff(school_id)
  or public.is_platform_admin()
  or public.is_platform_super_admin()
);

-- ---------------------------------------------------------------------------
-- 5. Approved/rejected hour evidence cannot be edited or deleted directly by
--    authenticated users. Existing pending review/correction behavior remains.
--    The RPC below is SECURITY DEFINER and is the only approved-row correction
--    path for authenticated callers.
-- ---------------------------------------------------------------------------
revoke delete on public.hour_logs from authenticated;

drop policy if exists hour_logs_delete on public.hour_logs;
drop policy if exists "hour_logs_delete" on public.hour_logs;

drop policy if exists hour_logs_update on public.hour_logs;
create policy hour_logs_update on public.hour_logs
for update to authenticated
using (
  (
    (
      public.is_school_admin(hour_logs.school_id)
      or public.is_platform_admin()
      or public.is_platform_super_admin()
    )
    and hour_logs.status = 'pending'
    and hour_logs.adjustment_version = 0
  )
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = hour_logs.school_id
    and hour_logs.status = 'pending'
    and hour_logs.adjustment_version = 0
    and hour_logs.reviewed_by is null
    and hour_logs.reviewed_at is null
    and hour_logs.source_type = 'attendance'
    and hour_logs.source_attendance_id is not null
    and public.user_school_id(hour_logs.user_id) = hour_logs.school_id
    and exists (
      select 1
      from public.attendance_records ar
      where ar.id = hour_logs.source_attendance_id
        and ar.school_id = hour_logs.school_id
        and ar.user_id = hour_logs.user_id
        and ar.date = hour_logs.date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present > 0
    )
  )
)
with check (
  (
    (
      public.is_school_admin(hour_logs.school_id)
      or public.is_platform_admin()
      or public.is_platform_super_admin()
    )
    and hour_logs.status in ('pending', 'approved', 'rejected')
    and hour_logs.adjustment_version = 0
    and public.user_school_id(hour_logs.user_id) = hour_logs.school_id
  )
  or (
    public.current_user_role() = 'instructor'
    and public.current_user_school_id() = hour_logs.school_id
    and hour_logs.submitted_by = auth.uid()
    and hour_logs.status = 'pending'
    and hour_logs.adjustment_version = 0
    and hour_logs.reviewed_by is null
    and hour_logs.reviewed_at is null
    and hour_logs.source_type = 'attendance'
    and hour_logs.source_attendance_id is not null
    and public.user_school_id(hour_logs.user_id) = hour_logs.school_id
    and exists (
      select 1
      from public.attendance_records ar
      where ar.id = hour_logs.source_attendance_id
        and ar.school_id = hour_logs.school_id
        and ar.user_id = hour_logs.user_id
        and ar.date = hour_logs.date
        and ar.status in ('Present', 'Tardy')
        and ar.minutes_present = hour_logs.minutes
        and ar.minutes_present > 0
    )
    and (
      hour_logs.resubmission_of_hour_log_id is null
      or exists (
        select 1
        from public.hour_logs rejected
        where rejected.id = hour_logs.resubmission_of_hour_log_id
          and rejected.source_attendance_id = hour_logs.source_attendance_id
          and rejected.school_id = hour_logs.school_id
          and rejected.user_id = hour_logs.user_id
          and rejected.status = 'rejected'
      )
    )
  )
);

-- ---------------------------------------------------------------------------
-- 6. Atomic approved-hour adjustment RPC.
--    Client supplies only the target row, desired effective minutes, reason,
--    and the version it last observed. Every audit/provenance field is derived
--    from authoritative database state under a row lock.
-- ---------------------------------------------------------------------------
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

comment on function public.adjust_approved_hour(uuid, integer, text, integer) is
  'Atomic, server-authoritative correction path for approved student hours. Uses a row lock and optimistic adjustment_version guard; all audit/provenance fields are derived from database state.';
