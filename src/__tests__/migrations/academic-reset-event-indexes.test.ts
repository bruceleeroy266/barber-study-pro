import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261003150000_academic_reset_event_indexes.sql',
  ),
  'utf8',
)

describe('academic reset event index hardening', () => {
  it('indexes every foreign-key lookup column on academic_reset_events', () => {
    expect(migration).toContain('idx_academic_reset_events_student_id')
    expect(migration).toContain('on public.academic_reset_events(student_id)')

    expect(migration).toContain('idx_academic_reset_events_school_id')
    expect(migration).toContain('on public.academic_reset_events(school_id)')

    expect(migration).toContain('idx_academic_reset_events_requested_by')
    expect(migration).toContain('on public.academic_reset_events(requested_by)')
  })

  it('is safe to re-run', () => {
    expect(migration.match(/create index if not exists/g)?.length).toBe(3)
  })
})
