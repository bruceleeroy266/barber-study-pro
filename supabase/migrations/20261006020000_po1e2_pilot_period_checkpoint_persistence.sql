-- ============================================================================
-- PO-1E.2 — Pilot period + immutable checkpoint persistence
-- Gate 6 Automated Pilot Measurement
--
-- Invariants:
--   * pilot start/end are explicit and auditable
--   * only one active pilot period per school
--   * baseline/day_30/day_60/day_90 targets derive from pilot_start_date
--   * finalized checkpoints are immutable historical evidence
--   * cohort membership is snapshotted with the checkpoint
--   * ordinary authenticated users cannot directly mutate persistence tables
--   * school staff may read same-school periods/checkpoints
--   * platform admin may administer periods/checkpoints through narrow RPCs
--   * no H&A / grading / mastery / readiness writes exist in this migration
-- ============================================================================

create table if not exists public.pilot_measurement_periods (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  status text not null default 'draft',
  pilot_start_date date not null,
  pilot_end_date date not null,
  timezone text not null default 'UTC',
  created_by uuid not null references auth.users(id) on delete restrict,
  activated_by uuid references auth.users(id) on delete restrict,
  activated_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),

  constraint pilot_measurement_periods_status_check
    check (status in ('draft','active','completed','cancelled')),
  constraint pilot_measurement_periods_date_order_check
    check (pilot_end_date >= pilot_start_date),
  constraint pilot_measurement_periods_activation_check
    check (
      (status = 'draft' and activated_at is null and completed_at is null and cancelled_at is null)
      or (status = 'active' and activated_at is not null and completed_at is null and cancelled_at is null)
      or (status = 'completed' and activated_at is not null and completed_at is not null and cancelled_at is null)
      or (status = 'cancelled' and cancelled_at is not null and completed_at is null)
    )
);

create unique index if not exists uq_pilot_measurement_periods_one_active_per_school
  on public.pilot_measurement_periods(school_id)
  where status = 'active';

create index if not exists idx_pilot_measurement_periods_school_created
  on public.pilot_measurement_periods(school_id, created_at desc);

create table if not exists public.pilot_measurement_checkpoints (
  id uuid primary key default gen_random_uuid(),
  pilot_period_id uuid not null references public.pilot_measurement_periods(id) on delete restrict,
  school_id uuid not null references public.schools(id) on delete restrict,
  checkpoint_type text not null,
  target_date date not null,
  cutoff_at timestamptz not null,
  generated_at timestamptz not null default clock_timestamp(),
  generated_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'draft',
  finalized_at timestamptz,
  included_student_count integer not null default 0,
  excluded_student_count integer not null default 0,
  included_student_ids uuid[] not null default '{}'::uuid[],
  excluded_student_ids uuid[] not null default '{}'::uuid[],
  coverage jsonb not null default '{}'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  notes jsonb not null default '{}'::jsonb,
  schema_version text not null default 'po1e-1',
  created_at timestamptz not null default clock_timestamp(),

  constraint pilot_measurement_checkpoints_type_check
    check (checkpoint_type in ('baseline','day_30','day_60','day_90')),
  constraint pilot_measurement_checkpoints_status_check
    check (status in ('draft','finalized')),
  constraint pilot_measurement_checkpoints_counts_check
    check (included_student_count >= 0 and excluded_student_count >= 0),
  constraint pilot_measurement_checkpoints_membership_count_check
    check (
      cardinality(included_student_ids) = included_student_count
      and cardinality(excluded_student_ids) = excluded_student_count
    ),
  constraint pilot_measurement_checkpoints_json_object_check
    check (
      jsonb_typeof(coverage) = 'object'
      and jsonb_typeof(metrics) = 'object'
      and jsonb_typeof(notes) = 'object'
    ),
  constraint pilot_measurement_checkpoints_finalize_check
    check (
      (status = 'draft' and finalized_at is null)
      or (status = 'finalized' and finalized_at is not null)
    )
);

create unique index if not exists uq_pilot_measurement_checkpoints_finalized_type
  on public.pilot_measurement_checkpoints(pilot_period_id, checkpoint_type)
  where status = 'finalized';

create index if not exists idx_pilot_measurement_checkpoints_school_generated
  on public.pilot_measurement_checkpoints(school_id, generated_at desc);

create index if not exists idx_pilot_measurement_checkpoints_period_type
  on public.pilot_measurement_checkpoints(pilot_period_id, checkpoint_type, generated_at desc);

alter table public.pilot_measurement_periods enable row level security;
alter table public.pilot_measurement_checkpoints enable row level security;

-- Same-school staff may read pilot period/checkpoint history.
drop policy if exists pilot_measurement_periods_school_staff_select
  on public.pilot_measurement_periods;
create policy pilot_measurement_periods_school_staff_select
  on public.pilot_measurement_periods
  for select to authenticated
  using (
    public.is_school_staff(school_id)
    and public.current_user_school_id() = school_id
  );

drop policy if exists pilot_measurement_checkpoints_school_staff_select
  on public.pilot_measurement_checkpoints;
create policy pilot_measurement_checkpoints_school_staff_select
  on public.pilot_measurement_checkpoints
  for select to authenticated
  using (
    public.is_school_staff(school_id)
    and public.current_user_school_id() = school_id
  );

-- Platform admin may read all pilot measurement evidence.
drop policy if exists pilot_measurement_periods_platform_admin_select
  on public.pilot_measurement_periods;
create policy pilot_measurement_periods_platform_admin_select
  on public.pilot_measurement_periods
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists pilot_measurement_checkpoints_platform_admin_select
  on public.pilot_measurement_checkpoints;
create policy pilot_measurement_checkpoints_platform_admin_select
  on public.pilot_measurement_checkpoints
  for select to authenticated
  using (public.is_platform_admin());

-- No direct authenticated writes. Mutation is RPC-only.
revoke all on public.pilot_measurement_periods from anon, authenticated;
revoke all on public.pilot_measurement_checkpoints from anon, authenticated;
grant select on public.pilot_measurement_periods to authenticated;
grant select on public.pilot_measurement_checkpoints to authenticated;
grant select, insert, update, delete on public.pilot_measurement_periods to service_role;
grant select, insert, update, delete on public.pilot_measurement_checkpoints to service_role;

-- --------------------------------------------------------------------------
-- Target-date helper. Deterministic and shared by runtime/tests.
-- --------------------------------------------------------------------------
create or replace function public.pilot_checkpoint_target_date(
  p_start_date date,
  p_checkpoint_type text
)
returns date
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  case p_checkpoint_type
    when 'baseline' then return p_start_date;
    when 'day_30' then return p_start_date + 30;
    when 'day_60' then return p_start_date + 60;
    when 'day_90' then return p_start_date + 90;
    else
      raise exception 'Unsupported pilot checkpoint type';
  end case;
end;
$$;

-- --------------------------------------------------------------------------
-- Platform-admin-only draft creation.
-- Standard external-school duration defaults to 90 days.
-- --------------------------------------------------------------------------
create or replace function public.create_pilot_measurement_period(
  p_school_id uuid,
  p_pilot_start_date date,
  p_timezone text default 'UTC',
  p_pilot_end_date date default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_period_id uuid;
  v_end_date date;
begin
  if v_actor is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  if p_school_id is null
     or not exists (
       select 1
       from public.schools
       where id = p_school_id
         and deleted_at is null
     ) then
    raise exception 'Active school required';
  end if;

  if p_pilot_start_date is null then
    raise exception 'Pilot start date required';
  end if;

  if p_timezone is null
     or not exists (select 1 from pg_timezone_names where name = p_timezone) then
    raise exception 'Valid IANA timezone required';
  end if;

  v_end_date := coalesce(p_pilot_end_date, p_pilot_start_date + 90);

  if v_end_date < p_pilot_start_date then
    raise exception 'Pilot end date cannot precede start date';
  end if;

  insert into public.pilot_measurement_periods (
    school_id,
    status,
    pilot_start_date,
    pilot_end_date,
    timezone,
    created_by
  )
  values (
    p_school_id,
    'draft',
    p_pilot_start_date,
    v_end_date,
    p_timezone,
    v_actor
  )
  returning id into v_period_id;

  return v_period_id;
end;
$$;

-- --------------------------------------------------------------------------
-- Activate a draft period. One active period per school is enforced by index.
-- --------------------------------------------------------------------------
create or replace function public.activate_pilot_measurement_period(
  p_period_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_period public.pilot_measurement_periods%rowtype;
begin
  if v_actor is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select *
    into v_period
  from public.pilot_measurement_periods
  where id = p_period_id
  for update;

  if not found then
    raise exception 'Pilot measurement period not found';
  end if;

  if v_period.status = 'active' then
    return;
  end if;

  if v_period.status <> 'draft' then
    raise exception 'Only draft pilot periods can be activated';
  end if;

  update public.pilot_measurement_periods
  set status = 'active',
      activated_by = v_actor,
      activated_at = clock_timestamp(),
      updated_at = clock_timestamp()
  where id = p_period_id;
end;
$$;

-- --------------------------------------------------------------------------
-- Complete an active period after the final checkpoint has been finalized.
-- --------------------------------------------------------------------------
create or replace function public.complete_pilot_measurement_period(
  p_period_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_period public.pilot_measurement_periods%rowtype;
begin
  if v_actor is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select *
    into v_period
  from public.pilot_measurement_periods
  where id = p_period_id
  for update;

  if not found then
    raise exception 'Pilot measurement period not found';
  end if;

  if v_period.status = 'completed' then
    return;
  end if;

  if v_period.status <> 'active' then
    raise exception 'Only active pilot periods can be completed';
  end if;

  if not exists (
    select 1
    from public.pilot_measurement_checkpoints
    where pilot_period_id = p_period_id
      and checkpoint_type = 'day_90'
      and status = 'finalized'
  ) then
    raise exception 'Finalized Day 90 checkpoint required';
  end if;

  update public.pilot_measurement_periods
  set status = 'completed',
      completed_at = clock_timestamp(),
      updated_at = clock_timestamp()
  where id = p_period_id;
end;
$$;

-- --------------------------------------------------------------------------
-- Create a draft checkpoint snapshot.
-- Caller supplies already-resolved trusted metrics from the server resolver.
-- Only platform admin may persist official checkpoint evidence.
-- --------------------------------------------------------------------------
create or replace function public.create_pilot_measurement_checkpoint_draft(
  p_period_id uuid,
  p_checkpoint_type text,
  p_cutoff_at timestamptz,
  p_included_student_ids uuid[],
  p_excluded_student_ids uuid[],
  p_coverage jsonb,
  p_metrics jsonb,
  p_notes jsonb default '{}'::jsonb,
  p_schema_version text default 'po1e-1'
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_period public.pilot_measurement_periods%rowtype;
  v_checkpoint_id uuid;
  v_target_date date;
begin
  if v_actor is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  if p_checkpoint_type not in ('baseline','day_30','day_60','day_90') then
    raise exception 'Unsupported pilot checkpoint type';
  end if;

  select *
    into v_period
  from public.pilot_measurement_periods
  where id = p_period_id
  for share;

  if not found then
    raise exception 'Pilot measurement period not found';
  end if;

  if v_period.status not in ('active','completed') then
    raise exception 'Pilot measurement period must be active or completed';
  end if;

  if p_cutoff_at is null then
    raise exception 'Checkpoint cutoff required';
  end if;

  if jsonb_typeof(coalesce(p_coverage, '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_metrics, '{}'::jsonb)) <> 'object'
     or jsonb_typeof(coalesce(p_notes, '{}'::jsonb)) <> 'object' then
    raise exception 'Checkpoint JSON payloads must be objects';
  end if;

  v_target_date := public.pilot_checkpoint_target_date(
    v_period.pilot_start_date,
    p_checkpoint_type
  );

  insert into public.pilot_measurement_checkpoints (
    pilot_period_id,
    school_id,
    checkpoint_type,
    target_date,
    cutoff_at,
    generated_by,
    status,
    included_student_count,
    excluded_student_count,
    included_student_ids,
    excluded_student_ids,
    coverage,
    metrics,
    notes,
    schema_version
  )
  values (
    v_period.id,
    v_period.school_id,
    p_checkpoint_type,
    v_target_date,
    p_cutoff_at,
    v_actor,
    'draft',
    cardinality(coalesce(p_included_student_ids, '{}'::uuid[])),
    cardinality(coalesce(p_excluded_student_ids, '{}'::uuid[])),
    coalesce(p_included_student_ids, '{}'::uuid[]),
    coalesce(p_excluded_student_ids, '{}'::uuid[]),
    coalesce(p_coverage, '{}'::jsonb),
    coalesce(p_metrics, '{}'::jsonb),
    coalesce(p_notes, '{}'::jsonb),
    coalesce(nullif(btrim(p_schema_version), ''), 'po1e-1')
  )
  returning id into v_checkpoint_id;

  return v_checkpoint_id;
end;
$$;

-- --------------------------------------------------------------------------
-- Finalize exactly one historical checkpoint per period/type.
-- --------------------------------------------------------------------------
create or replace function public.finalize_pilot_measurement_checkpoint(
  p_checkpoint_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_checkpoint public.pilot_measurement_checkpoints%rowtype;
begin
  if v_actor is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select *
    into v_checkpoint
  from public.pilot_measurement_checkpoints
  where id = p_checkpoint_id
  for update;

  if not found then
    raise exception 'Pilot measurement checkpoint not found';
  end if;

  if v_checkpoint.status = 'finalized' then
    return;
  end if;

  if v_checkpoint.status <> 'draft' then
    raise exception 'Only draft checkpoints can be finalized';
  end if;

  if exists (
    select 1
    from public.pilot_measurement_checkpoints
    where pilot_period_id = v_checkpoint.pilot_period_id
      and checkpoint_type = v_checkpoint.checkpoint_type
      and status = 'finalized'
      and id <> v_checkpoint.id
  ) then
    raise exception 'Checkpoint type already finalized for this pilot period';
  end if;

  update public.pilot_measurement_checkpoints
  set status = 'finalized',
      finalized_at = clock_timestamp()
  where id = p_checkpoint_id;
end;
$$;

-- --------------------------------------------------------------------------
-- Finalized checkpoints are immutable, even to service-role table writes.
-- A future audited revision workflow must create a replacement record instead.
-- --------------------------------------------------------------------------
create or replace function public.prevent_finalized_pilot_checkpoint_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' and old.status = 'finalized' then
    raise exception 'Finalized pilot measurement checkpoints are immutable';
  end if;

  if tg_op = 'UPDATE'
     and old.status = 'finalized'
     and row(new.*) is distinct from row(old.*) then
    raise exception 'Finalized pilot measurement checkpoints are immutable';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_pilot_measurement_checkpoint_immutable
  on public.pilot_measurement_checkpoints;
create trigger trg_pilot_measurement_checkpoint_immutable
before update or delete on public.pilot_measurement_checkpoints
for each row execute function public.prevent_finalized_pilot_checkpoint_mutation();

-- RPC grants
revoke all on function public.pilot_checkpoint_target_date(date, text) from public, anon;
revoke all on function public.create_pilot_measurement_period(uuid, date, text, date) from public, anon;
revoke all on function public.activate_pilot_measurement_period(uuid) from public, anon;
revoke all on function public.complete_pilot_measurement_period(uuid) from public, anon;
revoke all on function public.create_pilot_measurement_checkpoint_draft(uuid, text, timestamptz, uuid[], uuid[], jsonb, jsonb, jsonb, text) from public, anon;
revoke all on function public.finalize_pilot_measurement_checkpoint(uuid) from public, anon;

grant execute on function public.pilot_checkpoint_target_date(date, text) to authenticated, service_role;
grant execute on function public.create_pilot_measurement_period(uuid, date, text, date) to authenticated;
grant execute on function public.activate_pilot_measurement_period(uuid) to authenticated;
grant execute on function public.complete_pilot_measurement_period(uuid) to authenticated;
grant execute on function public.create_pilot_measurement_checkpoint_draft(uuid, text, timestamptz, uuid[], uuid[], jsonb, jsonb, jsonb, text) to authenticated;
grant execute on function public.finalize_pilot_measurement_checkpoint(uuid) to authenticated;

-- Explicit service-role operational access for controlled backfills/support.
grant execute on function public.create_pilot_measurement_period(uuid, date, text, date) to service_role;
grant execute on function public.activate_pilot_measurement_period(uuid) to service_role;
grant execute on function public.complete_pilot_measurement_period(uuid) to service_role;
grant execute on function public.create_pilot_measurement_checkpoint_draft(uuid, text, timestamptz, uuid[], uuid[], jsonb, jsonb, jsonb, text) to service_role;
grant execute on function public.finalize_pilot_measurement_checkpoint(uuid) to service_role;

comment on table public.pilot_measurement_periods is
  'PO-1E official school pilot measurement periods. Observational/reporting only.';
comment on table public.pilot_measurement_checkpoints is
  'PO-1E immutable finalized Baseline/Day30/Day60/Day90 pilot measurement snapshots.';
