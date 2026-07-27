-- ============================================================================
-- Migration: 20250625009900_create_legacy_core_tables
-- Phase 13A — Legacy Core Foundation (runs before production table migrations)
-- ============================================================================
-- This migration creates the minimal core tables that later migrations assume
-- already exist. It is idempotent so it can safely run on databases that were
-- bootstrapped from supabase-schema.sql as well as clean local databases.

-- Ensure pgcrypto is available.
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. SCHOOLS (minimal base — expanded by 20250625010000_create_core_production_tables)
-- ============================================================================
create table if not exists public.schools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  contact_email text,
  subscription_status text default 'trial' check (subscription_status in ('active', 'inactive', 'trial')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 2. PROFILES (extends auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text default 'student' check (role in ('student', 'instructor', 'apprentice', 'admin')),
  school_id uuid references public.schools(id) on delete set null,
  barber_shop_name text,
  mentor_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 3. STUDENT PROGRESS (chapter_id is text because chapters live in TypeScript)
-- ============================================================================
create table if not exists public.student_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  chapter_id text not null,
  flashcards_completed boolean default false,
  quiz_completed boolean default false,
  best_quiz_score int,
  last_studied_at timestamptz,
  progress_percentage int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, chapter_id)
);

-- ============================================================================
-- 4. QUIZ ATTEMPTS (quiz_id is text because quizzes live in TypeScript)
-- ============================================================================
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id text not null,
  score int not null default 0,
  total_questions int not null default 0,
  percentage int not null default 0,
  answers_json jsonb default '{}',
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================================
-- 5. HELPER FUNCTION: updated_at trigger
-- ============================================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================================
-- 6. HELPER FUNCTION: auto-create profile on signup
--    Replaced/extended by 20250625020000_security_hardening.
-- ============================================================================
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

  insert into public.profiles (id, email, full_name, role, created_at, updated_at)
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

-- Attach trigger to auth.users if not already attached.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 7. INDEXES
-- ============================================================================
create index if not exists idx_profiles_school_id on public.profiles(school_id);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_student_progress_user_id on public.student_progress(user_id);
create index if not exists idx_student_progress_chapter_id on public.student_progress(chapter_id);
create index if not exists idx_quiz_attempts_user_id on public.quiz_attempts(user_id);
create index if not exists idx_quiz_attempts_quiz_id on public.quiz_attempts(quiz_id);
create index if not exists idx_quiz_attempts_completed_at on public.quiz_attempts(completed_at desc);
create index if not exists idx_schools_created_by on public.schools(created_by);

-- ============================================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================================
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.student_progress enable row level security;
alter table public.quiz_attempts enable row level security;

-- Schools policies.
drop policy if exists "Schools are viewable by everyone" on public.schools;
create policy "Schools are viewable by everyone" on public.schools
  for select using (true);

drop policy if exists "Instructors can create schools" on public.schools;
create policy "Instructors can create schools" on public.schools
  for insert with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'instructor'
    )
  );

drop policy if exists "School creators can update their school" on public.schools;
create policy "School creators can update their school" on public.schools
  for update using (created_by = auth.uid());

-- Profiles policies.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Instructors can read school profiles" on public.profiles;
create policy "Instructors can read school profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles as instructor
      where instructor.id = auth.uid()
        and instructor.role in ('instructor', 'admin')
        and instructor.school_id = profiles.school_id
    )
  );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Student progress policies.
drop policy if exists "Users can read own progress" on public.student_progress;
create policy "Users can read own progress" on public.student_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Instructors can read school student progress" on public.student_progress;
create policy "Instructors can read school student progress" on public.student_progress
  for select using (
    exists (
      select 1 from public.profiles as instructor
      join public.profiles as student on student.id = student_progress.user_id
      where instructor.id = auth.uid()
        and instructor.role in ('instructor', 'admin')
        and instructor.school_id = student.school_id
    )
  );

drop policy if exists "Users can insert own progress" on public.student_progress;
create policy "Users can insert own progress" on public.student_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.student_progress;
create policy "Users can update own progress" on public.student_progress
  for update using (auth.uid() = user_id);

-- Quiz attempts policies.
drop policy if exists "Users can read own quiz attempts" on public.quiz_attempts;
create policy "Users can read own quiz attempts" on public.quiz_attempts
  for select using (auth.uid() = user_id);

drop policy if exists "Instructors can read school quiz attempts" on public.quiz_attempts;
create policy "Instructors can read school quiz attempts" on public.quiz_attempts
  for select using (
    exists (
      select 1 from public.profiles as instructor
      join public.profiles as student on student.id = quiz_attempts.user_id
      where instructor.id = auth.uid()
        and instructor.role in ('instructor', 'admin')
        and instructor.school_id = student.school_id
    )
  );

drop policy if exists "Users can insert own quiz attempts" on public.quiz_attempts;
create policy "Users can insert own quiz attempts" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);
