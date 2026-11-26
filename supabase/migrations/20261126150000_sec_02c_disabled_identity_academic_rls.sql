-- ASCYN-SECURITY-RELEASE-02C: enforce live, database-authoritative account
-- revocation for existing authenticated sessions on sensitive academic tables.
-- Confirmed audit gaps: ownership-only quiz/progress RLS policies ignored
-- profiles.is_disabled; is_platform_admin() checked role only.
-- Does not change privileged academic RPC EXECUTE grants or allow anon access.

create or replace function public.is_platform_admin()
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.school_id is null
      and p.is_disabled is false
      and p.approval_status = 'approved'
  );
end;
$$ language plpgsql security definer;

-- Preserve prior least-privilege EXECUTE grants; do not expose to PUBLIC/anon.
revoke execute on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated, service_role;

-- A RESTRICTIVE policy is AND-ed with all existing permissive policies,
-- preserving their school/ownership predicates. Authorization remains live,
-- so an already-issued JWT cannot bypass revocation by reusing its session.
-- Service-role server functions continue to bypass table RLS as designed.
do $$
declare
  sensitive_table text;
begin
  foreach sensitive_table in array array[
    'quiz_attempts', 'student_progress', 'missed_questions',
    'grades', 'grade_categories', 'assessments',
    'instructor_escalations', 'school_settings',
    'students', 'instructors', 'enrollments'
  ] loop
    execute format('drop policy if exists sec_02c_enabled_identity on public.%I', sensitive_table);
    execute format(
      'create policy sec_02c_enabled_identity on public.%I as restrictive for all to authenticated using (
         exists (select 1 from public.profiles actor
           where actor.id = auth.uid()
             and actor.is_disabled is false
             and actor.approval_status = ''approved'')
       ) with check (
         exists (select 1 from public.profiles actor
           where actor.id = auth.uid()
             and actor.is_disabled is false
             and actor.approval_status = ''approved'')
       )',
      sensitive_table
    );
  end loop;
end $$;
