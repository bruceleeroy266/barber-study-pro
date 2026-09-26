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

drop policy if exists "Students read own quiz access request" on public.quiz_access_requests;
create policy "Students read own quiz access request" on public.quiz_access_requests
for select to authenticated using (student_id = auth.uid());

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


create or replace function public.request_quiz_access(
  p_quiz_id text,
  p_chapter_id text
)
returns table(request_id uuid, request_status text)
language plpgsql
security definer
set search_path = public
as $quiz_approval$
declare
  v_user_id uuid := auth.uid();
  v_school_id uuid;
  v_role text;
  v_require_approval boolean := false;
  v_auto_approve boolean := false;
  v_lesson boolean := false;
  v_flashcards boolean := false;
  v_checks boolean := false;
  v_ready boolean := false;
  v_status text := 'pending';
  v_request_id uuid;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select p.school_id, p.role
    into v_school_id, v_role
  from public.profiles p
  where p.id = v_user_id;

  if v_school_id is null or v_role not in ('student','apprentice') then
    raise exception 'Student school membership required';
  end if;

  select s.require_approval, s.auto_approve_when_ready
    into v_require_approval, v_auto_approve
  from public.quiz_approval_settings s
  where s.school_id = v_school_id;

  if not coalesce(v_require_approval, false) then
    raise exception 'Quiz approval is not required for this school';
  end if;

  select
    coalesce(sp.lesson_completed, false),
    coalesce(sp.flashcards_completed, false),
    coalesce(sp.knowledge_checks_completed, false)
  into v_lesson, v_flashcards, v_checks
  from public.student_progress sp
  where sp.user_id = v_user_id
    and sp.chapter_id = p_chapter_id;

  v_ready := coalesce(v_lesson, false) and coalesce(v_flashcards, false) and coalesce(v_checks, false);
  if coalesce(v_auto_approve, false) and v_ready then
    v_status := 'approved';
  end if;

  insert into public.quiz_access_requests (
    school_id, student_id, quiz_id, chapter_id, status, readiness_snapshot,
    requested_at, reviewed_by, reviewed_at, updated_at
  ) values (
    v_school_id, v_user_id, p_quiz_id, p_chapter_id, v_status,
    jsonb_build_object(
      'lessonCompleted', coalesce(v_lesson, false),
      'flashcardsCompleted', coalesce(v_flashcards, false),
      'knowledgeChecksCompleted', coalesce(v_checks, false),
      'ready', v_ready
    ),
    v_now,
    case when v_status = 'approved' then v_user_id else null end,
    case when v_status = 'approved' then v_now else null end,
    v_now
  )
  on conflict (student_id, quiz_id)
  do update set
    status = excluded.status,
    readiness_snapshot = excluded.readiness_snapshot,
    requested_at = excluded.requested_at,
    reviewed_by = excluded.reviewed_by,
    reviewed_at = excluded.reviewed_at,
    updated_at = excluded.updated_at
  returning id into v_request_id;

  insert into public.quiz_access_events (
    request_id, school_id, student_id, quiz_id, event_type, actor_id, metadata
  ) values (
    v_request_id, v_school_id, v_user_id, p_quiz_id,
    case when v_status = 'approved' then 'auto_approved' else 'requested' end,
    v_user_id,
    jsonb_build_object('ready', v_ready)
  );

  return query select v_request_id, v_status;
end;
$quiz_approval$;

revoke all on function public.request_quiz_access(text, text) from public;
grant execute on function public.request_quiz_access(text, text) to authenticated;

grant select, insert, update, delete on public.quiz_approval_settings to authenticated;
grant select, insert, update, delete on public.quiz_access_requests to authenticated;
grant select, insert, update, delete on public.quiz_access_events to authenticated;
