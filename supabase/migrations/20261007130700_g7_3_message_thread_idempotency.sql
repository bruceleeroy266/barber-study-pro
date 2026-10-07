-- G7-3 — Message + Thread Idempotency Foundation
-- Database-authoritative exactly-once message intent and concurrency-safe
-- active one-to-one thread creation. No permission expansion.

alter table public.communication_messages
  add column if not exists client_operation_id uuid;

create unique index if not exists uq_communication_messages_sender_operation
  on public.communication_messages(sender_id, client_operation_id)
  where client_operation_id is not null;

create unique index if not exists uq_communication_threads_one_active_pair
  on public.communication_threads(
    school_id,
    least(participant_one_id, participant_two_id),
    greatest(participant_one_id, participant_two_id)
  )
  where status = 'active';

-- Current runtime supplies the operation ID explicitly. Historical messages
-- may remain null because they predate Gate 7 idempotency.
grant insert (client_operation_id)
  on table public.communication_messages
  to authenticated;
