import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SHARED_GRADE_WEIGHTS, calculateSharedGrade } from './shared-grading'
import {
  buildLiveInstructorChapterGrade,
  type LiveInstructorActivityEvidenceRow,
} from './live-instructor-grade'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
} from './activity-evidence-registry'
import { calculateChapterProgress } from '../progress'
import { canAccessRoute, isInstructorOrAdmin } from '../security/permissions'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const certifiedLiveChapters = Array.from({ length: 20 }, (_, index) => index + 1) as readonly number[]

function allCorrectActivityRows(chapterId: string): LiveInstructorActivityEvidenceRow[] {
  return [
    ...getFlashcardEvidenceInventory(chapterId).map((itemId) => ({
      chapter_id: chapterId,
      source: 'flashcard' as const,
      item_id: itemId,
      is_correct: true,
    })),
    ...getScenarioEvidenceInventory(chapterId).map((itemId) => ({
      chapter_id: chapterId,
      source: 'scenario_application' as const,
      item_id: itemId,
      is_correct: true,
    })),
  ]
}

describe('G7-3 Chapters 1-20 final live data and percentage certification', () => {
  it('locks the canonical five-component grading contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const result = calculateSharedGrade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 70,
      scenarioApplicationPercent: 60,
      remediationReassessmentPercent: 100,
    })

    expect(result.componentWeights).toEqual(SHARED_GRADE_WEIGHTS)
    expect(result.recoveryApplied).toBe(true)
    expect(result.finalGrade).toBeGreaterThanOrEqual(result.baseGrade)
  })

  it('requires durable flashcard evidence for all certified chapters and real scenario inventories only where runtime scenarios exist', () => {
    for (const chapter of certifiedLiveChapters) {
      const chapterId = `ch-${chapter}`
      expect(getFlashcardEvidenceInventory(chapterId).length, `${chapterId} flashcards`).toBeGreaterThan(0)

      if (chapter === 18 || chapter === 19) {
        expect(getFlashcardEvidenceInventory(chapterId), `${chapterId} flashcards`).toHaveLength(chapter === 18 ? 50 : 60)
        expect(getScenarioEvidenceInventory(chapterId), `${chapterId} scenarios`).toEqual([])
        continue
      }

      expect(getScenarioEvidenceInventory(chapterId).length, `${chapterId} scenarios`).toBeGreaterThan(0)
    }
  })

  it('can produce a complete 100% ordinary grade where all runtime evidence components exist and keeps Chapters 18-19 provisional without fabricated scenarios', () => {
    for (const chapter of certifiedLiveChapters.filter((chapter) => chapter !== 18 && chapter !== 19)) {
      const chapterId = `ch-${chapter}`
      const result = buildLiveInstructorChapterGrade({
        chapterId,
        microCheckPercent: 100,
        chapterAssessmentPercent: 100,
        remediationReassessmentPercent: null,
        activityRows: allCorrectActivityRows(chapterId),
      })

      expect(result.components.microCheckPercent, chapterId).toBe(100)
      expect(result.components.flashcardPercent, chapterId).toBe(100)
      expect(result.components.chapterAssessmentPercent, chapterId).toBe(100)
      expect(result.components.scenarioApplicationPercent, chapterId).toBe(100)
      expect(result.components.remediationReassessmentPercent, chapterId).toBeNull()
      expect(result.evidenceComplete, chapterId).toBe(true)
      expect(result.grade.finalGrade, chapterId).toBe(100)
      expect(result.grade.recoveryApplied, chapterId).toBe(false)
    }

    const chapter18 = buildLiveInstructorChapterGrade({
      chapterId: 'ch-18',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: null,
      activityRows: allCorrectActivityRows('ch-18'),
    })

    expect(chapter18.components.microCheckPercent).toBe(100)
    expect(chapter18.components.flashcardPercent).toBe(100)
    expect(chapter18.components.chapterAssessmentPercent).toBe(100)
    expect(chapter18.components.scenarioApplicationPercent).toBeNull()
    expect(chapter18.components.remediationReassessmentPercent).toBeNull()
    expect(chapter18.evidenceComplete).toBe(false)
    expect(chapter18.grade.recoveryApplied).toBe(false)

    const chapter19 = buildLiveInstructorChapterGrade({
      chapterId: 'ch-19',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: null,
      activityRows: allCorrectActivityRows('ch-19'),
    })

    expect(chapter19.components.microCheckPercent).toBe(100)
    expect(chapter19.components.flashcardPercent).toBe(100)
    expect(chapter19.components.chapterAssessmentPercent).toBe(100)
    expect(chapter19.components.scenarioApplicationPercent).toBeNull()
    expect(chapter19.components.remediationReassessmentPercent).toBeNull()
    expect(chapter19.evidenceComplete).toBe(false)
    expect(chapter19.grade.recoveryApplied).toBe(false)
  })

  it('keeps completion percentage separate from mastery/grade percentage', () => {
    const completion = calculateChapterProgress(true, true, {
      lessonCompleted: true,
      knowledgeChecksCompleted: true,
    })
    const academic = buildLiveInstructorChapterGrade({
      chapterId: 'ch-1',
      microCheckPercent: 0,
      chapterAssessmentPercent: 0,
      remediationReassessmentPercent: null,
      activityRows: [],
    })

    expect(completion).toBe(100)
    expect(academic.grade.finalGrade).toBe(0)
    expect(academic.evidenceComplete).toBe(true)
  })

  it('persists student flashcard and scenario answers as immutable first-attempt evidence', () => {
    const migration = read('supabase/migrations/20260928043000_create_chapter_activity_evidence.sql')
    const flashcards = read('src/components/FlashcardClient.tsx')
    const scenario = read('src/components/chapter/ScenarioBlock.tsx')
    const proScenario = read('src/components/chapter/ProScenario.tsx')

    expect(migration).toContain('unique (user_id, chapter_id, source, item_id)')
    expect(migration).toContain("source in ('flashcard','scenario_application')")
    expect(migration).toContain('grant select, insert on table public.chapter_activity_evidence to authenticated')
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')

    expect(flashcards).toContain("source: 'flashcard'")
    expect(flashcards).toContain("selectedAnswer: 'got_it'")
    expect(flashcards).toContain("selectedAnswer: 'needs_practice'")
    expect(flashcards).toContain('persistChapterActivityEvidence')

    for (const component of [scenario, proScenario]) {
      expect(component).toContain("source: 'scenario_application'")
      expect(component).toContain('selectedAnswer: selected')
      expect(component).toContain('isCorrect: selected === scenarios[scenarioIdx]?.correctAnswer')
      expect(component).toContain('persistChapterActivityEvidence')
    }
  })

  it('uses one same-school authorized evidence surface for instructor and school-admin visibility', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const schoolPanel = read('src/components/school-owner/StudentPerformancePanel.tsx')
    const migration = read('supabase/migrations/20260928043000_create_chapter_activity_evidence.sql')

    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(canAccessRoute('instructor', '/instructor/student/student-g7')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-g7')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-g7')).toBe(false)

    expect(page.match(/\.from\('chapter_activity_evidence'\)/g)).toHaveLength(1)
    expect(page).toContain(".in('chapter_id', ['ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9','ch-10','ch-11','ch-12','ch-13','ch-14','ch-15','ch-16','ch-17','ch-18','ch-19','ch-20'])")
    expect(schoolPanel).toContain('href={`/instructor/student/${row.studentId}`}')
    expect(schoolPanel).toContain('View the same mastery diagnostics used by instructors')

    expect(migration).toContain('create policy chapter_activity_evidence_staff_select')
    expect(migration).toContain('current_user_school_id() = user_school_id(user_id)')
  })

  it('renders one live grade and one separate completion value for every certified live chapter and clearly marks provisional grades', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')

    for (const chapter of certifiedLiveChapters) {
      expect(page).toContain(`chapter${chapter}LiveGrade.grade.finalGrade`)
      expect(page).toContain(`chapter${chapter}LiveGrade.evidenceComplete`)
      expect(page).toContain(`chapter${chapter}Progress?.progress_percentage ?? 0`)
      expect(page).toContain(`buildLiveGrade('ch-${chapter}', chapter${chapter}Diagnostics)`)
    }

    expect(page.match(/Final live 20\/10\/40\/15\/15 evidence/g)).toHaveLength(20)
    expect(page.match(/Provisional — required evidence still incomplete/g)).toHaveLength(20)
    expect(page).toContain('keeps completion separate')
  })

  it('preserves Chapter 7 remediation-cycle identity through the live oversight route', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const start = page.indexOf('const chapter7Diagnostics = buildChapter7InstructorDiagnostics')
    const end = page.indexOf('const chapter8MicroCheckAttempts', start)
    const block = page.slice(start, end)

    expect(block).toContain('remediation_cycle_id: attempt.remediation_cycle_id ?? null')
  })
})
