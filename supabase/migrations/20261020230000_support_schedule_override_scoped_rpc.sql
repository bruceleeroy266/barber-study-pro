-- Narrow Support Mode schedule override authorization. Existing table RLS stays intact.
-- SECURITY DEFINER accepts only verified platform admins supporting a currently approved instructor.
create or replace function public.support_upsert_student_schedule_override(
  p_target_instructor uuid,
  p_student uuid,
  p_override_date date,
  p_override_type text,
  p_start_time time,
  p_end_time time,
  p_break_minutes integer,
  p_reason text
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_school uuid;
  v_override uuid;
begin
  if v_actor is null or not exists (
    select 1 from public.profiles p
    where p.id = v_actor and p.role = 'admin' and p.school_id is null
      and p.approval_status = 'approved' and p.is_disabled is distinct from true
  ) then
    raise exception 'Support operator not authorized' using errcode = '42501';
  end if;

  select p.school_id into v_school from public.profiles p
  where p.id = p_target_instructor and p.role = 'instructor'
    and p.approval_status = 'approved' and p.is_disabled is distinct from true;
  if v_school is null or not exists (
    select 1 from public.profiles s
    join public.student_instructor_assignments a on a.student_id = s.id
    where s.id = p_student and s.school_id = v_school
      and s.role in ('student','apprentice')
      and a.school_id = v_school and a.instructor_id = p_target_instructor
      and a.is_active = true and a.ended_at is null
  ) then
    raise exception 'Student outside supported instructor assignment' using errcode = '42501';
  end if;

  if p_override_type not in ('scheduled','off','makeup')
    or p_break_minutes not between 0 and 480
    or length(coalesce(p_reason,'')) > 500
    or (p_override_type <> 'off' and (p_start_time is null or p_end_time is null or p_end_time <= p_start_time))
  then
    raise exception 'Invalid override' using errcode = '22023';
  end if;

  insert into public.student_schedule_overrides (
    school_id, student_id, override_date, override_type,
    start_time, end_time, break_minutes, reason, created_by, updated_at
  ) values (
    v_school, p_student, p_override_date, p_override_type,
    case when p_override_type = 'off' then null else p_start_time end,
    case when p_override_type = 'off' then null else p_end_time end,
    case when p_override_type = 'off' then 0 else p_break_minutes end,
    p_reason, v_actor, now()
  )
  on conflict (school_id, student_id, override_date) do update set
    override_type = excluded.override_type,
    start_time = excluded.start_time, end_time = excluded.end_time,
    break_minutes = excluded.break_minutes, reason = excluded.reason,
    updated_at = now()
  returning id into v_override;

  return v_override;
end;
$$;
revoke all on function public.support_upsert_student_schedule_override(uuid,uuid,date,text,time,time,integer,text) from public;
grant execute on function public.support_upsert_student_schedule_override(uuid,uuid,date,text,time,time,integer,text) to authenticated;
