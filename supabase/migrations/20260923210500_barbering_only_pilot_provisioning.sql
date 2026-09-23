-- Enforce Barbering-only pilot school provisioning.
-- Early-access inquiries for other programs may still exist and be approved,
-- but create_school_from_inquiry() will not provision a school for them.

create or replace function public.create_school_from_inquiry(
  p_pilot_inquiry_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_id uuid;
  v_caller_role text;
  v_caller_school_id uuid;
  v_inquiry record;
  v_school_id uuid;
  v_school_name text;
  v_contact_email text;
  v_program_type text;
begin
  v_caller_id := auth.uid();

  if v_caller_id is null then
    raise exception 'Unauthorized: no authenticated user'
      using errcode = '28000';
  end if;

  select role, school_id
    into v_caller_role, v_caller_school_id
  from public.profiles
  where id = v_caller_id;

  if not found then
    raise exception 'Unauthorized: caller profile not found'
      using errcode = '28000';
  end if;

  if v_caller_role <> 'admin' or v_caller_school_id is not null then
    raise exception 'Unauthorized: only platform administrators may create schools'
      using errcode = '28000';
  end if;

  select *
    into v_inquiry
  from public.pilot_inquiries
  where id = p_pilot_inquiry_id
  for update;

  if not found then
    raise exception 'Pilot inquiry not found: %', p_pilot_inquiry_id
      using errcode = '22023';
  end if;

  if v_inquiry.status <> 'approved' then
    raise exception 'Pilot inquiry must be approved before school creation. Current status: %', v_inquiry.status
      using errcode = '22023';
  end if;

  if v_inquiry.school_id is not null then
    return v_inquiry.school_id;
  end if;

  v_program_type := lower(trim(coalesce(v_inquiry.program_type, '')));

  if v_program_type not in ('barber', 'barbering') then
    raise exception 'Pilot provisioning is currently limited to Barbering. Unsupported program type: %',
      coalesce(v_inquiry.program_type, '(missing)')
      using errcode = '22023';
  end if;

  v_school_name := v_inquiry.school_name;
  v_contact_email := v_inquiry.email;

  insert into public.schools (
    name,
    contact_email,
    subscription_status,
    is_active,
    created_by
  ) values (
    v_school_name,
    v_contact_email,
    'trial',
    true,
    v_caller_id
  )
  returning id into v_school_id;

  insert into public.school_settings (
    school_id,
    updated_by
  ) values (
    v_school_id,
    v_caller_id
  );

  insert into public.programs (
    school_id,
    name,
    required_hours,
    required_assessments,
    required_practicals,
    is_active
  ) values (
    v_school_id,
    'Barbering',
    1500,
    0,
    0,
    true
  );

  update public.pilot_inquiries
  set
    school_id = v_school_id,
    school_created_at = now()
  where id = p_pilot_inquiry_id;

  return v_school_id;
exception
  when others then
    raise;
end;
$$;

revoke execute on function public.create_school_from_inquiry(uuid) from public;
revoke execute on function public.create_school_from_inquiry(uuid) from anon;
grant execute on function public.create_school_from_inquiry(uuid) to authenticated;
grant execute on function public.create_school_from_inquiry(uuid) to service_role;

comment on function public.create_school_from_inquiry(uuid) is
  'Transactional pilot school provisioning. Platform-admin only. Currently provisions Barbering inquiries only; all unsupported program types are rejected before any school/settings/program records are created. Concurrency-safe via SELECT ... FOR UPDATE and idempotent via pilot_inquiries.school_id.';
