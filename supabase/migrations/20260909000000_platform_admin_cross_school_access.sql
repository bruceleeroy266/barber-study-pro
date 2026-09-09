-- ============================================================================
-- Migration: 20260909000000_platform_admin_cross_school_access
-- P1 Defect Correction — Platform-Admin Cross-School Access
--
-- Defect: The platform administrator (role='admin', school_id IS NULL) could
-- not read users, instructors, students, programs, enrollments, audit logs, or
-- school operational data for ANY school. /admin/users returned "No users
-- found" when a school was selected.
--
-- Root cause (combination):
--   1. RLS school-staff policies require
--        current_user_school_id() = <table>.school_id
--      For the platform admin, current_user_school_id() is NULL, and
--      NULL = anything is never true -> zero rows.
--   2. The only cross-school policies required role='platform_super_admin',
--      a role the application never assigns (not in AppRole, ACTIVE_ROLES,
--      MANAGEABLE_ROLES; blocked by the signup sanitizer).
--   3. Role-name mismatch: the application layer's platform admin is
--      role='admin' AND school_id IS NULL (see pilot-inquiries authorization),
--      while the database layer only honored 'platform_super_admin'.
--
-- Correction approach (ADDITIVE ONLY):
--   - New security-definer helper public.is_platform_admin() implementing the
--     canonical platform-admin definition: role='admin' AND school_id IS NULL.
--   - New SELECT policies on tenant/operational/audit tables so the platform
--     admin can read across schools.
--   - New INSERT/UPDATE policies on school_settings and an UPDATE policy on
--     schools so the platform admin can administer any school's configuration
--     (the /admin/school/configuration save path writes through the
--     authenticated client).
--
-- What this migration deliberately does NOT do:
--   - Does NOT drop or alter any existing school-scoped policy. Tenant
--     isolation for school_admin, school-attached admin, instructor, student,
--     and anon is unchanged.
--   - Does NOT disable RLS anywhere.
--   - Does NOT grant platform-admin write access to profiles or tenant
--     tables. Platform-admin user-management writes continue to flow through
--     service-role server actions (createServiceRoleClient), unchanged.
--   - Does NOT touch notifications: the existing notifications_admin_all
--     policy already grants role='admin' full access regardless of school.
--
-- Security invariants preserved (verified by integration tests):
--   ALLOW: platform admin (admin + NULL school) -> read any school's data
--   DENY:  school_admin A / school-attached admin A -> school B data
--   DENY:  instructor A -> school B students
--   DENY:  student -> other students' records
--   DENY:  anon -> any tenant data
-- ============================================================================

-- ============================================================================
-- 1. CANONICAL PLATFORM-ADMIN HELPER
-- ============================================================================
-- Canonical definition (authorized): role='admin' AND school_id IS NULL.
-- A school-attached 'admin' is tenant-scoped, NOT a platform admin.
-- 'platform_super_admin' remains a separate future role and is intentionally
-- NOT included here; the existing is_platform_super_admin() is untouched.

create or replace function public.is_platform_admin()
returns boolean
set search_path = public, pg_temp
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and school_id is null
  );
end;
$$ language plpgsql security definer;

revoke execute on function public.is_platform_admin() from public;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.is_platform_admin() to service_role;

-- ============================================================================
-- 2. PROFILES — platform admin read all (fixes /admin/users)
-- ============================================================================

drop policy if exists "Profiles: platform admin read all" on public.profiles;
create policy "Profiles: platform admin read all" on public.profiles
  for select to authenticated
  using (public.is_platform_admin());

-- ============================================================================
-- 3. CORE TENANT TABLES — platform admin read all
-- ============================================================================

drop policy if exists "Students: platform admin read all" on public.students;
create policy "Students: platform admin read all" on public.students
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Instructors: platform admin read all" on public.instructors;
create policy "Instructors: platform admin read all" on public.instructors
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Programs: platform admin read all" on public.programs;
create policy "Programs: platform admin read all" on public.programs
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Enrollments: platform admin read all" on public.enrollments;
create policy "Enrollments: platform admin read all" on public.enrollments
  for select to authenticated
  using (public.is_platform_admin());

-- ============================================================================
-- 4. AUDIT LOGS — platform admin read all (fixes /admin/audit oversight)
-- ============================================================================

drop policy if exists "Security logs: platform admin read all" on public.security_logs;
create policy "Security logs: platform admin read all" on public.security_logs
  for select to authenticated
  using (public.is_platform_admin());

-- ============================================================================
-- 5. SCHOOL DASHBOARD OPERATIONAL TABLES — platform admin read all
--    (required for /admin/school to render a selected school's real data)
-- ============================================================================

drop policy if exists "Attendance records: platform admin read all" on public.attendance_records;
create policy "Attendance records: platform admin read all" on public.attendance_records
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Hour logs: platform admin read all" on public.hour_logs;
create policy "Hour logs: platform admin read all" on public.hour_logs
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Quiz attempts: platform admin read all" on public.quiz_attempts;
create policy "Quiz attempts: platform admin read all" on public.quiz_attempts
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Student progress: platform admin read all" on public.student_progress;
create policy "Student progress: platform admin read all" on public.student_progress
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Grades: platform admin read all" on public.grades;
create policy "Grades: platform admin read all" on public.grades
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Grade categories: platform admin read all" on public.grade_categories;
create policy "Grade categories: platform admin read all" on public.grade_categories
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Assessments: platform admin read all" on public.assessments;
create policy "Assessments: platform admin read all" on public.assessments
  for select to authenticated
  using (public.is_platform_admin());

-- ============================================================================
-- 6. SCHOOL CONFIGURATION — platform admin read/insert/update
--    (required for /admin/school/configuration with a selected school)
-- ============================================================================

drop policy if exists "School settings: platform admin read all" on public.school_settings;
create policy "School settings: platform admin read all" on public.school_settings
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "School settings: platform admin insert" on public.school_settings;
create policy "School settings: platform admin insert" on public.school_settings
  for insert to authenticated
  with check (public.is_platform_admin());

drop policy if exists "School settings: platform admin update" on public.school_settings;
create policy "School settings: platform admin update" on public.school_settings
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Schools: platform admin update" on public.schools;
create policy "Schools: platform admin update" on public.schools
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());
