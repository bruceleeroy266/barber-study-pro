-- PO-1E.2 — Pilot period + immutable checkpoint persistence
-- Gate 6 Automated Pilot Measurement
-- Baseline: main 535fc7f7e2132e7eae505b358a9ea207b47be78b
--
-- Adds explicit school pilot periods and immutable finalized checkpoint snapshots.
-- This migration is persistence-only. It does not calculate pilot metrics, mutate
-- grades/readiness/remediation, or write H&A evidence.

create table if not exists public.pilot_measurement_periods (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'completed', 'cancelled')),
  pilot_start_date date not null,
  pilot_end_date date not null,
  timezone text not null default 'UTC',
  created_by uuid not null references auth.users(id) on delete restrict,
  activated_by uuid null references auth.users(id) on delete restrict,
  activated_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  constraint pilot_measurement_period_dates_valid
    check (pilot_end_date >= pilot_start_date),
  constraint pilot_measurement_period_activation_state_valid
    check (
      (status = 'draft' and activated_at is null)
      or (status in ('active','completed','cancelled'))
    )
);

create unique index if not exists uq_pilot_measurement_period_active_school
  on public.pilot_measurement_periods(school_id)
  where status = 'active';

create index if not exists idx_pilot_measurement_period_school_created
  on public.pilot_measurement_periods(school_id, created_at desc);

create table if not exists public.pilot_measurement_checkpoints (
  id uuid primary key default gen_random_uuid(),
  pilot_period_id uuid not null references public.pilot_measurement_periods(id) on delete restrict,
  school_id uuid not null references public.schools(id) on delete restrict,
  checkpoint_type text not null
    check (checkpoint_type in ('baseline','day_30','day_60','day_90')),
  target_date date not null,
  cutoff_at timestamptz not null,
  generated_at timestamptz not null default clock_timestamp(),
  generated_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'draft'
    check (status in ('draft','finalized')),
  finalized_at timestamptz null,
  finalized_by uuid null references auth.users(id) on delete restrict,
  included_student_count integer not null default 0 check (included_student_count >= 0),
  excluded_student_count integer not null default 0 check (excluded_student_count >= 0),
  cohort_membership jsonb not null default '[]'::jsonb
    check (jsonb_typeof(cohort_membership) = 'array'),
  coverage jsonb not null default '{}'::jsonb
    check (jsonb_typeof(coverage) = 'object'),
  metrics jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metrics) = 'object'),
  notes jsonb not null default '{}'::jsonb
    check (jsonb_typeof(notes) = 'object'),
  schema_version text not null default 'po-1e.2-v1',
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  constraint pilot_checkpoint_finalization_state_valid
    check (
      (status = 'draft' and finalized_at is null and finalized_by is null)
      or (status = 'finalized' and finalized_at is not null and finalized_by is not null)
    )
);

create unique index if not exists uq_pilot_checkpoint_finalized_period_type
  on public.pilot_measurement_checkpoints(pilot_period_id, checkpoint_type)
  where status = 'finalized';

create index if not exists idx_pilot_checkpoint_school_generated
  on public.pilot_measurement_checkpoints(school_id, generated_at desc);

create index if not exists idx_pilot_checkpoint_period_type
  on public.pilot_measurement_checkpoints(pilot_period_id, checkpoint_type, generated_at desc);

alter table public.pilot_measurement_periods enable row level security;
alter table public.pilot_measurement_checkpoints enable row level security;

revoke all on public.pilot_measurement_periods from anon, authenticated;
revoke all on public.pilot_measurement_checkpoints from anon, authenticated;

grant select on public.pilot_measurement_periods to authenticated;
grant select on public.pilot_measurement_checkpoints to authenticated;
grant all on public.pilot_measurement_periods to service_role;
grant all on public.pilot_measurement_checkpoints to service_role;

drop policy if exists "Pilot periods: school staff read own school"
  on public.pilot_measurement_periods;
create policy "Pilot periods: school staff read own school"
  on public.pilot_measurement_periods
  for select to authenticated
  using (
    (
      school_id = public.current_user_school_id()
      and public.is_school_staff(school_id)
    )
    or public.is_platform_admin()
  );

drop policy if exists "Pilot checkpoints: school staff read own school"
  on public.pilot_measurement_checkpoints;
create policy "Pilot checkpoints: school staff read own school"
  on public.pilot_measurement_checkpoints
  for select to authenticated
  using (
    (
      school_id = public.current_user_school_id()
      and public.is_school_staff(school_id)
    )
    or public.is_platform_admin()
  );

create or replace function public.prevent_finalized_pilot_checkpoint_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.status = 'finalized' then
    raise exception 'Finalized pilot checkpoints are immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_finalized_pilot_checkpoint_update
  on public.pilot_measurement_checkpoints;
create trigger trg_prevent_finalized_pilot_checkpoint_update
before update on public.pilot_measurement_checkpoints
for each row execute function public.prevent_finalized_pilot_checkpoint_mutation();

drop trigger if exists trg_prevent_finalized_pilot_checkpoint_delete
  on public.pilot_measurement_checkpoints;
create trigger trg_prevent_finalized_pilot_checkpoint_delete
before delete on public.pilot_measurement_checkpoints
for each row execute function public.prevent_finalized_pilot_checkpoint_mutation();

create or replace function public.activate_pilot_measurement_period(
  p_period_id uuid
)
returns public.pilot_measurement_periods
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_period public.pilot_measurement_periods;
begin
  select * into v_period
  from public.pilot_measurement_periods
  where id = p_period_id
  for update;

  if not found then
    raise exception 'Pilot measurement period not found';
  end if;

  if not (
    public.is_platform_admin()
    or public.is_school_admin(v_period.school_id)
  ) then
    raise exception 'Not authorized to activate pilot measurement period';
  end if;

  if v_period.status <> 'draft' then
    raise exception 'Only draft pilot measurement periods may be activated';
  end if;

  if exists (
    select 1
    from public.pilot_measurement_periods p
    where p.school_id = v_period.school_id
      and p.status = 'active'
      and p.id <> v_period.id
  ) then
    raise exception 'School already has an active pilot measurement period';
  end if;

  update public.pilot_measurement_periods
  set
    status = 'active',
    activated_by = auth.uid(),
    activated_at = clock_timestamp(),
    updated_at = clock_timestamp()
  where id = v_period.id
  returning * into v_period;

  return v_period;
end;
$$;

revoke all on function public.activate_pilot_measurement_period(uuid) from public, anon;
grant execute on function public.activate_pilot_measurement_period(uuid) to authenticated, service_role;

create or replace function public.finalize_pilot_measurement_checkpoint(
  p_checkpoint_id uuid
)
returns public.pilot_measurement_checkpoints
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_checkpoint public.pilot_measurement_checkpoints;
begin
  select * into v_checkpoint
  from public.pilot_measurement_checkpoints
  where id = p_checkpoint_id
  for update;

  if not found then
    raise exception 'Pilot measurement checkpoint not found';
  end if;

  if not (
    public.is_platform_admin()
    or public.is_school_admin(v_checkpoint.school_id)
  ) then
    raise exception 'Not authorized to finalize pilot measurement checkpoint';
  end if;

  if v_checkpoint.status = 'finalized' then
    return v_checkpoint;
  end if;

  if exists (
    select 1
    from public.pilot_measurement_checkpoints c
    where c.pilot_period_id = v_checkpoint.pilot_period_id
      and c.checkpoint_type = v_checkpoint.checkpoint_type
      and c.status = 'finalized'
      and c.id <> v_checkpoint.id
  ) then
    raise exception 'A finalized checkpoint already exists for this period and checkpoint type';
  end if;

  update public.pilot_measurement_checkpoints
  set
    status = 'finalized',
    finalized_at = clock_timestamp(),
    finalized_by = auth.uid(),
    updated_at = clock_timestamp()
  where id = v_checkpoint.id
  returning * into v_checkpoint;

  return v_checkpoint;
end;
$$;

revoke all on function public.finalize_pilot_measurement_checkpoint(uuid) from public, anon;
grant execute on function public.finalize_pilot_measurement_checkpoint(uuid) to authenticated, service_role;

comment on table public.pilot_measurement_periods is
  'PO-1E.2 explicit school pilot measurement periods. Dates are operational authority, not inferred from login/activity.';

comment on table public.pilot_measurement_checkpoints is
  'PO-1E.2 pilot checkpoint snapshots. Finalized rows are immutable historical evidence.';

comment on function public.finalize_pilot_measurement_checkpoint(uuid) is
  'Finalizes a draft pilot measurement checkpoint idempotently. Finalized rows cannot be updated or deleted.';
