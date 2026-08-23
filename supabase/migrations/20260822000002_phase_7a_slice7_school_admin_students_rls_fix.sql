-- ============================================================================
-- Phase 7A Slice 7 — P1 RLS Defect Correction
-- ============================================================================
--
-- Defect: The "School staff can view students" policy on public.students
-- (originally created in 20250625010000_create_core_production_tables.sql)
-- permits roles 'instructor' and 'admin' but omits 'school_admin'.
--
-- Result: A school_admin cannot read student records belonging to their own
-- school, violating the Phase 7A authorization contract.
--
-- Correction: Recreate the policy to include 'school_admin' in the permitted
-- roles. The tenant-binding condition (p.school_id = students.school_id) is
-- unchanged, so cross-school access remains denied.
--
-- ALLOW: school_admin A → students belonging to School A
-- DENY:  school_admin A → students belonging to School B
--
-- This migration is forward-only and does not modify historical migrations.
-- ============================================================================

drop policy if exists "School staff can view students" on public.students;

create policy "School staff can view students" on public.students
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('instructor', 'admin', 'school_admin')
        and p.school_id = students.school_id
    )
  );
