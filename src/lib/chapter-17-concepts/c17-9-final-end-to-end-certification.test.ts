import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import {
  ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS,
  getChapter17ConceptFamily,
} from './concepts'
import {
  chapter17ContentConceptMappings,
  chapter17FlashcardConceptMappings,
  chapter17LearningQuestionConceptMappings,
  chapter17QuizQuestionConceptMappings,
} from './mappings'
import { chapter17MicroChecks } from './micro-checks'
import { chapter17ReassessmentReserve, getChapter17ReassessmentReserve } from './reassessment-reserve'
import {
  appendChapter17ReassessmentEvidence,
  buildChapter17ReassessmentEvidence,
  buildChapter17RemediationPathForConcept,
  buildChapter17TargetedRemediationPlan,
  calculateChapter17RecoveredMastery,
  scoreChapter17ReassessmentCycle,
} from './targeted-remediation'
import {
  chapter17SafetyTaggedItems,
  evaluateChapter17SafetyIntervention,
  getChapter17RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  buildChapter17InstructorDiagnostics,
  type Chapter17InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter17MicroCheckAttemptRow } from './micro-check-persistence'
import type { Chapter17EvidenceRecord } from './grading'
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
  conceptFamilyId: Chapter17EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter17EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter17EvidenceRecord['difficulty'] = 'application',
): Chapter17EvidenceRecord => ({
  studentId: 'student-c17-final',
  chapterId: 'ch-17',
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

describe('C17-9 final Chapter 17 end-to-end certification', () => {
  it('locks the complete certified inventory and namespace boundaries', () => {
    const lessonIds = chapter17PremiumContent.sections.map((section) => section.id)
    const flashcardIds = chapter17PremiumFlashcards.map((card) => card.id)
    const assessmentIds = chapter17PremiumQuizQuestions.map((question) => question.id)
    const learningIds = chapter17LearningQuestions.map((question) => question.id)
    const microIds = chapter17MicroChecks.flatMap((check) => check.questions.map((question) => question.id))
    const reassessmentIds = chapter17ReassessmentReserve.map((question) => question.id)

    expect(lessonIds).toHaveLength(24)
    expect(new Set(lessonIds).size).toBe(24)
    expect(flashcardIds).toHaveLength(60)
    expect(new Set(flashcardIds).size).toBe(60)
    expect(assessmentIds).toHaveLength(30)
    expect(new Set(assessmentIds).size).toBe(30)
    expect(learningIds).toHaveLength(16)
    expect(new Set(learningIds).size).toBe(16)
    expect(microIds).toHaveLength(14)
    expect(new Set(microIds).size).toBe(14)
    expect(reassessmentIds).toHaveLength(35)
    expect(new Set(reassessmentIds).size).toBe(35)

    expect(assessmentIds.every((id) => id.startsWith('qq-17-'))).toBe(true)
    expect(learningIds.every((id) => id.startsWith('lq-17-'))).toBe(true)
    expect(microIds.every((id) => id.startsWith('mcq-17-'))).toBe(true)
    expect(reassessmentIds.every((id) => id.startsWith('r17-'))).toBe(true)

    const priorIds = new Set([...assessmentIds, ...learningIds, ...microIds])
    expect(reassessmentIds.some((id) => priorIds.has(id as never))).toBe(false)
  })

  it('gives every concept complete lesson → flashcard → assessment → learning-question → micro-check → reassessment coverage', () => {
    expect(ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS).toHaveLength(7)

    for (const conceptFamilyId of ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS) {
      expect(
        chapter17ContentConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' lesson coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter17FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' flashcard coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter17QuizQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' assessment coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter17LearningQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).length,
        conceptFamilyId + ' learning-question coverage',
      ).toBeGreaterThan(0)
      expect(
        chapter17MicroChecks.filter((check) => check.conceptFamilyId === conceptFamilyId),
        conceptFamilyId + ' micro-check coverage',
      ).toHaveLength(1)
      expect(
        chapter17MicroChecks.find((check) => check.conceptFamilyId === conceptFamilyId)!.questions,
        conceptFamilyId + ' micro-check question count',
      ).toHaveLength(2)
      expect(getChapter17ReassessmentReserve(conceptFamilyId), conceptFamilyId + ' reassessment coverage').toHaveLength(5)
    }
  })

  it('keeps Chapter 17 on the shared durable evidence and 20/10/40/15/15 grade architecture', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-17')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-17')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-17')).toEqual(['scenario-1:0'])
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-17').map((itemId) => ({
        chapter_id: 'ch-17',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      })),
      ...getScenarioEvidenceInventory('ch-17').map((itemId) => ({
        chapter_id: 'ch-17',
        source: 'scenario_application' as const,
        item_id: itemId,
        is_correct: true,
      })),
    ]

    const live = buildLiveInstructorChapterGrade({
      chapterId: 'ch-17',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: 100,
      activityRows,
    })

    expect(live.evidenceComplete).toBe(true)
    expect(live.grade.componentWeights).toBe(SHARED_GRADE_WEIGHTS)
    expect(live.grade.finalGrade).toBe(100)
  })

  it('registers Chapter 17 across shared detection, remediation, content, and reassessment providers', () => {
    expect(isConceptDetectionSupported('ch-17')).toBe(true)
    expect(getChapterDetectionProvider('ch-17')).toBeDefined()
    expect(hasChapterContentProvider('ch-17')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-17')).toBe(true)

    const contentProvider = getChapterContentProvider('ch-17')!
    const mappingProvider = getCanonicalMappingProvider('ch-17')

    for (const conceptFamilyId of ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS) {
      const path = buildChapter17RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(contentProvider.getContentBlockIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.contentBlockIds)
      expect(contentProvider.getFlashcardIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(path.flashcardIds)

      const reassessmentIds = mappingProvider.getQuestionsForConcept(conceptFamilyId)
      expect(reassessmentIds, conceptFamilyId).toHaveLength(5)
      expect(reassessmentIds.every((id) => id.startsWith('r17-')), conceptFamilyId).toBe(true)
      for (const id of reassessmentIds) {
        expect(contentProvider.getQuizQuestionById(id), id).toBeTruthy()
      }
    }
  })

  it('locks the chemical-safety model to exactly four hazard classes', () => {
    expect(new Set(chapter17SafetyTaggedItems.map((item) => item.hazard))).toEqual(new Set([
      'chemical_incompatibility',
      'scalp_compromise_burning',
      'overprocessing_control',
      'unsafe_service_sequence',
    ]))
  })

  it('proves the ordinary multi-source recovery chain without erasing original misses', () => {
    const conceptFamilyId = 'ch17-consultation-hair-analysis'
    const original = [
      ev(conceptFamilyId, 'mcq-17-001', false, 'micro_check', '2026-09-29T23:00:00.000Z'),
      ev(conceptFamilyId, 'qq-17-001', false, 'chapter_assessment', '2026-09-29T23:01:00.000Z'),
      ev(conceptFamilyId, 'fc-ch17-001', true, 'flashcard', '2026-09-29T23:02:00.000Z', 'understanding'),
      ev(conceptFamilyId, 'scenario-1:0', false, 'scenario_application', '2026-09-29T23:03:00.000Z', 'scenario'),
    ]

    const plan = buildChapter17TargetedRemediationPlan(original, '2026-09-29T23:04:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === conceptFamilyId)
    expect(target).toBeDefined()
    expect(target!.priority).toBe('standard')
    expect(target!.plannedReassessmentQuestionCount).toBe(5)
    expect(target!.plannedReassessmentPassPercent).toBe(80)
    expect(target!.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target!.remediationFlashcardIds.length).toBeGreaterThan(0)

    const reserve = getChapter17ReassessmentReserve(conceptFamilyId)
    const responses = reserve.map((question, index) => ({
      questionId: question.id,
      correct: index < 4,
    }))
    const cycle = scoreChapter17ReassessmentCycle({
      cycleId: 'c17-final-ordinary',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses,
      passPercent: 80,
    })
    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)

    const reassessment = buildChapter17ReassessmentEvidence({
      studentId: 'student-c17-final',
      conceptFamilyId,
      selectedQuestions: reserve,
      responses,
      timestamp: '2026-09-29T23:05:00.000Z',
    })
    const recovered = calculateChapter17RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-29T23:06:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(3)
    expect(recovered.after.reassessmentCorrectCount).toBe(4)

    const combined = appendChapter17ReassessmentEvidence(original, reassessment)
    expect(combined.slice(0, original.length)).toEqual(original)
  })

  it('proves distinct chemical-safety hazards require perfect five-question urgent recovery', () => {
    const safetyEvidence = [
      ev(
        'ch17-safety-strand-tests-compatibility',
        'mcq-17-011',
        false,
        'micro_check',
        '2026-09-29T23:10:00.000Z',
        'scenario',
      ),
      ev(
        'ch17-chemical-relaxing-procedures',
        'mcq-17-008',
        false,
        'micro_check',
        '2026-09-29T23:11:00.000Z',
        'scenario',
      ),
    ]

    const intervention = evaluateChapter17SafetyIntervention(safetyEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.requiresInstructorReview).toBe(true)
    expect(intervention.requiresFormalSafetyReassessment).toBe(true)
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)

    const conceptFamilyId = 'ch17-chemical-relaxing-procedures'
    expect(getChapter17RequiredReassessmentPassPercent(safetyEvidence, conceptFamilyId)).toBe(100)

    const reserve = getChapter17ReassessmentReserve(conceptFamilyId)
    const fourOfFive = scoreChapter17ReassessmentCycle({
      cycleId: 'c17-final-urgent-fail',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question, index) => ({ questionId: question.id, correct: index < 4 })),
      passPercent: 100,
    })
    const fiveOfFive = scoreChapter17ReassessmentCycle({
      cycleId: 'c17-final-urgent-pass',
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

  it('proves recovered history and chemical-safety status are visible in authorized staff diagnostics', () => {
    const conceptFamilyId = 'ch17-chemical-relaxing-procedures'
    const initialQuestions = chapter17PremiumQuizQuestions.filter((question) =>
      chapter17QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === conceptFamilyId,
      ),
    )
    const initialAttempt: Chapter17InstructorQuizAttempt = {
      quiz_id: 'quiz-17',
      percentage: 75,
      answers_json: Object.fromEntries(
        initialQuestions.map((question, index) => [
          question.id,
          index < 2 ? wrongAnswer(question.correct_answer) : question.correct_answer,
        ]),
      ),
      completed_at: '2026-09-29T23:20:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter17ReassessmentReserve(conceptFamilyId)
    const reassessmentAttempt: Chapter17InstructorQuizAttempt = {
      quiz_id: 'quiz-17',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-29T23:25:00.000Z',
      is_reassessment: true,
      target_concept_id: conceptFamilyId,
      remediation_cycle_id: 'cycle-c17-final',
    }

    const microRows: Chapter17MicroCheckAttemptRow[] = [
      {
        id: 'row-c17-incompat',
        user_id: 'student-c17-final',
        chapter_id: 'ch-17',
        check_id: 'mc-17-06',
        question_id: 'mcq-17-011',
        concept_id: 'ch17-safety-strand-tests-compatibility',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-29T23:18:00.000Z',
        created_at: '2026-09-29T23:18:00.000Z',
      },
      {
        id: 'row-c17-burning',
        user_id: 'student-c17-final',
        chapter_id: 'ch-17',
        check_id: 'mc-17-04',
        question_id: 'mcq-17-008',
        concept_id: 'ch17-chemical-relaxing-procedures',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-29T23:19:00.000Z',
        created_at: '2026-09-29T23:19:00.000Z',
      },
    ]

    const diagnostics = buildChapter17InstructorDiagnostics({
      studentId: 'student-c17-final',
      completionPercent: 100,
      microCheckRows: microRows,
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-29T23:26:00.000Z',
    })

    const concept = diagnostics.concepts.find(
      (item) => item.conceptName === getChapter17ConceptFamily(conceptFamilyId).name,
    )
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBeGreaterThanOrEqual(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.latestReassessment).toContain('Chemical Relaxing')
    expect(diagnostics.safetyIntervention.level).toBe('urgent')
    expect(diagnostics.safetyIntervention.requiresInstructorReview).toBe(true)
  })

  it('keeps instructor/school-admin visibility same-school authorized and privacy limited', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-c17')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c17')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-c17')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-17'")
    expect(page).toContain('Chapter 17 — Chemical Texture Services')
    expect(page).toContain('chapter17Diagnostics.weakestConcepts')
    expect(page).toContain('chapter17Diagnostics.remediationStatus')
    expect(page).toContain('chapter17Diagnostics.latestReassessment')
    expect(page).toContain('chapter17Diagnostics.safetyIntervention.requiresInstructorReview')

    const marker = '{/* Chapter 17 mastery, chemical safety, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    const end = page.indexOf('</section>', start)
    expect(start).toBeGreaterThanOrEqual(0)
    expect(end).toBeGreaterThan(start)
    const panel = page.slice(start, end)
    expect(panel).not.toContain('answers_json')
    expect(panel).not.toContain('question_id')
    expect(panel).not.toContain('item_id')
    expect(panel).not.toContain('studentId')
  })
})
