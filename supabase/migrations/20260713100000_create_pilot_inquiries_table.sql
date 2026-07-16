-- ============================================================================
-- Migration: 20260713100000_create_pilot_inquiries_table
-- Create the pilot_inquiries table with the schema that existed before
-- 20260713140000_add_pilot_inquiry_columns.sql.
--
-- The five columns added by the later migration are intentionally omitted:
--   start_date, ip_address, user_agent, is_test, notes
-- ============================================================================

-- ============================================================================
-- 1. TABLE
-- ============================================================================
create table if not exists public.pilot_inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  school_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  program_type text not null,
  cohort_size text,
  message text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  status text default 'new' check (status in ('new', 'contacted', 'approved', 'declined', 'spam'))
);

-- ============================================================================
-- 2. RLS
-- ============================================================================
alter table public.pilot_inquiries enable row level security;

drop policy if exists "Public can create pilot inquiries" on public.pilot_inquiries;
create policy "Public can create pilot inquiries" on public.pilot_inquiries
  for insert with check (true);

drop policy if exists "Admins can read pilot inquiries" on public.pilot_inquiries;
create policy "Admins can read pilot inquiries" on public.pilot_inquiries
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and (profiles.role = 'admin' or profiles.role = 'school_admin')
    )
  );

drop policy if exists "Admins can update pilot inquiries" on public.pilot_inquiries;
create policy "Admins can update pilot inquiries" on public.pilot_inquiries
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and (profiles.role = 'admin' or profiles.role = 'school_admin')
    )
  );

drop policy if exists "Admins can delete pilot inquiries" on public.pilot_inquiries;
create policy "Admins can delete pilot inquiries" on public.pilot_inquiries
  for delete using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- ============================================================================
-- 3. INDEXES
-- ============================================================================
create index if not exists idx_pilot_inquiries_email on public.pilot_inquiries(email);
create index if not exists idx_pilot_inquiries_status on public.pilot_inquiries(status);
create index if not exists idx_pilot_inquiries_created_at on public.pilot_inquiries(created_at desc);

-- ============================================================================
-- 4. GRANTS
-- ============================================================================
-- The four RLS policies above govern row-level access. These table-level
-- grants only allow the policies to be evaluated; they do not broaden access
-- beyond what the policies permit.
--
--   - anon / unauthenticated: insert only (policy allows public inserts).
--   - authenticated: select/update only (policy further restricts to admins
--     and school_admins; delete is admin-only by policy).
--   - service_role: full access for the /api/email route and reply action.

grant usage on schema public to anon, authenticated, service_role;

grant insert on public.pilot_inquiries to anon;
grant select, update on public.pilot_inquiries to authenticated;
grant select, insert, update, delete on public.pilot_inquiries to service_role;
