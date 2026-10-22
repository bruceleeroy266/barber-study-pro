import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (p: string) => readFileSync(p, 'utf8')
const sql = read('supabase/migrations/20261022010000_exam_ready_instructor_results_read_only.sql')
const examRuntime = read('supabase/migrations/20261002160000_po1c3_comprehensive_exam_runtime.sql')
const studentResults = read('src/components/comprehensive-exam/ExamResults.tsx')
const instructorPage = read('src/app/instructor/students/[studentId]/exam-ready/page.tsx')

describe('Exam Ready student/instructor score provenance contract', () => {
  it('reads the exact persisted final exam scores, rather than recalculating', () => {
    expect(examRuntime).toContain('scored_correct = v_scored_correct')
    expect(examRuntime).toContain('percentage = v_percentage')
    expect(examRuntime).toContain('domain_breakdown = v_domain_breakdown')
    for (const field of ['scored_correct', 'scored_total', 'percentage', 'passed', 'domain_breakdown']) {
      expect(sql).toContain('t.' + field)
    }
    expect(sql).not.toContain('comprehensive_exam_attempt_items')
  })

  it('never blends Exam Ready scores with chapter grade or hours', () => {
    const lower = sql.toLowerCase()
    for (const source of ['quiz_attempts', 'student_progress', 'hour_logs', 'attendance_records', 'study_sessions']) {
      expect(lower).not.toContain(source)
    }
  })

  it('student and instructor displays use the stored percentage and domain breakdown', () => {
    expect(studentResults).toContain('result.percentage')
    expect(studentResults).toContain('result.domainBreakdown')
    expect(instructorPage).toContain('attempt.percentage')
    expect(instructorPage).toContain('attempt.domainBreakdown')
    expect(instructorPage).not.toContain('correctOption')
    expect(instructorPage).not.toContain('correct_option_snapshot')
  })

  it('restricts reporting to finalized attempts and approved assigned instructors', () => {
    expect(sql).toContain("t.status in ('completed', 'expired', 'recovered_finalized')")
    expect(sql).toContain("role = 'instructor'")
    expect(sql).toContain("approval_status = 'approved'")
    expect(sql).toContain('a.instructor_id = v_caller')
    expect(sql).toContain('a.is_active = true')
    expect(sql).toContain('a.ended_at is null')
    expect(sql).toContain('s.school_id = v_school')
    expect(sql).toContain('t.school_id = v_school')
  })
})
