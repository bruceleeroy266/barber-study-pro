-- ============================================================================
-- Migration: 20250625020000_security_hardening
-- Phase 13B — Security & Multi-School Architecture
-- ============================================================================

-- ============================================================================
-- 1. SECURITY LOGS TABLE
-- ============================================================================

create table if not exists public.security_logs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  role text,
  school_id uuid references public.schools(id) on delete set null,
  resource text,
  resource_id text,
  action text,
  result text not null check (result in ('allowed', 'denied', 'blocked', 'success', 'failure')),
  reason text,
  metadata jsonb default '{}',
  user_agent text,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_security_logs_user_id on public.security_logs(user_id);
create index if not exists idx_security_logs_type on public.security_logs(type);
create index if not exists idx_security_logs_school_id on public.security_logs(school_id);
create index if not exists idx_security_logs_created_at on public.security_logs(created_at desc);

-- Only platform-level roles should read security logs. For Phase 13B we enable
-- RLS and reserve read access to authenticated users reading their own audit
-- trail; a future platform_super_admin role can broaden this.
alter table public.security_logs enable row level security;

drop policy if exists "Users can read own security logs" on public.security_logs;
create policy "Users can read own security logs" on public.security_logs
  for select using (user_id = auth.uid());

-- ============================================================================
-- 2. SANITIZE SIGNUP ROLE TRIGGER
-- ============================================================================
-- The legacy handle_new_user trigger copied the role straight out of
-- raw_user_meta_data, allowing a crafted signup request to grant any role
-- (including admin). This replacement forces self-registration to 'student'
-- unless the metadata contains an explicitly allowed instructor/apprentice
-- value, and never allows 'admin' or future platform roles.

create or replace function public.handle_new_user()
returns trigger as $$
declare
  allowed_role text;
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'student');

  -- Self-registration may only produce student, apprentice, or instructor.
  if requested_role in ('student', 'apprentice', 'instructor') then
    allowed_role := requested_role;
  else
    allowed_role := 'student';
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    allowed_role,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(profiles.role, excluded.role),
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

-- Ensure the trigger is attached to auth.users.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 3. HELPER FUNCTION: REQUIRE SAME-SCHOOL MEMBERSHIP
-- ============================================================================
-- Reusable SQL function used by future RLS policies and application queries
-- to verify that the calling user belongs to the same school as a target row.

create or replace function public.current_user_school_id()
returns uuid as $$
begin
  return (
    select school_id from public.profiles
    where id = auth.uid()
    limit 1
  );
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 4. RLS POLICY IDEMPOTENCY NOTE
-- ============================================================================
-- Phase 13A policies were updated to use "drop policy if exists" before each
-- "create policy" so migrations can be replayed safely in staging/CI.
