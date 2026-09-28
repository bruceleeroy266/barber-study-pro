import { describe, expect, it } from 'vitest'
import { chapter10PremiumContent } from '../chapter-10-premium'
import { chapter10PremiumFlashcards } from '../chapter-10-premium-flashcards'
import { chapter10PremiumQuizQuestions } from '../chapter-10-premium-quiz'
import {
  ACTIVE_CHAPTER10_CONCEPT_FAMILY_IDS,
  chapter10ConceptFamilies,
} from './concepts'
import {
  chapter10ContentConceptMappings,
  chapter10FlashcardConceptMappings,
  chapter10QuizQuestionConceptMappings,
} from './mappings'
import { chapter10MicroChecks, buildChapter10MicroCheckEvidence } from './micro-checks'
import { evaluateChapter10SafetyIntervention } from './safety-intervention'
import {
  buildChapter10ReassessmentEvidence,
  buildChapter10TargetedRemediationPlan,
  calculateChapter10RecoveredMastery,
  scoreChapter10ReassessmentCycle,
  selectChapter10ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter10ReassessmentReserve,
  getChapter10ReassessmentReserve,
} from './reassessment-reserve'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { createHistoricalExclusionEngine } from '@/lib/reassessment/exclusion-engine'
import { hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'
import { buildChapter10InstructorDiagnostics } from './instructor-diagnostics'
import type { Chapter10EvidenceRecord } from './grading'
import type {
  HistoricalQuizAttempt,
  IExclusionDatabaseClient,
  ReassessmentQuestionHistoryRecord,
} from '@/lib/reassessment/types'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a', 'b', 'c', 'd'] as const).find((answer) => answer !== correct) ?? 'a'
}

const evidence = (
  conceptFamilyId: Chapter10EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter10EvidenceRecord['source'] = 'chapter_assessment',
  timestamp = '2026-09-28T00:10:00.000Z',
): Chapter10EvidenceRecord => ({
  studentId: 'student-c10-final',
  chapterId: 'ch-10',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

class ExclusionDb implements IExclusionDatabaseClient {
  constructor(private readonly attempts: HistoricalQuizAttempt[]) {}

  async getHistoricalQuizAttempts() {
    return this.attempts
  }

  async getReassessmentQuestionHistory(): Promise<ReassessmentQuestionHistoryRecord[]> {
    return []
  }

  async recordQuestionAttempt() {
    return 'history-c10'
  }

  async checkAndRecordPoolExhaustion() {
    return 'exhaustion-c10'
  }
}

describe('C10-8 final Chapter 10 end-to-end certification', () => {
  it('locks the certified content inventory and canonical coverage', () => {
    expect(chapter10PremiumContent).toBeDefined()
    expect(chapter10ContentConceptMappings).toHaveLength(47)
    expect(chapter10PremiumFlashcards).toHaveLength(118)
    expect(chapter10PremiumQuizQuestions).toHaveLength(75)
    expect(chapter10MicroChecks.flatMap((check) => check.questions)).toHaveLength(19)
    expect(chapter10ReassessmentReserve).toHaveLength(45)
    expect(chapter10ConceptFamilies).toHaveLength(9)

    expect(new Set(chapter10PremiumFlashcards.map((card) => card.id)).size).toBe(118)
    expect(new Set(chapter10PremiumQuizQuestions.map((question) => question.id)).size).toBe(75)
    expect(new Set(chapter10ReassessmentReserve.map((question) => question.id)).size).toBe(45)

    for (const conceptFamilyId of ACTIVE_CHAPTER10_CONCEPT_FAMILY_IDS) {
      expect(
        chapter10ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
      expect(
        chapter10FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
      expect(
        chapter10QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
      expect(
        chapter10MicroChecks.some((check) => check.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
      expect(getChapter10ReassessmentReserve(conceptFamilyId)).toHaveLength(5)
    }
  })

  it('registers Chapter 10 for live concept detection, targeted content, and fresh reassessment selection', async () => {
    expect(isConceptDetectionSupported('ch-10')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-10')).toBe(true)

    const provider = getChapterContentProvider('ch-10')
    expect(provider).toBeDefined()

    for (const concept of chapter10ConceptFamilies) {
      const bundle = provider!.buildRemediationContentBundle(concept.id)
      expect(bundle.conceptId).toBe(concept.id)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(1)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(1)
      expect(provider!.filterFlashcardsByConcept(concept.id).every((card) => card.is_active)).toBe(true)
    }

    const target = 'ch10-analysis-properties'
    const initialIds = chapter10QuizQuestionConceptMappings
      .filter((mapping) => mapping.conceptFamilyId === target)
      .map((mapping) => mapping.questionId)

    const historical: HistoricalQuizAttempt = {
      id: 'hist-c10-1',
      userId: 'student-c10-final',
      quizId: 'quiz-10',
      answersJson: Object.fromEntries(initialIds.map((id) => [id, 'a'])),
      completedAt: new Date('2026-09-28T00:00:00.000Z'),
    }

    const engine = createHistoricalExclusionEngine(new ExclusionDb([historical]), 'ch-10')
    const selected = await engine.selectReassessmentQuestion(
      'student-c10-final',
      target,
      'cycle-c10-final-1',
    )

    expect(selected.success).toBe(true)
    expect(selected.selectedQuestionId).toBe('r10-analysis-001')
    expect(selected.selectedQuestionId?.startsWith('r10-')).toBe(true)
    expect(initialIds.every((id) => selected.exclusionSet.combinedExclusionSet.has(id))).toBe(true)
  })

  it('preserves first-attempt micro-check evidence', () => {
    const records = buildChapter10MicroCheckEvidence(
      'student-c10-final',
      [
        { questionId: 'mcq-10-009', selectedAnswer: 'b' },
        { questionId: 'mcq-10-009', selectedAnswer: 'a' },
      ],
      '2026-09-28T00:01:00.000Z',
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      source: 'micro_check',
      attemptPhase: 'initial',
      conceptFamilyId: 'ch10-analysis-properties',
      itemId: 'mcq-10-009',
      correct: true,
    })
  })

  it('runs a normal gap through exact targeted content, five fresh questions, recovery, and preserved history', () => {
    const original = [
      evidence('ch10-analysis-properties', 'qq-10-019', false),
      evidence('ch10-analysis-properties', 'mcq-10-009', false, 'micro_check', '2026-09-28T00:11:00.000Z'),
      evidence('ch10-analysis-properties', 'qq-10-017', true, 'chapter_assessment', '2026-09-28T00:12:00.000Z'),
    ]
    const snapshot = JSON.stringify(original)

    const plan = buildChapter10TargetedRemediationPlan(original, '2026-09-28T00:13:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch10-analysis-properties')!

    expect(target).toBeDefined()
    expect(target.remediationContentBlockIds).toEqual(
      chapter10ContentConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === 'ch10-analysis-properties')
        .map((mapping) => mapping.contentBlockId),
    )
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)

    const selectedIds = selectChapter10ReassessmentQuestions(
      'ch10-analysis-properties',
      chapter10ReassessmentReserve,
    )
    const selectedQuestions = getChapter10ReassessmentReserve('ch10-analysis-properties')
    expect(selectedIds).toHaveLength(5)
    expect(selectedIds.every((id) => id.startsWith('r10-'))).toBe(true)

    const responses = selectedIds.map((questionId) => ({ questionId, correct: true }))
    const cycle = scoreChapter10ReassessmentCycle({
      cycleId: 'c10-final-normal',
      conceptFamilyId: 'ch10-analysis-properties',
      selectedQuestionIds: selectedIds,
      responses,
      passPercent: 80,
    })
    expect(cycle.passed).toBe(true)
    expect(cycle.percent).toBe(100)

    const recovery = buildChapter10ReassessmentEvidence({
      studentId: 'student-c10-final',
      conceptFamilyId: 'ch10-analysis-properties',
      selectedQuestions,
      responses,
      timestamp: '2026-09-28T00:20:00.000Z',
    })

    const result = calculateChapter10RecoveredMastery(
      original,
      recovery,
      'ch10-analysis-properties',
      '2026-09-28T00:21:00.000Z',
    )

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
  })

  it('runs distinct safety misses through urgent escalation and requires 5/5', () => {
    const original = [
      evidence('ch10-service-safety-referral', 'qq-10-034', false, 'chapter_assessment', '2026-09-28T00:10:00.000Z'),
      evidence('ch10-service-safety-referral', 'qq-10-066', true, 'chapter_assessment', '2026-09-28T00:11:00.000Z'),
      evidence('ch10-service-safety-referral', 'qq-10-067', false, 'chapter_assessment', '2026-09-28T00:12:00.000Z'),
    ]

    const safety = evaluateChapter10SafetyIntervention(original)
    expect(safety.level).toBe('urgent')
    expect(safety.reassessmentQuestionCount).toBe(5)
    expect(safety.reassessmentPassPercent).toBe(100)

    const selected = selectChapter10ReassessmentQuestions(
      'ch10-service-safety-referral',
      chapter10ReassessmentReserve,
    )
    const fourOfFive = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))
    const allFive = selected.map((questionId) => ({ questionId, correct: true }))

    expect(scoreChapter10ReassessmentCycle({
      cycleId: 'c10-final-safety-fail',
      conceptFamilyId: 'ch10-service-safety-referral',
      selectedQuestionIds: selected,
      responses: fourOfFive,
      passPercent: 100,
    }).passed).toBe(false)

    expect(scoreChapter10ReassessmentCycle({
      cycleId: 'c10-final-safety-pass',
      conceptFamilyId: 'ch10-service-safety-referral',
      selectedQuestionIds: selected,
      responses: allFive,
      passPercent: 100,
    }).passed).toBe(true)
  })

  it('shows preserved initial misses and five-question recovery in instructor diagnostics', () => {
    const target = 'ch10-analysis-properties'
    const initialQuestions = chapter10PremiumQuizQuestions.filter((question) =>
      chapter10QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )

    const initialAttempt = {
      quiz_id: 'quiz-10',
      percentage: 0,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [
          question.id,
          wrongAnswer(question.correct_answer),
        ]),
      ),
      completed_at: '2026-09-28T00:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const before = buildChapter10InstructorDiagnostics({
      studentId: 'student-c10-final',
      completionPercent: 80,
      microCheckRows: [],
      quizAttempts: [initialAttempt],
      referenceTime: '2026-09-28T01:00:00.000Z',
    })

    const reserve = getChapter10ReassessmentReserve(target)
    const reassessmentAttempts = reserve.map((question, index) => ({
      quiz_id: 'quiz-10',
      percentage: 100,
      answers_json: { [question.id]: question.correctAnswer },
      completed_at: `2026-09-28T00:3${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c10-analysis-1',
    }))

    const after = buildChapter10InstructorDiagnostics({
      studentId: 'student-c10-final',
      completionPercent: 80,
      microCheckRows: [],
      quizAttempts: [initialAttempt, ...reassessmentAttempts],
      referenceTime: '2026-09-28T01:00:00.000Z',
    })

    const conceptName = chapter10ConceptFamilies.find((concept) => concept.id === target)!.name
    const beforeConcept = before.concepts.find((concept) => concept.conceptName === conceptName)!
    const afterConcept = after.concepts.find((concept) => concept.conceptName === conceptName)!

    expect(beforeConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.reassessmentCorrect).toBe(5)
    expect(afterConcept.mastery).toBeGreaterThan(beforeConcept.mastery)
    expect(after.latestReassessment).toContain('100%')
    expect(after.latestReassessment).toContain(conceptName)
    expect(after.chapterGrade.finalGrade).toBeGreaterThanOrEqual(after.chapterGrade.baseGrade)
  })

  it('keeps the final Chapter 10 certified runtime free of previously removed unsupported claims', () => {
    const runtime = JSON.stringify({
      content: chapter10PremiumContent,
      flashcards: chapter10PremiumFlashcards,
      quiz: chapter10PremiumQuizQuestions,
      concepts: chapter10ConceptFamilies,
      reserve: chapter10ReassessmentReserve,
    }).toLowerCase()

    for (const phrase of [
      '63 million',
      'alopecia senilis',
      'alopecia syphilitica',
      'lanthionine',
      'fragilitas crinium',
      'hypertrophies',
      'state board exam',
      'trichology certification exam',
      '48 hours',
      'early detection of skin cancer',
    ]) {
      expect(runtime).not.toContain(phrase)
    }
  })
})
