import { describe, expect, it } from 'vitest'
import type { QuizAttempt } from '@/types'
import { chapter8PremiumContent } from '../chapter-8-premium'
import { chapter8PremiumFlashcards } from '../chapter-8-premium-flashcards'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import {
  CHAPTER8_CONCEPT_FAMILY_IDS,
  chapter8ConceptFamilies,
  chapter8LearningObjectives,
} from './concepts'
import {
  chapter8FlashcardConceptMappings,
  chapter8MicroCheckPlacements,
  chapter8QuizQuestionConceptMappings,
} from './mappings'
import {
  chapter8MicroChecks,
  buildChapter8MicroCheckEvidence,
} from './micro-checks'
import {
  detectConceptGapsWithEvidence,
} from './detection'
import {
  evaluateChapter8SafetyEscalation,
} from './safety-mastery'
import {
  buildChapter8TargetedRemediationPlan,
  appendChapter8ReassessmentEvidence,
  selectChapter8ReassessmentQuestions,
} from './targeted-remediation'
import { chapter8ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter8PersistedReassessmentEvent,
  chapter8PersistedEventToEvidence,
} from './reassessment-evidence'
import { evaluateChapter8FormalReassessment } from './recovery-outcome'
import {
  calculateChapter8ConceptMastery,
  CHAPTER8_GRADE_WEIGHTS,
  type Chapter8EvidenceRecord,
} from './grading'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapter8MappingProvider } from '@/lib/reassessment/adapters/chapter-8-adapter'

function quizAttempt(
  id: string,
  completedAt: string,
  answers: Record<string, string>,
): QuizAttempt {
  return {
    id,
    user_id: 'student-c8-final',
    quiz_id: 'quiz-8',
    score: 0,
    total_questions: Object.keys(answers).length,
    correct_answers: 0,
    percentage: 0,
    answers_json: answers,
    started_at: completedAt,
    completed_at: completedAt,
  } as QuizAttempt
}

function evidence(
  conceptFamilyId: Chapter8EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter8EvidenceRecord['source'],
  difficulty: Chapter8EvidenceRecord['difficulty'],
  timestamp: string,
  attemptPhase: Chapter8EvidenceRecord['attemptPhase'] = 'initial',
): Chapter8EvidenceRecord {
  return {
    studentId: 'student-c8-final',
    chapterId: 'ch-8',
    conceptFamilyId,
    source,
    itemId,
    difficulty,
    correct,
    attemptPhase,
    timestamp,
  }
}

describe('Chapter 8 final C8-0 through C8-7 certification', () => {
  it('locks the complete certified asset spine: 31 lesson sections, 57 active flashcards, 30 assessment questions, 10 concepts, 6 objectives', () => {
    expect(chapter8PremiumContent.chapterNumber).toBe(8)
    expect(chapter8PremiumContent.sections).toHaveLength(31)
    expect(new Set(chapter8PremiumContent.sections.map((section) => section.id)).size).toBe(31)

    expect(chapter8PremiumFlashcards).toHaveLength(57)
    expect(chapter8PremiumFlashcards.every((card) => card.is_active)).toBe(true)
    expect(new Set(chapter8PremiumFlashcards.map((card) => card.id)).size).toBe(57)

    expect(chapter8PremiumQuizQuestions).toHaveLength(30)
    expect(new Set(chapter8PremiumQuizQuestions.map((question) => question.id)).size).toBe(30)

    expect(chapter8LearningObjectives).toHaveLength(6)
    expect(chapter8ConceptFamilies).toHaveLength(10)
    expect(CHAPTER8_CONCEPT_FAMILY_IDS).toHaveLength(10)

    expect(chapter8FlashcardConceptMappings).toHaveLength(57)
    expect(chapter8QuizQuestionConceptMappings).toHaveLength(30)
  })

  it('certifies micro-check coverage across all ten concept families before final assessment/remediation', () => {
    expect(chapter8MicroCheckPlacements).toHaveLength(10)
    expect(chapter8MicroChecks).toHaveLength(10)

    const questions = chapter8MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(22)
    expect(new Set(chapter8MicroChecks.map((check) => check.conceptFamilyId)))
      .toEqual(new Set(CHAPTER8_CONCEPT_FAMILY_IDS))

    const sample = buildChapter8MicroCheckEvidence(
      'student-c8-final',
      [
        { questionId: 'mcq-8-007', selectedAnswer: 'a' },
        { questionId: 'mcq-8-020', selectedAnswer: 'a' },
      ],
      '2026-09-26T18:00:00.000Z',
    )
    expect(sample).toHaveLength(2)
    expect(sample.every((record) => record.source === 'micro_check')).toBe(true)
    expect(sample.every((record) => record.attemptPhase === 'initial')).toBe(true)
  })

  it('detects a real repeated concept gap from assessment history and routes it to targeted Chapter 8 content', () => {
    const attempts = [
      quizAttempt('a1', '2026-09-20T12:00:00.000Z', { 'qq-8-004': 'a', 'qq-8-005': 'a' }),
      quizAttempt('a2', '2026-09-21T12:00:00.000Z', { 'qq-8-004': 'a', 'qq-8-005': 'a' }),
      quizAttempt('a3', '2026-09-22T12:00:00.000Z', { 'qq-8-004': 'a', 'qq-8-005': 'a' }),
    ]
    const detections = detectConceptGapsWithEvidence(attempts)
    const detected = detections.get('ch8-current-conversion')

    expect(detected).toBeDefined()
    expect(['emerging_weakness', 'repeated_weakness']).toContain(detected?.state)
    expect((detected?.evidence.misses ?? 0)).toBeGreaterThanOrEqual(2)

    const provider = getChapterContentProvider('ch-8')
    expect(provider).toBeDefined()
    const bundle = provider!.buildRemediationContentBundle('ch8-current-conversion')
    expect(bundle.contentBlockCount).toBeGreaterThan(0)
    expect(bundle.flashcardCount).toBeGreaterThan(0)
  })

  it('certifies urgent safety escalation from repeated hard misses without changing shared Chapter 8 grade weights', () => {
    const safetyRecords = [
      evidence('ch8-equipment-safety', 's1', false, 'micro_check', 'scenario', '2026-09-24T12:00:00.000Z'),
      evidence('ch8-equipment-safety', 's2', true, 'chapter_assessment', 'application', '2026-09-25T12:00:00.000Z'),
      evidence('ch8-equipment-safety', 's3', false, 'scenario_application', 'scenario', '2026-09-26T12:00:00.000Z'),
    ]
    const escalation = evaluateChapter8SafetyEscalation(safetyRecords, 'ch8-equipment-safety')
    expect(escalation?.level).toBe('urgent')
    expect(escalation?.requiresInstructorReview).toBe(true)
    expect(escalation?.requiresFormalReassessment).toBe(true)

    expect(CHAPTER8_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('certifies ordinary remediation -> five fresh reserve questions -> 80% recovery -> persisted evidence -> increased mastery', () => {
    const original = [
      evidence('ch8-current-conversion', 'qq-8-004', false, 'chapter_assessment', 'application', '2026-09-20T12:00:00.000Z'),
      evidence('ch8-current-conversion', 'qq-8-005', false, 'chapter_assessment', 'application', '2026-09-21T12:00:00.000Z'),
      evidence('ch8-current-conversion', 'mcq-8-003', true, 'micro_check', 'understanding', '2026-09-22T12:00:00.000Z'),
    ] as const

    const plan = buildChapter8TargetedRemediationPlan(original, '2026-09-26T18:00:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch8-current-conversion')
    expect(target?.requiresFormalReassessment).toBe(true)
    expect(target?.reassessmentQuestionCount).toBe(5)
    expect(target?.reassessmentPassPercent).toBe(80)

    const selected = selectChapter8ReassessmentQuestions('ch8-current-conversion', chapter8ReassessmentReserve)
    expect(selected).toHaveLength(5)
    expect(new Set(selected).size).toBe(5)
    expect(selected.every((id) => id.startsWith('r8-'))).toBe(true)

    const runtimePool = getChapter8MappingProvider().getQuestionsForConcept('ch8-current-conversion')
    expect(runtimePool).toEqual(selected)
    expect(runtimePool.some((id) => id.startsWith('qq-8-'))).toBe(false)

    const correctness = [true, true, true, true, false]
    const recovery = selected.map((questionId, index) => {
      const event = buildChapter8PersistedReassessmentEvent({
        attemptId: `ordinary-recovery-${index + 1}`,
        questionId,
        conceptFamilyId: 'ch8-current-conversion',
        correct: correctness[index],
        answeredAt: `2026-09-26T18:1${index}:00.000Z`,
      })
      return chapter8PersistedEventToEvidence('student-c8-final', event)
    })

    const outcome = evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-current-conversion',
      correctCount: 4,
      questionCount: 5,
    })
    expect(outcome.percent).toBe(80)
    expect(outcome.passed).toBe(true)

    const before = calculateChapter8ConceptMastery(original, '2026-09-26T19:00:00.000Z')
    const combined = appendChapter8ReassessmentEvidence(original, recovery)
    const after = calculateChapter8ConceptMastery(combined, '2026-09-26T19:00:00.000Z')

    expect(combined.slice(0, original.length)).toEqual(original)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)
    expect(after.mastery).toBeGreaterThan(before.mastery)
    expect(after.reassessmentCorrectCount).toBe(4)
  })

  it('certifies urgent-safety recovery as fail at 4/5 and pass only at 5/5', () => {
    for (const conceptFamilyId of ['ch8-equipment-safety', 'ch8-light-therapy-safety'] as const) {
      const selected = selectChapter8ReassessmentQuestions(conceptFamilyId, chapter8ReassessmentReserve)
      expect(selected).toHaveLength(5)
      expect(selected.every((id) => id.startsWith('r8-'))).toBe(true)

      const fourOfFive = evaluateChapter8FormalReassessment({
        conceptFamilyId,
        correctCount: 4,
        questionCount: 5,
      })
      expect(fourOfFive.percent).toBe(80)
      expect(fourOfFive.passPercent).toBe(100)
      expect(fourOfFive.passed).toBe(false)
      expect(fourOfFive.detectionState).toBe('repeated_weakness')

      const fiveOfFive = evaluateChapter8FormalReassessment({
        conceptFamilyId,
        correctCount: 5,
        questionCount: 5,
      })
      expect(fiveOfFive.percent).toBe(100)
      expect(fiveOfFive.passPercent).toBe(100)
      expect(fiveOfFive.passed).toBe(true)
      expect(fiveOfFive.detectionState).toBe('currently_performing_well')
    }
  })

  it('keeps all ten concepts supplied with targeted content and exactly five fresh reserve questions', () => {
    const provider = getChapterContentProvider('ch-8')
    expect(provider).toBeDefined()

    for (const conceptFamilyId of CHAPTER8_CONCEPT_FAMILY_IDS) {
      const bundle = provider!.buildRemediationContentBundle(conceptFamilyId)
      expect(bundle.contentBlockCount).toBeGreaterThan(0)
      expect(bundle.flashcardCount).toBeGreaterThan(0)

      const reserve = selectChapter8ReassessmentQuestions(conceptFamilyId, chapter8ReassessmentReserve)
      expect(reserve).toHaveLength(5)
      expect(new Set(reserve).size).toBe(5)
      expect(reserve.every((id) => id.startsWith('r8-'))).toBe(true)
    }
  })
})
