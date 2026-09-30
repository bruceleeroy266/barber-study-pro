import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumContent } from '../chapter-16-premium'
import { chapter16PremiumFlashcards } from '../chapter-16-premium-flashcards'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import {
  ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS,
  getChapter16ConceptFamily,
} from './concepts'
import {
  chapter16ContentConceptMappings,
  chapter16FlashcardConceptMappings,
  chapter16QuizQuestionConceptMappings,
} from './mappings'
import { chapter16MicroChecks } from './micro-checks'
import { chapter16ReassessmentReserve, getChapter16ReassessmentReserve } from './reassessment-reserve'
import {
  appendChapter16ReassessmentEvidence,
  buildChapter16ReassessmentEvidence,
  buildChapter16RemediationPathForConcept,
  buildChapter16TargetedRemediationPlan,
  calculateChapter16RecoveredMastery,
  scoreChapter16ReassessmentCycle,
} from './targeted-remediation'
import {
  evaluateChapter16SafetyIntervention,
  getChapter16RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  buildChapter16InstructorDiagnostics,
  type Chapter16InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter16MicroCheckAttemptRow } from './micro-check-persistence'
import type { Chapter16EvidenceRecord } from './grading'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import {
  buildLiveInstructorChapterGrade,
  type LiveInstructorActivityEvidenceRow,
} from '../concept-mastery/live-instructor-grade'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '../remediation/chapter-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '../remediation/content-provider-registry'
import { getCanonicalMappingProvider, hasCanonicalMappingProvider } from '../reassessment/provider-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import { canAccessRoute, isInstructorOrAdmin } from '../security/permissions'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const ev = (
  conceptFamilyId: Chapter16EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter16EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter16EvidenceRecord['difficulty'] = 'application',
): Chapter16EvidenceRecord => ({
  studentId: 'student-c16-final',
  chapterId: 'ch-16',
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

describe('C16-9 final Chapter 16 end-to-end certification', () => {
  it('locks the complete inventory and namespace boundaries', () => {
    const lessonIds = chapter16PremiumContent.sections.map((section) => section.id)
    const flashcardIds = chapter16PremiumFlashcards.map((card) => card.id)
    const assessmentIds = chapter16PremiumQuizQuestions.map((question) => question.id)
    const microIds = chapter16MicroChecks.flatMap((check) => check.questions.map((question) => question.id))
    const reassessmentIds = chapter16ReassessmentReserve.map((question) => question.id)

    expect(lessonIds).toHaveLength(93)
    expect(new Set(lessonIds).size).toBe(93)
    expect(flashcardIds).toHaveLength(68)
    expect(new Set(flashcardIds).size).toBe(68)
    expect(assessmentIds).toHaveLength(30)
    expect(new Set(assessmentIds).size).toBe(30)
    expect(microIds).toHaveLength(16)
    expect(new Set(microIds).size).toBe(16)
    expect(reassessmentIds).toHaveLength(40)
    expect(new Set(reassessmentIds).size).toBe(40)

    expect(microIds.every((id) => id.startsWith('mcq-16-'))).toBe(true)
    expect(reassessmentIds.every((id) => id.startsWith('r16-'))).toBe(true)
    expect(reassessmentIds.some((id) => assessmentIds.includes(id as never))).toBe(false)
    expect(reassessmentIds.some((id) => microIds.includes(id as never))).toBe(false)
  })

  it('gives every concept lesson, flashcard, assessment, micro-check, and reassessment coverage', () => {
    expect(ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS).toHaveLength(8)

    for (const conceptFamilyId of ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS) {
      expect(chapter16ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter16FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter16QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      const micro = chapter16MicroChecks.find((check) => check.conceptFamilyId === conceptFamilyId)
      expect(micro, conceptFamilyId).toBeDefined()
      expect(micro!.questions, conceptFamilyId).toHaveLength(2)
      expect(getChapter16ReassessmentReserve(conceptFamilyId), conceptFamilyId).toHaveLength(5)
    }
  })

  it('keeps Chapter 16 on durable activity evidence and shared live grading', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-16')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-16')).toHaveLength(68)
    expect(getScenarioEvidenceInventory('ch-16')).toHaveLength(7)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-16').map((itemId) => ({
        chapter_id: 'ch-16',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      })),
      ...getScenarioEvidenceInventory('ch-16').map((itemId) => ({
        chapter_id: 'ch-16',
        source: 'scenario_application' as const,
        item_id: itemId,
        is_correct: true,
      })),
    ]

    const live = buildLiveInstructorChapterGrade({
      chapterId: 'ch-16',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: 100,
      activityRows,
    })
    expect(live.evidenceComplete).toBe(true)
    expect(live.grade.componentWeights).toBe(SHARED_GRADE_WEIGHTS)
    expect(live.grade.finalGrade).toBe(100)
  })

  it('registers detection, remediation content, and five-question reassessment providers', () => {
    expect(isConceptDetectionSupported('ch-16')).toBe(true)
    expect(getChapterDetectionProvider('ch-16')).toBeDefined()
    expect(hasChapterContentProvider('ch-16')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-16')).toBe(true)

    const content = getChapterContentProvider('ch-16')!
    const mapping = getCanonicalMappingProvider('ch-16')
    for (const conceptFamilyId of ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS) {
      const path = buildChapter16RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(content.getContentBlockIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.contentBlockIds)
      expect(content.getFlashcardIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.flashcardIds)
      const ids = mapping.getQuestionsForConcept(conceptFamilyId)
      expect(ids, conceptFamilyId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r16-')), conceptFamilyId).toBe(true)
      expect(ids.every((id) => content.getQuizQuestionById(id)?.id === id), conceptFamilyId).toBe(true)
    }
  })

  it('proves ordinary targeted remediation and 80-percent recovery without erasing original misses', () => {
    const conceptFamilyId = 'ch16-blunt-cut'
    const original = [
      ev(conceptFamilyId, 'mcq-16-003', false, 'micro_check', '2026-09-29T23:50:00.000Z'),
      ev(conceptFamilyId, 'qq-16-007', false, 'chapter_assessment', '2026-09-29T23:51:00.000Z'),
      ev(conceptFamilyId, 'fc-ch16-010', true, 'flashcard', '2026-09-29T23:52:00.000Z', 'understanding'),
      ev(conceptFamilyId, 'blunt-cut-scenario:0', false, 'scenario_application', '2026-09-29T23:53:00.000Z', 'scenario'),
    ]

    const plan = buildChapter16TargetedRemediationPlan(original, '2026-09-29T23:54:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === conceptFamilyId)!
    expect(target.priority).toBe('standard')
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)
    expect(target.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target.remediationFlashcardIds.length).toBeGreaterThan(0)

    const reserve = getChapter16ReassessmentReserve(conceptFamilyId)
    const responses = reserve.map((question, index) => ({ questionId: question.id, correct: index < 4 }))
    const cycle = scoreChapter16ReassessmentCycle({
      cycleId: 'c16-final-ordinary',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses,
      passPercent: 80,
    })
    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)

    const reassessment = buildChapter16ReassessmentEvidence({
      studentId: 'student-c16-final',
      conceptFamilyId,
      selectedQuestions: reserve,
      responses,
      timestamp: '2026-09-29T23:55:00.000Z',
    })
    const recovered = calculateChapter16RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-29T23:56:00.000Z',
    )
    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(3)
    expect(recovered.after.reassessmentCorrectCount).toBe(4)

    const combined = appendChapter16ReassessmentEvidence(original, reassessment)
    expect(combined.slice(0, original.length)).toEqual(original)
  })

  it('proves urgent two-hazard safety escalation requires perfect 5/5 recovery', () => {
    const safetyEvidence = [
      ev('ch16-advanced-techniques-texturizing', 'mcq-16-013', false, 'micro_check', '2026-09-29T23:57:00.000Z'),
      ev('ch16-styling-finishing-safety', 'mcq-16-015', false, 'micro_check', '2026-09-29T23:58:00.000Z'),
    ]
    const intervention = evaluateChapter16SafetyIntervention(safetyEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.requiresInstructorReview).toBe(true)
    expect(intervention.requiresFormalSafetyReassessment).toBe(true)
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)
    expect(getChapter16RequiredReassessmentPassPercent(safetyEvidence, 'ch16-advanced-techniques-texturizing')).toBe(100)
    expect(getChapter16RequiredReassessmentPassPercent(safetyEvidence, 'ch16-styling-finishing-safety')).toBe(100)

    const reserve = getChapter16ReassessmentReserve('ch16-styling-finishing-safety')
    const four = scoreChapter16ReassessmentCycle({
      cycleId: 'c16-final-urgent-fail',
      conceptFamilyId: 'ch16-styling-finishing-safety',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question, index) => ({ questionId: question.id, correct: index < 4 })),
      passPercent: 100,
    })
    const five = scoreChapter16ReassessmentCycle({
      cycleId: 'c16-final-urgent-pass',
      conceptFamilyId: 'ch16-styling-finishing-safety',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question) => ({ questionId: question.id, correct: true })),
      passPercent: 100,
    })
    expect(four.percent).toBe(80)
    expect(four.passed).toBe(false)
    expect(five.percent).toBe(100)
    expect(five.passed).toBe(true)
  })

  it('shows preserved misses and reassessment recovery in Chapter 16 instructor diagnostics', () => {
    const conceptFamilyId = 'ch16-blunt-cut'
    const initialQuestions = chapter16PremiumQuizQuestions.filter((question) =>
      chapter16QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === conceptFamilyId,
      ),
    )
    const initialAttempt: Chapter16InstructorQuizAttempt = {
      quiz_id: 'quiz-16',
      percentage: 60,
      answers_json: Object.fromEntries(
        initialQuestions.map((question, index) => [
          question.id,
          index < 2 ? wrongAnswer(question.correct_answer) : question.correct_answer,
        ]),
      ),
      completed_at: '2026-09-30T00:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }
    const reserve = getChapter16ReassessmentReserve(conceptFamilyId)
    const reassessmentAttempt: Chapter16InstructorQuizAttempt = {
      quiz_id: 'quiz-16',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-30T00:05:00.000Z',
      is_reassessment: true,
      target_concept_id: conceptFamilyId,
      remediation_cycle_id: 'cycle-c16-final',
    }

    const microRows: Chapter16MicroCheckAttemptRow[] = []
    const diagnostics = buildChapter16InstructorDiagnostics({
      studentId: 'student-c16-final',
      completionPercent: 100,
      microCheckRows: microRows,
      quizAttempts: [reassessmentAttempt, initialAttempt],
      referenceTime: '2026-09-30T00:06:00.000Z',
    })
    const concept = diagnostics.concepts.find(
      (item) => item.conceptName === getChapter16ConceptFamily(conceptFamilyId).name,
    )
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
  })

  it('keeps staff visibility same-school authorized and privacy limited', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-c16')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c16')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-c16')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-16'")
    expect(page).toContain("attempt.quiz_id === 'quiz-16'")
    expect(page).toContain("buildLiveGrade('ch-16', chapter16Diagnostics)")
    expect(page).toContain("Chapter 16 — Women's Haircutting & Styling")
    expect(page).toContain('chapter16Diagnostics.weakestConcepts')
    expect(page).toContain('chapter16Diagnostics.remediationStatus')
    expect(page).toContain('chapter16Diagnostics.latestReassessment')
    expect(page).toContain('chapter16Diagnostics.safetyIntervention.requiresInstructorReview')

    const marker = '{/* Chapter 16 mastery, safety, remediation & instructor visibility */}'
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
