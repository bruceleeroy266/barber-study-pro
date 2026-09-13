-- ============================================================================
-- Migration: 20260913000000_repair_school_settings_phase10_drift
-- Phase 10 — Corrective repair for DEV drift
-- ============================================================================
-- Purpose: Migration 20260805000000_extend_school_settings_phase10 (#24) is
--          recorded as applied in DEV, but most of its intended effects are
--          missing (columns, indexes, policies). This corrective migration
--          restores those missing effects using the EXACT definitions from
--          the current patched #24 file.
--
-- LOCKED DECISION: school_settings.address remains TEXT (pre-existing
--          column). NO ALTER TYPE is performed. The address index uses the
--          #24 TEXT path: gin(address gin_trgm_ops).
--
-- This migration does NOT modify or delete #24, does NOT touch
-- supabase_migrations history, and does NOT re-run unrelated migrations.
-- All operations are defensive/idempotent where practical.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSION (required for gin_trgm_ops on TEXT address)
-- ----------------------------------------------------------------------------

create extension if not exists pg_trgm;

-- ----------------------------------------------------------------------------
-- 2. RESTORE MISSING SCHOOLS COLUMNS (exact definitions from #24)
-- ----------------------------------------------------------------------------

alter table public.schools add column if not exists license_number text;
alter table public.schools add column if not exists accreditation text;
alter table public.schools add column if not exists school_type text;

-- Exact default from #24 (idempotent: SET DEFAULT is safe to re-run)
alter table public.schools alter column school_type set default 'barber';

-- Exact CHECK constraint from #24, created idempotently via pg_constraint guard
-- (constraint name matches Postgres default naming used by #24's inline check)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'schools_school_type_check'
      and conrelid = 'public.schools'::regclass
  ) then
    alter table public.schools
      add constraint schools_school_type_check
      check (school_type in ('barber', 'cosmetology', 'esthetics', 'nail_technology', 'instructor', 'multi_program'));
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 3. RESTORE MISSING SCHOOL_SETTINGS COLUMNS (exact types/defaults from #24)
--    NOTE: address is intentionally NOT touched — it remains TEXT.
-- ----------------------------------------------------------------------------

alter table public.school_settings add column if not exists school_info jsonb default '{
  "licenseNumber": null,
  "accreditation": null,
  "schoolType": "barber",
  "timezone": "America/Chicago"
}';

alter table public.school_settings add column if not exists branding jsonb default '{
  "primaryColor": "#D4AF37",
  "secondaryColor": "#1F2937",
  "logoUrl": null,
  "faviconUrl": null
}';

alter table public.school_settings add column if not exists programs jsonb default '[]';

alter table public.school_settings add column if not exists student_defaults jsonb default '{
  "passingPercentage": 70,
  "maxQuizAttempts": 3,
  "requiredAttendancePercentage": 80
}';

alter table public.school_settings add column if not exists instructor_defaults jsonb default '{
  "canApproveHours": true,
  "canManageStudents": true,
  "canViewReports": true,
  "requireApprovalForGrades": false
}';

-- ----------------------------------------------------------------------------
-- 4. INDEXES (exact definitions from #24; address uses the #24 TEXT path)
-- ----------------------------------------------------------------------------

create index if not exists idx_school_settings_school_info on public.school_settings using gin(school_info);

create index if not exists idx_school_settings_address on public.school_settings using gin(address gin_trgm_ops);

create index if not exists idx_school_settings_programs on public.school_settings using gin(programs);

-- ----------------------------------------------------------------------------
-- 5. RLS POLICY REPAIR (exact policy definitions from #24)
-- ----------------------------------------------------------------------------

-- Drop stale admin-only policy that #24 intended to remove
drop policy if exists "Admins can update school settings" on public.school_settings;

-- Recreate the #24 replacement policy (drop first for idempotency)
drop policy if exists "Admins and school admins can update school settings" on public.school_settings;
create policy "Admins and school admins can update school settings" on public.school_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'school_admin')
        and p.school_id = school_settings.school_id
    )
  );

-- Recreate the #24 schools policy (drop first for idempotency)
drop policy if exists "School admins can update own school" on public.schools;
create policy "School admins can update own school" on public.schools
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'school_admin')
        and p.school_id = schools.id
    )
  );

-- "School members can read school settings" already exists with the exact
-- #24 definition (verified in drift audit) and is intentionally left unchanged.

-- ----------------------------------------------------------------------------
-- 6. COLUMN COMMENTS FOR RESTORED COLUMNS (exact comment text from #24)
-- ----------------------------------------------------------------------------

comment on column public.school_settings.school_info is 'Structured school information: licenseNumber, accreditation, schoolType, timezone';
comment on column public.school_settings.branding is 'Branding configuration: primaryColor, secondaryColor, logoUrl, faviconUrl';
comment on column public.school_settings.programs is 'Array of academic programs offered by the school';
comment on column public.school_settings.student_defaults is 'Default settings for students: passingPercentage, maxQuizAttempts, requiredAttendancePercentage';
comment on column public.school_settings.instructor_defaults is 'Default permissions for instructors: canApproveHours, canManageStudents, canViewReports, requireApprovalForGrades';
