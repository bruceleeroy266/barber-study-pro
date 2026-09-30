import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  join(process.cwd(), 'supabase/migrations/20260930213000_ha4_chapters_1_18_evidence_immutability.sql'),
  'utf8',
)

describe('HA-4 Chapters 1-18 persistence and immutable evidence', () => {
  it('denies authenticated mutation/deletion of completed or reassessment attempts', () => {
    expect(migration).toContain('completed_at is null')
    expect(migration).toContain('coalesce(is_reassessment, false) = false')
    expect(migration).toContain('for update to authenticated')
    expect(migration).toContain('for delete to authenticated')
  })

  it('adds database-level defense against rewriting or deleting historical evidence', () => {
    expect(migration).toContain('prevent_completed_quiz_attempt_modification')
    expect(migration).toContain('before update or delete on public.quiz_attempts')
    expect(migration).toContain("old.completed_at is not null")
    expect(migration).toContain("coalesce(old.is_reassessment, false)")
  })

  it('freezes the original remediation detection snapshot while lifecycle state can advance', () => {
    expect(migration).toContain('prevent_remediation_detection_snapshot_mutation')
    expect(migration).toContain('new.detection_evidence is distinct from old.detection_evidence')
    expect(migration).toContain('new.detection_state is distinct from old.detection_state')
    expect(migration).toContain('new.targeted_at is distinct from old.targeted_at')
    expect(migration).toContain('before update on public.remediation_cycles')
  })

  it('preserves append-only recovery rather than erasing initial evidence', () => {
    expect(migration).not.toContain('delete from public.quiz_attempts')
    expect(migration).not.toContain('update public.quiz_attempts')
    expect(migration).toContain('allowing append-only new attempts')
  })
})
