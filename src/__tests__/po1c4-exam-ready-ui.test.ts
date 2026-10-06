import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')

describe('PO-1C.4 Exam Ready simulator UI', () => {
  const shell = read('src/components/comprehensive-exam/ExamShell.tsx')
  const page = read('src/app/(dashboard)/dashboard/exam-ready/page.tsx')
  const question = read('src/components/comprehensive-exam/ExamQuestion.tsx')
  const navigator = read('src/components/comprehensive-exam/QuestionNavigator.tsx')
  const review = read('src/components/comprehensive-exam/ReviewScreen.tsx')
  const results = read('src/components/comprehensive-exam/ExamResults.tsx')
  const dashboard = read('src/app/(dashboard)/dashboard/page.tsx')
  const combined = [shell, page, question, navigator, review, results].join('\n').toLowerCase()

  it('adds the student route and dashboard entry point', () => {
    expect(page).toContain('ExamShell')
    expect(page).toContain("profile.role !== 'student' && profile.role !== 'apprentice'")
    expect(dashboard).toContain('href="/dashboard/exam-ready"')
    expect(dashboard).toContain('110-question simulator')
  })

  it('uses only the authenticated comprehensive-exam API boundary', () => {
    expect(shell).toContain("fetch('/api/comprehensive-exam/config'")
    expect(shell).toContain("fetch('/api/comprehensive-exam/history'")
    expect(shell).toContain("fetch('/api/comprehensive-exam/attempts'")
    expect(shell).toContain('/answers/')
    expect(shell).toContain('/flags/')
    expect(shell).toContain('/submit')
    expect(combined).not.toContain(".from('comprehensive_exam")
    expect(combined).not.toContain('createServiceRoleClient')
  })

  it('derives countdown from server remainingSeconds and periodically reconciles', () => {
    expect(shell).toContain('next.remainingSeconds')
    expect(shell).toContain('60_000')
    expect(shell).not.toContain('new Date(attempt.expiresAt).getTime() - Date.now()')
  })

  it('autosaves answers and flags without revealing correctness', () => {
    expect(question).toContain('Saving answer…')
    expect(shell).toContain("setSaveMessage('Answer saved')")
    expect(question).toContain('Flag for review')
    expect(combined).not.toContain('correctoption')
    expect(combined).not.toContain('correct_answer')
    expect(combined).not.toContain('iscored')
  })

  it('supports 110-question navigation, review, explicit submit, results, and history', () => {
    expect(navigator).toContain('Question navigator')
    expect(shell).toContain('Review & Submit')
    expect(review).toContain('Confirm submit')
    expect(review).toContain('Unanswered')
    expect(results).toContain('domainBreakdown')
    expect(results).toContain('Attempt history')
    expect(shell).toContain('/110 answered')
  })

  it('does not write grades, mastery, readiness, H&A, or attendance', () => {
    for (const forbidden of [
      'hour_logs',
      'attendance_records',
      'attendance_corrections',
      'student_progress',
      'quiz_attempts',
      'remediation_cycles',
      'readiness_sync_status',
    ]) {
      expect(combined).not.toContain(forbidden)
    }
  })

  it('keeps pass/fail and official score server-owned', () => {
    expect(shell).not.toContain('percentage >=')
    expect(shell).not.toContain('scoredCorrect +')
    expect(results).toContain('result.passed')
    expect(results).toContain('result.percentage')
  })

  it('includes mobile and keyboard-accessible interaction semantics', () => {
    expect(question).toContain('focus:ring-2')
    expect(question).toContain('aria-pressed')
    expect(navigator).toContain('aria-current')
    expect(review).toContain('type="button"')
  })
})
