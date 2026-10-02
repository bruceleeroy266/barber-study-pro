-- COM-1D.4 production hardening:
-- break bulletin <-> bulletin_audiences RLS recursion using a private helper.

create schema if not exists private;

create or replace function private.can_current_user_receive_bulletin(
  p_bulletin_id uuid,
  p_school_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.bulletin_audiences audience
    where audience.bulletin_id = p_bulletin_id
      and audience.school_id = p_school_id
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
              and student_record.school_id = p_school_id
              and coalesce(student_record.is_active, true) = true
              and student_record.deleted_at is null
              and enrollment.program_id = audience.program_id
              and coalesce(enrollment.is_active, true) = true
              and enrollment.deleted_at is null
          )
        )
      )
  );
$$;

revoke all on function private.can_current_user_receive_bulletin(uuid, uuid) from public;
revoke all on function private.can_current_user_receive_bulletin(uuid, uuid) from anon;
grant usage on schema private to authenticated;
grant execute on function private.can_current_user_receive_bulletin(uuid, uuid) to authenticated;

drop policy if exists "bulletins student delivery select" on public.bulletins;

create policy "bulletins student delivery select"
on public.bulletins
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (select public.current_user_role()) = any (
    array['student'::text, 'apprentice'::text]
  )
  and status = 'published'
  and (publish_at is null or publish_at <= now())
  and (expires_at is null or expires_at > now())
  and (select private.can_current_user_receive_bulletin(id, school_id))
);
