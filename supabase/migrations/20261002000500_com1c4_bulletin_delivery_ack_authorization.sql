-- COM-1C.4 — Student Bulletin Delivery + Acknowledgment Authorization
-- Scope: student bulletin visibility, audience resolution, acknowledgment insert/read.
-- Realtime, communication audit events, and UI activation remain out of scope.

-- Students/apprentices may resolve only audience rows that apply to themselves.
-- This keeps other students' direct targets and unrelated program audiences private.
create policy "bulletin audiences student delivery select"
on public.bulletin_audiences
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (select public.current_user_role()) in ('student', 'apprentice')
  and (
    audience_type = 'school'
    or (
      audience_type = 'student'
      and student_id = (select auth.uid())
    )
    or (
      audience_type = 'program'
      and program_id is not null
      and exists (
        select 1
        from public.students student_record
        join public.enrollments enrollment
          on enrollment.student_id = student_record.id
        where student_record.profile_id = (select auth.uid())
          and student_record.school_id = bulletin_audiences.school_id
          and coalesce(student_record.is_active, true) = true
          and student_record.deleted_at is null
          and enrollment.program_id = bulletin_audiences.program_id
          and coalesce(enrollment.is_active, true) = true
          and enrollment.deleted_at is null
      )
    )
  )
);

-- Students/apprentices may see only published bulletins that:
-- 1) belong to their school,
-- 2) have reached publish time,
-- 3) are not expired,
-- 4) have at least one audience row that resolves to them.
create policy "bulletins student delivery select"
on public.bulletins
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (select public.current_user_role()) in ('student', 'apprentice')
  and status = 'published'
  and (publish_at is null or publish_at <= now())
  and (expires_at is null or expires_at > now())
  and exists (
    select 1
    from public.bulletin_audiences audience
    where audience.bulletin_id = bulletins.id
      and audience.school_id = bulletins.school_id
      and (
        audience.audience_type = 'school'
        or (
          audience.audience_type = 'student'
          and audience.student_id = (select auth.uid())
        )
        or (
          audience.audience_type = 'program'
          and audience.program_id is not null
          and exists (
            select 1
            from public.students student_record
            join public.enrollments enrollment
              on enrollment.student_id = student_record.id
            where student_record.profile_id = (select auth.uid())
              and student_record.school_id = bulletins.school_id
              and coalesce(student_record.is_active, true) = true
              and student_record.deleted_at is null
              and enrollment.program_id = audience.program_id
              and coalesce(enrollment.is_active, true) = true
              and enrollment.deleted_at is null
          )
        )
      )
  )
);

-- Students/apprentices may read only their own acknowledgment rows.
create policy "bulletin acknowledgments student self select"
on public.bulletin_acknowledgments
for select
to authenticated
using (
  student_id = (select auth.uid())
  and school_id = (select public.current_user_school_id())
);

-- Bulletin managers may read acknowledgment rows only for bulletins they manage.
-- Instructors: own-authored bulletins in their school.
-- School admins/admins: same-school bulletins.
create policy "bulletin acknowledgments managers select"
on public.bulletin_acknowledgments
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and exists (
    select 1
    from public.bulletins bulletin
    where bulletin.id = bulletin_acknowledgments.bulletin_id
      and bulletin.school_id = bulletin_acknowledgments.school_id
      and (
        (
          bulletin.author_id = (select auth.uid())
          and (select public.current_user_role()) = 'instructor'
        )
        or public.is_school_admin(bulletin.school_id)
      )
  )
);

-- Acknowledgment is append-only and means "I saw this", not agreement.
-- Students/apprentices may acknowledge only their own visible bulletin,
-- only when that bulletin requires acknowledgment.
create policy "bulletin acknowledgments student insert"
on public.bulletin_acknowledgments
for insert
to authenticated
with check (
  student_id = (select auth.uid())
  and school_id = (select public.current_user_school_id())
  and (select public.current_user_role()) in ('student', 'apprentice')
  and exists (
    select 1
    from public.bulletins bulletin
    where bulletin.id = bulletin_acknowledgments.bulletin_id
      and bulletin.school_id = bulletin_acknowledgments.school_id
      and bulletin.status = 'published'
      and bulletin.acknowledgment_required = true
      and (bulletin.publish_at is null or bulletin.publish_at <= now())
      and (bulletin.expires_at is null or bulletin.expires_at > now())
      and exists (
        select 1
        from public.bulletin_audiences audience
        where audience.bulletin_id = bulletin.id
          and audience.school_id = bulletin.school_id
          and (
            audience.audience_type = 'school'
            or (
              audience.audience_type = 'student'
              and audience.student_id = (select auth.uid())
            )
            or (
              audience.audience_type = 'program'
              and audience.program_id is not null
              and exists (
                select 1
                from public.students student_record
                join public.enrollments enrollment
                  on enrollment.student_id = student_record.id
                where student_record.profile_id = (select auth.uid())
                  and student_record.school_id = bulletin.school_id
                  and coalesce(student_record.is_active, true) = true
                  and student_record.deleted_at is null
                  and enrollment.program_id = audience.program_id
                  and coalesce(enrollment.is_active, true) = true
                  and enrollment.deleted_at is null
              )
            )
          )
      )
  )
);

-- Close ordinary client access first, then grant only the operations needed.
revoke all on table public.bulletin_acknowledgments from anon, authenticated;

grant select on table public.bulletin_acknowledgments to authenticated;
grant insert (bulletin_id, school_id, student_id)
  on table public.bulletin_acknowledgments to authenticated;

-- Existing COM-1C.3 SELECT grants on bulletins and bulletin_audiences
-- are intentionally reused; new student SELECT policies narrow row visibility.
-- No UPDATE/DELETE/TRUNCATE on acknowledgments.
-- No client control over acknowledged_at.
