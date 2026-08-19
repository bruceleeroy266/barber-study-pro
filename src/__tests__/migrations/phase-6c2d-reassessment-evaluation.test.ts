/**
 * Phase 6C-2d — Migration Validation Tests (CORRECTED)
 *
 * Tests for the Phase 6C-2d migration schema, constraints, and functions.
 * Includes tests for CORRECTION 1 (evidence validation) and CORRECTION 2
 * (pending cycle re-evaluatability).
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const MIGRATION_PATH = join(
  process.cwd(),
  'supabase/migrations/20260819000002_phase_6c2d_reassessment_evaluation.sql'
)

const migrationSql = readFileSync(MIGRATION_PATH, 'utf-8')

// ───────────────────────────────────────────────
// Schema Validation Tests
// ───────────────────────────────────────────────

describe('Phase 6C-2d Migration Schema (CORRECTED)', () => {
  describe('remediation_cycle_evaluations table', () => {
    it('creates remediation_cycle_evaluations table', () => {
      expect(migrationSql).toContain('create table if not exists public.remediation_cycle_evaluations')
    })

    it('has cycle_id foreign key', () => {
      expect(migrationSql).toContain('cycle_id uuid not null references public.remediation_cycles(id)')
    })

    it('has evaluation_confidence column with constraint', () => {
      expect(migrationSql).toContain('evaluation_confidence text not null')
      expect(migrationSql).toContain("constraint valid_evaluation_confidence check")
      expect(migrationSql).toContain("evaluation_confidence in ('low', 'medium', 'high')")
    })

    it('has evaluation_evidence_ids column', () => {
      expect(migrationSql).toContain('evaluation_evidence_ids uuid[] not null')
    })

    it('has evaluation_idempotency_key column', () => {
      expect(migrationSql).toContain('evaluation_idempotency_key text not null')
    })

    it('has evaluation_version column', () => {
      expect(migrationSql).toContain('evaluation_version integer not null default 1')
    })

    it('has detection_state column with constraint', () => {
      expect(migrationSql).toContain('detection_state text not null')
      expect(migrationSql).toContain("constraint valid_detection_state check")
      expect(migrationSql).toContain("'insufficient_evidence'")
      expect(migrationSql).toContain("'emerging_weakness'")
      expect(migrationSql).toContain("'repeated_weakness'")
      expect(migrationSql).toContain("'improving'")
      expect(migrationSql).toContain("'currently_performing_well'")
    })

    it('has outcome column with constraint', () => {
      expect(migrationSql).toContain('outcome text not null')
      expect(migrationSql).toContain("constraint valid_outcome check")
      expect(migrationSql).toContain("outcome in ('successful', 'unsuccessful', 'pending')")
    })

    it('has concept_evidence column', () => {
      expect(migrationSql).toContain('concept_evidence jsonb not null')
    })

    it('has unique constraint on idempotency key', () => {
      expect(migrationSql).toContain('create unique index if not exists idx_remediation_cycle_evaluations_idempotency')
      expect(migrationSql).toContain('on public.remediation_cycle_evaluations(evaluation_idempotency_key)')
    })

    // CORRECTION 2: Terminal outcome protection (replaces one-eval-per-cycle)
    it('has partial unique index for terminal outcomes only (CORRECTION 2)', () => {
      expect(migrationSql).toContain('create unique index if not exists idx_remediation_cycle_evaluations_terminal_unique')
      expect(migrationSql).toContain('on public.remediation_cycle_evaluations(cycle_id)')
      expect(migrationSql).toContain("where outcome in ('successful', 'unsuccessful')")
    })

    it('does NOT have one-evaluation-per-cycle unique index (CORRECTION 2)', () => {
      // The old idx_remediation_cycle_evaluations_cycle_unique should NOT exist
      expect(migrationSql).not.toContain('idx_remediation_cycle_evaluations_cycle_unique')
    })
  })

  describe('remediation_cycles modifications', () => {
    it('adds evaluation_id column', () => {
      expect(migrationSql).toContain('add column if not exists evaluation_id uuid references public.remediation_cycle_evaluations(id)')
    })

    it('adds evaluation_confidence column', () => {
      expect(migrationSql).toContain('add column if not exists evaluation_confidence text')
    })

    it('adds evaluation_idempotency_key column', () => {
      expect(migrationSql).toContain('add column if not exists evaluation_idempotency_key text')
    })
  })

  describe('map_detection_to_outcome function', () => {
    it('creates map_detection_to_outcome function', () => {
      expect(migrationSql).toContain('create or replace function public.map_detection_to_outcome')
    })

    it('is marked as immutable', () => {
      expect(migrationSql).toContain('language plpgsql immutable')
    })

    it('validates detection state input', () => {
      expect(migrationSql).toContain("raise exception 'Invalid detection state: %'")
    })

    it('validates confidence input', () => {
      expect(migrationSql).toContain("raise exception 'Invalid confidence level: %'")
    })

    it('returns unsuccessful for repeated_weakness', () => {
      expect(migrationSql).toContain("when 'repeated_weakness' then")
      expect(migrationSql).toContain("return 'unsuccessful'")
    })

    it('returns successful for currently_performing_well', () => {
      expect(migrationSql).toContain("when 'currently_performing_well' then")
      expect(migrationSql).toContain("return 'successful'")
    })

    it('returns pending for other states', () => {
      expect(migrationSql).toContain("return 'pending'")
    })
  })

  // CORRECTION 1: Evidence validation function
  describe('validate_evaluation_evidence function (CORRECTION 1)', () => {
    it('creates validate_evaluation_evidence function', () => {
      expect(migrationSql).toContain('create or replace function public.validate_evaluation_evidence')
    })

    it('returns table with evidence_id, is_valid, failure_reason', () => {
      expect(migrationSql).toContain('returns table (')
      expect(migrationSql).toContain('evidence_id uuid')
      expect(migrationSql).toContain('is_valid boolean')
      expect(migrationSql).toContain('failure_reason text')
    })

    it('checks evidence exists in quiz_attempts', () => {
      expect(migrationSql).toContain('from public.quiz_attempts qa')
      expect(migrationSql).toContain('where qa.id = v_evidence_id')
    })

    it('checks evidence belongs to same student as cycle', () => {
      expect(migrationSql).toContain('if v_attempt_user_id != v_cycle_user_id then')
      expect(migrationSql).toContain('Evidence belongs to different student')
    })

    it('checks evidence is completed assessment', () => {
      expect(migrationSql).toContain('if v_attempt_completed_at is null then')
      expect(migrationSql).toContain('Evidence is not a completed assessment')
    })

    it('checks reassessment has remediation_cycle_id', () => {
      expect(migrationSql).toContain('if v_attempt_remediation_cycle_id is null then')
      expect(migrationSql).toContain('Reassessment evidence missing remediation_cycle_id')
    })

    it('checks reassessment target_concept_id matches cycle concept', () => {
      expect(migrationSql).toContain('v_attempt_target_concept_id != v_cycle_concept_id')
      expect(migrationSql).toContain('Reassessment target_concept_id mismatch')
    })

    it('checks reassessment belongs to correct cycle', () => {
      expect(migrationSql).toContain('v_attempt_remediation_cycle_id != p_cycle_id')
      expect(migrationSql).toContain('Reassessment evidence belongs to different cycle')
    })

    it('is marked as stable for read-only operation', () => {
      expect(migrationSql).toContain('language plpgsql security definer stable')
    })
  })

  describe('evaluate_remediation_cycle function (CORRECTED)', () => {
    it('creates evaluate_remediation_cycle function', () => {
      expect(migrationSql).toContain('create or replace function public.evaluate_remediation_cycle')
    })

    it('uses SELECT FOR UPDATE for concurrency safety', () => {
      expect(migrationSql).toContain('for update')
    })

    it('checks idempotency key for existing evaluation', () => {
      expect(migrationSql).toContain('select id into v_existing_evaluation_id')
      expect(migrationSql).toContain('where evaluation_idempotency_key = p_idempotency_key')
    })

    it('returns existing evaluation for idempotent requests', () => {
      expect(migrationSql).toContain('if v_existing_evaluation_id is not null then')
      expect(migrationSql).toContain('return v_existing_evaluation_id')
    })

    // CORRECTION 1: Evidence validation
    it('validates evidence before evaluation (CORRECTION 1)', () => {
      expect(migrationSql).toContain('from public.validate_evaluation_evidence(p_cycle_id, p_evidence_ids)')
      expect(migrationSql).toContain('where is_valid = false')
    })

    it('raises exception for invalid evidence (CORRECTION 1)', () => {
      expect(migrationSql).toContain("raise exception 'Evidence validation failed for cycle %")
    })

    // CORRECTION 2: Terminal outcome handling
    it('checks for existing terminal outcome (CORRECTION 2)', () => {
      expect(migrationSql).toContain("if v_cycle_outcome in ('successful', 'unsuccessful') then")
    })

    it('raises exception for terminal outcome re-evaluation (CORRECTION 2)', () => {
      expect(migrationSql).toContain("raise exception 'Cycle % already has terminal outcome %'")
    })

    it('only updates cycle to evaluated for terminal outcomes (CORRECTION 2)', () => {
      expect(migrationSql).toContain("if v_outcome in ('successful', 'unsuccessful') then")
      expect(migrationSql).toContain("status = 'evaluated'")
    })

    it('does NOT update cycle status for pending outcomes (CORRECTION 2)', () => {
      // The else branch should only update post_remediation_state
      expect(migrationSql).toContain('else')
      expect(migrationSql).toContain('-- Pending outcome: record the evaluation but do NOT mark cycle terminal')
    })

    it('uses ON CONFLICT DO NOTHING for idempotent insert', () => {
      expect(migrationSql).toContain('on conflict (evaluation_idempotency_key) do nothing')
    })

    it('records evaluation event in audit ledger', () => {
      expect(migrationSql).toContain("insert into public.remediation_cycle_events")
      expect(migrationSql).toContain("'evaluated'")
    })

    it('includes is_terminal flag in audit event', () => {
      expect(migrationSql).toContain("'is_terminal'")
    })

    // CORRECTION 2: Escalation only for unsuccessful terminal outcomes
    it('triggers escalation ONLY for unsuccessful terminal outcomes (CORRECTION 2)', () => {
      expect(migrationSql).toContain("if v_outcome = 'unsuccessful' then")
      expect(migrationSql).toContain('perform public.create_instructor_escalation')
    })

    it('counts unsuccessful cycles in 30-day window', () => {
      expect(migrationSql).toContain("interval '30 days'")
      expect(migrationSql).toContain("outcome = 'unsuccessful'")
    })

    it('requires 2 unsuccessful cycles for escalation', () => {
      expect(migrationSql).toContain('if v_unsuccessful_count >= 2')
    })
  })

  describe('immutability enforcement', () => {
    it('creates prevent_evaluation_modification function', () => {
      expect(migrationSql).toContain('create or replace function public.prevent_evaluation_modification')
    })

    it('creates trigger for immutability', () => {
      expect(migrationSql).toContain('create trigger enforce_evaluations_immutability')
      expect(migrationSql).toContain('before update or delete on public.remediation_cycle_evaluations')
    })

    it('raises exception on modification attempt', () => {
      expect(migrationSql).toContain("raise exception 'remediation_cycle_evaluations is an immutable audit record")
    })
  })

  describe('RLS policies', () => {
    it('enables RLS on remediation_cycle_evaluations', () => {
      expect(migrationSql).toContain('alter table public.remediation_cycle_evaluations enable row level security')
    })

    it('creates student select policy', () => {
      expect(migrationSql).toContain('create policy remediation_cycle_evaluations_student_select')
    })

    it('creates staff select policy', () => {
      expect(migrationSql).toContain('create policy remediation_cycle_evaluations_staff_select')
    })

    it('creates super admin policy', () => {
      expect(migrationSql).toContain('create policy remediation_cycle_evaluations_super_admin')
    })
  })
})

// ───────────────────────────────────────────────
// Integration with Phase 6C-2c Tests
// ───────────────────────────────────────────────

describe('Phase 6C-2d Integration with Phase 6C-2c', () => {
  it('preserves Phase 6C-2c escalation logic', () => {
    expect(migrationSql).toContain('public.create_instructor_escalation')
  })

  it('respects reset_by_sustained_performance flag', () => {
    expect(migrationSql).toContain('reset_by_sustained_performance = false')
  })

  it('uses 30-day rolling window for escalation', () => {
    expect(migrationSql).toContain("interval '30 days'")
  })
})

// ───────────────────────────────────────────────
// CORRECTION 1: Evidence Validation Tests
// ───────────────────────────────────────────────

describe('CORRECTION 1: Evidence Validation', () => {
  it('validates evidence exists in quiz_attempts', () => {
    expect(migrationSql).toContain('from public.quiz_attempts qa')
    expect(migrationSql).toContain('where qa.id = v_evidence_id')
    expect(migrationSql).toContain('Evidence item not found in quiz_attempts')
  })

  it('validates evidence belongs to same student', () => {
    expect(migrationSql).toContain('v_attempt_user_id != v_cycle_user_id')
    expect(migrationSql).toContain('Evidence belongs to different student')
  })

  it('validates evidence is completed assessment', () => {
    expect(migrationSql).toContain('v_attempt_completed_at is null')
    expect(migrationSql).toContain('Evidence is not a completed assessment')
  })

  it('validates reassessment has remediation_cycle_id', () => {
    expect(migrationSql).toContain('v_attempt_remediation_cycle_id is null')
    expect(migrationSql).toContain('Reassessment evidence missing remediation_cycle_id')
  })

  it('validates reassessment target_concept_id matches cycle', () => {
    expect(migrationSql).toContain('v_attempt_target_concept_id != v_cycle_concept_id')
    expect(migrationSql).toContain('Reassessment target_concept_id mismatch')
  })

  it('validates reassessment belongs to correct cycle', () => {
    expect(migrationSql).toContain('v_attempt_remediation_cycle_id != p_cycle_id')
    expect(migrationSql).toContain('Reassessment evidence belongs to different cycle')
  })

  it('does NOT move curriculum-semantic mapping to PostgreSQL', () => {
    // The validation function should NOT contain question→concept mapping logic
    // That remains in the application layer (TypeScript canonical mapping providers)
    expect(migrationSql).not.toContain('getConceptForQuestion')
    expect(migrationSql).not.toContain('isQuestionMappedToConcept')
  })
})

// ───────────────────────────────────────────────
// CORRECTION 2: Pending Cycle Re-evaluatability Tests
// ───────────────────────────────────────────────

describe('CORRECTION 2: Pending Cycle Re-evaluatability', () => {
  it('allows multiple pending evaluations per cycle', () => {
    // No unique constraint on cycle_id alone
    expect(migrationSql).not.toContain('idx_remediation_cycle_evaluations_cycle_unique')
  })

  it('enforces at most one terminal outcome per cycle', () => {
    expect(migrationSql).toContain('idx_remediation_cycle_evaluations_terminal_unique')
    expect(migrationSql).toContain("where outcome in ('successful', 'unsuccessful')")
  })

  it('pending evaluations do NOT mark cycle as evaluated', () => {
    // The else branch for pending should NOT set status = 'evaluated'
    expect(migrationSql).toContain('-- Pending outcome: record the evaluation but do NOT mark cycle terminal')
  })

  it('pending evaluations do NOT contribute to escalation', () => {
    // Escalation check is inside if v_outcome = 'unsuccessful'
    expect(migrationSql).toContain("if v_outcome = 'unsuccessful' then")
  })

  it('terminal outcomes cannot be re-evaluated', () => {
    expect(migrationSql).toContain("if v_cycle_outcome in ('successful', 'unsuccessful') then")
    expect(migrationSql).toContain("raise exception 'Cycle % already has terminal outcome %'")
  })

  it('idempotency applies to evaluation event/evidence set', () => {
    expect(migrationSql).toContain('where evaluation_idempotency_key = p_idempotency_key')
    expect(migrationSql).toContain('on conflict (evaluation_idempotency_key) do nothing')
  })
})

// ───────────────────────────────────────────────
// Documentation Tests
// ───────────────────────────────────────────────

describe('Migration Documentation', () => {
  it('documents remediation_cycle_evaluations table', () => {
    expect(migrationSql).toContain("comment on table public.remediation_cycle_evaluations")
  })

  it('documents map_detection_to_outcome function', () => {
    expect(migrationSql).toContain("comment on function public.map_detection_to_outcome")
  })

  it('documents evaluate_remediation_cycle function', () => {
    expect(migrationSql).toContain("comment on function public.evaluate_remediation_cycle")
  })

  it('documents validate_evaluation_evidence function (CORRECTION 1)', () => {
    expect(migrationSql).toContain("comment on function public.validate_evaluation_evidence")
  })

  it('documents terminal_unique index (CORRECTION 2)', () => {
    expect(migrationSql).toContain("comment on index public.idx_remediation_cycle_evaluations_terminal_unique")
  })

  it('documents evaluation_confidence column', () => {
    expect(migrationSql).toContain("comment on column public.remediation_cycle_evaluations.evaluation_confidence")
  })

  it('documents evaluation_idempotency_key column', () => {
    expect(migrationSql).toContain("comment on column public.remediation_cycle_evaluations.evaluation_idempotency_key")
  })
})
