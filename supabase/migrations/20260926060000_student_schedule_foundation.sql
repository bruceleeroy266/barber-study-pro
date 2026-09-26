-- ============================================================================
-- Segment A — Student Schedule Foundation
-- Individual recurring schedules, reusable school templates, effective-dated
-- schedule profiles, and one-day overrides. Attendance/hour behavior is not
-- changed by this migration.
-- ============================================================================

create table if not exists public.school_schedule_templates (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint school_schedule_templates_name_nonblank check (length(trim(name)) > 0),
  unique (school_id, name)
);

create table if not exists public.school_schedule_template_days (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.school_schedule_templates(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_scheduled boolean not null default false,
  start_time time,
  end_time time,
  break_minutes integer not null default 0 check (break_minutes between 0 and 480),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, day_of_week),
  constraint schedule_template_day_times check (
    (is_scheduled = false and start_time is null and end_time is null)
    or
    (is_scheduled = true and start_time is not null and end_time is not null and end_time > start_time)
  )
);

create table if not exists public.student_schedule_profiles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  source_template_id uuid references public.school_schedule_templates(id) on delete set null,
  effective_from date not null default current_date,
  effective_to date,
  is_active boolean not null default true,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_schedule_profiles_name_nonblank check (length(trim(name)) > 0),
  constraint student_schedule_profiles_dates check (effective_to is null or effective_to >= effective_from)
);

create table if not exists public.student_schedule_days (
  id uuid primary key default gen_random_uuid(),
  schedule_profile_id uuid not null references public.student_schedule_profiles(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_scheduled boolean not null default false,
  start_time time,
  end_time time,
  break_minutes integer not null default 0 check (break_minutes between 0 and 480),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (schedule_profile_id, day_of_week),
  constraint student_schedule_day_times check (
    (is_scheduled = false and start_time is null and end_time is null)
    or
    (is_scheduled = true and start_time is not null and end_time is not null and end_time > start_time)
  )
);

create table if not exists public.student_schedule_overrides (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  override_date date not null,
  override_type text not null check (override_type in ('scheduled', 'off', 'makeup')),
  start_time time,
  end_time time,
  break_minutes integer not null default 0 check (break_minutes between 0 and 480),
  reason text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, student_id, override_date),
  constraint student_schedule_override_times check (
    (override_type = 'off' and start_time is null and end_time is null)
    or
    (override_type in ('scheduled', 'makeup') and start_time is not null and end_time is not null and end_time > start_time)
  )
);

create index if not exists idx_schedule_templates_school on public.school_schedule_templates(school_id, is_active);
create index if not exists idx_student_schedule_profiles_lookup on public.student_schedule_profiles(school_id, student_id, effective_from desc);
create index if not exists idx_student_schedule_overrides_lookup on public.student_schedule_overrides(school_id, student_id, override_date);

alter table public.school_schedule_templates enable row level security;
alter table public.school_schedule_template_days enable row level security;
alter table public.student_schedule_profiles enable row level security;
alter table public.student_schedule_days enable row level security;
alter table public.student_schedule_overrides enable row level security;

drop policy if exists "School members can view schedule templates" on public.school_schedule_templates;
create policy "School members can view schedule templates" on public.school_schedule_templates
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.school_id = school_schedule_templates.school_id
    )
  );

drop policy if exists "School staff can manage schedule templates" on public.school_schedule_templates;
create policy "School staff can manage schedule templates" on public.school_schedule_templates
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = school_schedule_templates.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = school_schedule_templates.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

drop policy if exists "School members can view schedule template days" on public.school_schedule_template_days;
create policy "School members can view schedule template days" on public.school_schedule_template_days
  for select to authenticated
  using (
    exists (
      select 1
      from public.school_schedule_templates t
      join public.profiles p on p.school_id = t.school_id
      where t.id = school_schedule_template_days.template_id and p.id = auth.uid()
    )
  );

drop policy if exists "School staff can manage schedule template days" on public.school_schedule_template_days;
create policy "School staff can manage schedule template days" on public.school_schedule_template_days
  for all to authenticated
  using (
    exists (
      select 1
      from public.school_schedule_templates t
      join public.profiles p on p.school_id = t.school_id
      where t.id = school_schedule_template_days.template_id
        and p.id = auth.uid()
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.school_schedule_templates t
      join public.profiles p on p.school_id = t.school_id
      where t.id = school_schedule_template_days.template_id
        and p.id = auth.uid()
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

drop policy if exists "Students and school staff can view schedule profiles" on public.student_schedule_profiles;
create policy "Students and school staff can view schedule profiles" on public.student_schedule_profiles
  for select to authenticated
  using (
    student_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = student_schedule_profiles.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

drop policy if exists "School staff can manage schedule profiles" on public.student_schedule_profiles;
create policy "School staff can manage schedule profiles" on public.student_schedule_profiles
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = student_schedule_profiles.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = student_schedule_profiles.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

drop policy if exists "Students and school staff can view schedule days" on public.student_schedule_days;
create policy "Students and school staff can view schedule days" on public.student_schedule_days
  for select to authenticated
  using (
    exists (
      select 1
      from public.student_schedule_profiles sp
      where sp.id = student_schedule_days.schedule_profile_id
        and (
          sp.student_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.school_id = sp.school_id
              and p.role in ('instructor', 'school_admin', 'admin')
          )
        )
    )
  );

drop policy if exists "School staff can manage schedule days" on public.student_schedule_days;
create policy "School staff can manage schedule days" on public.student_schedule_days
  for all to authenticated
  using (
    exists (
      select 1
      from public.student_schedule_profiles sp
      join public.profiles p on p.school_id = sp.school_id
      where sp.id = student_schedule_days.schedule_profile_id
        and p.id = auth.uid()
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.student_schedule_profiles sp
      join public.profiles p on p.school_id = sp.school_id
      where sp.id = student_schedule_days.schedule_profile_id
        and p.id = auth.uid()
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

drop policy if exists "Students and school staff can view schedule overrides" on public.student_schedule_overrides;
create policy "Students and school staff can view schedule overrides" on public.student_schedule_overrides
  for select to authenticated
  using (
    student_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = student_schedule_overrides.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

drop policy if exists "School staff can manage schedule overrides" on public.student_schedule_overrides;
create policy "School staff can manage schedule overrides" on public.student_schedule_overrides
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = student_schedule_overrides.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.school_id = student_schedule_overrides.school_id
        and p.role in ('instructor', 'school_admin', 'admin')
    )
  );

grant select, insert, update, delete on public.school_schedule_templates to authenticated;
grant select, insert, update, delete on public.school_schedule_template_days to authenticated;
grant select, insert, update, delete on public.student_schedule_profiles to authenticated;
grant select, insert, update, delete on public.student_schedule_days to authenticated;
grant select, insert, update, delete on public.student_schedule_overrides to authenticated;

comment on table public.school_schedule_templates is 'Reusable weekly schedule templates for a school.';
comment on table public.student_schedule_profiles is 'Effective-dated weekly schedule snapshots assigned to individual students.';
comment on table public.student_schedule_overrides is 'One-day schedule exceptions such as off days, makeup sessions, or changed times.';
