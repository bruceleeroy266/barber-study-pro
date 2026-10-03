-- ADM-1C — Service-role privileges for canonical student/instructor assignments
--
-- Server-side admin assignment actions use the Supabase service-role client.
-- RLS bypass does not replace PostgreSQL table privileges, so service_role must
-- have explicit access to the assignment table. Keep this grant intentionally
-- narrower than full table ownership: read assignment rows, create assignments,
-- and end/reassign them through lifecycle columns only.

revoke all on table public.student_instructor_assignments from service_role;

grant select
  on table public.student_instructor_assignments
  to service_role;

grant insert (school_id, student_id, instructor_id, assigned_by)
  on table public.student_instructor_assignments
  to service_role;

grant update (is_active, ended_at, updated_at)
  on table public.student_instructor_assignments
  to service_role;
