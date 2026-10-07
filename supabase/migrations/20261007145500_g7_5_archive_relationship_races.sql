-- G7-5 — Archive + Relationship-Race Hardening
-- Serializes message inserts against archive transitions and makes current
-- actor/relationship eligibility authoritative for new communication actions.

create or replace function private.enforce_communication_message_insert_race_guard()
returns trigger
language plpgsql
security invoker
set search_path = public, private, pg_temp
as $$
declare
  thread_row public.communication_threads%rowtype;
  counterpart_id uuid;
begin
  select thread.*
    into thread_row
  from public.communication_threads thread
  where thread.id = new.thread_id
  for update;

  if not found then
    raise exception using
      errcode = '42501',
      message = 'communication thread not available';
  end if;

  if thread_row.school_id <> new.school_id
     or thread_row.status <> 'active' then
    raise exception using
      errcode = '42501',
      message = 'communication thread is not sendable';
  end if;

  if auth.uid() is null
     or new.sender_id <> auth.uid()
     or (
       thread_row.participant_one_id <> auth.uid()
       and thread_row.participant_two_id <> auth.uid()
     ) then
    raise exception using
      errcode = '42501',
      message = 'communication sender is not authorized';
  end if;

  counterpart_id :=
    case
      when thread_row.participant_one_id = auth.uid()
        then thread_row.participant_two_id
      else thread_row.participant_one_id
    end;

  if not public.communication_pair_authorized(
    auth.uid(),
    counterpart_id,
    thread_row.school_id
  ) then
    raise exception using
      errcode = '42501',
      message = 'communication relationship is no longer authorized';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_communication_message_insert_race_guard()
  from public, anon, authenticated;

drop trigger if exists communication_message_insert_race_guard
  on public.communication_messages;

create trigger communication_message_insert_race_guard
before insert on public.communication_messages
for each row
execute function private.enforce_communication_message_insert_race_guard();

-- Historical rows remain preserved and readable to an otherwise eligible
-- same-school participant, but disabled/rejected stale sessions fail closed.
drop policy if exists "communication threads participants select"
  on public.communication_threads;

create policy "communication threads participants select"
on public.communication_threads
for select
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
      and actor.approval_status = 'approved'
      and coalesce(actor.is_disabled, false) = false
  )
);

drop policy if exists "communication messages participants select"
  on public.communication_messages;

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
        thread.participant_one_id = (select auth.uid())
        or thread.participant_two_id = (select auth.uid())
      )
  )
  and exists (
    select 1
    from public.profiles actor
    where actor.id = (select auth.uid())
      and actor.school_id = communication_messages.school_id
      and actor.approval_status = 'approved'
      and coalesce(actor.is_disabled, false) = false
  )
);

drop policy if exists "communication message reads participants select"
  on public.communication_message_reads;

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
    join public.profiles actor
      on actor.id = (select auth.uid())
     and actor.school_id = thread.school_id
     and actor.approval_status = 'approved'
     and coalesce(actor.is_disabled, false) = false
    where message.id = communication_message_reads.message_id
      and thread.school_id = (select public.current_user_school_id())
      and (
        thread.participant_one_id = (select auth.uid())
        or thread.participant_two_id = (select auth.uid())
      )
  )
);

-- Read receipts are new state changes, so stale assignment/eligibility may not
-- continue creating evidence after the canonical relationship ends.
drop policy if exists "communication message reads recipient insert"
  on public.communication_message_reads;

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
      and message.sender_id <> (select auth.uid())
      and (
        thread.participant_one_id = (select auth.uid())
        or thread.participant_two_id = (select auth.uid())
      )
      and (
        message.sender_id = thread.participant_one_id
        or message.sender_id = thread.participant_two_id
      )
      and public.communication_pair_authorized(
        (select auth.uid()),
        case
          when thread.participant_one_id = (select auth.uid())
            then thread.participant_two_id
          else thread.participant_one_id
        end,
        thread.school_id
      )
  )
);

-- Archive is a new state transition and must use the current canonical
-- relationship. Repeated archive requests are handled idempotently by runtime
-- without permitting a second UPDATE on an already archived row.
drop policy if exists "communication threads instructor archive update"
  on public.communication_threads;

create policy "communication threads instructor archive update"
on public.communication_threads
for update
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and status = 'active'
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
  and public.communication_pair_authorized(
    (select auth.uid()),
    case
      when participant_one_id = (select auth.uid())
        then participant_two_id
      else participant_one_id
    end,
    school_id
  )
)
with check (
  school_id = (select public.current_user_school_id())
  and status = 'archived'
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
  and public.communication_pair_authorized(
    (select auth.uid()),
    case
      when participant_one_id = (select auth.uid())
        then participant_two_id
      else participant_one_id
    end,
    school_id
  )
);
