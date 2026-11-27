-- ASCYN-SECURITY-RELEASE-02B
-- Fail closed for disabled staff using an otherwise valid session.
-- This migration deliberately preserves existing staff/school role boundaries,
-- SECURITY DEFINER ownership, and all currently restricted RPC EXECUTE grants.

create or replace function public.is_school_staff(target_school_id uuid)
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.school_id = target_school_id
      and p.role in ('instructor', 'admin', 'school_admin')
      and p.is_disabled is false
      and p.approval_status = 'approved'
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_school_admin(target_school_id uuid)
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.school_id = target_school_id
      and p.role in ('admin', 'school_admin')
      and p.is_disabled is false
      and p.approval_status = 'approved'
  );
end;
$$ language plpgsql security definer;

-- The older direct school_settings policy did not call the staff helper;
-- prevent a disabled school administrator from changing local school settings.
drop policy if exists "Admins and school admins can update school settings" on public.school_settings;
create policy "Admins and school admins can update school settings"
on public.school_settings for all to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'school_admin')
      and p.school_id = school_settings.school_id
      and p.is_disabled is false
      and p.approval_status = 'approved'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'school_admin')
      and p.school_id = school_settings.school_id
      and p.is_disabled is false
      and p.approval_status = 'approved'
  )
);

-- Prior EXECUTE role grants are retained by CREATE OR REPLACE.
-- No anonymous, authenticated, or public grants are added.
