-- ============================================================================
-- EXAM-COACHING-GATE — Technical default-deny gate for instructor coaching
--
-- Additive only: does not alter any previously applied migration.
--
-- Rationale: 20261022200000_exam_ready_instructor_coaching.sql is marked
-- "QA ONLY until security + academic review" but grants EXECUTE to
-- authenticated, so the gate was procedural (a comment). This migration makes
-- it technical:
--   * flag stored in the private schema (no application role can read/write
--     it; writes require a privileged migration or service role)
--   * flag defaults to disabled, with an explicit deny row seeded
--   * the SECURITY DEFINER coaching function checks the flag BEFORE any
--     authorization or data access, and fails closed when the flag row or
--     table is missing/unreadable
--   * all existing instructor role / school / active-assignment /
--     completed-attempt checks are preserved verbatim
--   * EXECUTE surface unchanged (authenticated) — authorization inside the
--     function is untouched; this gate controls environment availability
-- ============================================================================

-- 1. Flag store in the private schema.
create table if not exists private.deployment_flags (
  key text primary key,
  enabled boolean not null default false,
  updated_at timestamptz not null default clock_timestamp()
);

comment on table private.deployment_flags is
  'Environment-scoped feature flags. Private schema: application roles have no access; enable flags only via privileged migrations/SQL (QA opt-in). Default posture is deny.';

revoke all on private.deployment_flags from public, anon, authenticated;

-- 2. Default-deny seed row.
insert into private.deployment_flags (key, enabled)
values ('exam_coaching', false)
on conflict (key) do nothing;

-- 3. Gated coaching function (body preserved; gate added first).
create or replace function public.get_assigned_student_exam_coaching(p_student_id uuid, p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_caller uuid := auth.uid(); v_school uuid; v_result jsonb;
begin
  -- FAIL-CLOSED ENVIRONMENT GATE — evaluated before any other check and
  -- before any data access. Missing table or missing/false row => deny.
  -- Any resulting exception returns an error to the caller; no keys or
  -- explanations can be returned while the flag is absent or disabled.
  if to_regclass('private.deployment_flags') is null
     or not coalesce(
               (select enabled from private.deployment_flags where key='exam_coaching'),
               false
             ) then
    raise exception 'Coaching is not enabled in this environment';
  end if;
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
