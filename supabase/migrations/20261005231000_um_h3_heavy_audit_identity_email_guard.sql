-- UM-H3 heavy-audit hardening.
-- The profile email mirrors the authoritative Supabase Auth login email.
-- Regular authenticated/anonymous clients must not be able to drift this
-- column away from Auth; identity changes must go through the audited
-- admin server action + service-role reconciliation flow.

create or replace function public.enforce_profile_protected_columns()
returns trigger
set search_path = public, pg_temp
as $$
begin
  if current_user in ('service_role', 'postgres', 'supabase_admin') then
    return new;
  end if;

  new.school_id := old.school_id;
  new.role := old.role;
  new.approval_status := old.approval_status;
  new.is_disabled := old.is_disabled;
  new.approved_by := old.approved_by;
  new.approved_at := old.approved_at;
  new.include_in_school_metrics := old.include_in_school_metrics;

  -- UM-H3 heavy audit: profile email is an identity/security field, not a
  -- self-service profile field. Keeping this immutable for ordinary clients
  -- prevents Auth/profile drift and bypass of the audited identity workflow.
  new.email := old.email;

  return new;
end;
$$ language plpgsql;

revoke execute on function public.enforce_profile_protected_columns() from public;
revoke execute on function public.enforce_profile_protected_columns() from authenticated;
revoke execute on function public.enforce_profile_protected_columns() from anon;
grant execute on function public.enforce_profile_protected_columns() to service_role;

comment on function public.enforce_profile_protected_columns() is
  'Tenant and identity boundary trigger. Non-service roles cannot alter school_id, role, approval_status, is_disabled, approval provenance, school-metrics inclusion, or profile email. Identity email changes must use the audited service-role UM-H3 flow.';
