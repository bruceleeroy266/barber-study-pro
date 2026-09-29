import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumContent } from '../chapter-15-premium'
import { chapter15PremiumFlashcards } from '../chapter-15-premium-flashcards'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import {
  ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS,
  getChapter15ConceptFamily,
} from './concepts'
import {
  chapter15ContentConceptMappings,
  chapter15FlashcardConceptMappings,
  chapter15QuizQuestionConceptMappings,
} from './mappings'
import { chapter15MicroChecks } from './micro-checks'
import { chapter15ReassessmentReserve, getChapter15ReassessmentReserve } from './reassessment-reserve'
import {
  appendChapter15ReassessmentEvidence,
  buildChapter15ReassessmentEvidence,
  buildChapter15RemediationPathForConcept,
  buildChapter15TargetedRemediationPlan,
  calculateChapter15RecoveredMastery,
  scoreChapter15ReassessmentCycle,
} from './targeted-remediation'
import {
  evaluateChapter15SafetyIntervention,
  getChapter15RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  buildChapter15InstructorDiagnostics,
  type Chapter15InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter15MicroCheckAttemptRow } from './micro-check-persistence'
import type { Chapter15EvidenceRecord } from './grading'
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
  conceptFamilyId: Chapter15EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter15EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter15EvidenceRecord['difficulty'] = 'application',
): Chapter15EvidenceRecord => ({
  studentId: 'student-c15-final',
  chapterId: 'ch-15',
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

describe('C15-9 final Chapter 15 end-to-end certification', () => {
  it('locks the complete certified inventory and namespace boundaries', () => {
    const lessonIds = chapter15PremiumContent.sections.map((section) => section.id)
    const flashcardIds = chapter15PremiumFlashcards.map((card) => card.id)
    const assessmentIds = chapter15PremiumQuizQuestions.map((question) => question.id)
    const microIds = chapter15MicroChecks.flatMap((check) => check.questions.map((question) => question.id))
    const reassessmentIds = chapter15ReassessmentReserve.map((question) => question.id)

    expect(lessonIds).toHaveLength(54)
    expect(new Set(lessonIds).size).toBe(54)
    expect(flashcardIds).toHaveLength(90)
    expect(new Set(flashcardIds).size).toBe(90)
    expect(assessmentIds).toHaveLength(72)
    expect(new Set(assessmentIds).size).toBe(72)
    expect(microIds).toHaveLength(14)
    expect(new Set(microIds).size).toBe(14)
    expect(reassessmentIds).toHaveLength(35)
    expect(new Set(reassessmentIds).size).toBe(35)

    expect(microIds.every((id) => id.startsWith('mcq-15-'))).toBe(true)
    expect(reassessmentIds.every((id) => id.startsWith('r15-'))).toBe(true)
    expect(reassessmentIds.some((id) => assessmentIds.includes(id as never))).toBe(false)
    expect(reassessmentIds.some((id) => microIds.includes(id as never))).toBe(false)
  })

  it('gives every concept complete lesson → flashcard → assessment → micro-check → reassessment coverage', () => {
    expect(ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS).toHaveLength(7)

    for (const conceptFamilyId of ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS) {
      expect(
        chapter15ContentConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' lesson coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter15FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' flashcard coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter15QuizQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' assessment coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter15MicroChecks.filter((check) => check.conceptFamilyId === conceptFamilyId),
        conceptFamilyId + ' micro-check coverage',
      ).toHaveLength(1)
      expect(
        chapter15MicroChecks.find((check) => check.conceptFamilyId === conceptFamilyId)!.questions,
        conceptFamilyId + ' micro-check question count',
      ).toHaveLength(2)
      expect(getChapter15ReassessmentReserve(conceptFamilyId), conceptFamilyId + ' reassessment coverage').toHaveLength(5)
    }
  })

  it('keeps Chapter 15 on the shared durable evidence and 20/10/40/15/15 grade architecture', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-15')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-15')).toHaveLength(90)
    expect(getScenarioEvidenceInventory('ch-15')).toHaveLength(5)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-15').map((itemId) => ({
        chapter_id: 'ch-15',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      })),
      ...getScenarioEvidenceInventory('ch-15').map((itemId) => ({
        chapter_id: 'ch-15',
        source: 'scenario_application' as const,
        item_id: itemId,
        is_correct: true,
      })),
    ]

    const live = buildLiveInstructorChapterGrade({
      chapterId: 'ch-15',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: 100,
      activityRows,
    })

    expect(live.evidenceComplete).toBe(true)
    expect(live.grade.componentWeights).toBe(SHARED_GRADE_WEIGHTS)
    expect(live.grade.finalGrade).toBe(100)
  })

  it('registers Chapter 15 across shared detection, remediation, content, and reassessment providers', () => {
    expect(isConceptDetectionSupported('ch-15')).toBe(true)
    expect(getChapterDetectionProvider('ch-15')).toBeDefined()
    expect(hasChapterContentProvider('ch-15')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-15')).toBe(true)

    const contentProvider = getChapterContentProvider('ch-15')!
    const mappingProvider = getCanonicalMappingProvider('ch-15')

    for (const conceptFamilyId of ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS) {
      const path = buildChapter15RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(contentProvider.getContentBlockIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.contentBlockIds)
      expect(contentProvider.getFlashcardIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.flashcardIds)

      const reassessmentIds = mappingProvider.getQuestionsForConcept(conceptFamilyId)
      expect(reassessmentIds, conceptFamilyId).toHaveLength(5)
      expect(reassessmentIds.every((id) => id.startsWith('r15-')), conceptFamilyId).toBe(true)
      for (const id of reassessmentIds) {
        expect(contentProvider.getQuizQuestionById(id), id).toBeTruthy()
      }
    }
  })

  it('proves the ordinary end-to-end recovery chain without erasing original misses', () => {
    const conceptFamilyId = 'ch15-system-selection-measurement-template'
    const original = [
      ev(conceptFamilyId, 'mcq-15-007', false, 'micro_check', '2026-09-29T12:50:00.000Z'),
      ev(conceptFamilyId, 'qq-15-031', false, 'chapter_assessment', '2026-09-29T12:51:00.000Z'),
      ev(conceptFamilyId, 'fc-ch15-036', true, 'flashcard', '2026-09-29T12:52:00.000Z', 'understanding'),
      ev(conceptFamilyId, 'stock-custom-scenario:0', false, 'scenario_application', '2026-09-29T12:53:00.000Z', 'scenario'),
    ]

    const plan = buildChapter15TargetedRemediationPlan(original, '2026-09-29T12:54:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === conceptFamilyId)
    expect(target).toBeDefined()
    expect(target!.priority).toBe('standard')
    expect(target!.plannedReassessmentQuestionCount).toBe(5)
    expect(target!.plannedReassessmentPassPercent).toBe(80)
    expect(target!.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target!.remediationFlashcardIds.length).toBeGreaterThan(0)

    const reserve = getChapter15ReassessmentReserve(conceptFamilyId)
    const responses = reserve.map((question, index) => ({
      questionId: question.id,
      correct: index < 4,
    }))
    const cycle = scoreChapter15ReassessmentCycle({
      cycleId: 'c15-final-ordinary',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses,
      passPercent: 80,
    })
    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)

    const reassessment = buildChapter15ReassessmentEvidence({
      studentId: 'student-c15-final',
      conceptFamilyId,
      selectedQuestions: reserve,
      responses,
      timestamp: '2026-09-29T12:55:00.000Z',
    })
    const recovered = calculateChapter15RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-29T12:56:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(3)
    expect(recovered.after.reassessmentCorrectCount).toBe(4)

    const combined = appendChapter15ReassessmentEvidence(original, reassessment)
    expect(combined.slice(0, original.length)).toEqual(original)
  })

  it('proves urgent multi-hazard escalation requires a perfect five-question safety recovery', () => {
    const conceptFamilyId = 'ch15-alternatives-scope-referral'
    const safetyEvidence = [
      ev(conceptFamilyId, 'mcq-15-003', false, 'micro_check', '2026-09-29T13:00:00.000Z', 'scenario'),
      ev(conceptFamilyId, 'mcq-15-004', false, 'micro_check', '2026-09-29T13:01:00.000Z', 'scenario'),
    ]

    const intervention = evaluateChapter15SafetyIntervention(safetyEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.requiresInstructorReview).toBe(true)
    expect(intervention.requiresFormalSafetyReassessment).toBe(true)
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)
    expect(getChapter15RequiredReassessmentPassPercent(safetyEvidence, conceptFamilyId)).toBe(100)

    const reserve = getChapter15ReassessmentReserve(conceptFamilyId)
    const fourOfFive = scoreChapter15ReassessmentCycle({
      cycleId: 'c15-final-urgent-fail',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question, index) => ({ questionId: question.id, correct: index < 4 })),
      passPercent: 100,
    })
    const fiveOfFive = scoreChapter15ReassessmentCycle({
      cycleId: 'c15-final-urgent-pass',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question) => ({ questionId: question.id, correct: true })),
      passPercent: 100,
    })

    expect(fourOfFive.percent).toBe(80)
    expect(fourOfFive.passed).toBe(false)
    expect(fiveOfFive.percent).toBe(100)
    expect(fiveOfFive.passed).toBe(true)
  })

  it('proves recovered history is visible in authorized staff diagnostics', () => {
    const conceptFamilyId = 'ch15-system-selection-measurement-template'
    const initialQuestions = chapter15PremiumQuizQuestions.filter((question) =>
      chapter15QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === conceptFamilyId,
      ),
    )
    const initialAttempt: Chapter15InstructorQuizAttempt = {
      quiz_id: 'quiz-15',
      percentage: 75,
      answers_json: Object.fromEntries(
        initialQuestions.map((question, index) => [
          question.id,
          index < 2 ? wrongAnswer(question.correct_answer) : question.correct_answer,
        ]),
      ),
      completed_at: '2026-09-29T13:10:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter15ReassessmentReserve(conceptFamilyId)
    const reassessmentAttempt: Chapter15InstructorQuizAttempt = {
      quiz_id: 'quiz-15',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-29T13:15:00.000Z',
      is_reassessment: true,
      target_concept_id: conceptFamilyId,
      remediation_cycle_id: 'cycle-c15-final',
    }

    const microRows: Chapter15MicroCheckAttemptRow[] = []
    const diagnostics = buildChapter15InstructorDiagnostics({
      studentId: 'student-c15-final',
      completionPercent: 100,
      microCheckRows: microRows,
      quizAttempts: [reassessmentAttempt, initialAttempt],
      referenceTime: '2026-09-29T13:16:00.000Z',
    })

    const concept = diagnostics.concepts.find(
      (item) => item.conceptName === getChapter15ConceptFamily(conceptFamilyId).name,
    )
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.latestReassessment).toContain('System Selection')
  })

  it('keeps instructor/school-admin visibility same-school authorized and privacy limited', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-c15')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c15')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-c15')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-15'")
    expect(page).toContain('Chapter 15 — Men’s Hair Replacement')
    expect(page).toContain('chapter15Diagnostics.weakestConcepts')
    expect(page).toContain('chapter15Diagnostics.remediationStatus')
    expect(page).toContain('chapter15Diagnostics.latestReassessment')
    expect(page).toContain('chapter15Diagnostics.safetyIntervention.requiresInstructorReview')

    const marker = '{/* Chapter 15 mastery, safety, remediation & instructor visibility */}'
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
