-- ============================================================================
-- Test Actors Seed for Phase 7A Slice 7 Integration Tests
-- Creates deterministic test identities for adversarial validation
-- ============================================================================

-- ============================================================================
-- TEST SCHOOLS
-- ============================================================================

insert into public.schools (
  id,
  name,
  slug,
  address,
  city,
  state,
  postal_code,
  contact_email,
  contact_phone,
  website,
  timezone,
  subscription_status,
  is_active,
  created_at,
  updated_at
) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Test Academy Alpha',
    'test-academy-alpha',
    '100 Test Street',
    'Oklahoma City',
    'OK',
    '73102',
    'admin@test-academy-alpha.local',
    '555-1000',
    'https://test-academy-alpha.local',
    'America/Chicago',
    'active',
    true,
    now(),
    now()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Test Academy Beta',
    'test-academy-beta',
    '200 Test Avenue',
    'Tulsa',
    'OK',
    '74103',
    'admin@test-academy-beta.local',
    '555-2000',
    'https://test-academy-beta.local',
    'America/Chicago',
    'active',
    true,
    now(),
    now()
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  updated_at = now();

-- ============================================================================
-- TEST PROGRAMS
-- ============================================================================

insert into public.programs (id, school_id, name, description, required_hours, required_assessments, required_practicals, duration_weeks, is_active, created_at, updated_at)
values
  (
    'aaaaaaaa-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Barbering Alpha',
    'Test barbering program for School A',
    1500,
    10,
    20,
    52,
    true,
    now(),
    now()
  ),
  (
    'bbbbbbbb-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Barbering Beta',
    'Test barbering program for School B',
    1500,
    10,
    20,
    52,
    true,
    now(),
    now()
  )
on conflict (id) do nothing;

-- ============================================================================
-- TEST SCHOOL SETTINGS
-- ============================================================================

insert into public.school_settings (
  school_id,
  settings,
  name,
  contact_email,
  is_active,
  created_at,
  updated_at
) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '{}',
    'Test Academy Alpha',
    'admin@test-academy-alpha.local',
    true,
    now(),
    now()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '{}',
    'Test Academy Beta',
    'admin@test-academy-beta.local',
    true,
    now(),
    now()
  )
on conflict (school_id) do nothing;

-- ============================================================================
-- NOTE: Auth users and profiles are created via the test setup script
-- using Supabase Auth Admin API, not via SQL seed.
-- This ensures proper auth.users entries with encrypted passwords.
-- ============================================================================
