-- ============================================================================
-- Migration: 20260819000002_phase_6c2d_reassessment_evaluation
-- Phase 6C-2d — Reassessment Evaluation & Deterministic Outcome Mapping
-- (CORRECTED — Pre-Commit Corrective Implementation)
--
-- Implements:
--   - remediation_cycle_evaluations (immutable evaluation records)
--   - remediation_cycles modifications (evaluation metadata)
--   - Deterministic outcome mapping function
--   - Authoritative evidence validation (CORRECTION 1)
--   - Pending-cycle re-evaluatability (CORRECTION 2)
--   - Idempotency and concurrency protections
--   - Integration with Phase 6C-2c escalation logic
--
-- Binding Rules (from Phase 6C-2d Architecture Review and Stress Test):
--   - Detection State × Confidence → Outcome matrix is authoritative
--   - pending: NOT unsuccessful, NOT successful, preserves cycle
--   - unsuccessful: ONLY from repeated_weakness
--   - successful: ONLY from currently_performing_well
--   - RECENT_ATTEMPTS_WINDOW = 3 preserved (Phase 6B-3)
--   - Evaluation must be idempotent and concurrency-safe
--   - Two unsuccessful cycles in 30 days → instructor escalation
--
-- CORRECTION 1 — AUTHORITATIVE EVIDENCE VALIDATION:
--   Every evidence item must be verified from authoritative persisted data:
--     - exists in quiz_attempts
--     - belongs to the same student as the remediation cycle
--     - belongs to the correct remediation cycle/reassessment context
--     - represents completed assessment evidence
--     - satisfies Phase 6C-2b reassessment-integrity requirements
--   Application layer retains canonical curriculum-semantic verification.
--   Database layer enforces persisted identity, ownership, cycle, completion.
--
-- CORRECTION 2 — PENDING CYCLES MUST REMAIN RE-EVALUATABLE:
--   - pending evaluations do NOT mark the cycle terminal
--   - pending evaluations do NOT prevent future evaluation
--   - Multiple pending evaluation observations may exist per cycle
--   - At most ONE terminal outcome (successful or unsuccessful) per cycle
--   - Database-level protection against two competing terminal evaluations
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. REMEDIATION_CYCLE_EVALUATIONS TABLE (Immutable)
-- ============================================================================
-- Immutable record of remediation cycle evaluations.
-- Each evaluation represents a deterministic outcome assignment based on
-- legitimate reassessment evidence.
--
-- CORRECTION 2: Multiple pending evaluations may exist per cycle.
-- At most one terminal (successful/unsuccessful) evaluation per cycle.

create table if not exists public.remediation_cycle_evaluations (
  id uuid primary key default gen_random_uuid(),

  -- Reference
  cycle_id uuid not null references public.remediation_cycles(id) on delete cascade,

  -- Evaluation metadata (required by Phase 6C-2d)
  evaluation_confidence text not null, -- 'low', 'medium', 'high'
  evaluation_evidence_ids uuid[] not null, -- Array of quiz_attempt IDs used as evidence
  evaluation_idempotency_key text not null, -- Unique key for idempotency
  evaluation_version integer not null default 1, -- Schema version for future evolution

  -- Deterministic outcome (from outcome matrix)
  detection_state text not null, -- Detection state at evaluation time
  outcome text not null, -- 'successful', 'unsuccessful', 'pending'

  -- Evidence snapshot
  concept_evidence jsonb not null, -- ConceptEvidence from Phase 6B-3

  -- Timestamps
  evaluated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  -- Constraints
  constraint valid_evaluation_confidence check (
    evaluation_confidence in ('low', 'medium', 'high')
  ),
  constraint valid_detection_state check (
    detection_state in (
      'insufficient_evidence', 'emerging_weakness', 'repeated_weakness',
      'improving', 'currently_performing_well'
    )
  ),
  constraint valid_outcome check (
    outcome in ('successful', 'unsuccessful', 'pending')
  ),
  constraint valid_evaluation_version check (evaluation_version >= 1)
);

-- Idempotency: unique constraint on idempotency key
-- Same evaluation event/evidence set → same key → idempotent return
create unique index if not exists idx_remediation_cycle_evaluations_idempotency
  on public.remediation_cycle_evaluations(evaluation_idempotency_key);

-- CORRECTION 2: REMOVED the old one-evaluation-per-cycle unique index.
-- Replaced with terminal-outcome protection below.

-- Indexes
create index if not exists idx_remediation_cycle_evaluations_cycle
  on public.remediation_cycle_evaluations(cycle_id);
create index if not exists idx_remediation_cycle_evaluations_outcome
  on public.remediation_cycle_evaluations(outcome);
create index if not exists idx_remediation_cycle_evaluations_evaluated_at
  on public.remediation_cycle_evaluations(evaluated_at desc);

-- CORRECTION 2: Partial unique index — at most ONE terminal outcome per cycle.
-- Terminal outcomes are 'successful' and 'unsuccessful'.
-- Pending evaluations are NOT terminal and may coexist.
create unique index if not exists idx_remediation_cycle_evaluations_terminal_unique
  on public.remediation_cycle_evaluations(cycle_id)
  where outcome in ('successful', 'unsuccessful');

-- ============================================================================
-- 2. REMEDIATION_CYCLES MODIFICATIONS
-- ============================================================================
-- Add evaluation metadata columns to remediation_cycles.
--
-- CORRECTION 2: evaluation_id now points to the TERMINAL evaluation only.
-- Pending evaluations do NOT set evaluation_id on the cycle.
-- The cycle status is only set to 'evaluated' for terminal outcomes.

alter table public.remediation_cycles
add column if not exists evaluation_id uuid references public.remediation_cycle_evaluations(id),
add column if not exists evaluation_confidence text,
add column if not exists evaluation_idempotency_key text;

-- Add constraint for evaluation_confidence
alter table public.remediation_cycles
drop constraint if exists valid_evaluation_confidence;

alter table public.remediation_cycles
add constraint valid_evaluation_confidence check (
  evaluation_confidence in ('low', 'medium', 'high') or evaluation_confidence is null
);

-- Index for evaluation lookups
create index if not exists idx_remediation_cycles_evaluation_id
  on public.remediation_cycles(evaluation_id) where evaluation_id is not null;

-- ============================================================================
-- 3. DETERMINISTIC OUTCOME MAPPING FUNCTION
-- ============================================================================
-- Implements the approved deterministic outcome matrix:
--
-- Detection State          Low        Medium     High
-- -----------------------  ---------  ---------  ---------
-- insufficient_evidence    pending    pending    pending
-- emerging_weakness        pending    pending    pending
-- repeated_weakness        unsuccessful unsuccessful unsuccessful
-- improving                pending    pending    pending
-- currently_performing_well successful successful successful
--
-- This function is the SINGLE AUTHORITATIVE implementation of the outcome
-- matrix. Do not duplicate or reinterpret this logic elsewhere.

create or replace function public.map_detection_to_outcome(
  p_detection_state text,
  p_confidence text
)
returns text as $$
begin
  -- Validate inputs
  if p_detection_state not in (
    'insufficient_evidence', 'emerging_weakness', 'repeated_weakness',
    'improving', 'currently_performing_well'
  ) then
    raise exception 'Invalid detection state: %', p_detection_state;
  end if;

  if p_confidence not in ('low', 'medium', 'high') then
    raise exception 'Invalid confidence level: %', p_confidence;
  end if;

  -- Apply deterministic outcome matrix
  case p_detection_state
    when 'repeated_weakness' then
      return 'unsuccessful';
    when 'currently_performing_well' then
      return 'successful';
    else
      -- insufficient_evidence, emerging_weakness, improving → pending
      return 'pending';
  end case;
end;
$$ language plpgsql immutable;

-- ============================================================================
-- 4. AUTHORITATIVE EVIDENCE VALIDATION FUNCTION (CORRECTION 1)
-- ============================================================================
-- Validates that every evidence item (quiz_attempt ID) satisfies ALL
-- authoritative persisted-data requirements before it can be used to
-- evaluate a remediation cycle.
--
-- Checks performed (from persisted data only — no caller-controlled booleans):
--   1. Evidence item exists in quiz_attempts
--   2. Evidence item belongs to the same student as the remediation cycle
--   3. Evidence item belongs to the correct remediation cycle context
--      (remediation_cycle_id matches OR is a legitimate reassessment for
--       the same student and concept)
--   4. Evidence item represents completed assessment evidence
--      (completed_at IS NOT NULL)
--   5. Evidence item satisfies Phase 6C-2b reassessment-integrity:
--      - If is_reassessment = true, remediation_cycle_id must reference
--        an existing remediation cycle
--      - If is_reassessment = true, target_concept_id must match the
--        cycle's concept_id
--
-- NOTE: Canonical curriculum-semantic question→concept mapping verification
-- remains in the application layer (TypeScript canonical mapping providers).
-- This function validates persisted identity, ownership, cycle, completion,
-- and reassessment-integrity only.

create or replace function public.validate_evaluation_evidence(
  p_cycle_id uuid,
  p_evidence_ids uuid[]
)
returns table (
  evidence_id uuid,
  is_valid boolean,
  failure_reason text
) as $$
declare
  v_cycle_user_id uuid;
  v_cycle_concept_id text;
  v_cycle_chapter_id text;
  v_evidence_id uuid;
  v_attempt_user_id uuid;
  v_attempt_completed_at timestamptz;
  v_attempt_is_reassessment boolean;
  v_attempt_remediation_cycle_id uuid;
  v_attempt_target_concept_id text;
begin
  -- Get cycle information
  select user_id, concept_id, chapter_id
  into v_cycle_user_id, v_cycle_concept_id, v_cycle_chapter_id
  from public.remediation_cycles
  where id = p_cycle_id;

  if v_cycle_user_id is null then
    -- Cycle not found — all evidence is invalid
    foreach v_evidence_id in array p_evidence_ids
    loop
      evidence_id := v_evidence_id;
      is_valid := false;
      failure_reason := 'Remediation cycle not found: ' || p_cycle_id;
      return next;
    end loop;
    return;
  end if;

  -- Validate each evidence item
  foreach v_evidence_id in array p_evidence_ids
  loop
    evidence_id := v_evidence_id;
    is_valid := true;
    failure_reason := null;

    -- Check 1: Evidence item exists in quiz_attempts
    select
      qa.user_id,
      qa.completed_at,
      qa.is_reassessment,
      qa.remediation_cycle_id,
      qa.target_concept_id
    into
      v_attempt_user_id,
      v_attempt_completed_at,
      v_attempt_is_reassessment,
      v_attempt_remediation_cycle_id,
      v_attempt_target_concept_id
    from public.quiz_attempts qa
    where qa.id = v_evidence_id;

    if v_attempt_user_id is null then
      is_valid := false;
      failure_reason := 'Evidence item not found in quiz_attempts: ' || v_evidence_id;
      return next;
    end if;

    -- Check 2: Evidence belongs to the same student as the remediation cycle
    if v_attempt_user_id != v_cycle_user_id then
      is_valid := false;
      failure_reason := 'Evidence belongs to different student. Cycle user: '
        || v_cycle_user_id || ', Evidence user: ' || v_attempt_user_id;
      return next;
    end if;

    -- Check 3: Evidence represents completed assessment evidence
    if v_attempt_completed_at is null then
      is_valid := false;
      failure_reason := 'Evidence is not a completed assessment (completed_at is null): ' || v_evidence_id;
      return next;
    end if;

    -- Check 4: Phase 6C-2b reassessment-integrity requirements
    if v_attempt_is_reassessment then
      -- Reassessment must reference an existing remediation cycle
      if v_attempt_remediation_cycle_id is null then
        is_valid := false;
        failure_reason := 'Reassessment evidence missing remediation_cycle_id: ' || v_evidence_id;
        return next;
      end if;

      -- Reassessment target_concept_id must match the cycle's concept_id
      if v_attempt_target_concept_id is null or v_attempt_target_concept_id != v_cycle_concept_id then
        is_valid := false;
        failure_reason := 'Reassessment target_concept_id mismatch. Cycle concept: '
          || v_cycle_concept_id || ', Evidence target: '
          || coalesce(v_attempt_target_concept_id, 'NULL');
        return next;
      end if;
    end if;

    -- Check 5: Evidence belongs to the correct remediation cycle/reassessment context
    -- For reassessment evidence: remediation_cycle_id must match this cycle
    -- For non-reassessment (initial quiz) evidence: must be for the same student
    --   and the quiz must contain questions for the cycle's concept
    --   (application layer verifies canonical mapping; database verifies identity)
    if v_attempt_is_reassessment and v_attempt_remediation_cycle_id != p_cycle_id then
      is_valid := false;
      failure_reason := 'Reassessment evidence belongs to different cycle. Expected: '
        || p_cycle_id || ', Got: ' || v_attempt_remediation_cycle_id;
      return next;
    end if;

    -- All checks passed
    return next;
  end loop;

  return;
end;
$$ language plpgsql security definer stable;

-- ============================================================================
-- 5. EVALUATION FUNCTION (Idempotent, Concurrency-Safe, CORRECTED)
-- ============================================================================
-- Evaluates a remediation cycle and records the outcome.
-- Uses SELECT ... FOR UPDATE for concurrency safety.
-- Idempotent via evaluation_idempotency_key unique constraint.
--
-- CORRECTION 1: Validates all evidence items against authoritative
-- persisted data before allowing evaluation.
--
-- CORRECTION 2: Pending evaluations do NOT mark the cycle terminal.
-- Only terminal outcomes (successful/unsuccessful) set cycle status
-- to 'evaluated' and set evaluation_id on the cycle.

create or replace function public.evaluate_remediation_cycle(
  p_cycle_id uuid,
  p_detection_state text,
  p_confidence text,
  p_concept_evidence jsonb,
  p_evidence_ids uuid[],
  p_idempotency_key text
)
returns uuid as $$
declare
  v_outcome text;
  v_evaluation_id uuid;
  v_existing_evaluation_id uuid;
  v_cycle_user_id uuid;
  v_cycle_concept_id text;
  v_cycle_chapter_id text;
  v_cycle_school_id uuid;
  v_cycle_status text;
  v_cycle_outcome text;
  v_unsuccessful_count integer;
  v_triggering_cycle_ids uuid[];
  v_invalid_count integer;
  v_invalid_reasons text;
begin
  -- Map detection state to outcome using deterministic matrix
  v_outcome := public.map_detection_to_outcome(p_detection_state, p_confidence);

  -- Check for existing evaluation with this idempotency key
  -- Idempotency applies to an evaluation event/evidence set
  select id into v_existing_evaluation_id
  from public.remediation_cycle_evaluations
  where evaluation_idempotency_key = p_idempotency_key;

  if v_existing_evaluation_id is not null then
    -- Idempotent: return existing evaluation
    return v_existing_evaluation_id;
  end if;

  -- Get cycle information with row lock for concurrency safety
  select user_id, concept_id, chapter_id, status, outcome
  into v_cycle_user_id, v_cycle_concept_id, v_cycle_chapter_id, v_cycle_status, v_cycle_outcome
  from public.remediation_cycles
  where id = p_cycle_id
  for update;

  if v_cycle_user_id is null then
    raise exception 'Remediation cycle not found: %', p_cycle_id;
  end if;

  -- CORRECTION 2: Check if cycle already has a TERMINAL outcome
  -- Terminal outcomes are 'successful' and 'unsuccessful'
  -- A cycle with a terminal outcome cannot be re-evaluated
  if v_cycle_outcome in ('successful', 'unsuccessful') then
    -- Cycle already has terminal outcome — check if this is the same evaluation
    select evaluation_id into v_existing_evaluation_id
    from public.remediation_cycles
    where id = p_cycle_id;

    if v_existing_evaluation_id is not null then
      -- Return the existing terminal evaluation (idempotent for terminal)
      return v_existing_evaluation_id;
    end if;

    -- Should not reach here, but raise exception for safety
    raise exception 'Cycle % already has terminal outcome %', p_cycle_id, v_cycle_outcome;
  end if;

  -- CORRECTION 1: Validate all evidence items against authoritative persisted data
  -- Every evidence item must pass all validation checks
  select count(*), string_agg(failure_reason, '; ')
  into v_invalid_count, v_invalid_reasons
  from public.validate_evaluation_evidence(p_cycle_id, p_evidence_ids)
  where is_valid = false;

  if v_invalid_count > 0 then
    raise exception 'Evidence validation failed for cycle %. % invalid evidence item(s): %',
      p_cycle_id, v_invalid_count, v_invalid_reasons;
  end if;

  -- Insert evaluation record (idempotent via unique constraint)
  insert into public.remediation_cycle_evaluations (
    cycle_id,
    evaluation_confidence,
    evaluation_evidence_ids,
    evaluation_idempotency_key,
    evaluation_version,
    detection_state,
    outcome,
    concept_evidence
  )
  values (
    p_cycle_id,
    p_confidence,
    p_evidence_ids,
    p_idempotency_key,
    1, -- evaluation_version
    p_detection_state,
    v_outcome,
    p_concept_evidence
  )
  on conflict (evaluation_idempotency_key) do nothing
  returning id into v_evaluation_id;

  -- Handle concurrent insert conflict
  if v_evaluation_id is null then
    select id into v_evaluation_id
    from public.remediation_cycle_evaluations
    where evaluation_idempotency_key = p_idempotency_key;
    return v_evaluation_id;
  end if;

  -- CORRECTION 2: Only update cycle to terminal state for terminal outcomes
  -- Pending evaluations do NOT mark the cycle as evaluated
  if v_outcome in ('successful', 'unsuccessful') then
    -- Terminal outcome: update cycle status and set evaluation_id
    update public.remediation_cycles
    set
      status = 'evaluated',
      outcome = v_outcome,
      evaluated_at = now(),
      evaluation_id = v_evaluation_id,
      evaluation_confidence = p_confidence,
      evaluation_idempotency_key = p_idempotency_key,
      post_remediation_state = p_detection_state
    where id = p_cycle_id;
  else
    -- Pending outcome: record the evaluation but do NOT mark cycle terminal
    -- Update post_remediation_state for observability but preserve cycle
    update public.remediation_cycles
    set
      post_remediation_state = p_detection_state
    where id = p_cycle_id;
  end if;

  -- Record evaluation event in audit ledger (always, for auditability)
  insert into public.remediation_cycle_events (
    cycle_id,
    event_type,
    event_data
  )
  values (
    p_cycle_id,
    'evaluated',
    jsonb_build_object(
      'evaluation_id', v_evaluation_id,
      'outcome', v_outcome,
      'detection_state', p_detection_state,
      'confidence', p_confidence,
      'evidence_ids', p_evidence_ids,
      'is_terminal', (v_outcome in ('successful', 'unsuccessful'))
    )
  );

  -- If outcome is unsuccessful (terminal), check for escalation trigger
  -- CORRECTION 2: Pending evaluations NEVER contribute to escalation
  if v_outcome = 'unsuccessful' then
    -- Count unsuccessful cycles in rolling 30-day window
    -- Only count cycles with terminal unsuccessful outcomes
    select count(*), array_agg(id)
    into v_unsuccessful_count, v_triggering_cycle_ids
    from public.remediation_cycles
    where user_id = v_cycle_user_id
      and concept_id = v_cycle_concept_id
      and outcome = 'unsuccessful'
      and evaluated_at >= (now() - interval '30 days')
      and reset_by_sustained_performance = false;

    -- Get school_id for escalation
    select school_id into v_cycle_school_id
    from public.profiles
    where id = v_cycle_user_id;

    -- Trigger escalation if threshold met (2 unsuccessful cycles)
    if v_unsuccessful_count >= 2 and v_cycle_school_id is not null then
      -- Call escalation creation (idempotent via unique constraint)
      perform public.create_instructor_escalation(
        v_cycle_user_id,
        v_cycle_concept_id,
        v_cycle_chapter_id,
        v_cycle_school_id,
        v_triggering_cycle_ids,
        v_unsuccessful_count,
        p_concept_evidence
      );
    end if;
  end if;

  return v_evaluation_id;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 6. IMMUTABILITY ENFORCEMENT FOR REMEDIATION_CYCLE_EVALUATIONS
-- ============================================================================

create or replace function public.prevent_evaluation_modification()
returns trigger as $$
begin
  raise exception 'remediation_cycle_evaluations is an immutable audit record. UPDATE and DELETE operations are not allowed.';
end;
$$ language plpgsql;

create trigger enforce_evaluations_immutability
  before update or delete on public.remediation_cycle_evaluations
  for each row execute function public.prevent_evaluation_modification();

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

alter table public.remediation_cycle_evaluations enable row level security;

-- Students: read own evaluations (via cycle join)
create policy remediation_cycle_evaluations_student_select on public.remediation_cycle_evaluations
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id and rc.user_id = auth.uid()
    )
  );

-- School staff: read evaluations for students in same school
create policy remediation_cycle_evaluations_staff_select on public.remediation_cycle_evaluations
  for select to authenticated
  using (
    exists (
      select 1 from public.remediation_cycles rc
      where rc.id = cycle_id
        and public.is_school_staff(public.current_user_school_id())
        and public.current_user_school_id() = public.user_school_id(rc.user_id)
    )
  );

-- Platform super admin: full access
create policy remediation_cycle_evaluations_super_admin on public.remediation_cycle_evaluations
  for all to authenticated
  using (public.is_platform_super_admin())
  with check (public.is_platform_super_admin());

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on table public.remediation_cycle_evaluations is
  'Phase 6C-2d (CORRECTED): Immutable record of remediation cycle evaluations. Multiple pending evaluations may exist per cycle. At most one terminal (successful/unsuccessful) evaluation per cycle.';

comment on column public.remediation_cycle_evaluations.evaluation_confidence is
  'Confidence level from Phase 6B-3 detection engine: low, medium, high.';

comment on column public.remediation_cycle_evaluations.evaluation_evidence_ids is
  'Array of quiz_attempt IDs that provided legitimate evidence for this evaluation. All IDs are validated against authoritative persisted data before evaluation.';

comment on column public.remediation_cycle_evaluations.evaluation_idempotency_key is
  'Unique key for idempotency protection. Format: {cycle_id}:{detection_state}:{confidence}:{evidence_hash}. Same evaluation event/evidence set produces the same key.';

comment on column public.remediation_cycle_evaluations.evaluation_version is
  'Schema version for future evolution. Current version: 1';

comment on column public.remediation_cycle_evaluations.detection_state is
  'Detection state from Phase 6B-3 at evaluation time.';

comment on column public.remediation_cycle_evaluations.outcome is
  'Deterministic outcome from approved matrix: successful, unsuccessful, pending. Pending outcomes do NOT mark the cycle terminal.';

comment on index public.idx_remediation_cycle_evaluations_terminal_unique is
  'CORRECTION 2: Partial unique index ensuring at most ONE terminal outcome (successful or unsuccessful) per remediation cycle. Pending evaluations may coexist.';

comment on function public.map_detection_to_outcome is
  'Phase 6C-2d: SINGLE AUTHORITATIVE deterministic outcome mapping function. Implements the approved Detection State × Confidence → Outcome matrix. Do not duplicate or reinterpret this logic elsewhere.';

comment on function public.validate_evaluation_evidence is
  'CORRECTION 1: Validates that every evidence item satisfies authoritative persisted-data requirements: exists, belongs to same student, belongs to correct cycle context, represents completed assessment, satisfies Phase 6C-2b reassessment-integrity. Application layer retains canonical curriculum-semantic verification.';

comment on function public.evaluate_remediation_cycle is
  'Phase 6C-2d (CORRECTED): Evaluates a remediation cycle with evidence validation, idempotency, and concurrency safety. Pending evaluations do NOT mark the cycle terminal. Only terminal outcomes (successful/unsuccessful) set cycle status to evaluated. Pending evaluations never contribute to escalation.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
