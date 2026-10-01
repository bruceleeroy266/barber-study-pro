-- COM-1B — Production Communication Database Foundation
-- Scope: schema only. No production messaging activation, no UI wiring, no Realtime wiring.
-- RLS policies are deferred to COM-1C, but RLS is enabled on every exposed table now.

create table if not exists public.student_instructor_assignments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  is_active boolean not null default true,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_instructor_assignments_distinct_people
    check (student_id <> instructor_id),
  constraint student_instructor_assignments_lifecycle
    check ((is_active and ended_at is null) or (not is_active and ended_at is not null))
);

create unique index if not exists uq_student_instructor_assignments_one_active_student
  on public.student_instructor_assignments(student_id)
  where is_active = true;

create index if not exists idx_student_instructor_assignments_school_instructor_active
  on public.student_instructor_assignments(school_id, instructor_id, is_active);

create index if not exists idx_student_instructor_assignments_school_student_active
  on public.student_instructor_assignments(school_id, student_id, is_active);

create index if not exists idx_student_instructor_assignments_assigned_by
  on public.student_instructor_assignments(assigned_by);

create table if not exists public.communication_threads (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  status text not null default 'active',
  created_by uuid not null references public.profiles(id) on delete restrict,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint communication_threads_distinct_people
    check (student_id <> instructor_id),
  constraint communication_threads_subject_length
    check (char_length(btrim(subject)) between 1 and 160),
  constraint communication_threads_status
    check (status in ('active', 'archived'))
);

create index if not exists idx_communication_threads_school_student_last_message
  on public.communication_threads(school_id, student_id, last_message_at desc);

create index if not exists idx_communication_threads_school_instructor_last_message
  on public.communication_threads(school_id, instructor_id, last_message_at desc);

create index if not exists idx_communication_threads_created_by
  on public.communication_threads(created_by);

create index if not exists idx_communication_threads_status
  on public.communication_threads(status);

create table if not exists public.communication_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.communication_threads(id) on delete restrict,
  school_id uuid not null references public.schools(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  body text not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint communication_messages_body_length
    check (char_length(btrim(body)) between 1 and 4000)
);

create index if not exists idx_communication_messages_thread_sent_at
  on public.communication_messages(thread_id, sent_at);

create index if not exists idx_communication_messages_school_sent_at
  on public.communication_messages(school_id, sent_at desc);

create index if not exists idx_communication_messages_sender_sent_at
  on public.communication_messages(sender_id, sent_at desc);

create table if not exists public.communication_message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.communication_messages(id) on delete cascade,
  reader_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  constraint communication_message_reads_unique unique (message_id, reader_id)
);

create index if not exists idx_communication_message_reads_reader_read_at
  on public.communication_message_reads(reader_id, read_at desc);

create table if not exists public.bulletins (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  body text not null,
  priority text not null default 'normal',
  status text not null default 'draft',
  is_pinned boolean not null default false,
  acknowledgment_required boolean not null default false,
  publish_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bulletins_title_length
    check (char_length(btrim(title)) between 1 and 160),
  constraint bulletins_body_length
    check (char_length(btrim(body)) between 1 and 10000),
  constraint bulletins_priority
    check (priority in ('normal', 'important', 'urgent')),
  constraint bulletins_status
    check (status in ('draft', 'published', 'archived')),
  constraint bulletins_expiration_after_publish
    check (expires_at is null or publish_at is null or expires_at > publish_at)
);

create index if not exists idx_bulletins_school_status_publish_at
  on public.bulletins(school_id, status, publish_at desc);

create index if not exists idx_bulletins_school_pinned_publish_at
  on public.bulletins(school_id, is_pinned, publish_at desc);

create index if not exists idx_bulletins_author
  on public.bulletins(author_id);

create table if not exists public.bulletin_audiences (
  id uuid primary key default gen_random_uuid(),
  bulletin_id uuid not null references public.bulletins(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  audience_type text not null,
  program_id uuid references public.programs(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint bulletin_audiences_type
    check (audience_type in ('school', 'program', 'student')),
  constraint bulletin_audiences_shape
    check (
      (audience_type = 'school' and program_id is null and student_id is null)
      or
      (audience_type = 'program' and program_id is not null and student_id is null)
      or
      (audience_type = 'student' and student_id is not null and program_id is null)
    )
);

create unique index if not exists uq_bulletin_audiences_school
  on public.bulletin_audiences(bulletin_id)
  where audience_type = 'school';

create unique index if not exists uq_bulletin_audiences_program
  on public.bulletin_audiences(bulletin_id, program_id)
  where audience_type = 'program';

create unique index if not exists uq_bulletin_audiences_student
  on public.bulletin_audiences(bulletin_id, student_id)
  where audience_type = 'student';

create index if not exists idx_bulletin_audiences_school
  on public.bulletin_audiences(school_id);

create index if not exists idx_bulletin_audiences_program
  on public.bulletin_audiences(program_id)
  where program_id is not null;

create index if not exists idx_bulletin_audiences_student
  on public.bulletin_audiences(student_id)
  where student_id is not null;

create table if not exists public.bulletin_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  bulletin_id uuid not null references public.bulletins(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  constraint bulletin_acknowledgments_unique unique (bulletin_id, student_id)
);

create index if not exists idx_bulletin_acknowledgments_bulletin_acknowledged_at
  on public.bulletin_acknowledgments(bulletin_id, acknowledged_at);

create index if not exists idx_bulletin_acknowledgments_student_acknowledged_at
  on public.bulletin_acknowledgments(student_id, acknowledged_at desc);

create index if not exists idx_bulletin_acknowledgments_school
  on public.bulletin_acknowledgments(school_id);

create table if not exists public.communication_audit_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint communication_audit_events_entity_type_nonempty
    check (char_length(btrim(entity_type)) between 1 and 80),
  constraint communication_audit_events_event_type_nonempty
    check (char_length(btrim(event_type)) between 1 and 120)
);

create index if not exists idx_communication_audit_events_school_created_at
  on public.communication_audit_events(school_id, created_at desc);

create index if not exists idx_communication_audit_events_actor
  on public.communication_audit_events(actor_id)
  where actor_id is not null;

create index if not exists idx_communication_audit_events_entity
  on public.communication_audit_events(entity_type, entity_id, created_at desc);

alter table public.student_instructor_assignments enable row level security;
alter table public.communication_threads enable row level security;
alter table public.communication_messages enable row level security;
alter table public.communication_message_reads enable row level security;
alter table public.bulletins enable row level security;
alter table public.bulletin_audiences enable row level security;
alter table public.bulletin_acknowledgments enable row level security;
alter table public.communication_audit_events enable row level security;

-- No authenticated policies are created in COM-1B.
-- This intentionally leaves the new tables closed-by-default until COM-1C.
