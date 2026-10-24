-- Current-question position is distinct from the last answered question.
alter table public.comprehensive_exam_attempts add column if not exists current_question_position smallint;
create or replace function public.set_comprehensive_exam_current_question(p_attempt_id uuid,p_position integer)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or p_position not between 1 and 110 then return false; end if;
 update public.comprehensive_exam_attempts t set current_question_position=p_position
 where t.id=p_attempt_id and t.user_id=auth.uid() and t.status='active'
 and t.expires_at>now()
 and exists(select 1 from public.comprehensive_exam_attempt_items i where i.attempt_id=t.id and i.position=p_position);
 return found;
end $$;
revoke all on function public.set_comprehensive_exam_current_question(uuid,integer) from public,anon;
grant execute on function public.set_comprehensive_exam_current_question(uuid,integer) to authenticated;
create or replace function public.get_assigned_student_exam_live_position(p_student_id uuid)
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare v_school uuid;v_position integer;
begin
 select school_id into v_school from public.profiles where id=auth.uid() and role='instructor' and approval_status='approved' and coalesce(is_disabled,false)=false;
 if v_school is null then raise exception 'Instructor access required'; end if;
 if not exists(select 1 from public.profiles s join public.student_instructor_assignments a on a.student_id=s.id and a.school_id=s.school_id
 where s.id=p_student_id and s.school_id=v_school and s.role in ('student','apprentice') and a.instructor_id=auth.uid() and a.is_active=true and a.ended_at is null) then raise exception 'Student not assigned'; end if;
 select t.current_question_position into v_position from public.comprehensive_exam_attempts t
 where t.user_id=p_student_id and t.school_id=v_school and t.status='active' order by t.started_at desc limit 1;
 return v_position;
end $$;
revoke all on function public.get_assigned_student_exam_live_position(uuid) from public,anon;
grant execute on function public.get_assigned_student_exam_live_position(uuid) to authenticated;
