import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter18PremiumContent } from '../chapter-18-premium'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import { ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter18ContentConceptMappings,
  chapter18FlashcardConceptMappings,
  chapter18QuizQuestionConceptMappings,
} from './mappings'
import { chapter18MicroChecks } from './micro-checks'
import { chapter18ReassessmentReserve, getChapter18ReassessmentReserve } from './reassessment-reserve'
import {
  appendChapter18ReassessmentEvidence,
  buildChapter18ReassessmentEvidence,
  buildChapter18RemediationPathForConcept,
  buildChapter18TargetedRemediationPlan,
  calculateChapter18RecoveredMastery,
  scoreChapter18ReassessmentCycle,
} from './targeted-remediation'
import {
  evaluateChapter18SafetyIntervention,
  getChapter18RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  buildChapter18InstructorDiagnostics,
  type Chapter18InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter18EvidenceRecord } from './grading'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import {
  buildLiveInstructorChapterGrade,
  type LiveInstructorActivityEvidenceRow,
} from '../concept-mastery/live-instructor-grade'
import { hasChapterContentProvider, getChapterContentProvider } from '../remediation/content-provider-registry'
import { hasCanonicalMappingProvider, getCanonicalMappingProvider } from '../reassessment/provider-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import { canAccessRoute, isInstructorOrAdmin } from '../security/permissions'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const ev = (
  conceptFamilyId: Chapter18EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter18EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter18EvidenceRecord['difficulty'] = 'application',
): Chapter18EvidenceRecord => ({
  studentId: 'student-c18-final',
  chapterId: 'ch-18',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((answer) => answer !== correct) ?? 'a'
}

describe('C18-9 final Chapter 18 end-to-end certification', () => {
  it('locks the complete certified inventory and namespace boundaries', () => {
    const lessonIds = chapter18PremiumContent.sections.map((section) => section.id)
    const flashcardIds = chapter18PremiumFlashcards.map((card) => card.id)
    const assessmentIds = chapter18PremiumQuizQuestions.map((question) => question.id)
    const microIds = chapter18MicroChecks.flatMap((check) => check.questions.map((question) => question.id))
    const reassessmentIds = chapter18ReassessmentReserve.map((question) => question.id)

    expect(lessonIds).toEqual(['chapter-18-lesson'])
    expect(flashcardIds).toHaveLength(50)
    expect(new Set(flashcardIds).size).toBe(50)
    expect(assessmentIds).toHaveLength(15)
    expect(new Set(assessmentIds).size).toBe(15)
    expect(microIds).toHaveLength(14)
    expect(new Set(microIds).size).toBe(14)
    expect(reassessmentIds).toHaveLength(35)
    expect(new Set(reassessmentIds).size).toBe(35)
    expect(microIds.every((id) => id.startsWith('mcq-18-'))).toBe(true)
    expect(reassessmentIds.every((id) => id.startsWith('r18-'))).toBe(true)
    expect(reassessmentIds.some((id) => assessmentIds.includes(id as never))).toBe(false)
    expect(reassessmentIds.some((id) => microIds.includes(id as never))).toBe(false)
  })

  it('gives all seven canonical concepts coverage across lesson, flashcards, assessment, micro-checks, and reassessment', () => {
    expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toHaveLength(7)
    for (const conceptFamilyId of ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS) {
      expect(chapter18ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter18FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter18QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      const micro = chapter18MicroChecks.find((check) => check.conceptFamilyId === conceptFamilyId)
      expect(micro, conceptFamilyId).toBeDefined()
      expect(micro!.questions, conceptFamilyId).toHaveLength(2)
      expect(getChapter18ReassessmentReserve(conceptFamilyId), conceptFamilyId).toHaveLength(5)
    }
  })

  it('keeps shared grading intact and Chapter 18 provisional only because real scenario evidence does not yet exist', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-18')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-18')).toHaveLength(50)
    expect(getScenarioEvidenceInventory('ch-18')).toEqual([])
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const activityRows: LiveInstructorActivityEvidenceRow[] = getFlashcardEvidenceInventory('ch-18').map((itemId) => ({
      chapter_id: 'ch-18',
      source: 'flashcard' as const,
      item_id: itemId,
      is_correct: true,
    }))
    const live = buildLiveInstructorChapterGrade({
      chapterId: 'ch-18',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: 100,
      activityRows,
    })
    expect(live.grade.componentWeights).toBe(SHARED_GRADE_WEIGHTS)
    expect(live.components.flashcardPercent).toBe(100)
    expect(live.components.scenarioApplicationPercent).toBeNull()
    expect(live.evidenceComplete).toBe(false)
  })

  it('registers targeted remediation content and five-question reassessment providers for every concept', () => {
    expect(hasChapterContentProvider('ch-18')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-18')).toBe(true)
    const content = getChapterContentProvider('ch-18')!
    const mapping = getCanonicalMappingProvider('ch-18')

    for (const conceptFamilyId of ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS) {
      const path = buildChapter18RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(content.getContentBlockIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.contentBlockIds)
      expect(content.getFlashcardIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.flashcardIds)
      const ids = mapping.getQuestionsForConcept(conceptFamilyId)
      expect(ids, conceptFamilyId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r18-')), conceptFamilyId).toBe(true)
      expect(ids.every((id) => content.getQuizQuestionById(id)?.id === id), conceptFamilyId).toBe(true)
    }
  })

  it('proves ordinary 80-percent mastery recovery while preserving original misses', () => {
    const conceptFamilyId = 'ch18-color-theory'
    const original = [
      ev(conceptFamilyId, 'qq-18-03', false, 'chapter_assessment', '2026-09-30T04:45:00.000Z'),
      ev(conceptFamilyId, 'qq-18-06', false, 'chapter_assessment', '2026-09-30T04:46:00.000Z'),
      ev(conceptFamilyId, 'fc-ch18-006', true, 'flashcard', '2026-09-30T04:47:00.000Z', 'understanding'),
    ]
    const plan = buildChapter18TargetedRemediationPlan(original, '2026-09-30T04:48:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === conceptFamilyId)!
    expect(target.priority).toBe('standard')
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)

    const reserve = getChapter18ReassessmentReserve(conceptFamilyId)
    const responses = reserve.map((question, index) => ({ questionId: question.id, correct: index < 4 }))
    const cycle = scoreChapter18ReassessmentCycle({
      cycleId: 'c18-final-ordinary',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses,
      passPercent: 80,
    })
    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)

    const reassessment = buildChapter18ReassessmentEvidence({
      studentId: 'student-c18-final',
      conceptFamilyId,
      selectedQuestions: reserve,
      responses,
      timestamp: '2026-09-30T04:49:00.000Z',
    })
    const recovered = calculateChapter18RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-30T04:50:00.000Z',
    )
    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(2)
    expect(recovered.after.reassessmentCorrectCount).toBe(4)
    expect(appendChapter18ReassessmentEvidence(original, reassessment).slice(0, original.length)).toEqual(original)
  })

  it('proves urgent multi-hazard safety recovery requires perfect 5/5', () => {
    const safetyEvidence = [
      ev('ch18-service-safety-chemical-handling', 'mcq-18-013', false, 'micro_check', '2026-09-30T04:51:00.000Z', 'scenario'),
      ev('ch18-developers-lighteners-toners', 'mcq-18-008', false, 'micro_check', '2026-09-30T04:52:00.000Z', 'scenario'),
    ]
    const intervention = evaluateChapter18SafetyIntervention(safetyEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.requiresInstructorReview).toBe(true)
    expect(intervention.requiresFormalSafetyReassessment).toBe(true)
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)
    expect(getChapter18RequiredReassessmentPassPercent(safetyEvidence, 'ch18-developers-lighteners-toners')).toBe(100)

    const reserve = getChapter18ReassessmentReserve('ch18-developers-lighteners-toners')
    const four = scoreChapter18ReassessmentCycle({
      cycleId: 'c18-final-urgent-fail',
      conceptFamilyId: 'ch18-developers-lighteners-toners',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question, index) => ({ questionId: question.id, correct: index < 4 })),
      passPercent: 100,
    })
    const five = scoreChapter18ReassessmentCycle({
      cycleId: 'c18-final-urgent-pass',
      conceptFamilyId: 'ch18-developers-lighteners-toners',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question) => ({ questionId: question.id, correct: true })),
      passPercent: 100,
    })
    expect(four.percent).toBe(80)
    expect(four.passed).toBe(false)
    expect(five.percent).toBe(100)
    expect(five.passed).toBe(true)
  })

  it('keeps instructor and school-admin visibility same-school authorized and privacy limited', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-c18')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c18')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-c18')).toBe(false)

    const initialQuestions = chapter18PremiumQuizQuestions.filter((question) =>
      chapter18QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === 'ch18-service-safety-chemical-handling',
      ),
    )
    const initialAttempt: Chapter18InstructorQuizAttempt = {
      quiz_id: 'quiz-18',
      percentage: 70,
      answers_json: Object.fromEntries(
        initialQuestions.map((question, index) => [
          question.id,
          index < 2 ? wrongAnswer(question.correct_answer) : question.correct_answer,
        ]),
      ),
      completed_at: '2026-09-30T04:55:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }
    const reserve = getChapter18ReassessmentReserve('ch18-service-safety-chemical-handling')
    const reassessmentAttempt: Chapter18InstructorQuizAttempt = {
      quiz_id: 'quiz-18',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-30T05:00:00.000Z',
      is_reassessment: true,
      target_concept_id: 'ch18-service-safety-chemical-handling',
      remediation_cycle_id: 'cycle-c18-final',
    }
    const diagnostics = buildChapter18InstructorDiagnostics({
      studentId: 'student-c18-final',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-30T05:01:00.000Z',
    })
    expect(diagnostics.concepts.some((concept) => concept.initialMisses >= 2 && concept.reassessmentCorrect === 5)).toBe(true)
    expect(diagnostics.latestReassessment).toContain('100%')

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-18'")
    expect(page).toContain("buildLiveGrade('ch-18', chapter18Diagnostics)")
    expect(page).toContain('Chapter 18 — Haircoloring and Lightening')

    const marker = '{/* Chapter 18 mastery, haircolor/lightener safety, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    const end = page.indexOf('</section>', start)
    expect(start).toBeGreaterThanOrEqual(0)
    expect(end).toBeGreaterThan(start)
    const panel = page.slice(start, end)
    expect(panel).not.toContain('answers_json')
    expect(panel).not.toContain('question_id')
    expect(panel).not.toContain('studentId')
  })
})
