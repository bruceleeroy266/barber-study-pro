-- ============================================================================
-- Migration: 20250625010200_production_indexes_and_rls
-- Phase 13A — Missing indexes, foreign keys, and RLS for existing tables
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE HARDENING
-- ============================================================================

-- Ensure email has a uniqueness constraint at the database level.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_email_unique' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles add constraint profiles_email_unique unique (email);
  end if;
end
$$;

-- Role should be constrained to known values.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles add constraint profiles_role_check
      check (role in ('student', 'instructor', 'apprentice', 'admin'));
  end if;
end
$$;

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_school_role on public.profiles(school_id, role);

-- ============================================================================
-- 2. SCHOOLS TABLE HARDENING
-- ============================================================================

-- Ensure subscription_status has a check constraint.
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

-- ============================================================================
-- 3. STUDENT_PROGRESS HARDENING
-- ============================================================================

create index if not exists idx_student_progress_user_chapter on public.student_progress(user_id, chapter_id);

-- Add percentage bounds if the column exists.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'student_progress_percentage_check' and conrelid = 'public.student_progress'::regclass
  ) then
    alter table public.student_progress add constraint student_progress_percentage_check
      check (progress_percentage between 0 and 100);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'student_progress_best_quiz_score_check' and conrelid = 'public.student_progress'::regclass
  ) then
    alter table public.student_progress add constraint student_progress_best_quiz_score_check
      check (best_quiz_score between 0 and 100);
  end if;
end
$$;

-- ============================================================================
-- 4. QUIZ_ATTEMPTS HARDENING
-- ============================================================================

create index if not exists idx_quiz_attempts_user_completed on public.quiz_attempts(user_id, completed_at desc);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'quiz_attempts_percentage_check' and conrelid = 'public.quiz_attempts'::regclass
  ) then
    alter table public.quiz_attempts add constraint quiz_attempts_percentage_check
      check (percentage between 0 and 100);
  end if;
end
$$;

-- ============================================================================
-- 5. STANDARDIZE TIMESTAMP COLUMNS
-- ============================================================================

-- Ensure all core tables use timestamptz for created_at / updated_at.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = 'created_at' and data_type = 'timestamp without time zone'
  ) then
    alter table public.profiles alter column created_at type timestamptz using created_at at time zone 'UTC';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles'
      and column_name = 'updated_at' and data_type = 'timestamp without time zone'
  ) then
    alter table public.profiles alter column updated_at type timestamptz using updated_at at time zone 'UTC';
  end if;
end
$$;

-- ============================================================================
-- 6. SOFT-DELETE HELPER VIEW
-- ============================================================================

-- A reusable view for active schools. Soft-deleted rows are excluded.
create or replace view public.active_schools as
select *
from public.schools
where deleted_at is null
  and is_active = true;
