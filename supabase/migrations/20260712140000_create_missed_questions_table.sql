-- Create missed_questions table to persist incorrect quiz answers per student.
-- This replaces the localStorage-only missed question bank so records survive
-- logout/login and are available across devices.
--
-- Note: quizzes, quiz_questions, and chapters are currently stored in
-- application code, not in Supabase tables, so this table uses plain uuid/text
-- columns for those references rather than foreign keys.

create table if not exists public.missed_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null,
  quiz_id text not null,
  question_text text not null,
  correct_answer text not null,
  student_answer text not null,
  explanation text,
  chapter_id text,
  chapter_number integer,
  category text,
  times_missed integer not null default 1,
  missed_at timestamptz not null default now(),
  retaken_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

comment on table public.missed_questions is 'Records of quiz questions a student answered incorrectly, used for review and retest.';

-- Index for fast lookups by student.
create index if not exists idx_missed_questions_user_id on public.missed_questions (user_id);
create index if not exists idx_missed_questions_chapter_number on public.missed_questions (chapter_number);

-- Enable RLS.
alter table public.missed_questions enable row level security;

-- Students can only see their own missed questions.
create policy "Users can read own missed questions"
  on public.missed_questions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Students can only insert their own missed questions.
create policy "Users can insert own missed questions"
  on public.missed_questions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Students can only update their own missed questions (e.g. retaken timestamp or counter).
create policy "Users can update own missed questions"
  on public.missed_questions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Students can only delete their own missed questions.
create policy "Users can delete own missed questions"
  on public.missed_questions
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Trigger to auto-update updated_at.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_missed_questions_updated_at on public.missed_questions;

create trigger trg_missed_questions_updated_at
  before update on public.missed_questions
  for each row
  execute function public.set_updated_at();
