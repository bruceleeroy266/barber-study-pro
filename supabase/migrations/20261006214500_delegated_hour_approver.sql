-- Delegated hour-approver capability for selected instructors.
-- Keeps post-approval hour corrections restricted to school administrators.

alter table public.instructors
  add column if not exists can_approve_hours boolean not null default false;

comment on column public.instructors.can_approve_hours is
  'When true, this active instructor may approve or reject pending hour logs for their own school. Does not grant post-approval adjustment authority.';

create or replace function public.review_hour_log_as_authorized_approver(
  p_hour_log_id uuid,
  p_decision text,
  p_rejection_reason text default null
)
returns table (
  id uuid,
  user_id uuid,
  status text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_role text;
  v_school_id uuid;
  v_is_delegated_approver boolean := false;
begin
  if v_actor_id is null then
    raise exception 'Unauthorized';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'Invalid review decision';
  end if;

  if p_decision = 'rejected' and nullif(btrim(coalesce(p_rejection_reason, '')), '') is null then
    raise exception 'Rejection reason is required';
  end if;

  select p.role, p.school_id
    into v_actor_role, v_school_id
  from public.profiles p
  where p.id = v_actor_id;

  if v_school_id is null then
    raise exception 'School-scoped reviewer required';
  end if;

  if v_actor_role = 'instructor' then
    select exists (
      select 1
      from public.instructors i
      where i.profile_id = v_actor_id
        and i.school_id = v_school_id
        and i.is_active = true
        and i.deleted_at is null
        and i.can_approve_hours = true
    )
    into v_is_delegated_approver;
  end if;

  if not (
    public.is_school_admin(v_school_id)
    or public.is_platform_super_admin()
    or v_is_delegated_approver
  ) then
    raise exception 'Forbidden';
  end if;

  return query
  update public.hour_logs h
  set status = p_decision,
      reviewed_by = v_actor_id,
      reviewed_at = clock_timestamp(),
      rejection_reason = case
        when p_decision = 'rejected' then left(btrim(p_rejection_reason), 500)
        else null
      end
  where h.id = p_hour_log_id
    and h.school_id = v_school_id
    and h.status = 'pending'
  returning h.id, h.user_id, h.status;
end;
$$;

revoke all on function public.review_hour_log_as_authorized_approver(uuid, text, text) from public;
grant execute on function public.review_hour_log_as_authorized_approver(uuid, text, text) to authenticated;

create or replace function public.bulk_approve_hour_logs_as_authorized_approver(
  p_hour_log_ids uuid[]
)
returns table (
  id uuid,
  user_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor_id uuid := auth.uid();
  v_actor_role text;
  v_school_id uuid;
  v_is_delegated_approver boolean := false;
begin
  if v_actor_id is null then
    raise exception 'Unauthorized';
  end if;

  if coalesce(array_length(p_hour_log_ids, 1), 0) = 0 then
    return;
  end if;

  if array_length(p_hour_log_ids, 1) > 500 then
    raise exception 'Too many hour logs selected';
  end if;

  select p.role, p.school_id
    into v_actor_role, v_school_id
  from public.profiles p
  where p.id = v_actor_id;

  if v_school_id is null then
    raise exception 'School-scoped reviewer required';
  end if;

  if v_actor_role = 'instructor' then
    select exists (
      select 1
      from public.instructors i
      where i.profile_id = v_actor_id
        and i.school_id = v_school_id
        and i.is_active = true
        and i.deleted_at is null
        and i.can_approve_hours = true
    )
    into v_is_delegated_approver;
  end if;

  if not (
    public.is_school_admin(v_school_id)
    or public.is_platform_super_admin()
    or v_is_delegated_approver
  ) then
    raise exception 'Forbidden';
  end if;

  return query
  update public.hour_logs h
  set status = 'approved',
      reviewed_by = v_actor_id,
      reviewed_at = clock_timestamp(),
      rejection_reason = null
  where h.school_id = v_school_id
    and h.status = 'pending'
    and h.id = any(p_hour_log_ids)
  returning h.id, h.user_id;
end;
$$;

revoke all on function public.bulk_approve_hour_logs_as_authorized_approver(uuid[]) from public;
grant execute on function public.bulk_approve_hour_logs_as_authorized_approver(uuid[]) to authenticated;
