-- Migration: Create NABBA lead capture system
-- Event: NABBA 2026
-- Purpose: Secure lead capture for conference booth use

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_temperature') THEN
    CREATE TYPE lead_temperature AS ENUM ('HOT', 'WARM', 'CONTACT');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'RESPONDED', 'MEETING', 'PILOT', 'CLOSED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_role') THEN
    CREATE TYPE lead_role AS ENUM (
      'Student',
      'Instructor',
      'School Owner / Administrator',
      'Board / Regulator',
      'Industry',
      'Other'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_follow_up') THEN
    CREATE TYPE lead_follow_up AS ENUM (
      'Send Information',
      'Schedule Demo',
      'Discuss Pilot',
      'Call',
      'No Action Yet'
    );
  END IF;
END $$;

-- ============================================================================
-- LEADS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS nabba_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event identifier
  event TEXT NOT NULL DEFAULT 'NABBA 2026',

  -- Contact information
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  role lead_role NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  state TEXT,

  -- Lead qualification
  interests TEXT[] NOT NULL DEFAULT '{}',
  temperature lead_temperature NOT NULL DEFAULT 'CONTACT',
  notes TEXT,
  follow_up_action lead_follow_up NOT NULL DEFAULT 'No Action Yet',
  status lead_status NOT NULL DEFAULT 'NEW',

  -- Audit trail
  captured_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  captured_by_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_nabba_leads_event ON nabba_leads(event);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_temperature ON nabba_leads(temperature);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_status ON nabba_leads(status);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_role ON nabba_leads(role);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_captured_by ON nabba_leads(captured_by);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_created_at ON nabba_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_email ON nabba_leads(email);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_organization ON nabba_leads(organization);

-- GIN index for interests array and text search
CREATE INDEX IF NOT EXISTS idx_nabba_leads_interests ON nabba_leads USING GIN(interests);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_name_trgm ON nabba_leads USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_nabba_leads_org_trgm ON nabba_leads USING gin(organization gin_trgm_ops);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_nabba_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_nabba_leads_updated_at ON nabba_leads;
CREATE TRIGGER trg_nabba_leads_updated_at
  BEFORE UPDATE ON nabba_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_nabba_leads_updated_at();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE nabba_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and school_admins can view all leads
DROP POLICY IF EXISTS nabba_leads_select_admin ON nabba_leads;
CREATE POLICY nabba_leads_select_admin
  ON nabba_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'school_admin' OR profiles.role = 'platform_super_admin')
    )
  );

-- Policy: Admins and school_admins can insert leads
DROP POLICY IF EXISTS nabba_leads_insert_admin ON nabba_leads;
CREATE POLICY nabba_leads_insert_admin
  ON nabba_leads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'school_admin' OR profiles.role = 'platform_super_admin')
    )
  );

-- Policy: Admins and school_admins can update any lead
DROP POLICY IF EXISTS nabba_leads_update_admin ON nabba_leads;
CREATE POLICY nabba_leads_update_admin
  ON nabba_leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'school_admin' OR profiles.role = 'platform_super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'school_admin' OR profiles.role = 'platform_super_admin')
    )
  );

-- Policy: Admins and school_admins can delete leads
DROP POLICY IF EXISTS nabba_leads_delete_admin ON nabba_leads;
CREATE POLICY nabba_leads_delete_admin
  ON nabba_leads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'school_admin' OR profiles.role = 'platform_super_admin')
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE nabba_leads IS 'Lead capture records for NABBA 2026 and future events. Protected by RLS — admin access only.';
COMMENT ON COLUMN nabba_leads.captured_by IS 'UUID of the authenticated user who created this lead record.';
COMMENT ON COLUMN nabba_leads.event IS 'Event identifier, e.g. NABBA 2026. Supports multi-event lead tracking.';
