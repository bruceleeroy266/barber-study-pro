-- Authoritative Support Mode session registry. No direct table access for API roles.
create table if not exists public.support_access_sessions (
 actor_id uuid not null references auth.users(id) on delete cascade,
 target_profile_id uuid not null references public.profiles(id) on delete cascade,
 expires_at timestamptz not null,
 primary key (actor_id)
);
alter table public.support_access_sessions enable row level security;
revoke all on public.support_access_sessions from public, anon, authenticated;
create or replace function public.set_support_access_session(p_target uuid, p_enable boolean)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid := auth.uid();
begin
 if v_actor is null or not exists (
  select 1 from public.profiles p where p.id=v_actor and p.role='admin'
  and p.school_id is null and p.approval_status='approved'
  and p.is_disabled is distinct from true
 ) then raise exception 'Not authorized' using errcode='42501'; end if;
 if p_enable then
  if not exists (select 1 from public.profiles p where p.id=p_target
   and p.role in ('instructor','school_admin','admin')
   and p.school_id is not null and p.approval_status='approved'
   and p.is_disabled is distinct from true)
  then raise exception 'Invalid support target' using errcode='42501'; end if;
  insert into public.support_access_sessions(actor_id,target_profile_id,expires_at)
   values(v_actor,p_target,now()+interval '4 hours')
   on conflict(actor_id) do update set target_profile_id=excluded.target_profile_id,expires_at=excluded.expires_at;
 else
  delete from public.support_access_sessions where actor_id=v_actor;
 end if;
end; $$;
revoke all on function public.set_support_access_session(uuid,boolean) from public;
grant execute on function public.set_support_access_session(uuid,boolean) to authenticated;
-- Also require a database-verified active session, bound to this exact instructor.
create or replace function public.support_upsert_student_schedule_override(
 p_target_instructor uuid,p_student uuid,p_override_date date,p_override_type text,
 p_start_time time,p_end_time time,p_break_minutes integer,p_reason text
) returns uuid language plpgsql security definer set search_path='' as $$
declare v_actor uuid:=auth.uid();v_school uuid;v_override uuid;
begin
 if v_actor is null or not exists(select 1 from public.profiles p where p.id=v_actor
   and p.role='admin' and p.school_id is null and p.approval_status='approved'
   and p.is_disabled is distinct from true)
 then raise exception 'Support operator not authorized' using errcode='42501'; end if;
 if not exists(select 1 from public.support_access_sessions ss
   where ss.actor_id=v_actor and ss.target_profile_id=p_target_instructor and ss.expires_at>now())
 then raise exception 'Active support session required' using errcode='42501'; end if;
 select p.school_id into v_school from public.profiles p where p.id=p_target_instructor
   and p.role='instructor' and p.approval_status='approved'
   and p.is_disabled is distinct from true;
 if v_school is null or not exists (
   select 1 from public.profiles s join public.student_instructor_assignments a on a.student_id=s.id
   where s.id=p_student and s.school_id=v_school and s.role in ('student','apprentice')
   and a.school_id=v_school and a.instructor_id=p_target_instructor
   and a.is_active=true and a.ended_at is null)
 then raise exception 'Student outside supported instructor assignment' using errcode='42501'; end if;
 if p_override_type not in ('scheduled','off','makeup')
  or p_break_minutes not between 0 and 480 or length(coalesce(p_reason,''))>500
  or (p_override_type<>'off' and (p_start_time is null or p_end_time is null or p_end_time<=p_start_time))
 then raise exception 'Invalid override' using errcode='22023'; end if;
 insert into public.student_schedule_overrides(school_id,student_id,override_date,override_type,
   start_time,end_time,break_minutes,reason,created_by,updated_at)
 values(v_school,p_student,p_override_date,p_override_type,
   case when p_override_type='off' then null else p_start_time end,
   case when p_override_type='off' then null else p_end_time end,
   case when p_override_type='off' then 0 else p_break_minutes end,p_reason,v_actor,now())
 on conflict(school_id,student_id,override_date) do update set override_type=excluded.override_type,
   start_time=excluded.start_time,end_time=excluded.end_time,break_minutes=excluded.break_minutes,
   reason=excluded.reason,updated_at=now()
 returning id into v_override;
 return v_override;
end; $$;
revoke all on function public.support_upsert_student_schedule_override(uuid,uuid,date,text,time,time,integer,text) from public;
grant execute on function public.support_upsert_student_schedule_override(uuid,uuid,date,text,time,time,integer,text) to authenticated;
