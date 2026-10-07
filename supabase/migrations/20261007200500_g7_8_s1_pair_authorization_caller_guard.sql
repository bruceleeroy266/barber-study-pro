-- G7-8-S1 — Pair authorization caller-membership guard
-- Prevent authenticated callers from using the SECURITY DEFINER helper as a
-- cross-user relationship oracle while preserving use from thread/message RLS.

create or replace function public.communication_pair_authorized(
  p_actor_id uuid,
  p_recipient_id uuid,
  p_school_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with caller as (
    select auth.uid() as id
  ),
  pair as (
    select
      actor.id as actor_id,
      actor.role as actor_role,
      actor.school_id as actor_school_id,
      actor.approval_status as actor_approval_status,
      coalesce(actor.is_disabled, false) as actor_is_disabled,
      recipient.id as recipient_id,
      recipient.role as recipient_role,
      recipient.school_id as recipient_school_id,
      recipient.approval_status as recipient_approval_status,
      coalesce(recipient.is_disabled, false) as recipient_is_disabled
    from public.profiles actor
    join public.profiles recipient
      on recipient.id = p_recipient_id
    cross join caller
    where actor.id = p_actor_id
      and caller.id is not null
      and caller.id in (p_actor_id, p_recipient_id)
  )
  select exists (
    select 1
    from pair
    where actor_id <> recipient_id
      and actor_school_id = p_school_id
      and recipient_school_id = p_school_id
      and actor_approval_status = 'approved'
      and recipient_approval_status = 'approved'
      and actor_is_disabled = false
      and recipient_is_disabled = false
      and (
        (
          actor_role in ('student', 'apprentice')
          and recipient_role = 'instructor'
          and exists (
            select 1
            from public.student_instructor_assignments assignment
            where assignment.school_id = p_school_id
              and assignment.student_id = p_actor_id
              and assignment.instructor_id = p_recipient_id
              and assignment.is_active = true
              and assignment.ended_at is null
          )
        )
        or
        (
          actor_role = 'instructor'
          and recipient_role in ('student', 'apprentice')
          and exists (
            select 1
            from public.student_instructor_assignments assignment
            where assignment.school_id = p_school_id
              and assignment.student_id = p_recipient_id
              and assignment.instructor_id = p_actor_id
              and assignment.is_active = true
              and assignment.ended_at is null
          )
        )
        or
        (
          actor_role in ('student', 'apprentice')
          and recipient_role in ('admin', 'school_admin')
        )
        or
        (
          actor_role in ('admin', 'school_admin')
          and recipient_role in ('student', 'apprentice')
        )
        or
        (
          actor_role = 'instructor'
          and recipient_role in ('admin', 'school_admin')
        )
        or
        (
          actor_role in ('admin', 'school_admin')
          and recipient_role = 'instructor'
        )
      )
  );
$$;

revoke all on function public.communication_pair_authorized(uuid, uuid, uuid)
  from public, anon;

grant execute on function public.communication_pair_authorized(uuid, uuid, uuid)
  to authenticated;
