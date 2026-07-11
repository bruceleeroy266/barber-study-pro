-- Migration: Pilot invite-only access control
-- Adds approval workflow, disabled flag, and admin seeding support.

-- ───────────────────────────────────────────────
-- Profiles: approval and status fields
-- ───────────────────────────────────────────────
alter table public.profiles
  add column if not exists approval_status text default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  add column if not exists is_disabled boolean default false,
  add column if not exists approved_by uuid references auth.users(id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists requires_password_change boolean default false;

-- ───────────────────────────────────────────────
-- Trigger: self-registered accounts start as pending
-- ───────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
declare
  allowed_role text;
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'student');

  -- Self-registration may only produce student, apprentice, or instructor.
  -- All self-registered accounts require admin approval before login.
  if requested_role in ('student', 'apprentice', 'instructor') then
    allowed_role := requested_role;
  else
    allowed_role := 'student';
  end if;

  insert into public.profiles (
    id, email, full_name, role, approval_status, is_disabled, created_at, updated_at
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    allowed_role,
    'pending',
    false,
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

-- ───────────────────────────────────────────────
-- RLS: users can read own profile; instructors can read school profiles
-- ───────────────────────────────────────────────

-- Ensure the policies exist and are up to date.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Instructors can read school students" on public.profiles;
create policy "Instructors can read school students" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles instructor
      where instructor.id = auth.uid()
        and instructor.role = 'instructor'
        and instructor.school_id = profiles.school_id
    )
  );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Admins and instructors within the same school can update student/apprentice profiles
-- (e.g. to approve, disable, or assign a school).
drop policy if exists "Admins can manage school profiles" on public.profiles;
create policy "Admins can manage school profiles" on public.profiles
  for all using (
    exists (
      select 1 from public.profiles admin
      where admin.id = auth.uid()
        and admin.role = 'admin'
        and admin.school_id = profiles.school_id
    )
  );

-- ───────────────────────────────────────────────
-- Indexes for performance
-- ───────────────────────────────────────────────
create index if not exists idx_profiles_approval_status on public.profiles(approval_status);
create index if not exists idx_profiles_is_disabled on public.profiles(is_disabled);
