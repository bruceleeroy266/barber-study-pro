-- Phase 13D — Enterprise Services & Operations Foundation

-- ============================================================================
-- 1. Notifications
-- ============================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  type text not null check (type in (
    'system', 'security', 'compliance', 'attendance', 'grades', 'assessments',
    'school_approval', 'account_approval', 'maintenance'
  )),
  title text not null,
  body text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  read boolean not null default false,
  archived boolean not null default false,
  action_url text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.notifications is 'Production notification store for all user roles.';

-- RLS: users can only see their own notifications; school-scoped viewers (instructor/admin)
-- can see notifications for their school when user_id is null (broadcasts).
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  enabled boolean not null default false,
  school_id uuid references public.schools(id) on delete cascade,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (key, school_id)
);

comment on table public.feature_flags is 'Global and per-school feature toggles.';

-- ============================================================================
-- 2. Background Jobs
-- ============================================================================
create table if not exists public.background_jobs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  job_type text not null,
  payload jsonb default '{}',
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')),
  scheduled_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz,
  last_error text,
  result jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.background_jobs is 'Registry of scheduled and executed background jobs.';

-- ============================================================================
-- 3. Maintenance Mode
-- ============================================================================
create table if not exists public.maintenance_mode (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default false,
  message text not null default 'ASCYN PRO is undergoing scheduled maintenance. Please check back soon.',
  allowed_roles text[] not null default array['platform_super_admin'],
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id) on delete set null
);

comment on table public.maintenance_mode is 'Single-row maintenance mode configuration.';

-- Seed default maintenance mode row (inactive).
insert into public.maintenance_mode (enabled, message)
values (false, 'ASCYN PRO is undergoing scheduled maintenance. Please check back soon.')
on conflict do nothing;

-- ============================================================================
-- 4. Backup Status
-- ============================================================================
create table if not exists public.backup_status (
  id uuid primary key default gen_random_uuid(),
  last_backup_at timestamptz,
  status text not null default 'unknown' check (status in ('unknown', 'ok', 'warning', 'error')),
  backup_location text,
  restore_ready boolean not null default false,
  notes text,
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id) on delete set null
);

comment on table public.backup_status is 'Operational backup/recovery status record.';

insert into public.backup_status (status, notes)
values ('unknown', 'Backup integration not configured. This row is managed by external backup tooling.')
on conflict do nothing;

-- ============================================================================
-- RLS Policies
-- ============================================================================
alter table public.notifications enable row level security;
alter table public.feature_flags enable row level security;
alter table public.background_jobs enable row level security;
alter table public.maintenance_mode enable row level security;
alter table public.backup_status enable row level security;

-- Notifications: users see their own; school-scoped roles see school broadcasts.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'notifications' and policyname = 'notifications_user_select') then
    create policy notifications_user_select on public.notifications
      for select to authenticated
      using (user_id = auth.uid() or (
        user_id is null and school_id in (
          select school_id from public.profiles where id = auth.uid()
        )
      ));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'notifications' and policyname = 'notifications_admin_all') then
    create policy notifications_admin_all on public.notifications
      for all to authenticated
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ))
      with check (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;
end
$$;

-- Feature flags: readable by all authenticated users; writable by admins.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'feature_flags' and policyname = 'feature_flags_select') then
    create policy feature_flags_select on public.feature_flags
      for select to authenticated using (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'feature_flags' and policyname = 'feature_flags_admin_write') then
    create policy feature_flags_admin_write on public.feature_flags
      for all to authenticated
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ))
      with check (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;
end
$$;

-- Background jobs: readable by admins; writable by service role (server-side) or admins.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'background_jobs' and policyname = 'background_jobs_admin_all') then
    create policy background_jobs_admin_all on public.background_jobs
      for all to authenticated
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ))
      with check (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;
end
$$;

-- Maintenance mode: readable by all; writable by admins.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'maintenance_mode' and policyname = 'maintenance_mode_select') then
    create policy maintenance_mode_select on public.maintenance_mode
      for select to authenticated using (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'maintenance_mode' and policyname = 'maintenance_mode_admin_write') then
    create policy maintenance_mode_admin_write on public.maintenance_mode
      for all to authenticated
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ))
      with check (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;
end
$$;

-- Backup status: readable by admins; writable by service role/admins.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'backup_status' and policyname = 'backup_status_admin_select') then
    create policy backup_status_admin_select on public.backup_status
      for select to authenticated
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'backup_status' and policyname = 'backup_status_admin_write') then
    create policy backup_status_admin_write on public.backup_status
      for all to authenticated
      using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ))
      with check (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ));
  end if;
end
$$;

-- Indexes for performance.
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_school_id on public.notifications(school_id);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_notifications_archived on public.notifications(archived);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);
create index if not exists idx_feature_flags_key on public.feature_flags(key);
create index if not exists idx_feature_flags_school_id on public.feature_flags(school_id);
create index if not exists idx_background_jobs_status on public.background_jobs(status);
create index if not exists idx_background_jobs_scheduled_at on public.background_jobs(scheduled_at);
