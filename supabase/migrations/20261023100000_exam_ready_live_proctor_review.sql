-- Restricted live proctor review: do not return correct options or keys.
-- No production application until authenticated access and audit checks pass.
create or replace function public.get_assigned_student_exam_live_review(p_student_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_school uuid; v_attempt uuid; v_items jsonb;
begin
  select school_id into v_school from public.profiles where id=auth.uid()
    and role='instructor' and approval_status='approved' and coalesce(is_disabled,false)=false;
  if v_school is null then raise exception 'Instructor access required'; end if;
  if not exists(
    select 1 from public.profiles s join public.student_instructor_assignments a
      on a.student_id=s.id and a.school_id=s.school_id
    where s.id=p_student_id and s.school_id=v_school
      and s.role in ('student','apprentice') and a.instructor_id=auth.uid()
      and a.is_active=true and a.ended_at is null
  ) then raise exception 'Student not assigned'; end if;
  select t.id into v_attempt from public.comprehensive_exam_attempts t
  where t.user_id=p_student_id and t.school_id=v_school and t.status='active'
  order by t.started_at desc limit 1;
  if v_attempt is null then return 'null'::jsonb; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'position',i.position,'domain',i.domain,'prompt',i.prompt_snapshot,
    'selectedOption',i.selected_option,
    'selectedAnswer',case lower(i.selected_option)
      when 'a' then i.option_a_snapshot when 'b' then i.option_b_snapshot
      when 'c' then i.option_c_snapshot when 'd' then i.option_d_snapshot else null end,
    'isCorrect',case when i.selected_option is null then null
      else lower(i.selected_option)=lower(i.correct_option_snapshot) end,
    'flagged',i.flagged,'answeredAt',i.answered_at
  ) order by i.position),'[]'::jsonb) into v_items
  from public.comprehensive_exam_attempt_items i where i.attempt_id=v_attempt;
  return jsonb_build_object('attemptId',v_attempt,'items',v_items);
end $$;
revoke all on function public.get_assigned_student_exam_live_review(uuid) from public,anon;
grant execute on function public.get_assigned_student_exam_live_review(uuid) to authenticated;
