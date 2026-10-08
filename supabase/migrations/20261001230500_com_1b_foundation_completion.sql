-- ============================================================================
-- COM-1B — Production Communication Database Foundation Completion
--
-- Completes the schema-only foundation merged in PR #241 with:
--   * authoritative assignment row validation
--   * an active-assignment resolver for later COM authorization slices
--   * thread creation enforcement against the active assignment
--   * immutable participant identity on existing threads
--   * append-only communication evidence guards
--   * explicit closed-by-default grants
--
-- No UI, Realtime, message sending runtime, bulletin publishing runtime, or
-- authenticated RLS policies are activated by this migration.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Assignment row integrity.
-- ---------------------------------------------------------------------------
create or replace function public.validate_communication_assignment_row()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_student public.profiles%rowtype;
  v_instructor public.profiles%rowtype;
begin
  select *
    into v_student
  from public.profiles
  where id = new.student_id
  limit 1;

  if not found then
    raise exception 'Communication assignment student profile not found'
      using errcode = '23503';
  end if;

  if v_student.role not in ('student', 'apprentice') then
    raise exception 'Communication assignment student must have student or apprentice role'
      using errcode = '23514';
  end if;

  if v_student.school_id is distinct from new.school_id then
    raise exception 'Communication assignment student must belong to the assignment school'
      using errcode = '23514';
  end if;

  select *
    into v_instructor
  from public.profiles
  where id = new.instructor_id
  limit 1;

  if not found then
    raise exception 'Communication assignment instructor profile not found'
      using errcode = '23503';
  end if;

  if v_instructor.role <> 'instructor' then
    raise exception 'Communication assignment instructor must have instructor role'
      using errcode = '23514';
  end if;

  if v_instructor.school_id is distinct from new.school_id then
    raise exception 'Communication assignment instructor must belong to the assignment school'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_communication_assignment_row()
  from public, anon, authenticated;
grant execute on function public.validate_communication_assignment_row()
  to service_role;

drop trigger if exists trg_validate_communication_assignment
  on public.student_instructor_assignments;

create trigger trg_validate_communication_assignment
  before insert or update of school_id, student_id, instructor_id
  on public.student_instructor_assignments
  for each row
  execute function public.validate_communication_assignment_row();

-- ---------------------------------------------------------------------------
-- 2. Active assignment resolver.
--
-- This helper intentionally has no authenticated EXECUTE grant in COM-1B.
-- COM-1C may expose it only as required by certified RLS policy logic.
-- ---------------------------------------------------------------------------
create or replace function public.has_active_communication_assignment(
  p_school_id uuid,
  p_student_id uuid,
  p_instructor_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.student_instructor_assignments a
    where a.school_id = p_school_id
      and a.student_id = p_student_id
      and a.instructor_id = p_instructor_id
      and a.is_active = true
      and a.ended_at is null
  );
$$;

revoke execute on function public.has_active_communication_assignment(uuid, uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.has_active_communication_assignment(uuid, uuid, uuid)
  to service_role;

-- ---------------------------------------------------------------------------
-- 3. Thread assignment integrity.
--
-- Creation requires a current active assignment. Historical threads remain
-- preserved after later reassignment. Their participant/school identity cannot
-- be retargeted after creation.
-- ---------------------------------------------------------------------------
create or replace function public.validate_communication_thread_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.has_active_communication_assignment(
    new.school_id,
    new.student_id,
    new.instructor_id
  ) then
    raise exception 'Communication thread requires an active student-instructor assignment'
      using errcode = '23514';
  end if;

  if new.created_by not in (new.student_id, new.instructor_id) then
    raise exception 'Communication thread creator must be one of the thread participants'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_communication_thread_insert()
  from public, anon, authenticated;
grant execute on function public.validate_communication_thread_insert()
  to service_role;

drop trigger if exists trg_validate_communication_thread_insert
  on public.communication_threads;

create trigger trg_validate_communication_thread_insert
  before insert on public.communication_threads
  for each row
  execute function public.validate_communication_thread_insert();

create or replace function public.prevent_communication_thread_retargeting()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.school_id is distinct from old.school_id
     or new.student_id is distinct from old.student_id
     or new.instructor_id is distinct from old.instructor_id
     or new.created_by is distinct from old.created_by then
    raise exception 'Communication thread participant identity is immutable'
      using errcode = '55000';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_communication_thread_retargeting()
  from public, anon, authenticated;
grant execute on function public.prevent_communication_thread_retargeting()
  to service_role;

drop trigger if exists trg_prevent_communication_thread_retargeting
  on public.communication_threads;

create trigger trg_prevent_communication_thread_retargeting
  before update of school_id, student_id, instructor_id, created_by
  on public.communication_threads
  for each row
  execute function public.prevent_communication_thread_retargeting();

-- ---------------------------------------------------------------------------
-- 4. Append-only communication evidence.
-- ---------------------------------------------------------------------------
create or replace function public.prevent_communication_evidence_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  raise exception 'Communication evidence is append-only'
    using errcode = '55000';
end;
$$;

revoke execute on function public.prevent_communication_evidence_mutation()
  from public, anon, authenticated;
grant execute on function public.prevent_communication_evidence_mutation()
  to service_role;

drop trigger if exists trg_communication_messages_append_only
  on public.communication_messages;
create trigger trg_communication_messages_append_only
  before update or delete on public.communication_messages
  for each row execute function public.prevent_communication_evidence_mutation();

drop trigger if exists trg_communication_message_reads_append_only
  on public.communication_message_reads;
create trigger trg_communication_message_reads_append_only
  before update or delete on public.communication_message_reads
  for each row execute function public.prevent_communication_evidence_mutation();

drop trigger if exists trg_bulletin_acknowledgments_append_only
  on public.bulletin_acknowledgments;
create trigger trg_bulletin_acknowledgments_append_only
  before update or delete on public.bulletin_acknowledgments
  for each row execute function public.prevent_communication_evidence_mutation();

drop trigger if exists trg_communication_audit_events_append_only
  on public.communication_audit_events;
create trigger trg_communication_audit_events_append_only
  before update or delete on public.communication_audit_events
  for each row execute function public.prevent_communication_evidence_mutation();

-- ---------------------------------------------------------------------------
-- 5. updated_at trigger coverage for mutable foundation rows.
-- ---------------------------------------------------------------------------
drop trigger if exists update_student_instructor_assignments_updated_at
  on public.student_instructor_assignments;
create trigger update_student_instructor_assignments_updated_at
  before update on public.student_instructor_assignments
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_communication_threads_updated_at
  on public.communication_threads;
create trigger update_communication_threads_updated_at
  before update on public.communication_threads
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_bulletins_updated_at
  on public.bulletins;
create trigger update_bulletins_updated_at
  before update on public.bulletins
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 6. Closed-by-default grants.
--
-- RLS was enabled in the original COM-1B migration. COM-1B intentionally gives
-- ordinary authenticated users no table mutation/read privileges yet. COM-1C
-- will introduce the exact authenticated grants together with identity-scoped
-- RLS policies so grants can never outrun policy.
-- ---------------------------------------------------------------------------
revoke all on table public.student_instructor_assignments from anon, authenticated;
revoke all on table public.communication_threads from anon, authenticated;
revoke all on table public.communication_messages from anon, authenticated;
revoke all on table public.communication_message_reads from anon, authenticated;
revoke all on table public.bulletins from anon, authenticated;
revoke all on table public.bulletin_audiences from anon, authenticated;
revoke all on table public.bulletin_acknowledgments from anon, authenticated;
revoke all on table public.communication_audit_events from anon, authenticated;

grant select, insert, update, delete on table public.student_instructor_assignments to service_role;
grant select, insert, update, delete on table public.communication_threads to service_role;
grant select, insert, update, delete on table public.communication_messages to service_role;
grant select, insert, update, delete on table public.communication_message_reads to service_role;
grant select, insert, update, delete on table public.bulletins to service_role;
grant select, insert, update, delete on table public.bulletin_audiences to service_role;
grant select, insert, update, delete on table public.bulletin_acknowledgments to service_role;
grant select, insert, update, delete on table public.communication_audit_events to service_role;

-- Defensive reassertion: all public communication tables stay under RLS.
alter table public.student_instructor_assignments enable row level security;
alter table public.communication_threads enable row level security;
alter table public.communication_messages enable row level security;
alter table public.communication_message_reads enable row level security;
alter table public.bulletins enable row level security;
alter table public.bulletin_audiences enable row level security;
alter table public.bulletin_acknowledgments enable row level security;
alter table public.communication_audit_events enable row level security;

comment on function public.has_active_communication_assignment(uuid, uuid, uuid) is
  'COM-1B server-side resolver for one active Communications assignment. Not exposed to authenticated callers until later authorization slices.';
