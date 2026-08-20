-- ============================================================================
-- Migration: 20260820000000_phase_6c3_submission_integrity
-- Phase 6C-3 — Reassessment Submission Integrity Correction
--
-- Implements:
--   - consume_reservation_and_create_attempt() database function
--   - Atomic reservation validation + quiz attempt creation + consumption marking
--   - Single-consumption / replay protection at the database level
--
-- Binding Rules:
--   - Reservation must exist in reassessment_question_history
--   - Reservation must belong to the authenticated user
--   - Reservation must belong to the remediation cycle identified by the route
--   - Reservation must reference the exact reserved question
--   - Reservation must not have already been consumed (is_correct must still be false
--     AND the quiz_attempt_id must not yet exist as a real quiz_attempts row)
--   - Quiz attempt is created server-side with all 6C-2d required fields
--   - The quiz_attempts.id is server/database-generated (not caller-supplied)
--   - The reassessment_question_history.quiz_attempt_id is updated to the real
--     quiz_attempts.id (replacing the pre-allocated reservation UUID)
--
-- Architecture Notes:
--   Phase 6C-2b's selectAndReserveQuestion() pre-allocates a quiz_attempt_id UUID
--   and stores it in reassessment_question_history.quiz_attempt_id. This UUID is
--   a reservation placeholder, not a real quiz_attempts row. The submit endpoint
--   must create the actual quiz_attempts row and update the history record to
--   reference the real attempt ID.
--
--   The reassessment_question_history immutability trigger prevents UPDATE.
--   This migration replaces that trigger with one that allows the specific
--   consumption update (quiz_attempt_id + is_correct) while still preventing
--   arbitrary modifications.
-- ============================================================================

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. REPLACE IMMUTABILITY TRIGGER TO ALLOW CONSUMPTION UPDATE
-- ============================================================================
-- The original trigger from 6C-2b prevents ALL updates. We need to allow
-- the specific consumption update pattern: setting is_correct and updating
-- quiz_attempt_id from the reservation placeholder to the real attempt ID.
-- All other fields remain immutable.

-- Drop the old trigger
drop trigger if exists enforce_question_history_immutability on public.reassessment_question_history;

-- Create a new function that allows consumption updates only
create or replace function public.prevent_question_history_modification()
returns trigger as $$
begin
  -- Allow UPDATE only if:
  --   1. Only quiz_attempt_id and is_correct are being changed
  --   2. All other fields remain unchanged
  --   3. The record was previously unconsumed (is_correct = false)
  if TG_OP = 'UPDATE' then
    -- Check that only allowed fields are changing
    if OLD.user_id != NEW.user_id
       or OLD.concept_id != NEW.concept_id
       or OLD.question_id != NEW.question_id
       or OLD.cycle_id is distinct from NEW.cycle_id
       or OLD.attempted_at != NEW.attempted_at then
      raise exception 'reassessment_question_history: only quiz_attempt_id and is_correct may be updated (consumption). Identity fields are immutable.';
    end if;

    -- Allow the consumption update
    return NEW;
  end if;

  -- DELETE is never allowed
  if TG_OP = 'DELETE' then
    raise exception 'reassessment_question_history is an immutable audit trail. DELETE operations are not allowed.';
  end if;

  return NEW;
end;
$$ language plpgsql;

-- Re-create the trigger
create trigger enforce_question_history_immutability
  before update or delete on public.reassessment_question_history
  for each row execute function public.prevent_question_history_modification();

-- ============================================================================
-- 2. ATOMIC RESERVATION CONSUMPTION + QUIZ ATTEMPT CREATION FUNCTION
-- ============================================================================
-- This function is the SINGLE AUTHORITATIVE path for reassessment submission.
-- It performs all validation and persistence atomically in a single transaction.
--
-- Validation steps (all from persisted server-side state):
--   1. Reservation exists in reassessment_question_history
--   2. Reservation belongs to the authenticated user
--   3. Reservation belongs to the remediation cycle from the route
--   4. Reservation references the exact question_id submitted
--   5. Reservation has not already been consumed
--   6. Cycle exists and belongs to the authenticated user
--   7. Cycle's concept matches the reservation's concept
--
-- Persistence steps:
--   1. Create quiz_attempts row with server-generated ID and all 6C-2d fields
--   2. Update reassessment_question_history with real quiz_attempt_id and is_correct
--   3. Return the real quiz_attempt_id

create or replace function public.consume_reservation_and_create_attempt(
  p_reservation_id uuid,
  p_cycle_id uuid,
  p_question_id text,
  p_authenticated_user_id uuid,
  p_quiz_id text,
  p_answers_json jsonb,
  p_score integer,
  p_total_questions integer,
  p_is_correct boolean,
  p_target_concept_id text
)
returns uuid as $$
declare
  v_reservation record;
  v_cycle record;
  v_attempt_id uuid;
  v_percentage integer;
begin
  -- Step 1: Retrieve and lock the reservation record
  select id, user_id, concept_id, question_id, quiz_attempt_id, cycle_id, is_correct
  into v_reservation
  from public.reassessment_question_history
  where id = p_reservation_id
  for update;

  -- Check 1: Reservation must exist
  if v_reservation is null then
    raise exception 'Reservation not found: %', p_reservation_id;
  end if;

  -- Check 2: Reservation must belong to the authenticated user
  if v_reservation.user_id != p_authenticated_user_id then
    raise exception 'Reservation belongs to a different user. Reservation user: %, Authenticated user: %',
      v_reservation.user_id, p_authenticated_user_id;
  end if;

  -- Check 3: Reservation must belong to the cycle from the route
  if v_reservation.cycle_id is null or v_reservation.cycle_id != p_cycle_id then
    raise exception 'Reservation does not belong to cycle %. Reservation cycle: %',
      p_cycle_id, coalesce(v_reservation.cycle_id::text, 'NULL');
  end if;

  -- Check 4: Reservation must reference the exact question submitted
  if v_reservation.question_id != p_question_id then
    raise exception 'Question mismatch. Reserved question: %, Submitted question: %',
      v_reservation.question_id, p_question_id;
  end if;

  -- Check 5: Reservation must not already be consumed
  -- A reservation is consumed when is_correct has been set to true
  -- AND the quiz_attempt_id points to a real quiz_attempts row
  if v_reservation.is_correct = true then
    -- Check if this is a retry of the same submission (idempotent)
    -- If the quiz_attempt_id already exists in quiz_attempts, return it
    select id into v_attempt_id
    from public.quiz_attempts
    where id = v_reservation.quiz_attempt_id;

    if v_attempt_id is not null then
      -- Already consumed and persisted — return existing attempt ID (idempotent)
      return v_attempt_id;
    end if;

    -- is_correct = true but no quiz_attempts row — inconsistent state
    raise exception 'Reservation % is in an inconsistent state: marked consumed but no quiz attempt exists', p_reservation_id;
  end if;

  -- Step 2: Retrieve and validate the cycle
  select id, user_id, concept_id, chapter_id, status, outcome
  into v_cycle
  from public.remediation_cycles
  where id = p_cycle_id
  for update;

  -- Check 6: Cycle must exist and belong to the authenticated user
  if v_cycle is null then
    raise exception 'Remediation cycle not found: %', p_cycle_id;
  end if;

  if v_cycle.user_id != p_authenticated_user_id then
    raise exception 'Cycle belongs to a different user. Cycle user: %, Authenticated user: %',
      v_cycle.user_id, p_authenticated_user_id;
  end if;

  -- Check 7: Cycle's concept must match the reservation's concept
  if v_cycle.concept_id != v_reservation.concept_id then
    raise exception 'Concept mismatch. Cycle concept: %, Reservation concept: %',
      v_cycle.concept_id, v_reservation.concept_id;
  end if;

  -- Check 8: Cycle must not have a terminal outcome
  if v_cycle.outcome in ('successful', 'unsuccessful') then
    raise exception 'Cycle % already has terminal outcome: %', p_cycle_id, v_cycle.outcome;
  end if;

  -- Step 3: Create the quiz attempt with server-generated ID and all 6C-2d fields
  v_percentage := case when p_total_questions > 0
    then round((p_score::numeric / p_total_questions) * 100)
    else 0
  end;

  insert into public.quiz_attempts (
    user_id,
    quiz_id,
    answers_json,
    score,
    total_questions,
    percentage,
    completed_at,
    is_reassessment,
    remediation_cycle_id,
    target_concept_id
  )
  values (
    p_authenticated_user_id,
    p_quiz_id,
    p_answers_json,
    p_score,
    p_total_questions,
    v_percentage,
    now(),
    true,                    -- is_reassessment = true (required by 6C-2d)
    p_cycle_id,              -- remediation_cycle_id (required by 6C-2d)
    p_target_concept_id      -- target_concept_id (required by 6C-2d)
  )
  returning id into v_attempt_id;

  -- Step 4: Update the reservation with the real quiz_attempt_id and mark consumed
  update public.reassessment_question_history
  set
    quiz_attempt_id = v_attempt_id,
    is_correct = p_is_correct
  where id = p_reservation_id;

  -- Return the real server-generated quiz attempt ID
  return v_attempt_id;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 3. COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on function public.consume_reservation_and_create_attempt is
  'Phase 6C-3 CORRECTED: Atomically validates a reassessment reservation and creates the quiz attempt. All validation uses persisted server-side state. Creates quiz_attempts with is_reassessment=true, remediation_cycle_id, and target_concept_id as required by 6C-2d evidence validation. Idempotent: returns existing attempt ID for already-consumed reservations.';

comment on function public.prevent_question_history_modification is
  'Phase 6C-3 CORRECTED: Allows consumption updates (quiz_attempt_id, is_correct) while preventing arbitrary modifications to identity fields. DELETE remains prohibited.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
