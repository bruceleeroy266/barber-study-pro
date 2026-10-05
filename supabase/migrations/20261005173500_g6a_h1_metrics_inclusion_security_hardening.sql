-- G6-A H1 heavy-audit security hardening.
-- The school-metrics inclusion flag is an administrative reporting control.
-- Regular authenticated clients must not be able to opt themselves in/out.

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

  -- G6-A H1: school-metrics membership is controlled by authorized admin
  -- server actions, not by the learner's own profile session.
  new.include_in_school_metrics := old.include_in_school_metrics;

  return new;
end;
$$ language plpgsql;

create or replace function public.enforce_profile_metrics_default_on_insert()
returns trigger
set search_path = public, pg_temp
as $$
begin
  if current_user not in ('service_role', 'postgres', 'supabase_admin') then
    new.include_in_school_metrics := true;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_profile_metrics_default_on_insert_trigger on public.profiles;
create trigger enforce_profile_metrics_default_on_insert_trigger
  before insert on public.profiles
  for each row execute function public.enforce_profile_metrics_default_on_insert();

revoke execute on function public.enforce_profile_metrics_default_on_insert() from public;
revoke execute on function public.enforce_profile_metrics_default_on_insert() from authenticated;
revoke execute on function public.enforce_profile_metrics_default_on_insert() from anon;
grant execute on function public.enforce_profile_metrics_default_on_insert() to service_role;

comment on function public.enforce_profile_metrics_default_on_insert() is
  'G6-A H1: forces include_in_school_metrics=true for non-service-role profile inserts so learners cannot self-exclude during profile creation.';
