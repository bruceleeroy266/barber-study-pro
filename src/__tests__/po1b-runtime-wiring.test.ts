import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')
}

const layout = read('src/app/(dashboard)/layout.tsx')
const hook = read('src/hooks/useStudySession.ts')
const lesson = read('src/components/chapter/ChapterContent.tsx')
const flashcards = read('src/components/FlashcardClient.tsx')
const quiz = read('src/components/QuizClient.tsx')
const remediation = read('src/components/remediation/RemediationPageClient.tsx')
const startRoute = read('src/app/api/study-sessions/start/route.ts')
const activityRoute = read('src/app/api/study-sessions/activity/route.ts')
const endRoute = read('src/app/api/study-sessions/end/route.ts')
const linkRoute = read('src/app/api/study-sessions/link-quiz-attempt/route.ts')

describe('PO-1B runtime telemetry wiring', () => {
  it('removes the global dashboard activity tracker', () => {
    expect(layout).not.toContain('StudyActivityTracker')
    expect(layout).not.toContain('<StudyActivityTracker')
  })

  it('starts telemetry lazily from explicit learning activity', () => {
    expect(hook).toContain("const recordActivity = useCallback")
    expect(hook).toContain("sendActivity('qualifying_activity')")
    expect(hook).not.toContain('void ensureSession()\n\n    const heartbeat')
    expect(hook).toContain("document.visibilityState !== 'visible'")
    expect(hook).toContain('ACTIVE_WINDOW_MS = 5 * 60_000')
  })

  it('does not use generic browser pointer/scroll listeners as the telemetry source', () => {
    expect(hook).not.toContain("addEventListener('pointerdown'")
    expect(hook).not.toContain("addEventListener('scroll'")
    expect(hook).not.toContain("addEventListener('keydown'")
    expect(hook).not.toContain("addEventListener('touchstart'")
  })

  it('wires lesson telemetry only inside the chapter learning surface', () => {
    expect(lesson).toContain("surfaceType: 'lesson'")
    expect(lesson).toContain('onPointerDownCapture={() => { void recordActivity() }}')
    expect(lesson).toContain('onKeyDownCapture={() => { void recordActivity() }}')
  })

  it('wires flashcard telemetry to actual review actions', () => {
    expect(flashcards).toContain("surfaceType: 'flashcards'")
    expect(flashcards).toContain('const handleFlip = () =>')
    expect(flashcards).toContain('void recordActivity()')
    expect(flashcards).toContain('const markCurrentCardMastered = async () =>')
  })

  it('wires quiz telemetry and persisted attempt linkage without changing feedback mode', () => {
    expect(quiz).toContain("surfaceType: 'quiz'")
    expect(quiz).toContain('void recordActivity()')
    expect(quiz).toContain('void linkQuizAttempt(persistedQuizAttemptId)')
    expect(quiz).toContain('void endSession()')
    expect(quiz).toContain('advance without revealing')
  })

  it('keeps remediation and reassessment telemetry distinct', () => {
    expect(remediation).toContain("surfaceType: 'remediation'")
    expect(remediation).toContain("surfaceType: 'reassessment'")
    expect(remediation).toContain('void recordRemediationActivity()')
    expect(remediation).toContain('void recordReassessmentActivity()')
  })

  it('uses authenticated server routes that delegate authority to database RPCs', () => {
    for (const route of [startRoute, activityRoute, endRoute, linkRoute]) {
      expect(route).toContain('supabase.auth.getUser()')
      expect(route).not.toContain('createServiceRoleClient')
    }
    expect(startRoute).toContain("supabase.rpc('begin_study_session'")
    expect(activityRoute).toContain("supabase.rpc('record_learning_activity'")
    expect(endRoute).toContain("supabase.rpc('end_study_session'")
    expect(linkRoute).toContain("supabase.rpc('link_study_quiz_attempt'")
  })

  it('does not introduce H&A or grading writes in telemetry runtime modules', () => {
    const runtime = [hook, startRoute, activityRoute, endRoute, linkRoute].join('\n').toLowerCase()
    expect(runtime).not.toContain('hour_logs')
    expect(runtime).not.toContain('effective_hour_logs')
    expect(runtime).not.toContain('attendance_corrections')
    expect(runtime).not.toContain('hour_adjustments')
    expect(runtime).not.toContain('student_progress')
    expect(runtime).not.toContain('update public.quiz_attempts')
  })
})
