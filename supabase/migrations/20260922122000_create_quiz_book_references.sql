-- Optional student-entered course-material references for quiz questions.
-- One reference per student + quiz + question. Students may edit their own entries.

create table if not exists public.quiz_book_references (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id text not null,
  question_id text not null,
  book text not null default '',
  chapter text not null default '',
  page text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, quiz_id, question_id)
);

create index if not exists idx_quiz_book_references_user_quiz
  on public.quiz_book_references(user_id, quiz_id);

alter table public.quiz_book_references enable row level security;

drop policy if exists "Students can read own quiz book references" on public.quiz_book_references;
create policy "Students can read own quiz book references" on public.quiz_book_references
  for select using (auth.uid() = user_id);

drop policy if exists "Students can insert own quiz book references" on public.quiz_book_references;
create policy "Students can insert own quiz book references" on public.quiz_book_references
  for insert with check (auth.uid() = user_id);

drop policy if exists "Students can update own quiz book references" on public.quiz_book_references;
create policy "Students can update own quiz book references" on public.quiz_book_references
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Students can delete own quiz book references" on public.quiz_book_references;
create policy "Students can delete own quiz book references" on public.quiz_book_references
  for delete using (auth.uid() = user_id);

drop policy if exists "Instructors can read school quiz book references" on public.quiz_book_references;
create policy "Instructors can read school quiz book references" on public.quiz_book_references
  for select using (
    exists (
      select 1
      from public.profiles as instructor
      join public.profiles as student on student.id = quiz_book_references.user_id
      where instructor.id = auth.uid()
        and instructor.role in ('instructor', 'admin')
        and instructor.school_id = student.school_id
    )
  );
