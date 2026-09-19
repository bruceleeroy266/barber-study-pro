-- Track authenticated active study time by the student's browser timezone.
create table if not exists public.study_activity_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  study_date date not null,
  active_seconds integer not null default 0 check (active_seconds >= 0),
  timezone text not null default 'UTC',
  last_active_at timestamptz not null default now(),
  primary key (user_id, study_date)
);

alter table public.study_activity_days enable row level security;

create policy "Users can read own study activity"
  on public.study_activity_days for select
  using (auth.uid() = user_id);

create policy "Instructors can read school study activity"
  on public.study_activity_days for select
  using (
    exists (
      select 1 from public.profiles instructor
      where instructor.id = auth.uid()
        and instructor.role in ('instructor', 'admin', 'school_admin')
        and (
          instructor.role = 'admin'
          or instructor.school_id = (
            select student.school_id from public.profiles student
            where student.id = study_activity_days.user_id
          )
        )
    )
  );

create or replace function public.record_study_activity(
  p_seconds integer default 60,
  p_timezone text default 'UTC'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_timezone text;
  v_study_date date;
  v_seconds integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select name into v_timezone
  from pg_timezone_names
  where name = p_timezone
  limit 1;

  v_timezone := coalesce(v_timezone, 'UTC');
  v_study_date := (now() at time zone v_timezone)::date;
  v_seconds := greatest(1, least(coalesce(p_seconds, 60), 60));

  insert into public.study_activity_days (user_id, study_date, active_seconds, timezone, last_active_at)
  values (v_user_id, v_study_date, v_seconds, v_timezone, now())
  on conflict (user_id, study_date)
  do update set
    active_seconds = study_activity_days.active_seconds + excluded.active_seconds,
    timezone = excluded.timezone,
    last_active_at = now();
end;
$$;

revoke all on function public.record_study_activity(integer, text) from public;
grant execute on function public.record_study_activity(integer, text) to authenticated;

create index if not exists idx_study_activity_days_user_date
  on public.study_activity_days(user_id, study_date desc);
