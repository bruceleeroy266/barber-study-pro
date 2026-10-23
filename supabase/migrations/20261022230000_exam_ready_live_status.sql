-- Read-only instructor monitoring. Never expose live question text, answers, or keys.
create or replace function public.get_assigned_student_exam_live_status(p_student_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_school uuid; v_result jsonb;
begin
 select school_id into v_school from public.profiles
 where id=auth.uid() and role='instructor' and approval_status='approved'
 and coalesce(is_disabled,false)=false;
 if v_school is null then raise exception 'Instructor access required'; end if;
 if not exists (
 select 1 from public.profiles s join public.student_instructor_assignments a
 on a.student_id=s.id and a.school_id=s.school_id
 where s.id=p_student_id and s.school_id=v_school and s.role in ('student','apprentice')
 and a.instructor_id=auth.uid() and a.is_active=true and a.ended_at is null
 ) then raise exception 'Student not assigned'; end if;
 select jsonb_build_object('attemptId',t.id,'status',t.status,
 'startedAt',t.started_at,'expiresAt',t.expires_at,
 'remainingSeconds',greatest(0,ceil(extract(epoch from (t.expires_at-now())))::integer),
 'totalQuestions',(select count(*) from public.comprehensive_exam_attempt_items i where i.attempt_id=t.id),
 'answeredCount',(select count(*) from public.comprehensive_exam_attempt_items i where i.attempt_id=t.id and i.selected_option is not null),
 'lastAnsweredPosition',(select i.position from public.comprehensive_exam_attempt_items i
 where i.attempt_id=t.id and i.answered_at is not null order by i.answered_at desc,i.position desc limit 1))
 into v_result from public.comprehensive_exam_attempts t
 where t.user_id=p_student_id and t.school_id=v_school and t.status='active'
 order by t.started_at desc limit 1;
 return coalesce(v_result,'null'::jsonb);
end $$;
revoke all on function public.get_assigned_student_exam_live_status(uuid) from public,anon;
grant execute on function public.get_assigned_student_exam_live_status(uuid) to authenticated;
