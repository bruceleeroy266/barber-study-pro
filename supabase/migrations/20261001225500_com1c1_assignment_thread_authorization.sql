-- COM-1C.1 — Communication Assignment + Thread Authorization
-- Scope: first authorization slice only.
-- No message, bulletin, acknowledgment, or audit policies are opened here.

-- Assignment visibility: participants can see their own assignment history;
-- school admins/admins can manage assignments only inside their school.

create policy "communication assignments participants select"
on public.student_instructor_assignments
for select
to authenticated
using (
  school_id = public.current_user_school_id()
  and (
    student_id = auth.uid()
    or instructor_id = auth.uid()
    or public.is_school_admin(school_id)
  )
);

create policy "communication assignments school admin insert"
on public.student_instructor_assignments
for insert
to authenticated
with check (
  school_id = public.current_user_school_id()
  and public.is_school_admin(school_id)
  and assigned_by = auth.uid()
  and student_id <> instructor_id
  and exists (
    select 1
    from public.profiles student_profile
    where student_profile.id = student_id
      and student_profile.school_id = school_id
      and student_profile.role in ('student', 'apprentice')
  )
  and exists (
    select 1
    from public.profiles instructor_profile
    where instructor_profile.id = instructor_id
      and instructor_profile.school_id = school_id
      and instructor_profile.role = 'instructor'
  )
);

create policy "communication assignments school admin update"
on public.student_instructor_assignments
for update
to authenticated
using (
  school_id = public.current_user_school_id()
  and public.is_school_admin(school_id)
)
with check (
  school_id = public.current_user_school_id()
  and public.is_school_admin(school_id)
  and student_id <> instructor_id
  and exists (
    select 1
    from public.profiles student_profile
    where student_profile.id = student_id
      and student_profile.school_id = school_id
      and student_profile.role in ('student', 'apprentice')
  )
  and exists (
    select 1
    from public.profiles instructor_profile
    where instructor_profile.id = instructor_id
      and instructor_profile.school_id = school_id
      and instructor_profile.role = 'instructor'
  )
);

-- No DELETE policy: assignment history is retained.

-- Private thread visibility is limited to the two participants.
-- Historical thread reads remain available to those participants after reassignment.
create policy "communication threads participants select"
on public.communication_threads
for select
to authenticated
using (
  school_id = public.current_user_school_id()
  and (student_id = auth.uid() or instructor_id = auth.uid())
);

-- A new thread may only be created by one of the two participants while
-- an active assignment exists for the same school/student/instructor tuple.
create policy "communication threads participants insert"
on public.communication_threads
for insert
to authenticated
with check (
  school_id = public.current_user_school_id()
  and created_by = auth.uid()
  and (student_id = auth.uid() or instructor_id = auth.uid())
  and exists (
    select 1
    from public.student_instructor_assignments assignment
    where assignment.school_id = communication_threads.school_id
      and assignment.student_id = communication_threads.student_id
      and assignment.instructor_id = communication_threads.instructor_id
      and assignment.is_active = true
      and assignment.ended_at is null
  )
);

-- V1 allows participants to archive a thread but not rewrite its identities.
-- Column immutability will be enforced by server write paths / later hardening;
-- this policy only permits updates by participants within their school.
create policy "communication threads participants update"
on public.communication_threads
for update
to authenticated
using (
  school_id = public.current_user_school_id()
  and (student_id = auth.uid() or instructor_id = auth.uid())
)
with check (
  school_id = public.current_user_school_id()
  and (student_id = auth.uid() or instructor_id = auth.uid())
);

-- No DELETE policy: private thread history is retained.
