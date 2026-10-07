-- G7-6 — Bulletin Reliability Hardening
-- Atomic, duplicate-safe bulletin publication with current RLS authority.

alter table public.bulletins
  add column if not exists client_operation_id uuid,
  add column if not exists publish_request_hash text;

create unique index if not exists uq_bulletins_author_operation
  on public.bulletins(author_id, client_operation_id)
  where client_operation_id is not null;

grant insert (client_operation_id, publish_request_hash)
  on table public.bulletins
  to authenticated;

create or replace function public.publish_bulletin_atomic(
  p_operation_id uuid,
  p_title text,
  p_body text,
  p_priority text,
  p_is_pinned boolean,
  p_acknowledgment_required boolean,
  p_publish_at timestamptz,
  p_expires_at timestamptz,
  p_audiences jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_actor_id uuid := auth.uid();
  v_school_id uuid := public.current_user_school_id();
  v_role text := public.current_user_role();
  v_existing public.bulletins%rowtype;
  v_bulletin_id uuid;
  v_canonical_audiences jsonb;
  v_request_hash text;
begin
  if v_actor_id is null or v_school_id is null then
    raise exception using errcode='42501', message='bulletin actor unavailable';
  end if;

  if v_role not in ('instructor','admin','school_admin') then
    raise exception using errcode='42501', message='bulletin publish not authorized';
  end if;

  if not exists (
    select 1 from public.profiles actor
    where actor.id = v_actor_id
      and actor.school_id = v_school_id
      and actor.approval_status = 'approved'
      and coalesce(actor.is_disabled, false) = false
  ) then
    raise exception using errcode='42501', message='bulletin actor not eligible';
  end if;

  if p_operation_id is null then
    raise exception using errcode='22023', message='bulletin operation required';
  end if;

  if char_length(btrim(coalesce(p_title,''))) not between 1 and 160 then
    raise exception using errcode='22023', message='invalid bulletin title';
  end if;

  if char_length(btrim(coalesce(p_body,''))) not between 1 and 10000 then
    raise exception using errcode='22023', message='invalid bulletin body';
  end if;

  if p_priority not in ('normal','important','urgent') then
    raise exception using errcode='22023', message='invalid bulletin priority';
  end if;

  if p_expires_at is not null
     and p_publish_at is not null
     and p_expires_at <= p_publish_at then
    raise exception using errcode='22023', message='invalid bulletin expiration';
  end if;

  if jsonb_typeof(p_audiences) <> 'array'
     or jsonb_array_length(p_audiences) = 0 then
    raise exception using errcode='22023', message='bulletin audience required';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'audience_type', x.audience_type,
      'program_id', x.program_id,
      'student_id', x.student_id
    )
    order by x.audience_type, x.program_id::text, x.student_id::text
  )
  into v_canonical_audiences
  from (
    select distinct
      a.audience_type,
      a.program_id,
      a.student_id
    from jsonb_to_recordset(p_audiences) as a(
      audience_type text,
      program_id uuid,
      student_id uuid
    )
  ) x;

  v_request_hash := md5(
    jsonb_build_object(
      'title', btrim(p_title),
      'body', btrim(p_body),
      'priority', p_priority,
      'is_pinned', p_is_pinned,
      'acknowledgment_required', p_acknowledgment_required,
      'publish_at', p_publish_at,
      'expires_at', p_expires_at,
      'audiences', v_canonical_audiences
    )::text
  );

  select *
  into v_existing
  from public.bulletins
  where author_id = v_actor_id
    and client_operation_id = p_operation_id
  limit 1;

  if found then
    if v_existing.publish_request_hash is distinct from v_request_hash then
      raise exception using errcode='23505', message='bulletin operation payload mismatch';
    end if;
    return v_existing.id;
  end if;

  insert into public.bulletins (
    school_id,
    author_id,
    title,
    body,
    priority,
    status,
    is_pinned,
    acknowledgment_required,
    publish_at,
    expires_at,
    client_operation_id,
    publish_request_hash
  )
  values (
    v_school_id,
    v_actor_id,
    btrim(p_title),
    btrim(p_body),
    p_priority,
    'draft',
    p_is_pinned,
    p_acknowledgment_required,
    p_publish_at,
    p_expires_at,
    p_operation_id,
    v_request_hash
  )
  on conflict (author_id, client_operation_id)
    where client_operation_id is not null
  do nothing
  returning id into v_bulletin_id;

  if v_bulletin_id is null then
    select *
    into v_existing
    from public.bulletins
    where author_id = v_actor_id
      and client_operation_id = p_operation_id
    limit 1;

    if not found or v_existing.publish_request_hash is distinct from v_request_hash then
      raise exception using errcode='23505', message='bulletin operation payload mismatch';
    end if;
    return v_existing.id;
  end if;

  insert into public.bulletin_audiences (
    bulletin_id,
    school_id,
    audience_type,
    program_id,
    student_id
  )
  select distinct
    v_bulletin_id,
    v_school_id,
    a.audience_type,
    a.program_id,
    a.student_id
  from jsonb_to_recordset(p_audiences) as a(
    audience_type text,
    program_id uuid,
    student_id uuid
  );

  update public.bulletins
  set status = 'published',
      updated_at = now()
  where id = v_bulletin_id;

  return v_bulletin_id;
end;
$$;

revoke all on function public.publish_bulletin_atomic(
  uuid,text,text,text,boolean,boolean,timestamptz,timestamptz,jsonb
) from public, anon;

grant execute on function public.publish_bulletin_atomic(
  uuid,text,text,text,boolean,boolean,timestamptz,timestamptz,jsonb
) to authenticated;
