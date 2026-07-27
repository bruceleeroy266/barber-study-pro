-- ============================================================================
-- Migration: 20250628000000_fix_schools_select_rls
-- Phase 13E smoke-test fix — ensure anon/authenticated users can read only
-- active, non-deleted schools from public.schools.
-- ============================================================================
--
-- Problem:
--   The signup page queries public.schools as an anonymous browser client
--   to populate the Student school dropdown. This was failing with
--   "permission denied for table schools" because the active-schools SELECT
--   policy was not reliably applying to anon/authenticated roles after prior
--   migrations and local resets.
--
-- Fix:
--   1. Force RLS on for public.schools.
--   2. Drop any overly broad legacy SELECT policies on public.schools.
--   3. Create a single explicit SELECT policy scoped to anon + authenticated
--      that returns only rows where is_active = true and deleted_at is null.
--   4. Grant table-level SELECT to anon and authenticated so the policy can
--      be evaluated.
--   5. Explicitly revoke write privileges from anon so anonymous users can
--      never insert, update, or delete schools regardless of other policies.
--
-- Security impact:
--   - SELECT: anon/authenticated see active schools only.
--   - INSERT/UPDATE/DELETE: anon is blocked; existing instructor/admin
--     policies from earlier migrations remain in effect.

-- 1. Ensure RLS is enabled.
alter table public.schools force row level security;
alter table public.schools enable row level security;

-- 2. Remove any legacy permissive SELECT policies on schools.
drop policy if exists "Schools are viewable by everyone" on public.schools;
drop policy if exists "Active schools are viewable by everyone" on public.schools;

-- 3. Create explicit active-schools SELECT policy for anon + authenticated.
create policy "Active schools are viewable by anon and authenticated" on public.schools
  for select to anon, authenticated
  using (
    is_active = true
    and deleted_at is null
  );

-- 4. Grant SELECT at the table level so the policy can be evaluated.
grant select on public.schools to anon, authenticated;

-- 5. Ensure anon cannot mutate schools even if other policies were misapplied.
revoke insert, update, delete on public.schools from anon;
