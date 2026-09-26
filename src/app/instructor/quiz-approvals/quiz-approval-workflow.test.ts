import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('instructor quiz approval workflow', () => {
  it('creates school-scoped approval settings, requests, audit events, and a validated request RPC', () => {
    const sql = source('supabase/migrations/20260926003000_instructor_quiz_approval.sql')

    expect(sql).toContain('create table if not exists public.quiz_approval_settings')
    expect(sql).toContain('create table if not exists public.quiz_access_requests')
    expect(sql).toContain('create table if not exists public.quiz_access_events')
    expect(sql).toContain('create or replace function public.request_quiz_access')
    expect(sql).toContain("v_role not in ('student','apprentice')")
    expect(sql).toContain('auto_approve_when_ready')
    expect(sql).toContain("event_type in ('started','completed')")
    expect(sql).not.toContain('Students manage own quiz access request')
  })

  it('gates student chapter quizzes and exposes the request action', () => {
    const chapter = source('src/app/(dashboard)/dashboard/chapters/[chapterNumber]/page.tsx')

    expect(chapter).toContain("from('quiz_approval_settings')")
    expect(chapter).toContain("from('quiz_access_requests')")
    expect(chapter).toContain('Instructor approval required')
    expect(chapter).toContain('Request Quiz Access')
    expect(chapter).toContain('quizAccessRequestId={quizAccessRequest?.id ?? null}')
  })

  it('logs start and completion for approved quiz access', () => {
    const quizClient = source('src/components/QuizClient.tsx')

    expect(quizClient).toContain("event_type: 'started'")
    expect(quizClient).toContain("event_type: 'completed'")
    expect(quizClient).toContain('quizAttemptId: persistedQuizAttemptId')
    expect(quizClient).toContain('passed: percentage >= passingScore')
  })

  it('adds staff queue controls and instructor navigation', () => {
    const page = source('src/app/instructor/quiz-approvals/page.tsx')
    const queue = source('src/app/instructor/quiz-approvals/QuizApprovalQueueClient.tsx')
    const nav = source('src/components/InstructorNav.tsx')

    expect(page).toContain('Require instructor approval')
    expect(page).toContain('Auto-approve when ready')
    expect(queue).toContain('Approve selected')
    expect(queue).toContain('Approve all pending')
    expect(queue).toContain('Deny')
    expect(nav).toContain("href: '/instructor/quiz-approvals'")
  })
})
