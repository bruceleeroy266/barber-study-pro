-- ADMIN-SUPPORT-ACCESS-4J: allow authenticated platform operators to read
-- canonical assignments for scoped support reporting.
-- Existing participant/school-admin SELECT policy remains unchanged.
-- This adds SELECT only; it grants no INSERT/UPDATE/DELETE permissions.
begin;

create policy "support_access_platform_admin_read_assignments"
  on public.student_instructor_assignments
  for select
  to authenticated
  using (
    public.is_platform_admin()
    or public.is_platform_super_admin()
  );

commit;
