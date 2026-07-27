-- ============================================================================
-- Migration: 20250625010050_fix_schools_anon_select_policy
-- Fix: restrict anonymous/authenticated school reads to active schools only.
-- ============================================================================
-- The legacy policy "Schools are viewable by everyone" allowed all rows,
-- including inactive/pending schools, to be read by anon/authenticated users.
-- This migration replaces it with a scoped policy that only exposes schools
-- that are active and not soft-deleted.
--
-- Security impact:
--   - SELECT: anon/authenticated can read only active schools (is_active = true
--     and deleted_at is null).
--   - INSERT/UPDATE/DELETE: unchanged; instructors can still create schools and
--     school creators can still update their own schools.
--   - Admin/instructor/student RLS is not weakened.

-- Drop the overly permissive legacy policy.
drop policy if exists "Schools are viewable by everyone" on public.schools;

-- Replace with an active-only select policy. Omitting the TO clause applies it
-- to all roles (anon, authenticated) for SELECT only.
create policy "Active schools are viewable by everyone" on public.schools
  for select using (
    is_active = true
    and deleted_at is null
  );

-- Grant SELECT at the table level so the policy above can be evaluated by
-- anonymous and authenticated users. RLS still restricts rows to active schools.
grant select on public.schools to anon, authenticated;
