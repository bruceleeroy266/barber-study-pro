-- School-controlled, fail-closed technical Support Mode consent.
create table public.school_support_grants (
 school_id uuid primary key references public.schools(id) on delete cascade,
 authorized_by uuid not null references public.profiles(id),
 expires_at timestamptz not null,
 revoked_at timestamptz,
 revoked_by uuid references public.profiles(id),
 updated_at timestamptz not null default now()
);
alter table public.school_support_grants enable row level security;
revoke all on public.school_support_grants from public, anon, authenticated;
-- Restrict authorization changes to real, approved school administrators.
create or replace function public.set_school_support_authorization(p_enable boolean)
returns void language plpgsql security definer set search_path=''
as $$
declare v_actor uuid:=auth.uid(); v_school uuid;
begin
 select p.school_id into v_school from public.profiles p
 where p.id=v_actor and p.role in ('school_admin','admin')
 and p.school_id is not null and p.approval_status='approved'
 and p.is_disabled is distinct from true;
 if v_school is null then raise exception 'School administrator required' using errcode='42501'; end if;
 if p_enable then
   insert into public.school_support_grants(school_id,authorized_by,expires_at,revoked_at,revoked_by,updated_at)
   values(v_school,v_actor,now()+interval '90 days',null,null,now())
   on conflict(school_id) do update set authorized_by=excluded.authorized_by,
     expires_at=excluded.expires_at,revoked_at=null,revoked_by=null,updated_at=now();
 else
   update public.school_support_grants set revoked_at=now(),revoked_by=v_actor,updated_at=now()
     where school_id=v_school and revoked_at is null;
   delete from public.support_access_sessions ss using public.profiles t
     where ss.target_profile_id=t.id and t.school_id=v_school;
 end if;
end; $$;
revoke all on function public.set_school_support_authorization(boolean) from public;
grant execute on function public.set_school_support_authorization(boolean) to authenticated;
create or replace function public.get_school_support_authorization()
returns table(active boolean,expires_at timestamptz,authorized_by uuid,revoked_at timestamptz)
language sql stable security definer set search_path=''
as $$
 select (g.revoked_at is null and g.expires_at>now()), g.expires_at,g.authorized_by,g.revoked_at
 from public.profiles p join public.school_support_grants g on g.school_id=p.school_id
 where p.id=auth.uid() and p.role in ('school_admin','admin')
   and p.school_id is not null and p.approval_status='approved' and p.is_disabled is distinct from true;
$$;
revoke all on function public.get_school_support_authorization() from public;
grant execute on function public.get_school_support_authorization() to authenticated;
-- A school authorization is mandatory for starting any new support session.
create or replace function public.set_support_access_session(p_target uuid,p_enable boolean)
returns void language plpgsql security definer set search_path=''
as $$
declare v_actor uuid:=auth.uid(); v_school uuid;
begin
 if v_actor is null or not exists(select 1 from public.profiles p where p.id=v_actor
   and p.role='admin' and p.school_id is null and p.approval_status='approved'
   and p.is_disabled is distinct from true)
 then raise exception 'Not authorized' using errcode='42501'; end if;
 if p_enable then
  select p.school_id into v_school from public.profiles p where p.id=p_target
    and p.role in ('instructor','school_admin','admin') and p.school_id is not null
    and p.approval_status='approved' and p.is_disabled is distinct from true;
  if v_school is null or not exists (
    select 1 from public.school_support_grants g where g.school_id=v_school
      and g.revoked_at is null and g.expires_at>now()
  ) then raise exception 'School authorization required' using errcode='42501'; end if;
  insert into public.support_access_sessions(actor_id,target_profile_id,expires_at)
  values(v_actor,p_target,now()+interval '4 hours')
  on conflict(actor_id) do update set target_profile_id=excluded.target_profile_id,expires_at=excluded.expires_at;
 else
  delete from public.support_access_sessions where actor_id=v_actor;
 end if;
end; $$;
revoke all on function public.set_support_access_session(uuid,boolean) from public;
grant execute on function public.set_support_access_session(uuid,boolean) to authenticated;
-- Both cookie resolution and the privileged schedule RPC require live school consent.
create or replace function public.is_support_access_session_active(p_target uuid)
returns boolean language sql stable security definer set search_path=''
as $$
 select auth.uid() is not null and exists (
 select 1 from public.support_access_sessions ss
 join public.profiles a on a.id=ss.actor_id
 join public.profiles t on t.id=ss.target_profile_id
 join public.school_support_grants g on g.school_id=t.school_id
 where ss.actor_id=auth.uid() and ss.target_profile_id=p_target
 and ss.expires_at>now() and g.revoked_at is null and g.expires_at>now()
 and a.role='admin' and a.school_id is null
 and a.approval_status='approved' and a.is_disabled is distinct from true
 and t.school_id is not null and t.role in ('instructor','school_admin','admin')
 and t.approval_status='approved' and t.is_disabled is distinct from true
 );
$$;
revoke all on function public.is_support_access_session_active(uuid) from public;
grant execute on function public.is_support_access_session_active(uuid) to authenticated;
-- The privileged schedule RPC was already protected by an actor/target DB session.
-- Tighten it to also require an unrevoked school grant without altering its other protections.
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
 select p.school_id into v_school from public.profiles p where p.id=p_target_instructor
   and p.role='instructor' and p.approval_status='approved'
   and p.is_disabled is distinct from true;
 if v_school is null or not exists (
   select 1 from public.support_access_sessions ss
   join public.school_support_grants g on g.school_id=v_school
   where ss.actor_id=v_actor and ss.target_profile_id=p_target_instructor
   and ss.expires_at>now() and g.revoked_at is null and g.expires_at>now()
 ) then raise exception 'Active school-authorized support session required' using errcode='42501'; end if;
 if not exists (
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
