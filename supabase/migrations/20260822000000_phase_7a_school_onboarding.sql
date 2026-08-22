-- ============================================================================
-- Migration: 20260822000000_phase_7a_school_onboarding
-- Phase 7A Slice 1 — Persistence/Invariants: Database Foundation
--
-- Creates:
--   A. school_onboarding_invitations table
--   B. pilot_inquiries additions (school_id, school_created_at)
--   C. create_school_from_inquiry() transactional RPC
--
-- Security model:
--   - RLS enabled on school_onboarding_invitations
--   - Platform admin (role='admin', school_id IS NULL) can read all invitations
--   - School admin (role='school_admin') can read invitations for their school
--   - Ordinary instructor/student cannot enumerate invitations
--   - Anonymous users cannot enumerate invitations
--   - No client-controlled INSERT path for arbitrary school_id assignment
--   - create_school_from_inquiry() is SECURITY DEFINER with explicit auth
--   - search_path explicitly constrained
--   - Function privileges explicitly restricted
--   - ONE PILOT INQUIRY → AT MOST ONE SCHOOL enforced by UNIQUE constraint
--     on pilot_inquiries.school_id
-- ============================================================================

-- ============================================================================
-- A. SCHOOL_ONBOARDING_INVITATIONS TABLE
-- ============================================================================

create table if not exists public.school_onboarding_invitations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  pilot_inquiry_id uuid references public.pilot_inquiries(id) on delete set null,
  invited_by uuid not null references auth.users(id) on delete restrict,
  email text not null,
  full_name text not null,
  role text not null check (role in ('school_admin', 'instructor', 'student')),
  auth_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'revoked')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Required uniqueness: one active invitation per school+email+role
  constraint school_onboarding_invitations_school_email_role_unique
    unique (school_id, email, role)
);

-- ============================================================================
-- A.1 INDEXES
-- ============================================================================

create index if not exists idx_school_onboarding_invitations_school_id
  on public.school_onboarding_invitations(school_id);

create index if not exists idx_school_onboarding_invitations_pilot_inquiry_id
  on public.school_onboarding_invitations(pilot_inquiry_id);

create index if not exists idx_school_onboarding_invitations_email
  on public.school_onboarding_invitations(email);

create index if not exists idx_school_onboarding_invitations_status
  on public.school_onboarding_invitations(status);

create index if not exists idx_school_onboarding_invitations_invited_by
  on public.school_onboarding_invitations(invited_by);

create index if not exists idx_school_onboarding_invitations_auth_user_id
  on public.school_onboarding_invitations(auth_user_id);

create index if not exists idx_school_onboarding_invitations_expires_at
  on public.school_onboarding_invitations(expires_at);

-- ============================================================================
-- A.2 UPDATED_AT TRIGGER
-- ============================================================================

drop trigger if exists update_school_onboarding_invitations_updated_at
  on public.school_onboarding_invitations;

create trigger update_school_onboarding_invitations_updated_at
  before update on public.school_onboarding_invitations
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- A.3 ROW LEVEL SECURITY
-- ============================================================================

alter table public.school_onboarding_invitations enable row level security;

-- Platform admin (role='admin', school_id IS NULL) can read all invitations.
-- School admin (role='school_admin') can read invitations for their school only.
-- Ordinary instructor/student cannot enumerate invitations.
-- Anonymous users cannot enumerate invitations.

drop policy if exists "Platform admins can read all invitations"
  on public.school_onboarding_invitations;

create policy "Platform admins can read all invitations"
  on public.school_onboarding_invitations
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.school_id is null
    )
  );

drop policy if exists "School admins can read own school invitations"
  on public.school_onboarding_invitations;

create policy "School admins can read own school invitations"
  on public.school_onboarding_invitations
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'school_admin'
        and p.school_id = school_onboarding_invitations.school_id
    )
  );

-- No INSERT policy for authenticated users — invitations are created
-- exclusively through the create_school_from_inquiry() RPC or future
-- server-side actions using service_role.
-- No UPDATE policy for authenticated users — status transitions are
-- managed server-side only.
-- No DELETE policy for authenticated users — invitations are revoked
-- (status change), not deleted.

-- ============================================================================
-- A.4 GRANTS
-- ============================================================================

-- Table-level grants: only what is needed for RLS policy evaluation.
-- SELECT is granted to authenticated so the RLS policies above can be
-- evaluated. INSERT/UPDATE/DELETE are NOT granted to authenticated.
grant select on public.school_onboarding_invitations to authenticated;

-- service_role retains full access for server-side operations.
grant select, insert, update, delete on public.school_onboarding_invitations
  to service_role;

-- Anonymous users get no access.
-- (No grants to anon.)

-- ============================================================================
-- B. PILOT_INQUIRIES ADDITIONS
-- ============================================================================

-- Add school_id column (nullable, references schools.id).
-- Existing inquiries will have NULL school_id — no backfill required.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pilot_inquiries'
      and column_name = 'school_id'
  ) then
    alter table public.pilot_inquiries
      add column school_id uuid references public.schools(id) on delete set null;
  end if;
end
$$;

-- Add school_created_at column (nullable timestamp).
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pilot_inquiries'
      and column_name = 'school_created_at'
  ) then
    alter table public.pilot_inquiries
      add column school_created_at timestamptz;
  end if;
end
$$;

-- ============================================================================
-- B.1 CONCURRENCY PROTECTION: ONE INQUIRY → AT MOST ONE SCHOOL
-- ============================================================================
-- PRIMARY GUARD: SELECT ... FOR UPDATE row-level lock in
-- create_school_from_inquiry() serializes concurrent provisioning calls
-- for the same inquiry. The second call blocks until the first transaction
-- commits, then observes the committed school_id and returns it.
--
-- DEFENSE IN DEPTH: The UNIQUE index on pilot_inquiries.school_id
-- (WHERE school_id IS NOT NULL) ensures that no two inquiries can
-- reference the same school. This is a secondary safeguard, not the
-- primary concurrency guard.
--
-- INVARIANT: Under concurrent execution, at most one school is created
-- per pilot inquiry. No orphan school, school_settings, or program
-- records are produced.

create unique index if not exists idx_pilot_inquiries_school_id_unique
  on public.pilot_inquiries(school_id)
  where school_id is not null;

-- Index for efficient lookup of inquiries by school_id
create index if not exists idx_pilot_inquiries_school_id
  on public.pilot_inquiries(school_id);

-- ============================================================================
-- B.2 UPDATED_AT TRIGGER FOR PILOT_INQUIRIES
-- ============================================================================
-- The pilot_inquiries table has an updated_at column but no trigger.
-- Add one for consistency with other tables.

drop trigger if exists update_pilot_inquiries_updated_at
  on public.pilot_inquiries;

create trigger update_pilot_inquiries_updated_at
  before update on public.pilot_inquiries
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- C. CREATE_SCHOOL_FROM_INQUIRY() TRANSACTIONAL RPC
-- ============================================================================
-- This function implements the approved transactional RPC for converting
-- an approved pilot inquiry into a school record with default settings
-- and a default program.
--
-- Security properties:
--   - SECURITY DEFINER: runs with the privileges of the function owner
--     (postgres), not the caller. This is necessary because the function
--     must insert into schools, school_settings, and programs, which
--     the caller may not have direct INSERT access to.
--   - Explicit authorization: checks that the caller is a platform admin
--     (role='admin', school_id IS NULL) before proceeding.
--   - search_path explicitly constrained to prevent search_path injection.
--   - Caller-controlled identifiers cannot alter tenant scope: the function
--     only accepts pilot_inquiry_id as input and derives all other values
--     from the database.
--   - Function privileges explicitly restricted: only authenticated users
--     can execute; anonymous users cannot.
--   - Idempotency: if the inquiry already has a school_id, returns the
--     existing school rather than creating another.
--   - Atomicity: all operations (school, settings, program, inquiry update)
--     complete in a single transaction. Any failure rolls back everything.
--   - Concurrency safety: SELECT ... FOR UPDATE row-level lock on the
--     pilot_inquiries row serializes concurrent provisioning calls.
--     The second call blocks until the first transaction commits,
--     then observes the committed school_id and returns it (idempotent).
--     Combined with the UNIQUE constraint on pilot_inquiries.school_id,
--     this prevents duplicate school creation under concurrent execution.

create or replace function public.create_school_from_inquiry(
  p_pilot_inquiry_id uuid
)
returns uuid
set search_path = public, pg_temp
as $$
declare
  v_caller_id uuid;
  v_caller_role text;
  v_caller_school_id uuid;
  v_inquiry record;
  v_school_id uuid;
  v_existing_school_id uuid;
  v_school_name text;
  v_contact_email text;
  v_contact_name text;
  v_program_type text;
  v_default_program_name text;
  v_default_required_hours integer;
begin
  -- ==========================================================================
  -- 1. AUTHENTICATE/AUTHORIZE THE CALLER
  -- ==========================================================================
  -- Get the caller's user ID from the JWT.
  v_caller_id := auth.uid();

  if v_caller_id is null then
    raise exception 'Unauthorized: no authenticated user'
      using errcode = '28000'; -- invalid_authorization_specification
  end if;

  -- Get the caller's role and school_id from profiles.
  select role, school_id into v_caller_role, v_caller_school_id
  from public.profiles
  where id = v_caller_id;

  if not found then
    raise exception 'Unauthorized: caller profile not found'
      using errcode = '28000';
  end if;

  -- Only platform admins (role='admin', school_id IS NULL) may create schools.
  -- School admins (role='school_admin') may NOT create schools.
  -- Ordinary instructors/students may NOT create schools.
  if v_caller_role <> 'admin' or v_caller_school_id is not null then
    raise exception 'Unauthorized: only platform administrators may create schools'
      using errcode = '28000';
  end if;

  -- ==========================================================================
  -- 2. ACQUIRE ROW-LEVEL LOCK ON THE PILOT INQUIRY
  -- ==========================================================================
  -- SELECT ... FOR UPDATE acquires an exclusive row-level lock on the
  -- target pilot_inquiries row. This serializes concurrent provisioning
  -- calls for the same inquiry:
  --
  --   - The first call acquires the lock and proceeds.
  --   - A second concurrent call blocks on this SELECT until the first
  --     transaction commits or rolls back.
  --   - After the first transaction commits, the second call's SELECT
  --     returns the committed row (with school_id already set), and the
  --     idempotency check in step 4 returns the existing school.
  --   - If the first transaction rolls back, the second call acquires
  --     the lock and proceeds with provisioning.
  --
  -- This prevents the race condition where both calls observe
  -- school_id IS NULL before either commits, which would allow both
  -- to create separate school records.
  select * into v_inquiry
  from public.pilot_inquiries
  where id = p_pilot_inquiry_id
  for update;

  if not found then
    raise exception 'Pilot inquiry not found: %', p_pilot_inquiry_id
      using errcode = '22023'; -- invalid_parameter_value
  end if;

  -- ==========================================================================
  -- 3. REQUIRE THE INQUIRY TO BE APPROVED
  -- ==========================================================================
  if v_inquiry.status <> 'approved' then
    raise exception 'Pilot inquiry must be approved before school creation. Current status: %', v_inquiry.status
      using errcode = '22023';
  end if;

  -- ==========================================================================
  -- 4. ENFORCE IDEMPOTENCY (POST-LOCK)
  -- ==========================================================================
  -- This check runs AFTER the FOR UPDATE row lock is acquired, ensuring
  -- that the school_id value observed here is the committed value from
  -- any prior completed transaction. Under concurrent execution:
  --   - The first call holds the lock, sees school_id IS NULL, and
  --     proceeds to create the school.
  --   - The second call blocks on the FOR UPDATE SELECT until the first
  --     transaction commits, then sees school_id IS NOT NULL and returns
  --     the existing school_id without creating any records.
  if v_inquiry.school_id is not null then
    return v_inquiry.school_id;
  end if;

  -- ==========================================================================
  -- 5. EXTRACT VALUES FROM INQUIRY
  -- ==========================================================================
  v_school_name := v_inquiry.school_name;
  v_contact_email := v_inquiry.email;
  v_contact_name := v_inquiry.contact_name;
  v_program_type := v_inquiry.program_type;

  -- Map program_type to default program name and required hours.
  -- Uses established repository defaults from the programs table schema.
  v_default_program_name := case v_program_type
    when 'barber' then 'Barbering'
    when 'cosmetology' then 'Cosmetology'
    when 'esthetics' then 'Esthetics'
    when 'nail_technology' then 'Nail Technology'
    when 'instructor' then 'Instructor Training'
    else 'Barbering' -- default fallback
  end;

  -- Default required_hours from programs table schema default (1500).
  -- This is the established repository default.
  v_default_required_hours := 1500;

  -- ==========================================================================
  -- 6. CREATE THE SCHOOL
  -- ==========================================================================
  insert into public.schools (
    name,
    contact_email,
    subscription_status,
    is_active,
    created_by
  ) values (
    v_school_name,
    v_contact_email,
    'trial',
    true,
    v_caller_id
  )
  returning id into v_school_id;

  -- ==========================================================================
  -- 7. CREATE SCHOOL_SETTINGS RECORD
  -- ==========================================================================
  -- Uses established repository defaults from the school_settings table
  -- schema. Only school_id is required; all other columns have defaults.
  insert into public.school_settings (
    school_id,
    updated_by
  ) values (
    v_school_id,
    v_caller_id
  );

  -- ==========================================================================
  -- 8. CREATE DEFAULT PROGRAM
  -- ==========================================================================
  -- Uses established repository defaults from the programs table schema.
  insert into public.programs (
    school_id,
    name,
    required_hours,
    required_assessments,
    required_practicals,
    is_active
  ) values (
    v_school_id,
    v_default_program_name,
    v_default_required_hours,
    0,    -- required_assessments default
    0,    -- required_practicals default
    true  -- is_active default
  );

  -- ==========================================================================
  -- 9. UPDATE PILOT_INQUIRIES (LOCK ALREADY HELD)
  -- ==========================================================================
  -- Set school_id and school_created_at atomically. The row lock was
  -- already acquired in step 2 via SELECT ... FOR UPDATE, so this UPDATE
  -- does not block. The UNIQUE constraint on school_id provides defense
  -- in depth: even if the locking strategy were bypassed, the constraint
  -- would prevent two inquiries from referencing the same school.
  update public.pilot_inquiries
  set
    school_id = v_school_id,
    school_created_at = now()
  where id = p_pilot_inquiry_id;

  -- ==========================================================================
  -- 10. RETURN THE SCHOOL ID
  -- ==========================================================================
  return v_school_id;

exception
  -- Re-raise any exception to ensure the transaction rolls back.
  when others then
    raise;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- C.1 FUNCTION PRIVILEGES
-- ============================================================================
-- Explicitly restrict function execution:
--   - authenticated: can execute (but authorization inside function
--     further restricts to platform admins only)
--   - anon: CANNOT execute
--   - service_role: can execute (for server-side operations)

revoke execute on function public.create_school_from_inquiry(uuid) from public;
revoke execute on function public.create_school_from_inquiry(uuid) from anon;
grant execute on function public.create_school_from_inquiry(uuid) to authenticated;
grant execute on function public.create_school_from_inquiry(uuid) to service_role;

-- ============================================================================
-- C.2 COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on function public.create_school_from_inquiry(uuid) is
  'Phase 7A Slice 1: Transactional RPC to convert an approved pilot inquiry into a school record with default settings and program. '
  'Enforces: platform-admin-only authorization, inquiry approval requirement, idempotency, atomic school/settings/program creation. '
  'Concurrency-safe via SELECT ... FOR UPDATE row-level lock on pilot_inquiries (primary) and UNIQUE constraint on school_id (defense in depth). '
  'SECURITY DEFINER with explicit search_path constraint.';

comment on table public.school_onboarding_invitations is
  'Phase 7A Slice 1: Tracks school onboarding invitations sent to school administrators, instructors, and students. '
  'RLS: platform admins read all; school admins read own school only; others cannot enumerate.';

comment on column public.school_onboarding_invitations.role is
  'Role to assign upon acceptance: school_admin, instructor, or student.';

comment on column public.school_onboarding_invitations.status is
  'Invitation lifecycle: pending → accepted | expired | revoked.';

comment on column public.school_onboarding_invitations.expires_at is
  'Invitation expiration timestamp. Default should be set by the caller (e.g., 7 days from invitation).';

comment on column public.pilot_inquiries.school_id is
  'Reference to the school created from this inquiry. NULL until school creation. UNIQUE constraint ensures one inquiry → at most one school.';

comment on column public.pilot_inquiries.school_created_at is
  'Timestamp when the school was created from this inquiry.';
