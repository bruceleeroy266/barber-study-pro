-- COM-1C.1A — Authorization hardening after production verification
-- Fixes:
-- 1) same-school role validation must compare profile school_id to the assignment row's school_id
-- 2) authenticated role needs explicit least-privilege grants for the RLS policies to be usable
-- 3) column-level UPDATE grants prevent participant identity fields from being rewritten
--
-- Scope remains assignment + private thread authorization only.

drop policy if exists "communication assignments school admin insert"
  on public.student_instructor_assignments;

drop policy if exists "communication assignments school admin update"
  on public.student_instructor_assignments;

drop policy if exists "communication threads participants update"
  on public.communication_threads;

create policy "communication assignments school admin insert"
on public.student_instructor_assignments
for insert
to authenticated
with check (
  school_id = (select public.current_user_school_id())
  and public.is_school_admin(school_id)
  and assigned_by = (select auth.uid())
  and student_id <> instructor_id
  and exists (
    select 1
    from public.profiles student_profile
    where student_profile.id = student_instructor_assignments.student_id
      and student_profile.school_id = student_instructor_assignments.school_id
      and student_profile.role in ('student', 'apprentice')
  )
  and exists (
    select 1
    from public.profiles instructor_profile
    where instructor_profile.id = student_instructor_assignments.instructor_id
      and instructor_profile.school_id = student_instructor_assignments.school_id
      and instructor_profile.role = 'instructor'
  )
);

create policy "communication assignments school admin update"
on public.student_instructor_assignments
for update
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and public.is_school_admin(school_id)
)
with check (
  school_id = (select public.current_user_school_id())
  and public.is_school_admin(school_id)
  and student_id <> instructor_id
  and exists (
    select 1
    from public.profiles student_profile
    where student_profile.id = student_instructor_assignments.student_id
      and student_profile.school_id = student_instructor_assignments.school_id
      and student_profile.role in ('student', 'apprentice')
  )
  and exists (
    select 1
    from public.profiles instructor_profile
    where instructor_profile.id = student_instructor_assignments.instructor_id
      and instructor_profile.school_id = student_instructor_assignments.school_id
      and instructor_profile.role = 'instructor'
  )
);

create policy "communication threads participants update"
on public.communication_threads
for update
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (student_id = (select auth.uid()) or instructor_id = (select auth.uid()))
)
with check (
  school_id = (select public.current_user_school_id())
  and (student_id = (select auth.uid()) or instructor_id = (select auth.uid()))
);

-- Explicitly close all ordinary client access first.
revoke all on table public.student_instructor_assignments from anon, authenticated;
revoke all on table public.communication_threads from anon, authenticated;

-- Assignment access:
-- participants/admins may SELECT according to RLS;
-- school admins may INSERT assignments according to RLS;
-- lifecycle-only updates prevent changing school/student/instructor/creator identity.
grant select on table public.student_instructor_assignments to authenticated;
grant insert (school_id, student_id, instructor_id, assigned_by)
  on table public.student_instructor_assignments to authenticated;
grant update (is_active, ended_at, updated_at)
  on table public.student_instructor_assignments to authenticated;

-- Thread access:
-- participants may SELECT/INSERT according to RLS;
-- UPDATE is restricted to archive/status metadata only.
grant select on table public.communication_threads to authenticated;
grant insert (school_id, student_id, instructor_id, subject, status, created_by)
  on table public.communication_threads to authenticated;
grant update (status, updated_at)
  on table public.communication_threads to authenticated;
