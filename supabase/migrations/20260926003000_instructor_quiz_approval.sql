-- Instructor Quiz Approval workflow
create table if not exists public.quiz_approval_settings (
  school_id uuid primary key references public.schools(id) on delete cascade,
  require_approval boolean not null default false,
  auto_approve_when_ready boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_access_requests (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  chapter_id text not null,
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  readiness_snapshot jsonb not null default '{}'::jsonb,
  requested_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(student_id, quiz_id)
);

create table if not exists public.quiz_access_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.quiz_access_requests(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  event_type text not null check (event_type in ('requested','auto_approved','approved','denied','started','completed')),
  actor_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_access_requests_school_status
  on public.quiz_access_requests(school_id, status, requested_at desc);
create index if not exists idx_quiz_access_events_request
  on public.quiz_access_events(request_id, created_at desc);

alter table public.quiz_approval_settings enable row level security;
alter table public.quiz_access_requests enable row level security;
alter table public.quiz_access_events enable row level security;

drop policy if exists "Quiz approval settings school members read" on public.quiz_approval_settings;
create policy "Quiz approval settings school members read" on public.quiz_approval_settings
for select to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        p.school_id = quiz_approval_settings.school_id
        or (p.role = 'admin' and p.school_id is null)
      )
  )
);

drop policy if exists "Quiz approval settings staff manage" on public.quiz_approval_settings;
create policy "Quiz approval settings staff manage" on public.quiz_approval_settings
for all to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        (p.school_id = quiz_approval_settings.school_id and p.role in ('instructor','school_admin','admin'))
        or (p.role = 'admin' and p.school_id is null)
      )
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        (p.school_id = quiz_approval_settings.school_id and p.role in ('instructor','school_admin','admin'))
        or (p.role = 'admin' and p.school_id is null)
      )
  )
);

drop policy if exists "Students manage own quiz access request" on public.quiz_access_requests;
create policy "Students manage own quiz access request" on public.quiz_access_requests
for all to authenticated using (
  student_id = auth.uid()
) with check (
  student_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.school_id = quiz_access_requests.school_id
      and p.role in ('student','apprentice')
  )
);

drop policy if exists "School staff manage quiz access requests" on public.quiz_access_requests;
create policy "School staff manage quiz access requests" on public.quiz_access_requests
for all to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        (p.school_id = quiz_access_requests.school_id and p.role in ('instructor','school_admin','admin'))
        or (p.role = 'admin' and p.school_id is null)
      )
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        (p.school_id = quiz_access_requests.school_id and p.role in ('instructor','school_admin','admin'))
        or (p.role = 'admin' and p.school_id is null)
      )
  )
);

drop policy if exists "Students read and append own quiz access events" on public.quiz_access_events;
create policy "Students read and append own quiz access events" on public.quiz_access_events
for select to authenticated using (student_id = auth.uid());

drop policy if exists "Students append own quiz access events" on public.quiz_access_events;
create policy "Students append own quiz access events" on public.quiz_access_events
for insert to authenticated with check (
  student_id = auth.uid()
  and event_type in ('started','completed')
);

drop policy if exists "School staff manage quiz access events" on public.quiz_access_events;
create policy "School staff manage quiz access events" on public.quiz_access_events
for all to authenticated using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        (p.school_id = quiz_access_events.school_id and p.role in ('instructor','school_admin','admin'))
        or (p.role = 'admin' and p.school_id is null)
      )
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        (p.school_id = quiz_access_events.school_id and p.role in ('instructor','school_admin','admin'))
        or (p.role = 'admin' and p.school_id is null)
      )
  )
);

grant select, insert, update, delete on public.quiz_approval_settings to authenticated;
grant select, insert, update, delete on public.quiz_access_requests to authenticated;
grant select, insert, update, delete on public.quiz_access_events to authenticated;
