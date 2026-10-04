create table if not exists public.chapter_micro_check_remediation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  check_id text not null,
  question_id text not null,
  concept_id text not null,
  difficulty text not null check (difficulty in ('understanding','application','scenario')),
  selected_answer text not null check (selected_answer in ('a','b','c','d')),
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint chapter_micro_check_remediation_attempts_once_unique
    unique (user_id, chapter_id, question_id)
);

comment on table public.chapter_micro_check_remediation_attempts is
  'Immutable one-time hint-supported micro-check remediation evidence. Original first-attempt evidence remains in chapter_micro_check_attempts.';

create index if not exists chapter_micro_check_remediation_user_chapter_idx
  on public.chapter_micro_check_remediation_attempts (user_id, chapter_id, answered_at);

create index if not exists chapter_micro_check_remediation_concept_idx
  on public.chapter_micro_check_remediation_attempts (chapter_id, concept_id, answered_at);

alter table public.chapter_micro_check_remediation_attempts enable row level security;

revoke all on table public.chapter_micro_check_remediation_attempts from anon;
revoke all on table public.chapter_micro_check_remediation_attempts from authenticated;
grant select on table public.chapter_micro_check_remediation_attempts to authenticated;
grant all on table public.chapter_micro_check_remediation_attempts to service_role;

drop policy if exists chapter_micro_check_remediation_student_select
  on public.chapter_micro_check_remediation_attempts;
create policy chapter_micro_check_remediation_student_select
on public.chapter_micro_check_remediation_attempts
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists chapter_micro_check_remediation_staff_select
  on public.chapter_micro_check_remediation_attempts;
create policy chapter_micro_check_remediation_staff_select
on public.chapter_micro_check_remediation_attempts
for select
to authenticated
using (
  is_school_staff(current_user_school_id())
  and current_user_school_id() = user_school_id(user_id)
);

drop policy if exists chapter_micro_check_remediation_platform_admin_select
  on public.chapter_micro_check_remediation_attempts;
create policy chapter_micro_check_remediation_platform_admin_select
on public.chapter_micro_check_remediation_attempts
for select
to authenticated
using (is_platform_admin());

drop policy if exists chapter_micro_check_remediation_super_admin
  on public.chapter_micro_check_remediation_attempts;
create policy chapter_micro_check_remediation_super_admin
on public.chapter_micro_check_remediation_attempts
for all
to authenticated
using (is_platform_super_admin())
with check (is_platform_super_admin());
