-- COM-2H — Messaging audit/failure hardening
-- Adds server-authoritative audit evidence for generic private thread creation
-- and enriches archive evidence with generic participant IDs.
-- Message/read rows remain immutable evidence and are not duplicated here.

create schema if not exists private;

create or replace function private.audit_communication_thread()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
begin
  if tg_op = 'INSERT' then
    insert into public.communication_audit_events (
      school_id,
      actor_id,
      entity_type,
      entity_id,
      event_type,
      metadata
    ) values (
      new.school_id,
      coalesce(v_actor, new.created_by),
      'thread',
      new.id,
      'thread_created',
      jsonb_build_object(
        'participant_one_id', new.participant_one_id,
        'participant_two_id', new.participant_two_id,
        'student_id', new.student_id,
        'instructor_id', new.instructor_id,
        'status', new.status
      )
    );

    return new;
  end if;

  if old.status is distinct from new.status
    and new.status = 'archived'
  then
    insert into public.communication_audit_events (
      school_id,
      actor_id,
      entity_type,
      entity_id,
      event_type,
      metadata
    ) values (
      new.school_id,
      v_actor,
      'thread',
      new.id,
      'thread_archived',
      jsonb_build_object(
        'participant_one_id', new.participant_one_id,
        'participant_two_id', new.participant_two_id,
        'student_id', new.student_id,
        'instructor_id', new.instructor_id,
        'previous_status', old.status,
        'current_status', new.status
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.audit_communication_thread() from public, anon, authenticated;

drop trigger if exists trg_com_audit_thread on public.communication_threads;
create trigger trg_com_audit_thread
after insert or update on public.communication_threads
for each row
execute function private.audit_communication_thread();

-- Audit events remain append-only from ordinary clients.
revoke all on table public.communication_audit_events from anon, authenticated;
grant select on table public.communication_audit_events to authenticated;
