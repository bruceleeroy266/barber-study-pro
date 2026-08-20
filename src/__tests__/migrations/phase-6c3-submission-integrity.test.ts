/**
 * Phase 6C-3 — Submission Integrity Migration Validation Tests
 *
 * Tests for the Phase 6C-3 submission integrity correction migration.
 * Validates schema, constraints, functions, and trigger modifications.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const MIGRATION_PATH = join(
  process.cwd(),
  'supabase/migrations/20260820000000_phase_6c3_submission_integrity.sql'
)

const migrationSql = readFileSync(MIGRATION_PATH, 'utf-8')

// ───────────────────────────────────────────────
// Schema Validation Tests
// ───────────────────────────────────────────────

describe('Phase 6C-3 Submission Integrity Migration', () => {
  describe('Immutability Trigger Replacement', () => {
    it('drops the old immutability trigger', () => {
      expect(migrationSql).toContain('drop trigger if exists enforce_question_history_immutability')
    })

    it('creates a new trigger function allowing consumption updates', () => {
      expect(migrationSql).toContain('create or replace function public.prevent_question_history_modification()')
    })

    it('allows quiz_attempt_id and is_correct updates', () => {
      expect(migrationSql).toContain('quiz_attempt_id and is_correct may be updated')
    })

    it('prevents identity field modifications', () => {
      expect(migrationSql).toContain('Identity fields are immutable')
    })

    it('prevents DELETE operations', () => {
      expect(migrationSql).toContain('DELETE operations are not allowed')
    })

    it('re-creates the trigger', () => {
      expect(migrationSql).toContain('create trigger enforce_question_history_immutability')
      expect(migrationSql).toContain('before update or delete on public.reassessment_question_history')
    })

    it('validates user_id immutability', () => {
      expect(migrationSql).toContain('OLD.user_id != NEW.user_id')
    })

    it('validates concept_id immutability', () => {
      expect(migrationSql).toContain('OLD.concept_id != NEW.concept_id')
    })

    it('validates question_id immutability', () => {
      expect(migrationSql).toContain('OLD.question_id != NEW.question_id')
    })

    it('validates cycle_id immutability', () => {
      expect(migrationSql).toContain('OLD.cycle_id is distinct from NEW.cycle_id')
    })

    it('validates attempted_at immutability', () => {
      expect(migrationSql).toContain('OLD.attempted_at != NEW.attempted_at')
    })
  })

  describe('consume_reservation_and_create_attempt function', () => {
    it('creates the consume_reservation_and_create_attempt function', () => {
      expect(migrationSql).toContain('create or replace function public.consume_reservation_and_create_attempt')
    })

    it('accepts reservation_id parameter', () => {
      expect(migrationSql).toContain('p_reservation_id uuid')
    })

    it('accepts cycle_id parameter', () => {
      expect(migrationSql).toContain('p_cycle_id uuid')
    })

    it('accepts question_id parameter', () => {
      expect(migrationSql).toContain('p_question_id text')
    })

    it('accepts authenticated_user_id parameter', () => {
      expect(migrationSql).toContain('p_authenticated_user_id uuid')
    })

    it('accepts target_concept_id parameter', () => {
      expect(migrationSql).toContain('p_target_concept_id text')
    })

    it('returns uuid (the server-generated quiz attempt ID)', () => {
      expect(migrationSql).toContain('returns uuid as $$')
    })

    // CORRECTION 1: Authoritative Reservation Binding
    it('retrieves and locks the reservation record (CORRECTION 1)', () => {
      expect(migrationSql).toContain('from public.reassessment_question_history')
      expect(migrationSql).toContain('for update')
    })

    it('validates reservation exists (CORRECTION 1)', () => {
      expect(migrationSql).toContain('Reservation not found')
    })

    it('validates reservation belongs to authenticated user (CORRECTION 1)', () => {
      expect(migrationSql).toContain('Reservation belongs to a different user')
    })

    it('validates reservation belongs to the cycle (CORRECTION 1)', () => {
      expect(migrationSql).toContain('Reservation does not belong to cycle')
    })

    it('validates reservation references the exact question (CORRECTION 1)', () => {
      expect(migrationSql).toContain('Question mismatch. Reserved question:')
    })

    it('validates reservation not already consumed (CORRECTION 1/5)', () => {
      expect(migrationSql).toContain('is_correct = true')
    })

    it('validates cycle exists and belongs to user (CORRECTION 1)', () => {
      expect(migrationSql).toContain('Remediation cycle not found')
      expect(migrationSql).toContain('Cycle belongs to a different user')
    })

    it('validates cycle concept matches reservation concept (CORRECTION 1)', () => {
      expect(migrationSql).toContain('Concept mismatch. Cycle concept:')
    })

    it('validates cycle does not have terminal outcome (CORRECTION 1)', () => {
      expect(migrationSql).toContain('already has terminal outcome')
    })

    // CORRECTION 2: Server-Authoritative Quiz Attempt Creation
    it('creates quiz_attempts with is_reassessment = true (CORRECTION 2)', () => {
      expect(migrationSql).toContain('true,                    -- is_reassessment = true (required by 6C-2d)')
    })

    it('creates quiz_attempts with remediation_cycle_id (CORRECTION 2)', () => {
      expect(migrationSql).toContain('p_cycle_id,              -- remediation_cycle_id (required by 6C-2d)')
    })

    it('creates quiz_attempts with target_concept_id (CORRECTION 2)', () => {
      expect(migrationSql).toContain('p_target_concept_id      -- target_concept_id (required by 6C-2d)')
    })

    it('creates quiz_attempts with completed_at = now() (CORRECTION 2)', () => {
      expect(migrationSql).toContain('now(),')
    })

    it('creates quiz_attempts with answers_json (CORRECTION 2)', () => {
      expect(migrationSql).toContain('p_answers_json,')
    })

    it('creates quiz_attempts with authenticated user_id (CORRECTION 2)', () => {
      expect(migrationSql).toContain('p_authenticated_user_id,')
    })

    // CORRECTION 3: Quiz Attempt ID Authority
    it('uses server-generated ID for quiz_attempts (CORRECTION 3)', () => {
      // The function returns the ID from the INSERT ... RETURNING clause
      expect(migrationSql).toContain('returning id into v_attempt_id')
    })

    it('updates reservation with real quiz_attempt_id (CORRECTION 3)', () => {
      expect(migrationSql).toContain('quiz_attempt_id = v_attempt_id')
    })

    // CORRECTION 5: Single-Consumption / Replay Protection
    it('is idempotent for already-consumed reservations (CORRECTION 5)', () => {
      expect(migrationSql).toContain('Already consumed and persisted')
    })

    it('returns existing attempt ID for idempotent replay (CORRECTION 5)', () => {
      expect(migrationSql).toContain('return v_attempt_id;')
    })

    it('detects inconsistent consumed state (CORRECTION 5)', () => {
      expect(migrationSql).toContain('inconsistent state')
    })

    it('uses row-level locking for concurrency safety (CORRECTION 5)', () => {
      // Both reservation and cycle are locked with FOR UPDATE
      const forUpdateCount = (migrationSql.match(/for update/g) || []).length
      expect(forUpdateCount).toBeGreaterThanOrEqual(2)
    })

    // Security
    it('uses security definer', () => {
      expect(migrationSql).toContain('security definer')
    })
  })

  describe('Documentation', () => {
    it('has function comment for consume_reservation_and_create_attempt', () => {
      expect(migrationSql).toContain('Phase 6C-3 CORRECTED')
    })

    it('has function comment for prevent_question_history_modification', () => {
      expect(migrationSql).toContain('Allows consumption updates')
    })
  })
})
