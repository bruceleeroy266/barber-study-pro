-- Migration: Admin user management support
-- Enables school_admin role in profiles and adds dedicated audit logging
-- for user management actions performed by admins and school admins.

-- ============================================================================
-- 1. Allow school_admin role in profiles check constraint
-- ============================================================================
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'apprentice', 'instructor', 'admin', 'school_admin'));

-- ============================================================================
-- 2. Dedicated audit log for user management changes
-- ============================================================================
create table if not exists public.user_management_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  actor_role text,
  target_user_id uuid references auth.users(id) on delete set null,
  target_user_email text,
  action text not null,
  old_values jsonb default '{}',
  new_values jsonb default '{}',
  school_id uuid references public.schools(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_user_mgmt_audit_target_user_id
  on public.user_management_audit_logs(target_user_id);
create index if not exists idx_user_mgmt_audit_actor_id
  on public.user_management_audit_logs(actor_id);
create index if not exists idx_user_mgmt_audit_school_id
  on public.user_management_audit_logs(school_id);
create index if not exists idx_user_mgmt_audit_created_at
  on public.user_management_audit_logs(created_at desc);

-- ============================================================================
-- 3. Row Level Security for audit logs
-- ============================================================================
alter table public.user_management_audit_logs enable row level security;

-- Admins can view all user management audit logs.
-- School admins can only view logs for their own school.
drop policy if exists "Admins can view user management audit logs" on public.user_management_audit_logs;
create policy "Admins can view user management audit logs" on public.user_management_audit_logs
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (
          p.role = 'admin'
          or (
            p.role = 'school_admin'
            and p.school_id = user_management_audit_logs.school_id
          )
        )
    )
  );

-- Service role may insert audit logs (server-side actions).
drop policy if exists "Service role can insert user management audit logs" on public.user_management_audit_logs;
create policy "Service role can insert user management audit logs" on public.user_management_audit_logs
  for insert to service_role with check (true);

-- ============================================================================
-- 4. Profile management policies
-- ============================================================================
-- School admins may manage profiles within their own school. Platform admins
-- (role = 'admin') already have a broader policy; we add an explicit policy
-- for school_admin here so both roles can use the same UI safely.
drop policy if exists "School admins can manage school profiles" on public.profiles;
create policy "School admins can manage school profiles" on public.profiles
  for all using (
    exists (
      select 1 from public.profiles admin
      where admin.id = auth.uid()
        and admin.role = 'school_admin'
        and admin.school_id = profiles.school_id
    )
  );

-- ============================================================================
-- 5. Grants for service role
-- ============================================================================
grant all on public.user_management_audit_logs to service_role;
