-- ============================================================================
-- Migration: 20260805000000_extend_school_settings_phase10
-- Phase 10 Sprint 1 — School Settings Production Readiness
-- ============================================================================
-- Purpose: Extend school_settings table with columns needed for the complete
--          School Settings module. Adds structured address fields, school info,
--          and ensures RLS policies allow school_admin role.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTEND SCHOOLS TABLE (if missing columns)
-- ----------------------------------------------------------------------------

do $$
begin
  -- License and accreditation fields
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'license_number') then
    alter table public.schools add column license_number text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'accreditation') then
    alter table public.schools add column accreditation text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'schools' and column_name = 'school_type') then
    alter table public.schools add column school_type text default 'barber' check (school_type in ('barber', 'cosmetology', 'esthetics', 'nail_technology', 'instructor', 'multi_program'));
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 2. EXTEND SCHOOL_SETTINGS TABLE
-- ----------------------------------------------------------------------------

do $$
begin
  -- Add school_info JSONB column for structured school information
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'school_info') then
    alter table public.school_settings add column school_info jsonb default '{
      "licenseNumber": null,
      "accreditation": null,
      "schoolType": "barber",
      "timezone": "America/Chicago"
    }';
  end if;

  -- Add address JSONB column for structured address
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'address') then
    alter table public.school_settings add column address jsonb default '{
      "street": null,
      "city": null,
      "state": null,
      "zip": null
    }';
  end if;

  -- Add branding JSONB column if it doesn't exist (extends brand_colors)
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'branding') then
    alter table public.school_settings add column branding jsonb default '{
      "primaryColor": "#D4AF37",
      "secondaryColor": "#1F2937",
      "logoUrl": null,
      "faviconUrl": null
    }';
  end if;

  -- Add programs JSONB column for editable programs list
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'programs') then
    alter table public.school_settings add column programs jsonb default '[]';
  end if;

  -- Add student_defaults JSONB column
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'student_defaults') then
    alter table public.school_settings add column student_defaults jsonb default '{
      "passingPercentage": 70,
      "maxQuizAttempts": 3,
      "requiredAttendancePercentage": 80
    }';
  end if;

  -- Add instructor_defaults JSONB column
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'school_settings' and column_name = 'instructor_defaults') then
    alter table public.school_settings add column instructor_defaults jsonb default '{
      "canApproveHours": true,
      "canManageStudents": true,
      "canViewReports": true,
      "requireApprovalForGrades": false
    }';
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 3. UPDATE RLS POLICIES FOR SCHOOL_ADMIN ACCESS
-- ----------------------------------------------------------------------------

-- Drop existing policies
drop policy if exists "Admins can update school settings" on public.school_settings;
drop policy if exists "School members can read school settings" on public.school_settings;

-- School members can read their own school's settings (unchanged)
create policy "School members can read school settings" on public.school_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.school_id = school_settings.school_id
    )
  );

-- Admins AND school_admins can update their own school's settings
create policy "Admins and school admins can update school settings" on public.school_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'school_admin')
        and p.school_id = school_settings.school_id
    )
  );

-- ----------------------------------------------------------------------------
-- 4. UPDATE SCHOOLS TABLE RLS FOR SCHOOL_ADMIN
-- ----------------------------------------------------------------------------

-- Allow school_admin to update their own school record
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

-- ----------------------------------------------------------------------------
-- 5. INDEXES FOR NEW COLUMNS
-- ----------------------------------------------------------------------------

create index if not exists idx_school_settings_school_info on public.school_settings using gin(school_info);
create index if not exists idx_school_settings_address on public.school_settings using gin(address);
create index if not exists idx_school_settings_programs on public.school_settings using gin(programs);

-- ----------------------------------------------------------------------------
-- 6. COMMENTS FOR DOCUMENTATION
-- ----------------------------------------------------------------------------

comment on column public.school_settings.school_info is 'Structured school information: licenseNumber, accreditation, schoolType, timezone';
comment on column public.school_settings.address is 'Structured address: street, city, state, zip';
comment on column public.school_settings.branding is 'Branding configuration: primaryColor, secondaryColor, logoUrl, faviconUrl';
comment on column public.school_settings.programs is 'Array of academic programs offered by the school';
comment on column public.school_settings.student_defaults is 'Default settings for students: passingPercentage, maxQuizAttempts, requiredAttendancePercentage';
comment on column public.school_settings.instructor_defaults is 'Default permissions for instructors: canApproveHours, canManageStudents, canViewReports, requireApprovalForGrades';
