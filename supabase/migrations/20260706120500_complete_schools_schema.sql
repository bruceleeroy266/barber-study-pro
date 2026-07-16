-- ============================================================================
-- Migration: 20260706120500_complete_schools_schema
-- Purpose: Complete the public.schools schema that the live database is missing.
--          Adds only slug, is_active, deleted_at, the RLS SELECT policy,
--          and the active_schools helper view.
-- ============================================================================
-- Current verified state at runtime:
--   Existing columns: id, name, address, contact_email, subscription_status,
--                     created_by, created_at, updated_at
--   Missing columns:  slug, is_active, deleted_at
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MISSING COLUMNS
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'slug') then
    alter table public.schools add column slug text unique;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'is_active') then
    alter table public.schools add column is_active boolean default true;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'deleted_at') then
    alter table public.schools add column deleted_at timestamptz;
  end if;
end
$$;

-- Backfill is_active for any pre-existing rows.
update public.schools
set is_active = true
where is_active is null;

-- Ensure the default is set for future inserts.
alter table public.schools alter column is_active set default true;

-- ----------------------------------------------------------------------------
-- 2. INDEXES
-- ----------------------------------------------------------------------------
create index if not exists idx_schools_slug on public.schools(slug);
create index if not exists idx_schools_is_active on public.schools(is_active) where deleted_at is null;

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.schools force row level security;
alter table public.schools enable row level security;

-- Drop legacy permissive policies if they exist.
drop policy if exists "Schools are viewable by everyone" on public.schools;
drop policy if exists "Active schools are viewable by everyone" on public.schools;
drop policy if exists "Active schools are viewable by anon and authenticated" on public.schools;

-- Allow anonymous and authenticated users to read only active, non-deleted schools.
create policy "Active schools are viewable by anon and authenticated" on public.schools
  for select to anon, authenticated
  using (
    is_active = true
    and deleted_at is null
  );

grant select on public.schools to anon, authenticated;

-- Best-effort revoke of anon write privileges.
do $$
begin
  revoke insert, update, delete on public.schools from anon;
exception
  when insufficient_privilege then null;
end
$$;

-- ----------------------------------------------------------------------------
-- 4. SOFT-DELETE HELPER VIEW
-- ----------------------------------------------------------------------------
create or replace view public.active_schools as
select *
from public.schools
where deleted_at is null
  and is_active = true;
