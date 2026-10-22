-- Serialize school consent revocation with privileged support mutations.
-- Restrict consent control to designated school_admin (not generic school-scoped admin).
-- Deliberately retain technical schedule support only; official grade/hour/attendance
-- mutation is not authorized by a school support grant.
create or replace function public.set_school_support_authorization(p_enable boolean)
returns void language plpgsql security definer set search_path=''
as $$
declare v_actor uuid:=auth.uid(); v_school uuid;
begin
 select p.school_id into v_school from public.profiles p
 where p.id=v_actor and p.role='school_admin'
 and p.school_id is not null and p.approval_status='approved'
 and p.is_disabled is distinct from true;
 if v_school is null then raise exception 'School administrator required' using errcode='42501'; end if;
 -- A school row is a serialization point for consent changes and support writes.
 perform 1 from public.schools where id=v_school for update;
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

-- Replace the schedule override with an authorization check after taking the
-- same per-school row lock as consent changes. It cannot commit a newly
-- authorized mutation after a committed revoke.
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
 if v_school is null then raise exception 'Unsupported instructor' using errcode='42501'; end if;
 perform 1 from public.schools where id=v_school for update;
 if not found or not exists (
   select 1 from public.support_access_sessions ss
   join public.school_support_grants g on g.school_id=v_school
   where ss.actor_id=v_actor and ss.target_profile_id=p_target_instructor
   and ss.expires_at>clock_timestamp() and g.revoked_at is null and g.expires_at>clock_timestamp()
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
