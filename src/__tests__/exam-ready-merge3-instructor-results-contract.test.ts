import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Static contract guard; real JWT/RLS tests are required before release.
const migration = readFileSync('supabase/migrations/20261022010000_exam_ready_instructor_results_read_only.sql', 'utf8')
const endpoint = readFileSync('src/app/api/instructor/students/[studentId]/exam-ready/route.ts', 'utf8')

describe('EXAM-READY-MERGE-3 instructor-only reporting contract', () => {
  it('requires authenticated, approved, enabled instructor at the same school', () => {
    expect(migration).toContain('auth.uid()')
    expect(migration).toContain("role = 'instructor'")
    expect(migration).toContain("is_disabled, false")
    expect(migration).toContain("approval_status = 'approved'")
    expect(migration).toContain('s.school_id = v_school')
    expect(migration).toContain('t.school_id = v_school')
  })
  it('requires active assigned student and rejects ended assignments', () => {
    expect(migration).toContain('a.instructor_id = v_caller')
    expect(migration).toContain('a.is_active = true')
    expect(migration).toContain('a.ended_at is null')
  })
  it('returns scored results without raw keys or question snapshots', () => {
    expect(migration).toContain("'scoredCorrect', t.scored_correct")
    expect(migration).toContain("'domainBreakdown', t.domain_breakdown")
    expect(migration).not.toContain('comprehensive_exam_attempt_items')
    expect(migration).not.toContain('correct_option_snapshot')
    expect(migration).not.toContain('prompt_snapshot')
    expect(endpoint).toContain('get_assigned_student_comprehensive_exam_results')
  })
  it('limits execution to authenticated callers and read-only HTTP GET', () => {
    expect(migration).toContain('to authenticated;')
    expect(migration).toContain('from public, anon;')
    expect(endpoint).toContain('export async function GET(')
    expect(endpoint).not.toContain('export async function POST(')
  })
})
