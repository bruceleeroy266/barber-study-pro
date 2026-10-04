-- COM-2 Heavy Adversarial Audit — archive authorization repair
-- Real regression found: communication_threads UPDATE RLS allowed any participant
-- to update status directly even though the production runtime restricts archive
-- to instructors. Enforce the same rule at the database boundary.

drop policy if exists "communication threads participants update"
  on public.communication_threads;

create policy "communication threads instructor archive update"
on public.communication_threads
for update
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (
    participant_one_id = (select auth.uid())
    or participant_two_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.profiles actor
    where actor.id = (select auth.uid())
      and actor.school_id = communication_threads.school_id
      and actor.role = 'instructor'
      and actor.approval_status = 'approved'
      and coalesce(actor.is_disabled, false) = false
  )
)
with check (
  school_id = (select public.current_user_school_id())
  and (
    participant_one_id = (select auth.uid())
    or participant_two_id = (select auth.uid())
  )
  and status = 'archived'
  and exists (
    select 1
    from public.profiles actor
    where actor.id = (select auth.uid())
      and actor.school_id = communication_threads.school_id
      and actor.role = 'instructor'
      and actor.approval_status = 'approved'
      and coalesce(actor.is_disabled, false) = false
  )
);

-- Preserve least-privilege update surface.
revoke update on table public.communication_threads from authenticated;
grant update (status, updated_at)
  on table public.communication_threads to authenticated;
