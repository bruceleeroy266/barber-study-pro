alter table public.student_progress
  add column if not exists lesson_completed boolean not null default false,
  add column if not exists knowledge_checks_completed boolean not null default false;

comment on column public.student_progress.lesson_completed is
  'True after the student explicitly completes the chapter lesson/content requirement.';
comment on column public.student_progress.knowledge_checks_completed is
  'True after the student completes the chapter knowledge-check/scenario requirement.';
