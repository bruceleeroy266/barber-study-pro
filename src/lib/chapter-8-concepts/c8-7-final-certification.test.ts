import { describe, expect, it } from 'vitest'
import type { Chapter8EvidenceRecord } from './grading'
import { calculateChapter8ConceptMastery } from './grading'
import {
  appendChapter8ReassessmentEvidence,
  buildChapter8TargetedRemediationPlan,
  selectChapter8ReassessmentQuestions,
} from './targeted-remediation'
import { chapter8ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter8PersistedReassessmentEvent,
  chapter8PersistedEventToEvidence,
} from './reassessment-evidence'
import { evaluateChapter8FormalReassessment } from './recovery-outcome'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapter8MappingProvider } from '@/lib/reassessment/adapters/chapter-8-adapter'

function initialEvidence(
  conceptFamilyId: Chapter8EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  timestamp: string,
): Chapter8EvidenceRecord {
  return {
    studentId: 'student-c8-7-cert',
    chapterId: 'ch-8',
    conceptFamilyId,
    source: 'chapter_assessment',
    itemId,
    difficulty: 'application',
    correct,
    attemptPhase: 'initial',
    timestamp,
  }
}

function persistedRecoveryEvidence(
  conceptFamilyId: Chapter8EvidenceRecord['conceptFamilyId'],
  questionIds: readonly string[],
  correctness: readonly boolean[],
): Chapter8EvidenceRecord[] {
  return questionIds.map((questionId, index) => {
    const event = buildChapter8PersistedReassessmentEvent({
      attemptId: `attempt-${index + 1}`,
      questionId,
      conceptFamilyId,
      correct: correctness[index],
      answeredAt: `2026-09-26T17:0${index}:00.000Z`,
    })
    return chapter8PersistedEventToEvidence('student-c8-7-cert', event)
  })
}

describe('C8-7 final adversarial certification', () => {
  it('certifies detected ordinary gap -> targeted content -> five fresh reserve questions -> persisted recovery -> 80% pass -> higher mastery', () => {
    const original = [
      initialEvidence('ch8-current-conversion', 'qq-8-004', false, '2026-09-20T12:00:00.000Z'),
      initialEvidence('ch8-current-conversion', 'qq-8-005', false, '2026-09-21T12:00:00.000Z'),
      initialEvidence('ch8-current-conversion', 'mcq-8-003', true, '2026-09-22T12:00:00.000Z'),
    ] as const

    const plan = buildChapter8TargetedRemediationPlan(original, '2026-09-26T16:00:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch8-current-conversion')
    expect(target?.requiresFormalReassessment).toBe(true)
    expect(target?.reassessmentPassPercent).toBe(80)

    const contentProvider = getChapterContentProvider('ch-8')
    expect(contentProvider).toBeDefined()
    const bundle = contentProvider!.buildRemediationContentBundle('ch8-current-conversion')
    expect(bundle.contentBlockCount).toBeGreaterThan(0)
    expect(bundle.flashcardCount).toBeGreaterThan(0)

    const selected = selectChapter8ReassessmentQuestions(
      'ch8-current-conversion',
      chapter8ReassessmentReserve,
    )
    expect(selected).toHaveLength(5)
    expect(new Set(selected).size).toBe(5)
    expect(selected.every((id) => id.startsWith('r8-current-conversion-'))).toBe(true)

    const runtimePool = getChapter8MappingProvider().getQuestionsForConcept('ch8-current-conversion')
    expect(runtimePool).toEqual(selected)
    expect(runtimePool.every((id) => id.startsWith('r8-'))).toBe(true)
    expect(runtimePool.some((id) => id.startsWith('qq-8-'))).toBe(false)

    const correctness = [true, true, true, true, false]
    const recovery = persistedRecoveryEvidence('ch8-current-conversion', selected, correctness)
    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)

    const outcome = evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-current-conversion',
      correctCount: 4,
      questionCount: 5,
    })
    expect(outcome.percent).toBe(80)
    expect(outcome.passPercent).toBe(80)
    expect(outcome.passed).toBe(true)
    expect(outcome.detectionState).toBe('currently_performing_well')

    const before = calculateChapter8ConceptMastery(original, '2026-09-26T18:00:00.000Z')
    const combined = appendChapter8ReassessmentEvidence(original, recovery)
    const after = calculateChapter8ConceptMastery(combined, '2026-09-26T18:00:00.000Z')
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(after.mastery).toBeGreaterThan(before.mastery)
    expect(after.reassessmentCorrectCount).toBe(4)
  })

  it('certifies urgent equipment-safety recovery requires 5/5 and does not accept 4/5', () => {
    const selected = selectChapter8ReassessmentQuestions(
      'ch8-equipment-safety',
      chapter8ReassessmentReserve,
    )
    expect(selected).toHaveLength(5)
    expect(selected.every((id) => id.startsWith('r8-equipment-safety-'))).toBe(true)

    const fourOfFive = evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-equipment-safety',
      correctCount: 4,
      questionCount: 5,
    })
    expect(fourOfFive.percent).toBe(80)
    expect(fourOfFive.passPercent).toBe(100)
    expect(fourOfFive.passed).toBe(false)
    expect(fourOfFive.detectionState).toBe('repeated_weakness')

    const fiveOfFive = evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-equipment-safety',
      correctCount: 5,
      questionCount: 5,
    })
    expect(fiveOfFive.percent).toBe(100)
    expect(fiveOfFive.passPercent).toBe(100)
    expect(fiveOfFive.passed).toBe(true)
    expect(fiveOfFive.detectionState).toBe('currently_performing_well')
  })

  it('certifies urgent light-therapy safety uses the same perfect-recovery rule', () => {
    const fourOfFive = evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-light-therapy-safety',
      correctCount: 4,
      questionCount: 5,
    })
    expect(fourOfFive.passPercent).toBe(100)
    expect(fourOfFive.passed).toBe(false)

    const fiveOfFive = evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-light-therapy-safety',
      correctCount: 5,
      questionCount: 5,
    })
    expect(fiveOfFive.passed).toBe(true)
  })

  it('fails closed on incomplete reassessment evidence', () => {
    expect(() => evaluateChapter8FormalReassessment({
      conceptFamilyId: 'ch8-current-conversion',
      correctCount: 4,
      questionCount: 4,
    })).toThrow('exactly five completed questions')
  })

  it('rejects cross-concept reserve evidence so persisted mastery cannot be contaminated', () => {
    const selected = selectChapter8ReassessmentQuestions(
      'ch8-equipment-safety',
      chapter8ReassessmentReserve,
    )
    expect(() => buildChapter8PersistedReassessmentEvent({
      attemptId: 'cross-concept-attempt',
      questionId: selected[0],
      conceptFamilyId: 'ch8-light-therapy-safety',
      correct: true,
      answeredAt: '2026-09-26T17:30:00.000Z',
    })).toThrow('not mapped to the supplied concept family')
  })
})
