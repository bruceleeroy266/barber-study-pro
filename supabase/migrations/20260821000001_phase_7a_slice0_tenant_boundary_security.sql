-- ============================================================================
-- Migration: 20260821000001_phase_7a_slice0_tenant_boundary_security
-- Phase 7A Slice 0 — Tenant-Boundary Security Correction
--
-- CRITICAL SECURITY FIX: Prevents authenticated users from modifying
-- security-sensitive profile columns (school_id, role, approval_status,
-- is_disabled) on their own profile row.
--
-- Root cause: The "Profiles: users update own" RLS policy uses
--   auth.uid() = id
-- with no column-level restrictions, allowing privilege escalation and
-- cross-school tenant escape.
--
-- Correction approach: Database trigger that silently strips protected
-- columns from non-privileged UPDATE statements. This is enforced at the
-- database authorization layer and cannot be bypassed by any client.
-- ============================================================================

-- ============================================================================
-- 1. PROTECTED-COLUMN ENFORCEMENT TRIGGER
-- ============================================================================
-- This trigger fires BEFORE UPDATE on profiles. When the calling PostgreSQL
-- role is 'authenticated' (i.e., a regular Supabase JS client session),
-- it silently reverts any changes to security-sensitive columns back to
-- their original values. The UPDATE succeeds for non-protected columns.
--
-- Why silent stripping instead of raising an error:
--   - Prevents information leakage about which columns are protected
--   - Allows ORM/client updates that include all columns to succeed for
--     the safe subset
--   - Avoids breaking legitimate update flows that may include protected
--     columns in the SET clause but don't actually change them
--
-- service_role and postgres (superuser) bypass this trigger entirely.
-- All admin server actions use createServiceRoleClient() which connects
-- as the 'service_role' PostgreSQL role.

create or replace function public.enforce_profile_protected_columns()
returns trigger
set search_path = public, pg_temp
as $$
begin
  -- service_role and postgres (superuser) may modify any column.
  -- These roles are used by admin server actions and database migrations.
  -- current_user returns the PostgreSQL role name for the current session.
  if current_user in ('service_role', 'postgres', 'supabase_admin') then
    return new;
  end if;

  -- For all other roles (authenticated, anon), silently revert protected
  -- columns to their original values. The UPDATE will succeed but the
  -- protected columns will not actually change.

  -- school_id: prevents cross-school tenant escape
  new.school_id := old.school_id;

  -- role: prevents privilege escalation
  new.role := old.role;

  -- approval_status: prevents self-approval
  new.approval_status := old.approval_status;

  -- is_disabled: prevents self-re-enablement
  new.is_disabled := old.is_disabled;

  -- approved_by: prevents forging approval provenance
  new.approved_by := old.approved_by;

  -- approved_at: prevents forging approval timestamp
  new.approved_at := old.approved_at;

  return new;
end;
$$ language plpgsql;

-- Attach the trigger to the profiles table.
drop trigger if exists enforce_profile_protected_columns_trigger on public.profiles;
create trigger enforce_profile_protected_columns_trigger
  before update on public.profiles
  for each row execute function public.enforce_profile_protected_columns();

-- ============================================================================
-- 2. GRANT/REVOKE: Restrict trigger function execution
-- ============================================================================
-- The trigger function should not be callable directly by clients.
revoke execute on function public.enforce_profile_protected_columns() from public;
revoke execute on function public.enforce_profile_protected_columns() from authenticated;
revoke execute on function public.enforce_profile_protected_columns() from anon;
-- Only the database engine itself needs to execute this (via trigger).
-- service_role retains execute for administrative purposes.
grant execute on function public.enforce_profile_protected_columns() to service_role;

-- ============================================================================
-- 3. COMMENTS FOR DOCUMENTATION
-- ============================================================================
comment on function public.enforce_profile_protected_columns() is
  'Phase 7A Slice 0: Enforces tenant-boundary security by preventing authenticated users from modifying security-sensitive profile columns (school_id, role, approval_status, is_disabled, approved_by, approved_at). service_role and postgres bypass this restriction for admin workflows.';
