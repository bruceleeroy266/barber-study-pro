-- ============================================================================
-- Migration: 20260821000000_phase_6c5_atomic_cycle_creation
-- Phase 6C-5 — Atomic Remediation Cycle + Assignment Creation
--
-- Implements:
--   - create_remediation_cycle_with_assignments() database function
--   - Ensures cycle + assignments are created atomically
--   - Prevents partial state (cycle without assignments)
--   - Handles concurrent detection requests safely
--
-- This migration addresses BLOCKER 3 from the Phase 6C-5 release-blocker review.
-- ============================================================================

-- ============================================================================
-- 1. ATOMIC CYCLE + ASSIGNMENT CREATION FUNCTION
-- ============================================================================
-- Creates a remediation cycle and all its assignments in a single transaction.
-- Returns the cycle ID if successful, NULL if an active cycle already exists.
--
-- Concurrency behavior:
--   - Uses the existing unique index on (user_id, concept_id) WHERE status != 'evaluated'
--   - If a concurrent request creates a cycle first, this function returns NULL
--   - The calling code must handle NULL by fetching the existing cycle ID
--
-- Idempotency behavior:
--   - If an active cycle already exists, returns NULL (no duplicate created)
--   - The calling code must handle this case appropriately

create or replace function public.create_remediation_cycle_with_assignments(
  p_user_id uuid,
  p_concept_id text,
  p_chapter_id text,
  p_cycle_number integer,
  p_detection_state text,
  p_detection_confidence text,
  p_detection_evidence jsonb,
  p_status text,
  p_assignments jsonb -- Array of {assignment_type, asset_id, priority, is_primary}
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle_id uuid;
  v_assignment record;
begin
  -- Validate detection_state
  if p_detection_state not in ('emerging_weakness', 'repeated_weakness') then
    raise exception 'Invalid detection_state: %', p_detection_state;
  end if;

  -- Validate detection_confidence
  if p_detection_confidence not in ('low', 'medium', 'high') then
    raise exception 'Invalid detection_confidence: %', p_detection_confidence;
  end if;

  -- Validate status
  if p_status not in ('targeted', 'in_review', 'review_completed', 'reassessed', 'evaluated') then
    raise exception 'Invalid status: %', p_status;
  end if;

  -- Validate cycle_number
  if p_cycle_number < 1 or p_cycle_number > 3 then
    raise exception 'Invalid cycle_number: % (must be 1-3)', p_cycle_number;
  end if;

  -- Check if active cycle already exists (idempotency)
  select id into v_cycle_id
  from public.remediation_cycles
  where user_id = p_user_id
    and concept_id = p_concept_id
    and status != 'evaluated'
    and outcome is null;

  if found then
    -- Active cycle already exists, return NULL to indicate idempotency
    return null;
  end if;

  -- Insert the remediation cycle
  insert into public.remediation_cycles (
    user_id,
    concept_id,
    chapter_id,
    cycle_number,
    detection_state,
    detection_confidence,
    detection_evidence,
    status,
    targeted_at
  ) values (
    p_user_id,
    p_concept_id,
    p_chapter_id,
    p_cycle_number,
    p_detection_state,
    p_detection_confidence,
    p_detection_evidence,
    p_status,
    now()
  )
  returning id into v_cycle_id;

  -- Insert all assignments
  for v_assignment in
    select * from jsonb_to_recordset(p_assignments) as x(
      assignment_type text,
      asset_id text,
      priority integer,
      is_primary boolean
    )
  loop
    insert into public.remediation_assignments (
      cycle_id,
      assignment_type,
      asset_id,
      priority,
      is_primary,
      status
    ) values (
      v_cycle_id,
      v_assignment.assignment_type,
      v_assignment.asset_id,
      v_assignment.priority,
      v_assignment.is_primary,
      'assigned'
    );
  end loop;

  -- Record the 'targeted' event in the audit ledger
  insert into public.remediation_cycle_events (
    cycle_id,
    event_type,
    event_data
  ) values (
    v_cycle_id,
    'targeted',
    jsonb_build_object(
      'detection_state', p_detection_state,
      'detection_confidence', p_detection_confidence,
      'cycle_number', p_cycle_number,
      'assignments_count', jsonb_array_length(p_assignments)
    )
  );

  return v_cycle_id;
exception
  when unique_violation then
    -- Concurrent request created a cycle first
    -- Return NULL to indicate idempotency (caller should fetch existing)
    return null;
  when others then
    -- Any other error: rollback and re-raise
    raise;
end;
$$;

-- ============================================================================
-- 2. GET EXISTING ACTIVE CYCLE ID FUNCTION
-- ============================================================================
-- Helper function to get the ID of an existing active cycle.
-- Used when create_remediation_cycle_with_assignments returns NULL.

create or replace function public.get_active_remediation_cycle_id(
  p_user_id uuid,
  p_concept_id text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle_id uuid;
begin
  select id into v_cycle_id
  from public.remediation_cycles
  where user_id = p_user_id
    and concept_id = p_concept_id
    and status != 'evaluated'
    and outcome is null;

  return v_cycle_id;
end;
$$;

-- ============================================================================
-- 3. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on function public.create_remediation_cycle_with_assignments is
  'Phase 6C-5: Atomically creates a remediation cycle and all its assignments. Returns cycle ID if created, NULL if active cycle already exists (idempotency).';

comment on function public.get_active_remediation_cycle_id is
  'Phase 6C-5: Helper function to get the ID of an existing active remediation cycle for a user+concept.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
