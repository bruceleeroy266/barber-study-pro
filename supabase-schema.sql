-- Barber Study Pro V2 — Supabase Schema
-- Run this in your Supabase SQL Editor to set up the school + instructor system

-- ───────────────────────────────────────────────
-- Schools table
-- ───────────────────────────────────────────────
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

-- Enable RLS
alter table public.schools enable row level security;

-- Everyone can read schools (needed for signup dropdown)
create policy "Schools are viewable by everyone" on public.schools
  for select using (true);

-- Instructors can create schools
create policy "Instructors can create schools" on public.schools
  for insert with check (
    auth.uid() = created_by
  );

-- ───────────────────────────────────────────────
-- Profiles table (extends auth.users)
-- ───────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text default 'student' check (role in ('student', 'instructor', 'apprentice', 'admin')),
  school_id uuid references public.schools(id) on delete set null,
  barber_shop_name text,
  mentor_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Instructors can read profiles of students in their school
create policy "Instructors can read school students" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles instructor
      where instructor.id = auth.uid()
        and instructor.role = 'instructor'
        and instructor.school_id = profiles.school_id
    )
  );

-- Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- ───────────────────────────────────────────────
-- Student Progress table
-- ───────────────────────────────────────────────
create table if not exists public.student_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  chapter_id uuid references public.chapters(id) on delete cascade not null,
  flashcards_completed boolean default false,
  quiz_completed boolean default false,
  best_quiz_score int,
  last_studied_at timestamptz,
  progress_percentage int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, chapter_id)
);

-- Enable RLS
alter table public.student_progress enable row level security;

-- Students can read/write their own progress
create policy "Users own their progress" on public.student_progress
  for all using (auth.uid() = user_id);

-- Instructors can read progress of students in their school
create policy "Instructors can read school progress" on public.student_progress
  for select using (
    exists (
      select 1 from public.profiles instructor
      where instructor.id = auth.uid()
        and instructor.role = 'instructor'
        and instructor.school_id = (
          select school_id from public.profiles student where student.id = student_progress.user_id
        )
    )
  );

-- ───────────────────────────────────────────────
-- Quiz Attempts table
-- ───────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score int not null,
  total_questions int not null,
  percentage int not null,
  answers_json jsonb default '{}',
  completed_at timestamptz default now()
);

-- Enable RLS
alter table public.quiz_attempts enable row level security;

-- Students own their attempts
create policy "Users own their quiz attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id);

-- Instructors can read attempts of students in their school
create policy "Instructors can read school quiz attempts" on public.quiz_attempts
  for select using (
    exists (
      select 1 from public.profiles instructor
      where instructor.id = auth.uid()
        and instructor.role = 'instructor'
        and instructor.school_id = (
          select school_id from public.profiles student where student.id = quiz_attempts.user_id
        )
    )
  );

-- ───────────────────────────────────────────────
-- Trigger: auto-create profile on signup
-- ───────────────────────────────────────────────
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

-- Attach trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────────────────────────────
-- Indexes for performance
-- ───────────────────────────────────────────────
create index if not exists idx_profiles_school_id on public.profiles(school_id);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_student_progress_user_id on public.student_progress(user_id);
create index if not exists idx_student_progress_chapter_id on public.student_progress(chapter_id);
create index if not exists idx_quiz_attempts_user_id on public.quiz_attempts(user_id);
create index if not exists idx_quiz_attempts_quiz_id on public.quiz_attempts(quiz_id);
create index if not exists idx_schools_created_by on public.schools(created_by);

-- ───────────────────────────────────────────────
-- Pilot inquiries table
-- Stores public pilot program submissions from the /pilot page.
-- ───────────────────────────────────────────────
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
  start_date text,
  message text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  ip_address text,
  user_agent text,
  is_test boolean default false,
  status text default 'new' check (status in ('new', 'contacted', 'approved', 'declined', 'spam')),
  notes text
);

-- Enable RLS
alter table public.pilot_inquiries enable row level security;

-- Public can create pilot inquiries (the /api/email route inserts using the
-- service role key, but this policy also allows anon inserts if desired).
create policy "Public can create pilot inquiries" on public.pilot_inquiries
  for insert with check (true);

-- Only admins and school admins can read pilot inquiries
create policy "Admins can read pilot inquiries" on public.pilot_inquiries
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and (profiles.role = 'admin' or profiles.role = 'school_admin')
    )
  );

-- Only admins can update pilot inquiries (status, notes, is_test)
create policy "Admins can update pilot inquiries" on public.pilot_inquiries
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and (profiles.role = 'admin' or profiles.role = 'school_admin')
    )
  );

-- Only admins can delete pilot inquiries
create policy "Admins can delete pilot inquiries" on public.pilot_inquiries
  for delete using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Indexes for performance
 create index if not exists idx_pilot_inquiries_email on public.pilot_inquiries(email);
 create index if not exists idx_pilot_inquiries_status on public.pilot_inquiries(status);
 create index if not exists idx_pilot_inquiries_created_at on public.pilot_inquiries(created_at desc);
