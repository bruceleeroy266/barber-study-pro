-- COM-1C.2 — Message + Read-Receipt Authorization
-- Scope: communication_messages and communication_message_reads only.
-- Requires COM-1C.1/1A assignment + thread authorization foundation.
-- No bulletin, acknowledgment, realtime, or UI activation in this slice.

create policy "communication messages participants select"
on public.communication_messages
for select
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and exists (
    select 1
    from public.communication_threads thread
    where thread.id = communication_messages.thread_id
      and thread.school_id = communication_messages.school_id
      and (
        thread.student_id = (select auth.uid())
        or thread.instructor_id = (select auth.uid())
      )
  )
);

create policy "communication messages participants insert"
on public.communication_messages
for insert
to authenticated
with check (
  school_id = (select public.current_user_school_id())
  and sender_id = (select auth.uid())
  and exists (
    select 1
    from public.communication_threads thread
    where thread.id = communication_messages.thread_id
      and thread.school_id = communication_messages.school_id
      and thread.status = 'active'
      and (
        thread.student_id = (select auth.uid())
        or thread.instructor_id = (select auth.uid())
      )
      and exists (
        select 1
        from public.student_instructor_assignments assignment
        where assignment.school_id = thread.school_id
          and assignment.student_id = thread.student_id
          and assignment.instructor_id = thread.instructor_id
          and assignment.is_active = true
          and assignment.ended_at is null
      )
  )
);

create policy "communication message reads participants select"
on public.communication_message_reads
for select
to authenticated
using (
  exists (
    select 1
    from public.communication_messages message
    join public.communication_threads thread
      on thread.id = message.thread_id
     and thread.school_id = message.school_id
    where message.id = communication_message_reads.message_id
      and thread.school_id = (select public.current_user_school_id())
      and (
        thread.student_id = (select auth.uid())
        or thread.instructor_id = (select auth.uid())
      )
  )
);

create policy "communication message reads recipient insert"
on public.communication_message_reads
for insert
to authenticated
with check (
  reader_id = (select auth.uid())
  and exists (
    select 1
    from public.communication_messages message
    join public.communication_threads thread
      on thread.id = message.thread_id
     and thread.school_id = message.school_id
    where message.id = communication_message_reads.message_id
      and thread.school_id = (select public.current_user_school_id())
      and (
        (
          thread.student_id = (select auth.uid())
          and message.sender_id = thread.instructor_id
        )
        or
        (
          thread.instructor_id = (select auth.uid())
          and message.sender_id = thread.student_id
        )
      )
  )
);

-- Explicit ordinary-client permissions.
-- Message evidence and read receipts remain immutable/append-only in V1.
revoke all on table public.communication_messages from anon, authenticated;
revoke all on table public.communication_message_reads from anon, authenticated;

grant select on table public.communication_messages to authenticated;
grant insert (thread_id, school_id, sender_id, body)
  on table public.communication_messages to authenticated;

grant select on table public.communication_message_reads to authenticated;
grant insert (message_id, reader_id)
  on table public.communication_message_reads to authenticated;
