-- ============================================================================
-- Migration: 20260714010000_fix_quiz_progress_missed_rls
-- Phase 13F — Fix RLS recursion, missing grants, and instructor visibility
-- for quiz_attempts, student_progress, and missed_questions.
--
-- DO NOT apply to production until reviewed and tested in staging.
-- If duplicate (user_id, chapter_id) rows exist in student_progress, this
-- migration will raise an error and refuse to create the unique constraint.
-- Run the cleanup script from the repair report first in that case.
-- ============================================================================

-- ============================================================================
-- 1. MINIMUM TABLE PRIVILEGES
-- ============================================================================
-- authenticated/anon need a base grant for RLS policies to be evaluated.
-- service_role bypasses RLS but still requires table privileges.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.quiz_attempts      to authenticated;
grant select, insert, update, delete on public.student_progress   to authenticated;
grant select, insert, update, delete on public.missed_questions   to authenticated;
grant select, insert, update, delete on public.profiles           to authenticated;

grant select, insert, update, delete on public.quiz_attempts      to service_role;
grant select, insert, update, delete on public.student_progress   to service_role;
grant select, insert, update, delete on public.missed_questions   to service_role;
grant select, insert, update, delete on public.profiles           to service_role;

-- ============================================================================
-- 2. HELPER FUNCTIONS (SECURITY DEFINER — bypass RLS, avoid recursion)
-- ============================================================================
-- These functions read profiles once, outside the recursive policy context.
-- They must remain security definer and owned by a role with BYPASSRLS
-- (postgres in Supabase) to work correctly.
-- Each uses an explicit search_path and is restricted from PUBLIC/anon
-- execution; only authenticated and service_role may invoke them.

create or replace function public.current_user_school_id()
returns uuid
set search_path = public, pg_temp
as $$
begin
  return (select school_id from public.profiles where id = auth.uid() limit 1);
end;
$$ language plpgsql security definer;

revoke execute on function public.current_user_school_id() from public;
grant execute on function public.current_user_school_id() to authenticated;
grant execute on function public.current_user_school_id() to service_role;

create or replace function public.current_user_role()
returns text
set search_path = public, pg_temp
as $$
begin
  return (select role from public.profiles where id = auth.uid() limit 1);
end;
$$ language plpgsql security definer;

revoke execute on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_role() to service_role;

create or replace function public.is_school_staff(target_school_id uuid)
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = target_school_id
      and role in ('instructor', 'admin', 'school_admin')
  );
end;
$$ language plpgsql security definer;

revoke execute on function public.is_school_staff(uuid) from public;
grant execute on function public.is_school_staff(uuid) to authenticated;
grant execute on function public.is_school_staff(uuid) to service_role;

create or replace function public.is_school_admin(target_school_id uuid)
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = target_school_id
      and role in ('admin', 'school_admin')
  );
end;
$$ language plpgsql security definer;

revoke execute on function public.is_school_admin(uuid) from public;
grant execute on function public.is_school_admin(uuid) to authenticated;
grant execute on function public.is_school_admin(uuid) to service_role;

create or replace function public.user_school_id(target_user_id uuid)
returns uuid
set search_path = public, pg_temp
as $$
begin
  return (select school_id from public.profiles where id = target_user_id limit 1);
end;
$$ language plpgsql security definer;

revoke execute on function public.user_school_id(uuid) from public;
grant execute on function public.user_school_id(uuid) to authenticated;
grant execute on function public.user_school_id(uuid) to service_role;

create or replace function public.is_platform_super_admin()
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'platform_super_admin'
  );
end;
$$ language plpgsql security definer;

revoke execute on function public.is_platform_super_admin() from public;
grant execute on function public.is_platform_super_admin() to authenticated;
grant execute on function public.is_platform_super_admin() to service_role;

-- ============================================================================
-- 3. PROFILES RLS — REMOVE RECURSIVE SELF-JOIN POLICIES
-- ============================================================================
alter table public.profiles enable row level security;

-- Drop all existing profile policies to avoid name collisions.
drop policy if exists "Users can read own profile"             on public.profiles;
drop policy if exists "Instructors can read school profiles"   on public.profiles;
drop policy if exists "Instructors can read school students"   on public.profiles;
drop policy if exists "Users can update own profile"           on public.profiles;
drop policy if exists "Users can insert own profile"           on public.profiles;
drop policy if exists "Admins can manage school profiles"      on public.profiles;
drop policy if exists "School admins can manage school profiles" on public.profiles;
drop policy if exists "Profiles: users read own"               on public.profiles;
drop policy if exists "Profiles: school staff read students"   on public.profiles;
drop policy if exists "Profiles: school staff manage students" on public.profiles;
drop policy if exists "Profiles: admins manage school"         on public.profiles;
drop policy if exists "Profiles: school_admins manage school"  on public.profiles;

-- Users read/update their own profile.
create policy "Profiles: users read own" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy "Profiles: users update own" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Instructors, admins, and school_admins can read any profile in the same school.
-- Uses helper functions; no self-join on profiles.
create policy "Profiles: school staff read school" on public.profiles
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = profiles.school_id
  );

-- Instructors, admins, and school_admins can read learner profiles in the same school.
-- Separate policy keeps the learner-scoped intent explicit.
create policy "Profiles: school staff read students" on public.profiles
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = profiles.school_id
    and profiles.role in ('student', 'apprentice')
  );

-- Admins/school_admins can update learner profiles in the same school
-- (e.g. approve, disable, assign school). No insert/delete to avoid destroying auth rows.
create policy "Profiles: school admins manage students" on public.profiles
  for update to authenticated
  using (
    public.is_school_admin(public.current_user_school_id())
    and public.current_user_school_id() = profiles.school_id
    and profiles.role in ('student', 'apprentice')
  )
  with check (
    public.is_school_admin(public.current_user_school_id())
    and public.current_user_school_id() = profiles.school_id
    and profiles.role in ('student', 'apprentice')
  );

-- Allow new users to insert their own profile row during signup.
create policy "Profiles: users insert own" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);

-- Platform super admin can read/manage all profiles.
create policy "Profiles: platform super admin full access" on public.profiles
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 4. STUDENT_PROGRESS RLS + UNIQUE CONSTRAINT
-- ============================================================================
alter table public.student_progress enable row level security;

-- Drop old policies.
drop policy if exists "Users can read own progress"                  on public.student_progress;
drop policy if exists "Instructors can read school student progress" on public.student_progress;
drop policy if exists "Users can insert own progress"                on public.student_progress;
drop policy if exists "Users can update own progress"                on public.student_progress;
drop policy if exists "student_progress_select"                      on public.student_progress;
drop policy if exists "student_progress_insert"                      on public.student_progress;
drop policy if exists "student_progress_update"                      on public.student_progress;
drop policy if exists "student_progress_delete"                      on public.student_progress;

-- Students: full CRUD on own rows.
create policy "student_progress_select" on public.student_progress
  for select to authenticated
  using (auth.uid() = user_id);

create policy "student_progress_insert" on public.student_progress
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "student_progress_update" on public.student_progress
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "student_progress_delete" on public.student_progress
  for delete to authenticated
  using (auth.uid() = user_id);

-- School staff: read all progress for students in the same school.
-- No join to profiles inside the policy; uses helper functions.
create policy "student_progress_staff_select" on public.student_progress
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin.
create policy "student_progress_super_admin" on public.student_progress
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- Unique constraint on (user_id, chapter_id).
-- Guard: fail fast if duplicates exist so we do not silently lose data.
do $$
declare
  dup_count integer;
  constraint_exists boolean;
begin
  select exists (
    select 1 from pg_constraint c
    where c.conrelid = 'public.student_progress'::regclass
      and c.contype = 'u'
      and (
        select count(*) from unnest(c.conkey) as k(attnum)
        where k.attnum in (
          select attnum from pg_attribute
          where attrelid = 'public.student_progress'::regclass
            and attname in ('user_id', 'chapter_id')
        )
      ) = 2
      and array_length(c.conkey, 1) = 2
  ) into constraint_exists;

  if not constraint_exists then
    select count(*) into dup_count
    from (
      select user_id, chapter_id
      from public.student_progress
      group by user_id, chapter_id
      having count(*) > 1
    ) d;

    if dup_count > 0 then
      raise exception 'Duplicate (user_id, chapter_id) rows exist in student_progress (groups=%). Run the cleanup proposal from DATABASE_REPAIR_REPORT_2026-07-13.md before applying this migration.', dup_count;
    end if;

    alter table public.student_progress
      add constraint student_progress_user_chapter_unique unique (user_id, chapter_id);
  end if;
end
$$;

-- Note: the unique constraint above already creates a unique index on (user_id, chapter_id).
-- No additional index is needed for that pair.

-- ============================================================================
-- 5. QUIZ_ATTEMPTS RLS
-- ============================================================================
alter table public.quiz_attempts enable row level security;

-- Drop old policies.
drop policy if exists "Users can read own quiz attempts"            on public.quiz_attempts;
drop policy if exists "Instructors can read school quiz attempts"  on public.quiz_attempts;
drop policy if exists "Users can insert own quiz attempts"          on public.quiz_attempts;
drop policy if exists "quiz_attempts_select"                        on public.quiz_attempts;
drop policy if exists "quiz_attempts_insert"                        on public.quiz_attempts;
drop policy if exists "quiz_attempts_update"                        on public.quiz_attempts;
drop policy if exists "quiz_attempts_delete"                        on public.quiz_attempts;

-- Students: full CRUD on own rows.
create policy "quiz_attempts_select" on public.quiz_attempts
  for select to authenticated
  using (auth.uid() = user_id);

create policy "quiz_attempts_insert" on public.quiz_attempts
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "quiz_attempts_update" on public.quiz_attempts
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_attempts_delete" on public.quiz_attempts
  for delete to authenticated
  using (auth.uid() = user_id);

-- School staff: read all attempts for students in the same school.
create policy "quiz_attempts_staff_select" on public.quiz_attempts
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin.
create policy "quiz_attempts_super_admin" on public.quiz_attempts
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 6. MISSED_QUESTIONS RLS
-- ============================================================================
alter table public.missed_questions enable row level security;

-- Drop old policies.
drop policy if exists "Users can read own missed questions"   on public.missed_questions;
drop policy if exists "Users can insert own missed questions" on public.missed_questions;
drop policy if exists "Users can update own missed questions" on public.missed_questions;
drop policy if exists "Users can delete own missed questions" on public.missed_questions;
drop policy if exists "missed_questions_select"               on public.missed_questions;
drop policy if exists "missed_questions_insert"               on public.missed_questions;
drop policy if exists "missed_questions_update"               on public.missed_questions;
drop policy if exists "missed_questions_delete"               on public.missed_questions;

-- Students: full CRUD on own rows.
create policy "missed_questions_select" on public.missed_questions
  for select to authenticated
  using (auth.uid() = user_id);

create policy "missed_questions_insert" on public.missed_questions
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "missed_questions_update" on public.missed_questions
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "missed_questions_delete" on public.missed_questions
  for delete to authenticated
  using (auth.uid() = user_id);

-- School staff: read missed questions for students in the same school.
-- This enables the instructor student-detail view to show the missed bank.
create policy "missed_questions_staff_select" on public.missed_questions
  for select to authenticated
  using (
    public.is_school_staff(public.current_user_school_id())
    and public.current_user_school_id() = public.user_school_id(user_id)
  );

-- Platform super admin.
create policy "missed_questions_super_admin" on public.missed_questions
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================
create index if not exists idx_quiz_attempts_user_completed
  on public.quiz_attempts (user_id, completed_at desc);

create index if not exists idx_student_progress_user_id
  on public.student_progress (user_id);

create index if not exists idx_missed_questions_user_question
  on public.missed_questions (user_id, question_id);

-- ============================================================================
-- 8. UPDATED_AT COLUMN + TRIGGER (shared helper)
-- ============================================================================
-- quiz_attempts was created without an updated_at column. Add it idempotently
-- before attaching the trigger so existing and new rows both support it.
alter table public.quiz_attempts
  add column if not exists updated_at timestamptz default now();

create or replace function public.update_updated_at_column()
returns trigger
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

revoke execute on function public.update_updated_at_column() from public;
grant execute on function public.update_updated_at_column() to authenticated;
grant execute on function public.update_updated_at_column() to service_role;

-- Attach to tables that have updated_at and may be missing a trigger.
drop trigger if exists update_quiz_attempts_updated_at on public.quiz_attempts;
create trigger update_quiz_attempts_updated_at
  before update on public.quiz_attempts
  for each row execute function public.update_updated_at_column();

-- student_progress already uses update_updated_at_column in operational tables logic,
-- but ensure the trigger exists.
drop trigger if exists update_student_progress_updated_at on public.student_progress;
create trigger update_student_progress_updated_at
  before update on public.student_progress
  for each row execute function public.update_updated_at_column();

-- missed_questions uses set_updated_at(); keep it consistent if desired.
drop trigger if exists trg_missed_questions_updated_at on public.missed_questions;
create trigger trg_missed_questions_updated_at
  before update on public.missed_questions
  for each row execute function public.update_updated_at_column();
