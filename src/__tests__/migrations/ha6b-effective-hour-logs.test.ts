import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migration = fs.readFileSync(
  path.join(
    process.cwd(),
    'supabase/migrations/20261001160000_ha6b_effective_hour_logs.sql',
  ),
  'utf8',
)

describe('H&A-6B canonical effective-hour read model', () => {
  it('creates a security-invoker canonical view', () => {
    expect(migration).toContain('create view public.effective_hour_logs')
    expect(migration).toContain('with (security_invoker = true)')
    expect(migration).toContain('grant select on public.effective_hour_logs to authenticated')
  })

  it('uses original minutes only for valid unadjusted approved rows', () => {
    expect(migration).toContain("then 'valid_unadjusted'")
    expect(migration).toContain('then h.minutes')
  })

  it('uses the latest valid adjustment only when the full chain matches the base record', () => {
    expect(migration).toContain('c.adjustment_count = h.adjustment_version')
    expect(migration).toContain('c.min_sequence = 1')
    expect(migration).toContain('c.max_sequence = h.adjustment_version')
    expect(migration).toContain('c.school_matches')
    expect(migration).toContain('c.student_matches')
    expect(migration).toContain('c.original_minutes_match')
    expect(migration).toContain('c.source_type_matches')
    expect(migration).toContain('c.attendance_source_matches')
    expect(migration).toContain('ls.links_valid')
    expect(migration).toContain('ls.first_value_matches')
    expect(migration).toContain('l.adjustment_sequence = h.adjustment_version')
    expect(migration).toContain('then l.new_effective_minutes')
  })

  it('makes normal pending/rejected rows contribute zero', () => {
    expect(migration).toContain("when h.status <> 'approved'")
    expect(migration).toContain("then 'not_approved'")
    expect(migration).toContain('then 0')
  })

  it('fails closed by returning null effective minutes for structurally invalid chains', () => {
    expect(migration).toContain("else 'invalid'")
    expect(migration).toContain('else null')
    expect(migration).toContain('effective_minutes is null then null')
  })

  it('preserves the original hour-log date/category because the read model does not rewrite them', () => {
    expect(migration).toContain('h.*')
    expect(migration).toContain('h.minutes as original_minutes')
  })

  it('does not cross into TLS or Chapter 1-21 learning state', () => {
    const lower = migration.toLowerCase()
    expect(lower).not.toContain('remediation_cycles')
    expect(lower).not.toContain('quiz_attempts')
    expect(lower).not.toContain('student_progress')
    expect(lower).not.toContain('src/lib/tls')
  })
})
