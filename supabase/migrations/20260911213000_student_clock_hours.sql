-- Student clock-in/out with pending hour-credit handoff.
-- Students may only clock themselves. Clock-out creates/updates a pending hour log;
-- instructor approval remains the authority that turns time into approved program hours.

alter table public.hour_logs
  add column if not exists attendance_record_id uuid references public.attendance_records(id) on delete set null;

create unique index if not exists idx_hour_logs_attendance_record_id
  on public.hour_logs(attendance_record_id)
  where attendance_record_id is not null;

create or replace function public.student_clock_in()
returns public.attendance_records
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_school uuid;
  v_timezone text;
  v_date date;
  v_record public.attendance_records;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select p.school_id, coalesce(s.timezone, 'America/Chicago')
    into v_school, v_timezone
  from public.profiles p join public.schools s on s.id = p.school_id
  where p.id = v_user;
  if v_school is null then raise exception 'Student is not assigned to a school'; end if;
  v_date := (now() at time zone v_timezone)::date;

  select * into v_record from public.attendance_records
  where user_id = v_user and date = v_date
  order by created_at desc limit 1 for update;

  if v_record.id is null then
    insert into public.attendance_records
      (school_id, user_id, date, status, clocked_in_at, clocked_out_at, minutes_present, verified_by)
    values (v_school, v_user, v_date, 'Clocked In', now(), null, null, null)
    returning * into v_record;
  elsif v_record.clocked_in_at is not null and v_record.clocked_out_at is null then
    raise exception 'Already clocked in';
  elsif v_record.clocked_out_at is not null then
    raise exception 'Today''s clock session is already complete';
  else
    update public.attendance_records
    set school_id = v_school, status = 'Clocked In', clocked_in_at = now(),
        clocked_out_at = null, minutes_present = null, updated_at = now()
    where id = v_record.id returning * into v_record;
  end if;
  return v_record;
end;
$$;

create or replace function public.student_clock_out()
returns public.attendance_records
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_school uuid;
  v_timezone text;
  v_date date;
  v_record public.attendance_records;
  v_minutes integer;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select p.school_id, coalesce(s.timezone, 'America/Chicago')
    into v_school, v_timezone
  from public.profiles p join public.schools s on s.id = p.school_id
  where p.id = v_user;
  if v_school is null then raise exception 'Student is not assigned to a school'; end if;
  v_date := (now() at time zone v_timezone)::date;

  select * into v_record from public.attendance_records
  where user_id = v_user and date = v_date
  order by created_at desc limit 1 for update;

  if v_record.id is null or v_record.clocked_in_at is null then raise exception 'No active clock-in found'; end if;
  if v_record.clocked_out_at is not null then raise exception 'Already clocked out'; end if;

  v_minutes := greatest(1, floor(extract(epoch from (now() - v_record.clocked_in_at)) / 60)::integer);
  update public.attendance_records
  set status = 'Clocked Out', clocked_out_at = now(), minutes_present = v_minutes, updated_at = now()
  where id = v_record.id returning * into v_record;

  insert into public.hour_logs
    (school_id, user_id, date, category, minutes, status, notes, attendance_record_id)
  values
    (v_record.school_id, v_user, v_record.date, 'Other', v_minutes, 'pending',
     'Automatically created from student attendance clock. Requires instructor review.', v_record.id)
  on conflict (attendance_record_id) where attendance_record_id is not null
  do update set minutes = excluded.minutes, updated_at = now();
  return v_record;
end;
$$;

revoke all on function public.student_clock_in() from public;
revoke all on function public.student_clock_out() from public;
grant execute on function public.student_clock_in() to authenticated;
grant execute on function public.student_clock_out() to authenticated;
