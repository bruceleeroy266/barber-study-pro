import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumContent } from '../chapter-19-premium-content'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import {
  ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS,
  CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter19LessonSectionConceptMappings,
  chapter19FlashcardConceptMappings,
  chapter19QuizQuestionConceptMappings,
} from './mappings'
import { chapter19MicroChecks } from './micro-checks'
import {
  chapter19ReassessmentReserve,
  getChapter19ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter19ReassessmentEvidence,
  buildChapter19ReassessmentEvidence,
  buildChapter19RemediationPathForConcept,
  buildChapter19TargetedRemediationPlan,
  calculateChapter19RecoveredMastery,
  containsLegacyChapter19RemediationId,
  scoreChapter19ReassessmentCycle,
} from './targeted-remediation'
import {
  evaluateChapter19ComplianceIntervention,
  evaluateChapter19SafetyIntervention,
  getChapter19RequiredReassessmentPassPercent,
} from './escalation'
import {
  buildChapter19InstructorDiagnostics,
  type Chapter19InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter19EvidenceRecord } from './grading'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import {
  buildLiveInstructorChapterGrade,
  type LiveInstructorActivityEvidenceRow,
} from '../concept-mastery/live-instructor-grade'
import {
  hasChapterContentProvider,
  getChapterContentProvider,
} from '../remediation/content-provider-registry'
import {
  hasCanonicalMappingProvider,
  getCanonicalMappingProvider,
} from '../reassessment/provider-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import { canAccessRoute, isInstructorOrAdmin } from '../security/permissions'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const ev = (
  conceptFamilyId: Chapter19EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter19EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter19EvidenceRecord['difficulty'] = 'application',
): Chapter19EvidenceRecord => ({
  studentId: 'student-c19-final',
  chapterId: 'ch-19',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (
    (['a', 'b', 'c', 'd'] as const).find(
      (answer) => answer !== correct,
    ) ?? 'a'
  )
}

describe('C19-9 final Chapter 19 end-to-end certification', () => {
  it('locks the complete certified inventory and namespace boundaries', () => {
    const lessonIds = chapter19PremiumContent.sections.map(
      (section) => section.id,
    )
    const flashcardIds = chapter19PremiumFlashcards.map((card) => card.id)
    const assessmentIds = chapter19PremiumQuizQuestions.map(
      (question) => question.id,
    )
    const microIds = chapter19MicroChecks.flatMap((check) =>
      check.questions.map((question) => question.id),
    )
    const reassessmentIds = chapter19ReassessmentReserve.map(
      (question) => question.id,
    )

    expect(lessonIds).toEqual(['chapter-19-lesson'])
    expect(flashcardIds).toHaveLength(60)
    expect(new Set(flashcardIds).size).toBe(60)
    expect(assessmentIds).toHaveLength(15)
    expect(new Set(assessmentIds).size).toBe(15)
    expect(microIds).toHaveLength(14)
    expect(new Set(microIds).size).toBe(14)
    expect(reassessmentIds).toHaveLength(35)
    expect(new Set(reassessmentIds).size).toBe(35)
    expect(microIds.every((id) => id.startsWith('mcq-19-'))).toBe(true)
    expect(reassessmentIds.every((id) => id.startsWith('r19-'))).toBe(true)
    expect(
      reassessmentIds.some((id) => assessmentIds.includes(id as never)),
    ).toBe(false)
    expect(
      reassessmentIds.some((id) => microIds.includes(id as never)),
    ).toBe(false)
  })

  it('gives all seven canonical concepts lesson, flashcard, assessment, micro-check, remediation, and reassessment coverage', () => {
    expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toHaveLength(7)

    for (const conceptFamilyId of ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS) {
      expect(
        chapter19LessonSectionConceptMappings.some((mapping) =>
          mapping.conceptFamilyIds.includes(conceptFamilyId),
        ),
        conceptFamilyId,
      ).toBe(true)
      expect(
        chapter19FlashcardConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
      expect(
        chapter19QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)

      const micro = chapter19MicroChecks.find(
        (check) => check.conceptFamilyId === conceptFamilyId,
      )
      expect(micro, conceptFamilyId).toBeDefined()
      expect(micro!.questions, conceptFamilyId).toHaveLength(2)

      const remediation =
        buildChapter19RemediationPathForConcept(conceptFamilyId)
      expect(remediation.contentBlockIds, conceptFamilyId).toEqual([
        'chapter-19-lesson',
      ])
      expect(remediation.flashcardIds.length, conceptFamilyId).toBeGreaterThan(
        0,
      )
      expect(
        [...remediation.contentBlockIds, ...remediation.flashcardIds].some(
          containsLegacyChapter19RemediationId,
        ),
        conceptFamilyId,
      ).toBe(false)

      expect(
        getChapter19ReassessmentReserve(conceptFamilyId),
        conceptFamilyId,
      ).toHaveLength(5)
    }
  })

  it('keeps shared grading intact and Chapter 19 provisional only because real scenario evidence does not exist', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-19')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-19')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-19')).toEqual([])

    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const activityRows: LiveInstructorActivityEvidenceRow[] =
      getFlashcardEvidenceInventory('ch-19').map((itemId) => ({
        chapter_id: 'ch-19',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      }))

    const live = buildLiveInstructorChapterGrade({
      chapterId: 'ch-19',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: 100,
      activityRows,
    })

    expect(live.grade.componentWeights).toEqual(SHARED_GRADE_WEIGHTS)
    expect(live.components.flashcardPercent).toBe(100)
    expect(live.components.scenarioApplicationPercent).toBeNull()
    expect(live.evidenceComplete).toBe(false)
  })

  it('registers canonical targeted-remediation and five-question reassessment providers for every concept', () => {
    expect(hasChapterContentProvider('ch-19')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-19')).toBe(true)

    const content = getChapterContentProvider('ch-19')!
    const mapping = getCanonicalMappingProvider('ch-19')

    for (const conceptFamilyId of ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS) {
      const path = buildChapter19RemediationPathForConcept(conceptFamilyId)
      expect(
        content.getContentBlockIdsForConcept(conceptFamilyId),
        conceptFamilyId,
      ).toEqual(path.contentBlockIds)
      expect(
        content.getFlashcardIdsForConcept(conceptFamilyId),
        conceptFamilyId,
      ).toEqual(path.flashcardIds)

      const ids = mapping.getQuestionsForConcept(conceptFamilyId)
      expect(ids, conceptFamilyId).toHaveLength(5)
      expect(
        ids.every((id) => id.startsWith('r19-')),
        conceptFamilyId,
      ).toBe(true)
      expect(
        ids.every((id) => content.getQuizQuestionById(id)?.id === id),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('proves ordinary 80-percent mastery recovery while preserving original misses', () => {
    const conceptFamilyId =
      'ch19-employment-readiness-professionalism' as const
    const original = [
      ev(
        conceptFamilyId,
        'qq-19-04',
        false,
        'chapter_assessment',
        '2026-09-30T17:10:00.000Z',
      ),
      ev(
        conceptFamilyId,
        'qq-19-05',
        false,
        'chapter_assessment',
        '2026-09-30T17:11:00.000Z',
      ),
      ev(
        conceptFamilyId,
        'fc-ch19-026',
        true,
        'flashcard',
        '2026-09-30T17:12:00.000Z',
        'understanding',
      ),
    ]

    const plan = buildChapter19TargetedRemediationPlan(
      original,
      '2026-09-30T17:13:00.000Z',
    )
    const target = plan.targets.find(
      (item) => item.conceptFamilyId === conceptFamilyId,
    )!

    expect(target.priority).toBe('standard')
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)

    const reserve = getChapter19ReassessmentReserve(conceptFamilyId)
    const responses = reserve.map((question, index) => ({
      questionId: question.id,
      correct: index < 4,
    }))
    const cycle = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-final-ordinary',
      conceptFamilyId,
      selectedQuestionIds: reserve.map((question) => question.id),
      responses,
      passPercent: 80,
    })

    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)

    const reassessment = buildChapter19ReassessmentEvidence({
      studentId: 'student-c19-final',
      conceptFamilyId,
      selectedQuestions: reserve,
      responses,
      timestamp: '2026-09-30T17:14:00.000Z',
    })
    const recovered = calculateChapter19RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-30T17:15:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(
      recovered.before.mastery,
    )
    expect(recovered.after.initialMissCount).toBe(
      recovered.before.initialMissCount,
    )
    expect(recovered.after.initialMissCount).toBe(2)
    expect(recovered.after.reassessmentCorrectCount).toBe(4)
    expect(
      appendChapter19ReassessmentEvidence(original, reassessment).slice(
        0,
        original.length,
      ),
    ).toEqual(original)
  })

  it('proves licensing/employment-law compliance remains distinct and recovers at 80 percent', () => {
    expect(CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-licensing-requirements-verification',
      'ch19-employment-law-contracts-compliance',
    ])

    const complianceEvidence = [
      ev(
        'ch19-licensing-requirements-verification',
        'mcq-19-001',
        false,
        'micro_check',
        '2026-09-30T17:20:00.000Z',
      ),
      ev(
        'ch19-licensing-requirements-verification',
        'qq-19-01',
        false,
        'chapter_assessment',
        '2026-09-30T17:21:00.000Z',
      ),
    ]

    const compliance =
      evaluateChapter19ComplianceIntervention(complianceEvidence)
    expect(compliance.level).toBe('elevated')
    expect(compliance.requiresInstructorReview).toBe(true)
    expect(compliance.requiresFormalReassessment).toBe(true)
    expect(compliance.reassessmentQuestionCount).toBe(5)
    expect(compliance.reassessmentPassPercent).toBe(80)
    expect(
      getChapter19RequiredReassessmentPassPercent(
        complianceEvidence,
        'ch19-licensing-requirements-verification',
      ),
    ).toBe(80)

    const plan = buildChapter19TargetedRemediationPlan(
      complianceEvidence,
      '2026-09-30T17:22:00.000Z',
    )
    const target = plan.targets.find(
      (item) =>
        item.conceptFamilyId ===
        'ch19-licensing-requirements-verification',
    )!
    expect(target.priority).toBe('compliance')
    expect(target.plannedReassessmentPassPercent).toBe(80)

    const reserve = getChapter19ReassessmentReserve(
      'ch19-licensing-requirements-verification',
    )
    const cycle = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-final-compliance',
      conceptFamilyId: 'ch19-licensing-requirements-verification',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question, index) => ({
        questionId: question.id,
        correct: index < 4,
      })),
      passPercent: 80,
    })

    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)
  })

  it('proves urgent practical-safety recovery requires perfect 5/5 and is safety-only', () => {
    expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-practical-exam-safety-readiness',
    ])

    const safetyEvidence = [
      ev(
        'ch19-practical-exam-safety-readiness',
        'mcq-19-006',
        false,
        'micro_check',
        '2026-09-30T17:25:00.000Z',
      ),
      ev(
        'ch19-practical-exam-safety-readiness',
        'qq-19-03',
        false,
        'chapter_assessment',
        '2026-09-30T17:26:00.000Z',
      ),
    ]

    const intervention =
      evaluateChapter19SafetyIntervention(safetyEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.requiresInstructorReview).toBe(true)
    expect(intervention.requiresFormalSafetyReassessment).toBe(true)
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)
    expect(
      getChapter19RequiredReassessmentPassPercent(
        safetyEvidence,
        'ch19-practical-exam-safety-readiness',
      ),
    ).toBe(100)

    const reserve = getChapter19ReassessmentReserve(
      'ch19-practical-exam-safety-readiness',
    )
    const four = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-final-urgent-fail',
      conceptFamilyId: 'ch19-practical-exam-safety-readiness',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question, index) => ({
        questionId: question.id,
        correct: index < 4,
      })),
      passPercent: 100,
    })
    const five = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-final-urgent-pass',
      conceptFamilyId: 'ch19-practical-exam-safety-readiness',
      selectedQuestionIds: reserve.map((question) => question.id),
      responses: reserve.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
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
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(
      canAccessRoute(
        'instructor',
        '/instructor/student/student-c19-final',
      ),
    ).toBe(true)
    expect(
      canAccessRoute(
        'school_admin',
        '/instructor/student/student-c19-final',
      ),
    ).toBe(true)
    expect(
      canAccessRoute(
        'student',
        '/instructor/student/student-c19-final',
      ),
    ).toBe(false)

    const initialQuestions = chapter19PremiumQuizQuestions.filter(
      (question) =>
        chapter19QuizQuestionConceptMappings.some(
          (mapping) =>
            mapping.questionId === question.id &&
            mapping.conceptFamilyId ===
              'ch19-employment-law-contracts-compliance',
        ),
    )
    expect(initialQuestions).toHaveLength(2)

    const initialAttempt: Chapter19InstructorQuizAttempt = {
      quiz_id: 'quiz-19',
      percentage: 80,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [
          question.id,
          wrongAnswer(question.correct_answer),
        ]),
      ),
      completed_at: '2026-09-30T17:30:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter19ReassessmentReserve(
      'ch19-employment-law-contracts-compliance',
    )
    const reassessmentAttempt: Chapter19InstructorQuizAttempt = {
      quiz_id: 'quiz-19',
      percentage: 100,
      answers_json: Object.fromEntries(
        reserve.map((question) => [
          question.id,
          question.correctAnswer,
        ]),
      ),
      completed_at: '2026-09-30T17:35:00.000Z',
      is_reassessment: true,
      target_concept_id:
        'ch19-employment-law-contracts-compliance',
      remediation_cycle_id: 'cycle-c19-final',
    }

    const diagnostics = buildChapter19InstructorDiagnostics({
      studentId: 'student-c19-final',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-30T17:36:00.000Z',
    })

    expect(
      diagnostics.concepts.some(
        (concept) =>
          concept.initialMisses >= 2 &&
          concept.reassessmentCorrect === 5,
      ),
    ).toBe(true)
    expect(diagnostics.latestReassessment).toContain('100%')

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(
      'if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))',
    )
    expect(page).toContain(
      ".eq('school_id', instructorProfile.school_id)",
    )
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-19'")
    expect(page).toContain(
      "buildLiveGrade('ch-19', chapter19Diagnostics)",
    )
    expect(page).toContain(
      'Chapter 19 — Preparing for Licensure and Employment',
    )

    const marker =
      '{/* Chapter 19 mastery, licensing/compliance, safety, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    const end = page.indexOf('</section>', start)
    expect(start).toBeGreaterThanOrEqual(0)
    expect(end).toBeGreaterThan(start)
    const panel = page.slice(start, end)

    expect(panel).not.toContain('answers_json')
    expect(panel).not.toContain('question_id')
    expect(panel).not.toContain('studentId')
    expect(panel).not.toContain('item_id')
    expect(panel).not.toContain('remediation_cycle_id')
  })
})
