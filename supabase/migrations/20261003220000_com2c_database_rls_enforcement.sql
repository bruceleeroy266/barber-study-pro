-- COM-2C — Database / RLS Enforcement
-- Expands private-message thread authorization from the original
-- student/instructor-only tuple to a generic two-participant model while
-- preserving all existing COM-1 rows and runtime inserts.
--
-- Scope:
-- - generic participant identities
-- - canonical pair authorization helper
-- - thread/message/read RLS parity with COM-2A/2B
-- - least-privilege grants
-- No UI/runtime recipient picker changes in this slice.

-- ---------------------------------------------------------------------------
-- 1. Backward-compatible generic participants
-- ---------------------------------------------------------------------------

alter table public.communication_threads
  add column if not exists participant_one_id uuid references public.profiles(id) on delete cascade,
  add column if not exists participant_two_id uuid references public.profiles(id) on delete cascade;

update public.communication_threads
set
  participant_one_id = coalesce(participant_one_id, student_id),
  participant_two_id = coalesce(participant_two_id, instructor_id)
where participant_one_id is null
   or participant_two_id is null;

-- Future admin-related threads do not necessarily have a student/instructor
-- tuple, so legacy columns become nullable. Existing rows remain populated.
alter table public.communication_threads
  alter column student_id drop not null,
  alter column instructor_id drop not null;

alter table public.communication_threads
  drop constraint if exists communication_threads_distinct_people;

alter table public.communication_threads
  drop constraint if exists communication_threads_participants_required;

alter table public.communication_threads
  add constraint communication_threads_participants_required
  check (
    participant_one_id is not null
    and participant_two_id is not null
    and participant_one_id <> participant_two_id
  );

alter table public.communication_threads
  drop constraint if exists communication_threads_legacy_pair_shape;

alter table public.communication_threads
  add constraint communication_threads_legacy_pair_shape
  check (
    (student_id is null and instructor_id is null)
    or
    (
      student_id is not null
      and instructor_id is not null
      and student_id <> instructor_id
      and (
        (participant_one_id = student_id and participant_two_id = instructor_id)
        or
        (participant_one_id = instructor_id and participant_two_id = student_id)
      )
    )
  );

create index if not exists idx_communication_threads_school_participant_one
  on public.communication_threads(school_id, participant_one_id, last_message_at desc);

create index if not exists idx_communication_threads_school_participant_two
  on public.communication_threads(school_id, participant_two_id, last_message_at desc);

create or replace function public.sync_communication_thread_participants()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  -- Existing COM-1 inserts still provide student_id + instructor_id only.
  if new.participant_one_id is null and new.student_id is not null then
    new.participant_one_id := new.student_id;
  end if;

  if new.participant_two_id is null and new.instructor_id is not null then
    new.participant_two_id := new.instructor_id;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_communication_thread_participants_trigger
  on public.communication_threads;

create trigger sync_communication_thread_participants_trigger
before insert on public.communication_threads
for each row
execute function public.sync_communication_thread_participants();

revoke all on function public.sync_communication_thread_participants() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Canonical database authorization helper
-- ---------------------------------------------------------------------------

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
  with pair as (
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
    where actor.id = p_actor_id
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
        -- Learner <-> assigned instructor
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
        -- Learner <-> same-school admin
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
        -- Instructor <-> same-school admin
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

-- ---------------------------------------------------------------------------
-- 3. Replace thread RLS with generic participant enforcement
-- ---------------------------------------------------------------------------

drop policy if exists "communication threads participants select"
  on public.communication_threads;
drop policy if exists "communication threads participants insert"
  on public.communication_threads;
drop policy if exists "communication threads participants update"
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
);

create policy "communication threads participants insert"
on public.communication_threads
for insert
to authenticated
with check (
  school_id = (select public.current_user_school_id())
  and created_by = (select auth.uid())
  and (
    participant_one_id = (select auth.uid())
    or participant_two_id = (select auth.uid())
  )
  and public.communication_pair_authorized(
    participant_one_id,
    participant_two_id,
    school_id
  )
);

create policy "communication threads participants update"
on public.communication_threads
for update
to authenticated
using (
  school_id = (select public.current_user_school_id())
  and (
    participant_one_id = (select auth.uid())
    or participant_two_id = (select auth.uid())
  )
)
with check (
  school_id = (select public.current_user_school_id())
  and (
    participant_one_id = (select auth.uid())
    or participant_two_id = (select auth.uid())
  )
);

-- ---------------------------------------------------------------------------
-- 4. Replace message/read RLS using the same canonical pair helper
-- ---------------------------------------------------------------------------

drop policy if exists "communication messages participants select"
  on public.communication_messages;
drop policy if exists "communication messages participants insert"
  on public.communication_messages;
drop policy if exists "communication message reads participants select"
  on public.communication_message_reads;
drop policy if exists "communication message reads recipient insert"
  on public.communication_message_reads;

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
        thread.participant_one_id = (select auth.uid())
        or thread.participant_two_id = (select auth.uid())
      )
      and public.communication_pair_authorized(
        thread.participant_one_id,
        thread.participant_two_id,
        thread.school_id
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
        thread.participant_one_id = (select auth.uid())
        or thread.participant_two_id = (select auth.uid())
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
      and message.sender_id <> (select auth.uid())
      and (
        thread.participant_one_id = (select auth.uid())
        or thread.participant_two_id = (select auth.uid())
      )
      and (
        message.sender_id = thread.participant_one_id
        or message.sender_id = thread.participant_two_id
      )
  )
);

-- ---------------------------------------------------------------------------
-- 5. Least-privilege grants
-- ---------------------------------------------------------------------------

revoke all on table public.communication_threads from anon, authenticated;
grant select on table public.communication_threads to authenticated;
grant insert (
  school_id,
  student_id,
  instructor_id,
  participant_one_id,
  participant_two_id,
  subject,
  status,
  created_by
) on table public.communication_threads to authenticated;
grant update (status, updated_at)
  on table public.communication_threads to authenticated;

-- Existing message/read grants remain least-privilege and are restated here
-- for deterministic migration behavior.
revoke all on table public.communication_messages from anon, authenticated;
revoke all on table public.communication_message_reads from anon, authenticated;

grant select on table public.communication_messages to authenticated;
grant insert (thread_id, school_id, sender_id, body)
  on table public.communication_messages to authenticated;

grant select on table public.communication_message_reads to authenticated;
grant insert (message_id, reader_id)
  on table public.communication_message_reads to authenticated;
