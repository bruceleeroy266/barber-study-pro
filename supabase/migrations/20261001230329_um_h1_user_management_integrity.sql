-- UM-H1 — User Management Integrity Hardening
-- Keeps profiles.role / profiles.school_id and active student/instructor domain
-- records coherent in one PostgreSQL transaction.
--
-- The function is SECURITY INVOKER and callable only by service_role. Server
-- actions perform authorization before invoking it.

create or replace function public.reconcile_user_management_identity(
  p_user_id uuid,
  p_role text,
  p_school_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_active_id uuid;
  v_target_id uuid;
begin
  if p_role not in ('student', 'apprentice', 'instructor', 'admin', 'school_admin') then
    raise exception 'Invalid role';
  end if;

  if p_role in ('student', 'instructor') and p_school_id is null then
    raise exception '% accounts require a school assignment', p_role;
  end if;

  update public.profiles
  set role = p_role,
      school_id = p_school_id,
      updated_at = now()
  where id = p_user_id;

  if not found then
    raise exception 'User profile not found';
  end if;

  if p_role = 'student' then
    update public.instructors
    set is_active = false,
        deleted_at = coalesce(deleted_at, now()),
        updated_at = now()
    where profile_id = p_user_id
      and deleted_at is null;

    select id into v_active_id
    from public.students
    where profile_id = p_user_id
      and deleted_at is null
    order by created_at asc
    limit 1;

    select id into v_target_id
    from public.students
    where profile_id = p_user_id
      and school_id = p_school_id
    order by created_at asc
    limit 1;

    if v_active_id is not null and v_target_id is not null and v_active_id <> v_target_id then
      raise exception 'Student already has a historical domain record for the target school; manual reconciliation is required';
    end if;

    if v_active_id is not null then
      update public.students
      set school_id = p_school_id,
          is_active = true,
          deleted_at = null,
          updated_at = now()
      where id = v_active_id;
    elsif v_target_id is not null then
      update public.students
      set is_active = true,
          deleted_at = null,
          updated_at = now()
      where id = v_target_id;
      v_active_id := v_target_id;
    else
      insert into public.students (profile_id, school_id, is_active, deleted_at)
      values (p_user_id, p_school_id, true, null)
      returning id into v_active_id;
    end if;

    update public.students
    set is_active = false,
        deleted_at = coalesce(deleted_at, now()),
        updated_at = now()
    where profile_id = p_user_id
      and id <> v_active_id
      and deleted_at is null;

  elsif p_role = 'instructor' then
    update public.students
    set is_active = false,
        deleted_at = coalesce(deleted_at, now()),
        updated_at = now()
    where profile_id = p_user_id
      and deleted_at is null;

    select id into v_active_id
    from public.instructors
    where profile_id = p_user_id
      and deleted_at is null
    order by created_at asc
    limit 1;

    select id into v_target_id
    from public.instructors
    where profile_id = p_user_id
      and school_id = p_school_id
    order by created_at asc
    limit 1;

    if v_active_id is not null and v_target_id is not null and v_active_id <> v_target_id then
      raise exception 'Instructor already has a historical domain record for the target school; manual reconciliation is required';
    end if;

    if v_active_id is not null then
      update public.instructors
      set school_id = p_school_id,
          is_active = true,
          deleted_at = null,
          updated_at = now()
      where id = v_active_id;
    elsif v_target_id is not null then
      update public.instructors
      set is_active = true,
          deleted_at = null,
          updated_at = now()
      where id = v_target_id;
      v_active_id := v_target_id;
    else
      insert into public.instructors (profile_id, school_id, is_active, deleted_at)
      values (p_user_id, p_school_id, true, null)
      returning id into v_active_id;
    end if;

    update public.instructors
    set is_active = false,
        deleted_at = coalesce(deleted_at, now()),
        updated_at = now()
    where profile_id = p_user_id
      and id <> v_active_id
      and deleted_at is null;

  else
    update public.students
    set is_active = false,
        deleted_at = coalesce(deleted_at, now()),
        updated_at = now()
    where profile_id = p_user_id
      and deleted_at is null;

    update public.instructors
    set is_active = false,
        deleted_at = coalesce(deleted_at, now()),
        updated_at = now()
    where profile_id = p_user_id
      and deleted_at is null;
  end if;
end;
$$;

revoke all on function public.reconcile_user_management_identity(uuid, text, uuid) from public;
revoke all on function public.reconcile_user_management_identity(uuid, text, uuid) from anon;
revoke all on function public.reconcile_user_management_identity(uuid, text, uuid) from authenticated;
grant execute on function public.reconcile_user_management_identity(uuid, text, uuid) to service_role;
