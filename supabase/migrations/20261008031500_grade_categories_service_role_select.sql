-- Fix platform-admin support reads for grade categories.
--
-- SchoolDashboard uses a service-role client only after the parent route has
-- validated the platform admin and selected active school. grade_categories
-- had SELECT for authenticated but not service_role, so that otherwise-valid
-- support view surfaced "Failed to load grade categories".
--
-- Add only the missing read grant. No RLS policies or tenant data are changed.

grant select on table public.grade_categories to service_role;
