-- QA ONLY until security + academic review. Keys restricted to authorized instructor
-- and questions in completed assigned-student attempts (never active attempts).
create or replace function public.get_assigned_student_exam_coaching(p_student_id uuid, p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_caller uuid := auth.uid(); v_school uuid; v_result jsonb;
begin
  select school_id into v_school from public.profiles where id=v_caller
    and role='instructor' and approval_status='approved'
    and coalesce(is_disabled,false)=false;
  if v_school is null then raise exception 'Instructor access required'; end if;
  if not exists (
    select 1 from public.profiles s join public.student_instructor_assignments a
      on a.student_id=s.id and a.school_id=s.school_id
    where s.id=p_student_id and s.school_id=v_school and s.role in ('student','apprentice')
      and a.instructor_id=v_caller and a.is_active=true and a.ended_at is null
  ) then raise exception 'Student not assigned'; end if;
  if not exists (
    select 1 from public.comprehensive_exam_attempts t
    where t.id=p_attempt_id and t.user_id=p_student_id and t.school_id=v_school
      and t.status in ('completed','expired','recovered_finalized')
      and t.completed_at is not null
  ) then raise exception 'Completed attempt unavailable'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'position',i.position,'domain',i.domain,'prompt',i.prompt_snapshot,
    'options',jsonb_build_object('a',i.option_a_snapshot,'b',i.option_b_snapshot,
      'c',i.option_c_snapshot,'d',i.option_d_snapshot),
    'correctOption',i.correct_option_snapshot,'selectedOption',i.selected_option,
    'explanation',i.explanation_snapshot,'isScored',i.is_scored
  ) order by i.position),'[]'::jsonb) into v_result
  from public.comprehensive_exam_attempt_items i where i.attempt_id=p_attempt_id;
  return v_result;
end $$;
revoke all on function public.get_assigned_student_exam_coaching(uuid,uuid) from public,anon;
grant execute on function public.get_assigned_student_exam_coaching(uuid,uuid) to authenticated;
