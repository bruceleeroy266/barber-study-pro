create table if not exists public.chapter_activity_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  concept_id text not null,
  source text not null check (source in ('flashcard','scenario_application')),
  item_id text not null,
  selected_answer text,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint chapter_activity_evidence_first_attempt_unique
    unique (user_id, chapter_id, source, item_id)
);

comment on table public.chapter_activity_evidence is
  'Immutable first-attempt flashcard study and scenario/application evidence for shared chapter grading.';

create index if not exists chapter_activity_evidence_user_chapter_idx
  on public.chapter_activity_evidence (user_id, chapter_id, source, answered_at);

create index if not exists chapter_activity_evidence_concept_idx
  on public.chapter_activity_evidence (chapter_id, concept_id, source, answered_at);

alter table public.chapter_activity_evidence enable row level security;

revoke all on table public.chapter_activity_evidence from anon;
revoke all on table public.chapter_activity_evidence from authenticated;
grant select, insert on table public.chapter_activity_evidence to authenticated;
grant all on table public.chapter_activity_evidence to service_role;

drop policy if exists chapter_activity_evidence_student_select on public.chapter_activity_evidence;
create policy chapter_activity_evidence_student_select
on public.chapter_activity_evidence
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists chapter_activity_evidence_student_insert on public.chapter_activity_evidence;
create policy chapter_activity_evidence_student_insert
on public.chapter_activity_evidence
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists chapter_activity_evidence_staff_select on public.chapter_activity_evidence;
create policy chapter_activity_evidence_staff_select
on public.chapter_activity_evidence
for select
to authenticated
using (
  is_school_staff(current_user_school_id())
  and current_user_school_id() = user_school_id(user_id)
);

drop policy if exists chapter_activity_evidence_platform_admin_select on public.chapter_activity_evidence;
create policy chapter_activity_evidence_platform_admin_select
on public.chapter_activity_evidence
for select
to authenticated
using (is_platform_admin());

drop policy if exists chapter_activity_evidence_super_admin on public.chapter_activity_evidence;
create policy chapter_activity_evidence_super_admin
on public.chapter_activity_evidence
for all
to authenticated
using (is_platform_super_admin())
with check (is_platform_super_admin());
