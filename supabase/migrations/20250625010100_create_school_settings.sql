-- ============================================================================
-- Migration: 20250625010100_create_school_settings
-- Phase 13A — School Settings Foundation
-- Supports the School Configuration workspace from Phase 12B.
-- ============================================================================

-- ============================================================================
-- 1. SCHOOL_SETTINGS TABLE
-- ============================================================================

create table if not exists public.school_settings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null unique references public.schools(id) on delete cascade,

  -- Raw settings blob (used by Phase 12B School Configuration workspace)
  settings jsonb default '{}',

  -- Branding & identity
  name text,
  logo_url text,
  favicon_url text,
  brand_colors jsonb default '{"primary": "#D4AF37", "secondary": "#1F2937", "accent": "#3B82F6"}',

  -- Contact & location
  contact_email text,
  contact_phone text,
  address text,
  city text,
  state text,
  postal_code text,
  website text,
  timezone text default 'America/Chicago',

  -- Attendance defaults (matches Phase 12 config)
  attendance_defaults jsonb default '{
    "targetAttendancePercentage": 80,
    "autoExcuseLimit": 3,
    "tardyThresholdMinutes": 10,
    "trackClockEvents": true
  }',

  -- Hours policy defaults
  hours_defaults jsonb default '{
    "requiredHours": 1500,
    "categories": ["Theory", "Practical", "Clinic", "Sanitation", "Other"],
    "requireInstructorApproval": true
  }',

  -- Gradebook defaults
  gradebook_defaults jsonb default '{
    "passingPercentage": 70,
    "gradingScale": "percentage"
  }',

  -- Assessment defaults
  assessment_defaults jsonb default '{
    "passingPercentage": 70,
    "defaultRubricId": null,
    "allowedTypes": ["HAIRCUT", "COLOR", "CHEMICAL", "SANITATION", "CONSULTATION"]
  }',

  -- Messaging preferences
  messaging_preferences jsonb default '{
    "allowStudentToStudent": false,
    "requireModeration": false,
    "autoReplyEnabled": false
  }',

  -- Notification preferences
  notification_preferences jsonb default '[
    {"type": "attendance_alert", "enabled": true, "priority": "high"},
    {"type": "attendance_risk", "enabled": true, "priority": "high"},
    {"type": "board_readiness", "enabled": true, "priority": "medium"},
    {"type": "missing_hours", "enabled": true, "priority": "medium"},
    {"type": "upcoming_exam", "enabled": true, "priority": "low"}
  ]',

  -- Metadata
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id) on delete set null
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

create index if not exists idx_school_settings_school_id on public.school_settings(school_id);
create index if not exists idx_school_settings_updated_by on public.school_settings(updated_by);

-- ============================================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================================

alter table public.school_settings enable row level security;

-- School members can read their own school's settings.
drop policy if exists "School members can read school settings" on public.school_settings;
create policy "School members can read school settings" on public.school_settings
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.school_id = school_settings.school_id
    )
  );

-- Admins can update their own school's settings.
drop policy if exists "Admins can update school settings" on public.school_settings;
create policy "Admins can update school settings" on public.school_settings
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.school_id = school_settings.school_id
    )
  );

-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

drop trigger if exists update_school_settings_updated_at on public.school_settings;
create trigger update_school_settings_updated_at
  before update on public.school_settings
  for each row execute function public.update_updated_at_column();
