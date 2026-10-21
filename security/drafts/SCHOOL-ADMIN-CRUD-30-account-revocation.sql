-- SCHOOL-ADMIN-CRUD-30: DRAFT, NOT APPLIED. Validate against effective policy catalog
-- on an isolated disposable Supabase branch before moving into migrations/.
-- Any RLS policy is additive: restrictive policies AND with existing permissive grants.
-- IMPORTANT: SECURITY DEFINER reads profiles under fixed search_path to avoid recursion.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
create or replace function private.active_account()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.is_disabled is false
      and p.approval_status = 'approved'
  );
$$;
revoke all on function private.active_account() from public, anon;
grant execute on function private.active_account() to authenticated;

-- Phase 1: explicitly scoped sensitive tables. Existing permissive policies
-- must be present; validate effective pg_policies and grants first.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','students','instructors','enrollments',
    'quiz_attempts','student_progress','hour_logs','attendance_records',
    'user_management_audit_logs','school_settings'
  ] loop
    if to_regclass('public.' || t) is null then
      raise exception 'Missing table public.%', t;
    end if;
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', 'crud30_active_account', t);
    execute format(
      'create policy %I on public.%I as restrictive for all to authenticated using ((select private.active_account())) with check ((select private.active_account()))',
      'crud30_active_account', t
    );
  end loop;
end;
$$;

-- Caveat: excludes anon policies, views, RPC SECURITY DEFINER paths, tables
-- outside this list, and bypassrls/service_role. Audit before certification.
