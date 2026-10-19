-- 20261017120000_restrict_maintenance_mode_admin_write.sql
-- ASCYN-SECURITY-1C: Restrict global maintenance_mode writes to platform-level admins.
-- Evidence (2026-10-17 catalog review): maintenance_mode_admin_write used a bare
-- profiles.role='admin' check — any school-attached admin could modify the
-- platform-global maintenance mode, while platform_super_admin could not.

begin;

drop policy if exists maintenance_mode_admin_write on public.maintenance_mode;

create policy maintenance_mode_admin_write
  on public.maintenance_mode
  for all
  to authenticated
  using (
    public.is_platform_admin()
    or public.is_platform_super_admin()
  )
  with check (
    public.is_platform_admin()
    or public.is_platform_super_admin()
  );

commit;
