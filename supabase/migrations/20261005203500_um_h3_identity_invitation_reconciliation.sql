-- ============================================================================
-- UM-H3.3 — Transactional profile + invitation identity reconciliation
-- ============================================================================
-- Supabase Auth is updated separately through auth.admin.updateUserById().
-- This RPC keeps the application-side profile and onboarding lifecycle in one
-- PostgreSQL transaction so a failed invitation reconciliation cannot leave
-- those two records out of sync.
--
-- Execute is restricted to service_role. Caller authorization/tenant scope is
-- enforced by the server action before this RPC is invoked.
-- ============================================================================

create or replace function public.reconcile_user_identity_profile_and_invitation(
  p_user_id uuid,
  p_expected_old_email text,
  p_new_email text,
  p_full_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_profile public.profiles%rowtype;
  v_old_email text := lower(trim(p_expected_old_email));
  v_new_email text := lower(trim(p_new_email));
  v_invitation public.school_onboarding_invitations%rowtype;
  v_conflict_id uuid;
  v_reconciled_invitation boolean := false;
  v_history jsonb;
begin
  if p_user_id is null then
    raise exception 'User id is required';
  end if;

  if coalesce(trim(p_full_name), '') = '' then
    raise exception 'Full name is required';
  end if;

  if coalesce(v_new_email, '') = '' then
    raise exception 'Email is required';
  end if;

  select *
    into v_profile
    from public.profiles
   where id = p_user_id
   for update;

  if not found then
    raise exception 'User profile not found';
  end if;

  if lower(trim(v_profile.email)) <> v_old_email then
    raise exception 'Profile email changed during identity update';
  end if;

  -- If this role/school participates in onboarding lifecycle tracking, lock the
  -- matching historical/current invitation record before changing the profile.
  if v_profile.school_id is not null
     and v_profile.role in ('school_admin', 'instructor', 'student') then

    select *
      into v_invitation
      from public.school_onboarding_invitations
     where school_id = v_profile.school_id
       and lower(trim(email)) = v_old_email
       and role = v_profile.role
     limit 1
     for update;

    if found then
      -- Do not merge two lifecycle records. A stale/pending invitation at the
      -- corrected address requires explicit administrator cleanup rather than
      -- silently destroying historical onboarding state.
      if v_new_email <> v_old_email then
        select id
          into v_conflict_id
          from public.school_onboarding_invitations
         where school_id = v_profile.school_id
           and lower(trim(email)) = v_new_email
           and role = v_profile.role
           and id <> v_invitation.id
         limit 1;

        if v_conflict_id is not null then
          raise exception 'An onboarding invitation already exists for the corrected email';
        end if;
      end if;

      -- Preserve accepted/revoked/expired/pending state exactly as-is. Record
      -- email history in metadata so accepted invitation history remains
      -- auditable even though its current identity key follows the corrected
      -- login email.
      if v_new_email <> v_old_email then
        v_history := coalesce(v_invitation.metadata->'identity_email_history', '[]'::jsonb)
          || jsonb_build_array(
               jsonb_build_object(
                 'from', v_old_email,
                 'to', v_new_email,
                 'changed_at', now()
               )
             );
      else
        v_history := coalesce(v_invitation.metadata->'identity_email_history', '[]'::jsonb);
      end if;

      update public.school_onboarding_invitations
         set email = v_new_email,
             full_name = trim(p_full_name),
             metadata = jsonb_set(
               coalesce(metadata, '{}'::jsonb),
               '{identity_email_history}',
               v_history,
               true
             )
       where id = v_invitation.id;

      v_reconciled_invitation := true;
    end if;
  end if;

  update public.profiles
     set email = v_new_email,
         full_name = trim(p_full_name)
   where id = p_user_id;

  return jsonb_build_object(
    'profile_updated', true,
    'invitation_reconciled', v_reconciled_invitation,
    'invitation_status', case when v_reconciled_invitation then v_invitation.status else null end
  );
end;
$function$;

revoke all on function public.reconcile_user_identity_profile_and_invitation(uuid, text, text, text)
  from public, anon, authenticated;

grant execute on function public.reconcile_user_identity_profile_and_invitation(uuid, text, text, text)
  to service_role;

comment on function public.reconcile_user_identity_profile_and_invitation(uuid, text, text, text) is
  'UM-H3.3 service-role-only transaction that synchronizes profiles identity fields with the matching onboarding invitation while preserving invitation lifecycle state and email history.';
