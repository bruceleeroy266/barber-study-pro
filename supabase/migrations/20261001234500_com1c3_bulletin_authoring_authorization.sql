-- COM-1C.3 — Bulletin Authoring + Audience Authorization
-- Scope: bulletin creation/management and audience targeting only.
-- Student bulletin delivery and acknowledgments remain closed until the next slice.

-- Bulletin management visibility:
-- - instructors may manage only bulletins they authored in their school
-- - school admins/admins may manage bulletins within their school
create policy "bulletins managers select"
on public.bulletins
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (
    (
      author_id = (select auth.uid())
      and (select public.current_user_role()) = 'instructor'
    )
    or public.is_school_admin(school_id)
  )
);

-- All direct client-created bulletins begin as drafts.
create policy "bulletins managers insert"
on public.bulletins
for insert
to authenticated
with check (
  school_id = (select public.current_user_school_id())
  and author_id = (select auth.uid())
  and status = 'draft'
  and (
    (select public.current_user_role()) = 'instructor'
    or public.is_school_admin(school_id)
  )
);

-- Managers may edit within their school.
-- Publishing requires at least one valid audience.
-- Instructors may publish only to their actively assigned students.
-- School admins/admins may publish to valid school/program/student audiences in their school.
create policy "bulletins managers update"
on public.bulletins
for update
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (
    (
      author_id = (select auth.uid())
      and (select public.current_user_role()) = 'instructor'
    )
    or public.is_school_admin(school_id)
  )
)
with check (
  school_id = (select public.current_user_school_id())
  and (
    (
      author_id = (select auth.uid())
      and (select public.current_user_role()) = 'instructor'
    )
    or public.is_school_admin(school_id)
  )
  and (
    status <> 'published'
    or (
      exists (
        select 1
        from public.bulletin_audiences audience
        where audience.bulletin_id = bulletins.id
          and audience.school_id = bulletins.school_id
      )
      and (
        (
          (select public.current_user_role()) = 'instructor'
          and not exists (
            select 1
            from public.bulletin_audiences audience
            where audience.bulletin_id = bulletins.id
              and (
                audience.school_id <> bulletins.school_id
                or audience.audience_type <> 'student'
                or audience.student_id is null
                or not exists (
                  select 1
                  from public.student_instructor_assignments assignment
                  where assignment.school_id = bulletins.school_id
                    and assignment.student_id = audience.student_id
                    and assignment.instructor_id = (select auth.uid())
                    and assignment.is_active = true
                    and assignment.ended_at is null
                )
              )
          )
        )
        or (
          public.is_school_admin(school_id)
          and not exists (
            select 1
            from public.bulletin_audiences audience
            where audience.bulletin_id = bulletins.id
              and (
                audience.school_id <> bulletins.school_id
                or (
                  audience.audience_type = 'program'
                  and not exists (
                    select 1
                    from public.programs program
                    where program.id = audience.program_id
                      and program.school_id = bulletins.school_id
                  )
                )
                or (
                  audience.audience_type = 'student'
                  and not exists (
                    select 1
                    from public.profiles student_profile
                    where student_profile.id = audience.student_id
                      and student_profile.school_id = bulletins.school_id
                      and student_profile.role in ('student', 'apprentice')
                  )
                )
              )
          )
        )
      )
    )
  )
);

-- Audience rows are visible to school admins.
-- Instructors may see only selected-student audience rows for students actively assigned to them.
-- This policy deliberately does not query bulletins, preventing circular RLS dependencies.
create policy "bulletin audiences managers select"
on public.bulletin_audiences
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (
    public.is_school_admin(school_id)
    or (
      (select public.current_user_role()) = 'instructor'
      and audience_type = 'student'
      and student_id is not null
      and exists (
        select 1
        from public.student_instructor_assignments assignment
        where assignment.school_id = bulletin_audiences.school_id
          and assignment.student_id = bulletin_audiences.student_id
          and assignment.instructor_id = (select auth.uid())
          and assignment.is_active = true
          and assignment.ended_at is null
      )
    )
  )
);

-- Audience targeting may be created only while the bulletin is still a draft.
create policy "bulletin audiences managers insert"
on public.bulletin_audiences
for insert
to authenticated
with check (
  school_id = (select public.current_user_school_id())
  and exists (
    select 1
    from public.bulletins bulletin
    where bulletin.id = bulletin_audiences.bulletin_id
      and bulletin.school_id = bulletin_audiences.school_id
      and bulletin.status = 'draft'
      and (
        (
          bulletin.author_id = (select auth.uid())
          and (select public.current_user_role()) = 'instructor'
          and bulletin_audiences.audience_type = 'student'
          and bulletin_audiences.student_id is not null
          and exists (
            select 1
            from public.student_instructor_assignments assignment
            where assignment.school_id = bulletin.school_id
              and assignment.student_id = bulletin_audiences.student_id
              and assignment.instructor_id = (select auth.uid())
              and assignment.is_active = true
              and assignment.ended_at is null
          )
        )
        or (
          public.is_school_admin(bulletin.school_id)
          and (
            bulletin_audiences.audience_type = 'school'
            or (
              bulletin_audiences.audience_type = 'program'
              and exists (
                select 1
                from public.programs program
                where program.id = bulletin_audiences.program_id
                  and program.school_id = bulletin.school_id
              )
            )
            or (
              bulletin_audiences.audience_type = 'student'
              and exists (
                select 1
                from public.profiles student_profile
                where student_profile.id = bulletin_audiences.student_id
                  and student_profile.school_id = bulletin.school_id
                  and student_profile.role in ('student', 'apprentice')
              )
            )
          )
        )
      )
  )
);

-- Draft audience rows may be removed before publication.
create policy "bulletin audiences managers delete draft"
on public.bulletin_audiences
for delete
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and exists (
    select 1
    from public.bulletins bulletin
    where bulletin.id = bulletin_audiences.bulletin_id
      and bulletin.school_id = bulletin_audiences.school_id
      and bulletin.status = 'draft'
      and (
        public.is_school_admin(bulletin.school_id)
        or (
          bulletin.author_id = (select auth.uid())
          and (select public.current_user_role()) = 'instructor'
          and bulletin_audiences.audience_type = 'student'
          and bulletin_audiences.student_id is not null
          and exists (
            select 1
            from public.student_instructor_assignments assignment
            where assignment.school_id = bulletin.school_id
              and assignment.student_id = bulletin_audiences.student_id
              and assignment.instructor_id = (select auth.uid())
              and assignment.is_active = true
              and assignment.ended_at is null
          )
        )
      )
  )
);

-- Close ordinary client access first, then grant the minimum operations needed.
revoke all on table public.bulletins from anon, authenticated;
revoke all on table public.bulletin_audiences from anon, authenticated;

grant select on table public.bulletins to authenticated;
grant insert (
  school_id,
  author_id,
  title,
  body,
  priority,
  status,
  is_pinned,
  acknowledgment_required,
  publish_at,
  expires_at
) on table public.bulletins to authenticated;
grant update (
  title,
  body,
  priority,
  status,
  is_pinned,
  acknowledgment_required,
  publish_at,
  expires_at,
  updated_at
) on table public.bulletins to authenticated;

grant select on table public.bulletin_audiences to authenticated;
grant insert (
  bulletin_id,
  school_id,
  audience_type,
  program_id,
  student_id
) on table public.bulletin_audiences to authenticated;
grant delete on table public.bulletin_audiences to authenticated;

-- No authenticated DELETE/TRUNCATE on bulletins.
-- No authenticated UPDATE/TRUNCATE on audience rows.
-- bulletin_acknowledgments remains closed in this slice.
