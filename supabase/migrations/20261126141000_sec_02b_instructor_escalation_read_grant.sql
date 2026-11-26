-- ASCYN-SECURITY-RELEASE-02B-1
-- Exact-head local HTTP regression demonstrated SQLSTATE 42501 on
-- public.instructor_escalations for an authenticated instructor.
-- Existing SELECT RLS policies already scope students to their own rows,
-- school staff to their school, and platform administrators appropriately.
-- A table-level SELECT grant is required before those policies are evaluated.
--
-- This is read-only access. Never grant INSERT/UPDATE/DELETE or anon access.
-- Existing migration 20260930223000 explicitly revoked mutation privileges.

grant select on table public.instructor_escalations to authenticated;

revoke insert, update, delete on table public.instructor_escalations from authenticated;
revoke all on table public.instructor_escalations from anon;

comment on table public.instructor_escalations is
  'Instructor escalation evidence: authenticated SELECT is filtered by existing student and school-staff RLS; mutation remains server-authoritative.';
