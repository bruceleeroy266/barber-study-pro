-- COM-1D.5 — Server-authoritative communication audit-event writing
-- Audit rows are appended by private database triggers after authorized source mutations succeed.
-- Ordinary clients keep SELECT-only access (school admins only) and no INSERT/UPDATE/DELETE/TRUNCATE grants.
-- Immutable message, read-receipt, and acknowledgment rows remain their own evidence and are not duplicated here.

create schema if not exists private;

create or replace function private.audit_student_instructor_assignment()
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
      coalesce(v_actor, new.assigned_by),
      'assignment',
      new.id,
      'assignment_created',
      jsonb_build_object(
        'student_id', new.student_id,
        'instructor_id', new.instructor_id,
        'is_active', new.is_active,
        'assigned_at', new.assigned_at
      )
    );
  elsif tg_op = 'UPDATE'
    and old.is_active is true
    and new.is_active is false
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
      'assignment',
      new.id,
      'assignment_ended',
      jsonb_build_object(
        'student_id', new.student_id,
        'instructor_id', new.instructor_id,
        'assigned_at', new.assigned_at,
        'ended_at', new.ended_at
      )
    );
  end if;

  return new;
end;
$$;

create or replace function private.audit_communication_thread()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
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
      (select auth.uid()),
      'thread',
      new.id,
      'thread_archived',
      jsonb_build_object(
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

create or replace function private.audit_bulletin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_changed_fields text[];
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
      coalesce(v_actor, new.author_id),
      'bulletin',
      new.id,
      'bulletin_created',
      jsonb_build_object(
        'priority', new.priority,
        'is_pinned', new.is_pinned,
        'acknowledgment_required', new.acknowledgment_required,
        'publish_at', new.publish_at,
        'expires_at', new.expires_at
      )
    );

    return new;
  end if;

  if old.status is distinct from new.status
    and new.status = 'published'
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
      'bulletin',
      new.id,
      'bulletin_published',
      jsonb_build_object(
        'previous_status', old.status,
        'current_status', new.status,
        'publish_at', new.publish_at,
        'expires_at', new.expires_at,
        'priority', new.priority,
        'is_pinned', new.is_pinned
      )
    );
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
      'bulletin',
      new.id,
      'bulletin_archived',
      jsonb_build_object(
        'previous_status', old.status,
        'current_status', new.status
      )
    );
  end if;

  v_changed_fields := array_remove(array[
    case when old.title is distinct from new.title then 'title' end,
    case when old.body is distinct from new.body then 'body' end,
    case when old.priority is distinct from new.priority then 'priority' end,
    case when old.is_pinned is distinct from new.is_pinned then 'is_pinned' end,
    case when old.acknowledgment_required is distinct from new.acknowledgment_required then 'acknowledgment_required' end,
    case when old.publish_at is distinct from new.publish_at then 'publish_at' end,
    case when old.expires_at is distinct from new.expires_at then 'expires_at' end
  ], null);

  if coalesce(array_length(v_changed_fields, 1), 0) > 0 then
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
      'bulletin',
      new.id,
      'bulletin_updated',
      jsonb_build_object(
        'changed_fields', to_jsonb(v_changed_fields),
        'previous', jsonb_build_object(
          'priority', old.priority,
          'is_pinned', old.is_pinned,
          'acknowledgment_required', old.acknowledgment_required,
          'publish_at', old.publish_at,
          'expires_at', old.expires_at
        ),
        'current', jsonb_build_object(
          'priority', new.priority,
          'is_pinned', new.is_pinned,
          'acknowledgment_required', new.acknowledgment_required,
          'publish_at', new.publish_at,
          'expires_at', new.expires_at
        )
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.audit_student_instructor_assignment() from public, anon, authenticated;
revoke all on function private.audit_communication_thread() from public, anon, authenticated;
revoke all on function private.audit_bulletin() from public, anon, authenticated;

drop trigger if exists trg_com_audit_assignment on public.student_instructor_assignments;
create trigger trg_com_audit_assignment
after insert or update on public.student_instructor_assignments
for each row
execute function private.audit_student_instructor_assignment();

drop trigger if exists trg_com_audit_thread on public.communication_threads;
create trigger trg_com_audit_thread
after update on public.communication_threads
for each row
execute function private.audit_communication_thread();

drop trigger if exists trg_com_audit_bulletin on public.bulletins;
create trigger trg_com_audit_bulletin
after insert or update on public.bulletins
for each row
execute function private.audit_bulletin();

-- Reassert append-only client privileges. Trigger functions write as their owner;
-- ordinary anon/authenticated sessions still cannot write audit rows directly.
revoke all on table public.communication_audit_events from anon, authenticated;
grant select on table public.communication_audit_events to authenticated;
