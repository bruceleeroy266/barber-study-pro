-- ============================================================================
-- STUDENT-HOURS-1 — Adaptive Enrollment Hours Contract
--
-- Adds enrollment-level prior/transfer credit and student-specific required
-- hour overrides without changing program-wide requirements or rewriting
-- approved hour evidence.
--
-- Official formula:
--   effective_required_minutes =
--     coalesce(requirement_override_minutes, program.required_hours * 60)
--   completed_for_requirement_minutes =
--     prior_credit_minutes + official approved minutes from effective_hour_logs
--   remaining_minutes =
--     greatest(0, effective_required_minutes - completed_for_requirement_minutes)
--
-- All persisted values are minutes to preserve exactness and align with the
-- existing hour_logs/effective_hour_logs contract.
-- ============================================================================

create table if not exists public.enrollment_hour_contracts (
  enrollment_id uuid primary key references public.enrollments(id) on delete restrict,
  school_id uuid not null references public.schools(id) on delete restrict,
  student_id uuid not null references public.students(id) on delete restrict,
  program_id uuid not null references public.programs(id) on delete restrict,

  prior_credit_minutes integer not null default 0
    check (prior_credit_minutes >= 0 and prior_credit_minutes <= 1000000),

  requirement_override_minutes integer
    check (
      requirement_override_minutes is null
      or (requirement_override_minutes > 0 and requirement_override_minutes <= 1000000)
    ),

  version integer not null default 0 check (version >= 0),

  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_by uuid not null references public.profiles(id) on delete restrict,
  updated_at timestamptz not null default now()
);

comment on table public.enrollment_hour_contracts is
  'Current enrollment-level hour contract. Prior credit and student-specific requirement override are separate from program requirements and approved hour evidence.';

comment on column public.enrollment_hour_contracts.prior_credit_minutes is
  'Official school-accepted prior/transfer credit for this enrollment. Never represented as synthetic attendance/hour_logs.';

comment on column public.enrollment_hour_contracts.requirement_override_minutes is
  'Optional student-specific total requirement for this enrollment. NULL means use the program required_hours value.';

create index if not exists idx_enrollment_hour_contracts_school_id
  on public.enrollment_hour_contracts(school_id);

create index if not exists idx_enrollment_hour_contracts_student_id
  on public.enrollment_hour_contracts(student_id);

create index if not exists idx_enrollment_hour_contracts_program_id
  on public.enrollment_hour_contracts(program_id);

-- Immutable audit ledger: one row per accepted official contract change.
create table if not exists public.enrollment_hour_contract_events (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete restrict,
  school_id uuid not null references public.schools(id) on delete restrict,
  student_id uuid not null references public.students(id) on delete restrict,
  program_id uuid not null references public.programs(id) on delete restrict,

  contract_version integer not null check (contract_version > 0),

  previous_prior_credit_minutes integer not null
    check (previous_prior_credit_minutes >= 0 and previous_prior_credit_minutes <= 1000000),
  new_prior_credit_minutes integer not null
    check (new_prior_credit_minutes >= 0 and new_prior_credit_minutes <= 1000000),

  previous_requirement_override_minutes integer
    check (
      previous_requirement_override_minutes is null
      or (previous_requirement_override_minutes > 0 and previous_requirement_override_minutes <= 1000000)
    ),
  new_requirement_override_minutes integer
    check (
      new_requirement_override_minutes is null
      or (new_requirement_override_minutes > 0 and new_requirement_override_minutes <= 1000000)
    ),

  change_type text not null
    check (change_type in ('transfer_credit', 'returning_student', 'redo_requirement', 'correction', 'other')),

  reason text not null check (char_length(btrim(reason)) between 10 and 1000),
  source_reference text check (source_reference is null or char_length(source_reference) <= 500),

  changed_by uuid not null references public.profiles(id) on delete restrict,
  changed_at timestamptz not null default now(),

  constraint enrollment_hour_contract_events_version_unique
    unique (enrollment_id, contract_version),
  constraint enrollment_hour_contract_events_non_noop_check
    check (
      new_prior_credit_minutes <> previous_prior_credit_minutes
      or new_requirement_override_minutes is distinct from previous_requirement_override_minutes
    )
);

comment on table public.enrollment_hour_contract_events is
  'Append-only audit ledger for official prior-credit and student-specific requirement changes.';

create index if not exists idx_enrollment_hour_contract_events_enrollment
  on public.enrollment_hour_contract_events(enrollment_id, contract_version desc);

create index if not exists idx_enrollment_hour_contract_events_school
  on public.enrollment_hour_contract_events(school_id, changed_at desc);

create index if not exists idx_enrollment_hour_contract_events_student
  on public.enrollment_hour_contract_events(student_id, changed_at desc);

-- Prevent mutation of audit history even by privileged application writes.
create or replace function public.prevent_enrollment_hour_contract_event_mutation()
returns trigger
set search_path = public, pg_temp
as $$
begin
  raise exception 'enrollment_hour_contract_events are immutable; create a new event instead'
    using errcode = '55000';
end;
$$ language plpgsql;

revoke execute on function public.prevent_enrollment_hour_contract_event_mutation() from public;
grant execute on function public.prevent_enrollment_hour_contract_event_mutation() to service_role;

drop trigger if exists trg_enrollment_hour_contract_events_immutable
  on public.enrollment_hour_contract_events;

create trigger trg_enrollment_hour_contract_events_immutable
  before update or delete on public.enrollment_hour_contract_events
  for each row execute function public.prevent_enrollment_hour_contract_event_mutation();

-- Read access is student/self + same-school staff + platform administration.
alter table public.enrollment_hour_contracts enable row level security;
alter table public.enrollment_hour_contract_events enable row level security;

grant select on public.enrollment_hour_contracts to authenticated;
grant select on public.enrollment_hour_contract_events to authenticated;

revoke insert, update, delete on public.enrollment_hour_contracts from anon, authenticated;
revoke insert, update, delete on public.enrollment_hour_contract_events from anon, authenticated;

grant select, insert, update, delete on public.enrollment_hour_contracts to service_role;
grant select, insert, update, delete on public.enrollment_hour_contract_events to service_role;

drop policy if exists enrollment_hour_contracts_select
  on public.enrollment_hour_contracts;

create policy enrollment_hour_contracts_select
on public.enrollment_hour_contracts
for select to authenticated
using (
  exists (
    select 1
    from public.students s
    where s.id = enrollment_hour_contracts.student_id
      and s.profile_id = auth.uid()
  )
  or public.is_school_staff(enrollment_hour_contracts.school_id)
  or public.is_platform_admin()
  or public.is_platform_super_admin()
);

drop policy if exists enrollment_hour_contract_events_select
  on public.enrollment_hour_contract_events;

create policy enrollment_hour_contract_events_select
on public.enrollment_hour_contract_events
for select to authenticated
using (
  exists (
    select 1
    from public.students s
    where s.id = enrollment_hour_contract_events.student_id
      and s.profile_id = auth.uid()
  )
  or public.is_school_staff(enrollment_hour_contract_events.school_id)
  or public.is_platform_admin()
  or public.is_platform_super_admin()
);

-- Canonical read view for requirement configuration. It intentionally does NOT
-- aggregate earned hours; those remain authoritative in effective_hour_logs.
drop view if exists public.effective_enrollment_hour_contracts;

create view public.effective_enrollment_hour_contracts
with (security_invoker = true)
as
select
  e.id as enrollment_id,
  s.school_id,
  e.student_id,
  s.profile_id as student_profile_id,
  e.program_id,
  p.required_hours as program_required_hours,
  p.required_hours * 60 as program_required_minutes,
  coalesce(c.prior_credit_minutes, 0) as prior_credit_minutes,
  c.requirement_override_minutes,
  coalesce(c.requirement_override_minutes, p.required_hours * 60) as effective_required_minutes,
  case
    when c.requirement_override_minutes is null then 'program'
    else 'student_override'
  end as requirement_source,
  coalesce(c.version, 0) as contract_version,
  c.updated_by,
  c.updated_at
from public.enrollments e
join public.students s on s.id = e.student_id
join public.programs p on p.id = e.program_id
left join public.enrollment_hour_contracts c on c.enrollment_id = e.id
where e.deleted_at is null
  and p.deleted_at is null
  and s.deleted_at is null;

comment on view public.effective_enrollment_hour_contracts is
  'Canonical enrollment requirement contract. Prior credit is distinct from earned hours; effective requirement uses a student override only when explicitly configured.';

revoke all on public.effective_enrollment_hour_contracts from public, anon, authenticated;
grant select on public.effective_enrollment_hour_contracts to authenticated;
grant select on public.effective_enrollment_hour_contracts to service_role;

-- Atomic official change path. UI/workflows may later wrap this with approval,
-- but no authenticated caller may directly mutate the current-state table.
create or replace function public.set_enrollment_hour_contract(
  p_enrollment_id uuid,
  p_prior_credit_minutes integer,
  p_requirement_override_minutes integer,
  p_change_type text,
  p_reason text,
  p_source_reference text default null,
  p_expected_version integer default 0
)
returns table (
  enrollment_id uuid,
  prior_credit_minutes integer,
  requirement_override_minutes integer,
  contract_version integer
)
set search_path = public, pg_temp
as $$
declare
  v_actor public.profiles%rowtype;
  v_enrollment public.enrollments%rowtype;
  v_student public.students%rowtype;
  v_program public.programs%rowtype;
  v_current public.enrollment_hour_contracts%rowtype;
  v_new_version integer;
  v_reason text;
  v_source_reference text;
  v_is_authorized boolean;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select * into v_actor
  from public.profiles
  where id = auth.uid()
  limit 1;

  if not found
     or coalesce(v_actor.is_disabled, false)
     or coalesce(v_actor.approval_status, '') <> 'approved' then
    raise exception 'Active approved administrator account required'
      using errcode = '42501';
  end if;

  if p_enrollment_id is null then
    raise exception 'Enrollment is required' using errcode = '22023';
  end if;

  if p_prior_credit_minutes is null
     or p_prior_credit_minutes < 0
     or p_prior_credit_minutes > 1000000 then
    raise exception 'Prior credit minutes must be between 0 and 1000000'
      using errcode = '22023';
  end if;

  if p_requirement_override_minutes is not null
     and (
       p_requirement_override_minutes <= 0
       or p_requirement_override_minutes > 1000000
     ) then
    raise exception 'Requirement override minutes must be null or between 1 and 1000000'
      using errcode = '22023';
  end if;

  if p_expected_version is null or p_expected_version < 0 then
    raise exception 'Expected contract version is required'
      using errcode = '22023';
  end if;

  if p_change_type not in ('transfer_credit', 'returning_student', 'redo_requirement', 'correction', 'other') then
    raise exception 'Invalid change type' using errcode = '22023';
  end if;

  v_reason := btrim(coalesce(p_reason, ''));
  if char_length(v_reason) < 10 or char_length(v_reason) > 1000 then
    raise exception 'Reason must be between 10 and 1000 characters'
      using errcode = '22023';
  end if;

  v_source_reference := nullif(btrim(coalesce(p_source_reference, '')), '');
  if v_source_reference is not null and char_length(v_source_reference) > 500 then
    raise exception 'Source reference must not exceed 500 characters'
      using errcode = '22023';
  end if;

  select * into v_enrollment
  from public.enrollments
  where id = p_enrollment_id
    and deleted_at is null
  for update;

  if not found then
    raise exception 'Enrollment not found' using errcode = 'P0002';
  end if;

  select * into v_student
  from public.students
  where id = v_enrollment.student_id
    and deleted_at is null;

  if not found then
    raise exception 'Enrollment student not found' using errcode = '55000';
  end if;

  select * into v_program
  from public.programs
  where id = v_enrollment.program_id
    and deleted_at is null;

  if not found then
    raise exception 'Enrollment program not found' using errcode = '55000';
  end if;

  if v_program.school_id <> v_student.school_id then
    raise exception 'Enrollment program and student school mismatch'
      using errcode = '55000';
  end if;

  v_is_authorized :=
    (
      v_actor.role in ('admin', 'school_admin')
      and v_actor.school_id = v_student.school_id
    )
    or (
      v_actor.role = 'admin'
      and v_actor.school_id is null
    )
    or v_actor.role = 'platform_super_admin';

  if not v_is_authorized then
    raise exception 'Not authorized to change this enrollment hour contract'
      using errcode = '42501';
  end if;

  select * into v_current
  from public.enrollment_hour_contracts
  where enrollment_id = v_enrollment.id
  for update;

  if found then
    if v_current.school_id <> v_student.school_id
       or v_current.student_id <> v_student.id
       or v_current.program_id <> v_program.id then
      raise exception 'Enrollment hour contract integrity check failed'
        using errcode = '55000';
    end if;

    if v_current.version <> p_expected_version then
      raise exception 'Enrollment hour contract changed since it was loaded; refresh before saving'
        using errcode = '40001';
    end if;

    if v_current.prior_credit_minutes = p_prior_credit_minutes
       and v_current.requirement_override_minutes is not distinct from p_requirement_override_minutes then
      raise exception 'Enrollment hour contract change must modify prior credit or requirement override'
        using errcode = '22023';
    end if;

    v_new_version := v_current.version + 1;

    insert into public.enrollment_hour_contract_events (
      enrollment_id,
      school_id,
      student_id,
      program_id,
      contract_version,
      previous_prior_credit_minutes,
      new_prior_credit_minutes,
      previous_requirement_override_minutes,
      new_requirement_override_minutes,
      change_type,
      reason,
      source_reference,
      changed_by,
      changed_at
    )
    values (
      v_enrollment.id,
      v_student.school_id,
      v_student.id,
      v_program.id,
      v_new_version,
      v_current.prior_credit_minutes,
      p_prior_credit_minutes,
      v_current.requirement_override_minutes,
      p_requirement_override_minutes,
      p_change_type,
      v_reason,
      v_source_reference,
      auth.uid(),
      now()
    );

    update public.enrollment_hour_contracts
    set prior_credit_minutes = p_prior_credit_minutes,
        requirement_override_minutes = p_requirement_override_minutes,
        version = v_new_version,
        updated_by = auth.uid(),
        updated_at = now()
    where enrollment_id = v_enrollment.id
      and version = p_expected_version;

    if not found then
      raise exception 'Enrollment hour contract changed during save; refresh and try again'
        using errcode = '40001';
    end if;
  else
    if p_expected_version <> 0 then
      raise exception 'Enrollment hour contract does not exist at the expected version'
        using errcode = '40001';
    end if;

    if p_prior_credit_minutes = 0 and p_requirement_override_minutes is null then
      raise exception 'Enrollment hour contract change must modify prior credit or requirement override'
        using errcode = '22023';
    end if;

    v_new_version := 1;

    insert into public.enrollment_hour_contracts (
      enrollment_id,
      school_id,
      student_id,
      program_id,
      prior_credit_minutes,
      requirement_override_minutes,
      version,
      created_by,
      created_at,
      updated_by,
      updated_at
    )
    values (
      v_enrollment.id,
      v_student.school_id,
      v_student.id,
      v_program.id,
      p_prior_credit_minutes,
      p_requirement_override_minutes,
      v_new_version,
      auth.uid(),
      now(),
      auth.uid(),
      now()
    );

    insert into public.enrollment_hour_contract_events (
      enrollment_id,
      school_id,
      student_id,
      program_id,
      contract_version,
      previous_prior_credit_minutes,
      new_prior_credit_minutes,
      previous_requirement_override_minutes,
      new_requirement_override_minutes,
      change_type,
      reason,
      source_reference,
      changed_by,
      changed_at
    )
    values (
      v_enrollment.id,
      v_student.school_id,
      v_student.id,
      v_program.id,
      v_new_version,
      0,
      p_prior_credit_minutes,
      null,
      p_requirement_override_minutes,
      p_change_type,
      v_reason,
      v_source_reference,
      auth.uid(),
      now()
    );
  end if;

  return query
  select
    v_enrollment.id,
    p_prior_credit_minutes,
    p_requirement_override_minutes,
    v_new_version;
end;
$$ language plpgsql security definer;

revoke execute on function public.set_enrollment_hour_contract(
  uuid, integer, integer, text, text, text, integer
) from public, anon;

grant execute on function public.set_enrollment_hour_contract(
  uuid, integer, integer, text, text, text, integer
) to authenticated;

comment on function public.set_enrollment_hour_contract(
  uuid, integer, integer, text, text, text, integer
) is
  'Atomic official mutation path for prior/transfer credit and student-specific requirement overrides. Never rewrites program requirements or hour_logs.';
