-- EXAM-READY-MERGE-3: instructor-only, assigned-student, read-only results.
-- Draft migration: do not apply to production without authenticated School A/B tests.
create or replace function public.get_assigned_student_comprehensive_exam_results(p_student_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_school uuid;
  v_results jsonb;
begin
  if v_caller is null then
    raise exception 'Authentication required';
  end if;
  select school_id into v_school
  from public.profiles
  where id = v_caller
    and role = 'instructor'
    and coalesce(is_disabled, false) = false
    and approval_status = 'approved';
  if v_school is null then
    raise exception 'Instructor access required';
  end if;

  if not exists (
    select 1
    from public.profiles s
    join public.student_instructor_assignments a
      on a.student_id = s.id
     and a.school_id = s.school_id
    where s.id = p_student_id
      and s.school_id = v_school
      and s.role in ('student', 'apprentice')
      and a.instructor_id = v_caller
      and a.is_active = true
      and a.ended_at is null
  ) then
    raise exception 'Student not assigned';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'attemptId', t.id,
    'attemptNumber', t.attempt_number,
    'status', t.status,
    'completedAt', t.completed_at,
    'scoredCorrect', t.scored_correct,
    'scoredTotal', t.scored_total,
    'percentage', t.percentage,
    'passed', t.passed,
    'domainBreakdown', t.domain_breakdown,
    'scoringPolicyVersion', t.scoring_policy_version
  ) order by t.started_at desc), '[]'::jsonb)
  into v_results
  from public.comprehensive_exam_attempts t
  where t.user_id = p_student_id
    and t.school_id = v_school
    and t.status in ('completed', 'expired', 'recovered_finalized');
  return v_results;
end;
$$;

revoke all on function public.get_assigned_student_comprehensive_exam_results(uuid) from public, anon;
grant execute on function public.get_assigned_student_comprehensive_exam_results(uuid) to authenticated;
