-- G7-4 — Read / Unread Convergence Hardening
-- Canonical unread-count snapshot using persisted messages + read receipts.
-- SECURITY INVOKER preserves the existing RLS boundary.

create or replace function public.communication_unread_counts()
returns table (
  thread_id uuid,
  unread_count bigint
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    thread.id as thread_id,
    count(message.id) filter (
      where message.id is not null
        and read_receipt.message_id is null
    )::bigint as unread_count
  from public.communication_threads thread
  left join public.communication_messages message
    on message.thread_id = thread.id
   and message.school_id = thread.school_id
   and message.sender_id <> auth.uid()
  left join public.communication_message_reads read_receipt
    on read_receipt.message_id = message.id
   and read_receipt.reader_id = auth.uid()
  where thread.school_id = public.current_user_school_id()
    and (
      thread.participant_one_id = auth.uid()
      or thread.participant_two_id = auth.uid()
    )
  group by thread.id;
$$;

revoke all on function public.communication_unread_counts()
  from public, anon;
grant execute on function public.communication_unread_counts()
  to authenticated;
