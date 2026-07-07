-- ============================================================================
-- Migration: 20260706091600_align_schools_schema
-- Purpose: Bring the live public.schools table in line with the application
--          schema expected by HEAD fabaa0d, without losing existing data.
-- ============================================================================
-- Safety:
--   - All ADD COLUMN statements check information_schema first.
--   - Existing rows keep their current values.
--   - New boolean/default columns are backfilled with safe defaults.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ADD MISSING COLUMNS
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'slug') then
    alter table public.schools add column slug text unique;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'city') then
    alter table public.schools add column city text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'state') then
    alter table public.schools add column state text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'postal_code') then
    alter table public.schools add column postal_code text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'contact_phone') then
    alter table public.schools add column contact_phone text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'website') then
    alter table public.schools add column website text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'timezone') then
    alter table public.schools add column timezone text default 'America/Chicago';
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'subscription_expires_at') then
    alter table public.schools add column subscription_expires_at timestamptz;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'is_active') then
    alter table public.schools add column is_active boolean default true;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'deleted_at') then
    alter table public.schools add column deleted_at timestamptz;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'updated_at') then
    alter table public.schools add column updated_at timestamptz default now();
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 2. DEFAULTS & CHECK CONSTRAINTS
-- ----------------------------------------------------------------------------

-- Backfill is_active for rows that were created before the column existed.
update public.schools
set is_active = true
where is_active is null;

-- Set sensible defaults on existing columns so future inserts are safe.
alter table public.schools alter column is_active set default true;
alter table public.schools alter column timezone set default 'America/Chicago';
alter table public.schools alter column subscription_status set default 'trial';

-- Enforce known subscription statuses.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'schools_subscription_status_check' and conrelid = 'public.schools'::regclass
  ) then
    alter table public.schools add constraint schools_subscription_status_check
      check (subscription_status in ('active', 'inactive', 'trial'));
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 3. INDEXES
-- ----------------------------------------------------------------------------
create index if not exists idx_schools_slug on public.schools(slug);
create index if not exists idx_schools_subscription_status on public.schools(subscription_status);
create index if not exists idx_schools_is_active on public.schools(is_active) where deleted_at is null;

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (required for anon signup reads)
-- ----------------------------------------------------------------------------
alter table public.schools force row level security;
alter table public.schools enable row level security;

-- Remove any legacy overly-broad policies.
drop policy if exists "Schools are viewable by everyone" on public.schools;
drop policy if exists "Active schools are viewable by everyone" on public.schools;

-- Allow anonymous and authenticated users to read only active, non-deleted schools.
create policy "Active schools are viewable by anon and authenticated" on public.schools
  for select to anon, authenticated
  using (
    is_active = true
    and deleted_at is null
  );

grant select on public.schools to anon, authenticated;

-- Best-effort revoke of anon write privileges (safe to ignore if not held).
do $$
begin
  revoke insert, update, delete on public.schools from anon;
exception
  when insufficient_privilege then null;
end
$$;

-- ----------------------------------------------------------------------------
-- 5. SOFT-DELETE HELPER VIEW
-- ----------------------------------------------------------------------------
create or replace view public.active_schools as
select *
from public.schools
where deleted_at is null
  and is_active = true;

-- ----------------------------------------------------------------------------
-- 6. AUTO-UPDATE updated_at TRIGGER
-- ----------------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_schools_updated_at on public.schools;
create trigger update_schools_updated_at
  before update on public.schools
  for each row execute function public.update_updated_at_column();
