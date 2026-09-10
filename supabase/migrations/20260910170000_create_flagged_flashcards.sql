-- Persist student flashcards marked "Need More Practice".
-- This migration mirrors the additive production migration applied during
-- September 2026 mobile QA and is idempotent for safe schema reconciliation.

create table if not exists public.flagged_flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  flashcard_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, chapter_id, flashcard_id)
);

alter table public.flagged_flashcards enable row level security;

grant select, insert, delete on public.flagged_flashcards to authenticated;

create index if not exists flagged_flashcards_user_chapter_idx
  on public.flagged_flashcards (user_id, chapter_id);

drop policy if exists "Students can view own flagged flashcards" on public.flagged_flashcards;
create policy "Students can view own flagged flashcards"
  on public.flagged_flashcards
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Students can flag own flashcards" on public.flagged_flashcards;
create policy "Students can flag own flashcards"
  on public.flagged_flashcards
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Students can unflag own flashcards" on public.flagged_flashcards;
create policy "Students can unflag own flashcards"
  on public.flagged_flashcards
  for delete
  to authenticated
  using (auth.uid() = user_id);
