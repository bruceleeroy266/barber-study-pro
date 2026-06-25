-- ============================================================================
-- Migration: 20250625010000_create_core_production_tables
-- Phase 13A — Production Database Foundation
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. SCHOOLS TABLE (production-ready enhancement)
-- ============================================================================

-- Create base schools table if it does not exist yet.
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  address text,
  city text,
  state text,
  postal_code text,
  contact_email text,
  contact_phone text,
  website text,
  timezone text default 'America/Chicago',
  subscription_status text default 'trial' check (subscription_status in ('active', 'inactive', 'trial')),
  subscription_expires_at timestamptz,
  is_active boolean default true,
  deleted_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add missing columns to legacy schools table without data loss.
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
end
$$;

-- ============================================================================
-- 2. PROGRAMS TABLE
-- ============================================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  description text,
  required_hours integer not null default 1500 check (required_hours >= 0),
  required_assessments integer not null default 0 check (required_assessments >= 0),
  required_practicals integer not null default 0 check (required_practicals >= 0),
  duration_weeks integer,
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(school_id, name)
);

-- ============================================================================
-- 3. INSTRUCTORS TABLE
-- ============================================================================

create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  license_number text,
  bio text,
  hire_date date,
  specialization text,
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id, school_id)
);

-- ============================================================================
-- 4. STUDENTS TABLE
-- ============================================================================

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  student_number text,
  enrollment_date date default current_date,
  expected_graduation_date date,
  total_hours_completed integer default 0 check (total_hours_completed >= 0),
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id, school_id)
);

-- ============================================================================
-- 5. ENROLLMENTS TABLE
-- ============================================================================

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete restrict,
  start_date date default current_date,
  expected_end_date date,
  status text default 'active' check (status in ('active', 'completed', 'withdrawn', 'on_hold')),
  notes text,
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(student_id, program_id)
);

-- ============================================================================
-- 6. INDEXES
-- ============================================================================

create index if not exists idx_schools_slug on public.schools(slug);
create index if not exists idx_schools_subscription_status on public.schools(subscription_status);
create index if not exists idx_schools_is_active on public.schools(is_active) where deleted_at is null;
create index if not exists idx_programs_school_id on public.programs(school_id);
create index if not exists idx_programs_school_active on public.programs(school_id, is_active) where deleted_at is null;
create index if not exists idx_instructors_school_id on public.instructors(school_id);
create index if not exists idx_instructors_profile_id on public.instructors(profile_id);
create index if not exists idx_students_school_id on public.students(school_id);
create index if not exists idx_students_profile_id on public.students(profile_id);
create index if not exists idx_students_student_number on public.students(student_number);
create index if not exists idx_enrollments_student_id on public.enrollments(student_id);
create index if not exists idx_enrollments_program_id on public.enrollments(program_id);
create index if not exists idx_enrollments_status on public.enrollments(status);

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

alter table public.programs enable row level security;
alter table public.instructors enable row level security;
alter table public.students enable row level security;
alter table public.enrollments enable row level security;

-- Programs: school-scoped read; admins/instructors can manage their school's programs.
drop policy if exists "Programs are viewable by school members" on public.programs;
create policy "Programs are viewable by school members" on public.programs
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.school_id = programs.school_id
    )
  );

drop policy if exists "Admins can manage school programs" on public.programs;
create policy "Admins can manage school programs" on public.programs
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.school_id = programs.school_id
    )
  );

-- Instructors: school-scoped read; self-read; admins can manage.
drop policy if exists "Instructors can view own record" on public.instructors;
create policy "Instructors can view own record" on public.instructors
  for select using (profile_id = auth.uid());

drop policy if exists "School staff can view instructors" on public.instructors;
create policy "School staff can view instructors" on public.instructors
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('instructor', 'admin')
        and p.school_id = instructors.school_id
    )
  );

drop policy if exists "Admins can manage instructors" on public.instructors;
create policy "Admins can manage instructors" on public.instructors
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.school_id = instructors.school_id
    )
  );

-- Students: self-read; school staff can view students in their school.
drop policy if exists "Students can view own record" on public.students;
create policy "Students can view own record" on public.students
  for select using (profile_id = auth.uid());

drop policy if exists "School staff can view students" on public.students;
create policy "School staff can view students" on public.students
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('instructor', 'admin')
        and p.school_id = students.school_id
    )
  );

drop policy if exists "Admins can manage students" on public.students;
create policy "Admins can manage students" on public.students
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.school_id = students.school_id
    )
  );

-- Enrollments: student self-read; school staff can view school enrollments.
drop policy if exists "Students can view own enrollments" on public.enrollments;
create policy "Students can view own enrollments" on public.enrollments
  for select using (
    exists (
      select 1 from public.students s
      where s.id = enrollments.student_id and s.profile_id = auth.uid()
    )
  );

drop policy if exists "School staff can view enrollments" on public.enrollments;
create policy "School staff can view enrollments" on public.enrollments
  for select using (
    exists (
      select 1 from public.students s
      join public.profiles p on p.school_id = s.school_id
      where s.id = enrollments.student_id
        and p.id = auth.uid()
        and p.role in ('instructor', 'admin')
    )
  );

drop policy if exists "Admins can manage enrollments" on public.enrollments;
create policy "Admins can manage enrollments" on public.enrollments
  for all using (
    exists (
      select 1 from public.students s
      join public.profiles p on p.school_id = s.school_id
      where s.id = enrollments.student_id
        and p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

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

drop trigger if exists update_programs_updated_at on public.programs;
create trigger update_programs_updated_at
  before update on public.programs
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_instructors_updated_at on public.instructors;
create trigger update_instructors_updated_at
  before update on public.instructors
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_students_updated_at on public.students;
create trigger update_students_updated_at
  before update on public.students
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_enrollments_updated_at on public.enrollments;
create trigger update_enrollments_updated_at
  before update on public.enrollments
  for each row execute function public.update_updated_at_column();
