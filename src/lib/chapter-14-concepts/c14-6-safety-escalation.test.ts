import { describe, expect, it } from 'vitest'
import type { Chapter14EvidenceRecord } from './grading'
import { chapter14MicroChecks } from './micro-checks'
import { chapter14PremiumQuizQuestions } from '../chapter-14-premium-quiz'
import {
  CHAPTER14_SAFETY_RULES,
  chapter14SafetyTaggedItems,
  classifyChapter14MicroCheckSafetyMiss,
  containsProhibitedChapter14SafetyLanguage,
  evaluateChapter14SafetyIntervention,
  evaluateChapter14SafetyRecovery,
  getChapter14RequiredReassessmentPassPercent,
  getChapter14SafetyTag,
} from './safety-intervention'

const ev = (
  itemId: string,
  conceptFamilyId: Chapter14EvidenceRecord['conceptFamilyId'],
  correct: boolean,
  timestamp: string,
  source: Chapter14EvidenceRecord['source'] = 'chapter_assessment',
): Chapter14EvidenceRecord => ({
  studentId: 'student-c14-safety',
  chapterId: 'ch-14',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C14-6 Chapter 14 safety escalation', () => {
  it('defines only genuinely high-risk Chapter 14 hazard categories', () => {
    const hazards = new Set(chapter14SafetyTaggedItems.map((item) => item.hazard))
    expect(hazards).toEqual(new Set([
      'compromised_skin_service_deferral',
      'thermal_burn_prevention',
    ]))

    expect(getChapter14SafetyTag('mcq-14-013')?.hazard).toBe('compromised_skin_service_deferral')
    expect(getChapter14SafetyTag('mcq-14-014')?.hazard).toBe('thermal_burn_prevention')
    expect(getChapter14SafetyTag('qq-14-070')?.hazard).toBe('thermal_burn_prevention')
  })

  it('tags only current Chapter 14 micro-check and assessment evidence items', () => {
    const microIds = new Set(
      chapter14MicroChecks.flatMap((check) => check.questions.map((question) => question.id)),
    )
    const assessmentIds = new Set(chapter14PremiumQuizQuestions.map((question) => question.id))

    for (const item of chapter14SafetyTaggedItems) {
      expect(
        microIds.has(item.itemId as `mcq-14-${string}`) ||
        assessmentIds.has(item.itemId as `qq-14-${string}`),
        item.itemId,
      ).toBe(true)
    }
  })

  it('keeps tagged assessment items bound to the certified safe answer', () => {
    const byId = new Map(chapter14PremiumQuizQuestions.map((item) => [item.id, item]))
    const question = byId.get('qq-14-070')
    expect(question).toBeDefined()
    expect(question!.correct_answer).toBe('b')
    expect(question!.answer_b).toContain('Continuously move both the dryer and the hair')
  })

  it('turns one tagged micro-check miss into immediate targeted review without mutating evidence', () => {
    const question = chapter14MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-14-013')!

    const result = classifyChapter14MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('compromised_skin_service_deferral')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('defer the affected service')
  })

  it('does not escalate an ordinary non-safety technique miss', () => {
    const question = chapter14MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-14-007')!

    const result = classifyChapter14MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
    expect(result.requiresInstructorReview).toBe(false)
  })

  it('escalates distinct recent high-risk misses to urgent five-question 100-percent safety reassessment', () => {
    const records = [
      ev('mcq-14-013', 'ch14-service-safety-sanitation', false, '2026-09-28T18:30:00.000Z', 'micro_check'),
      ev('qq-14-070', 'ch14-service-safety-sanitation', true, '2026-09-28T18:31:00.000Z'),
      ev('mcq-14-014', 'ch14-service-safety-sanitation', false, '2026-09-28T18:32:00.000Z', 'micro_check'),
    ]

    const result = evaluateChapter14SafetyIntervention(records)

    expect(result.level).toBe('urgent')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
    expect(result.affectedConceptFamilyIds).toContain('ch14-service-safety-sanitation')
  })

  it('does not let repeated misses from one hazard alone trigger urgent escalation', () => {
    const result = evaluateChapter14SafetyIntervention([
      ev('qq-14-070', 'ch14-service-safety-sanitation', false, '2026-09-28T18:30:00.000Z'),
      ev('mcq-14-014', 'ch14-service-safety-sanitation', false, '2026-09-28T18:32:00.000Z', 'micro_check'),
    ])

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('thermal_burn_prevention')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('requires 100 percent for urgent safety recovery while ordinary recovery remains 80 percent', () => {
    const urgentRecords = [
      ev('mcq-14-013', 'ch14-service-safety-sanitation', false, '2026-09-28T18:30:00.000Z', 'micro_check'),
      ev('mcq-14-014', 'ch14-service-safety-sanitation', false, '2026-09-28T18:32:00.000Z', 'micro_check'),
    ]

    expect(getChapter14RequiredReassessmentPassPercent(
      urgentRecords,
      'ch14-service-safety-sanitation',
    )).toBe(100)

    const urgentFourOfFive = evaluateChapter14SafetyRecovery({
      records: urgentRecords,
      conceptFamilyId: 'ch14-service-safety-sanitation',
      responses: [true, true, true, true, false],
    })
    expect(urgentFourOfFive.percent).toBe(80)
    expect(urgentFourOfFive.requiredPassPercent).toBe(100)
    expect(urgentFourOfFive.passed).toBe(false)
    expect(urgentFourOfFive.blocksMasteryRecovery).toBe(true)

    const urgentFiveOfFive = evaluateChapter14SafetyRecovery({
      records: urgentRecords,
      conceptFamilyId: 'ch14-service-safety-sanitation',
      responses: [true, true, true, true, true],
    })
    expect(urgentFiveOfFive.passed).toBe(true)
    expect(urgentFiveOfFive.blocksMasteryRecovery).toBe(false)

    expect(getChapter14RequiredReassessmentPassPercent(
      urgentRecords,
      'ch14-cutting-geometry-guides',
    )).toBe(80)
  })

  it('clears an active safety intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter14SafetyIntervention([
      ev('mcq-14-013', 'ch14-service-safety-sanitation', false, '2026-09-28T18:30:00.000Z', 'micro_check'),
      ev('qq-14-070', 'ch14-service-safety-sanitation', true, '2026-09-28T18:31:00.000Z'),
      ev('mcq-14-014', 'ch14-service-safety-sanitation', true, '2026-09-28T18:32:00.000Z', 'micro_check'),
      ev('qq-14-070', 'ch14-service-safety-sanitation', true, '2026-09-28T18:33:00.000Z'),
      ev('mcq-14-013', 'ch14-service-safety-sanitation', true, '2026-09-28T18:34:00.000Z', 'micro_check'),
      ev('mcq-14-014', 'ch14-service-safety-sanitation', true, '2026-09-28T18:35:00.000Z', 'micro_check'),
    ])

    expect(CHAPTER14_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.requiresInstructorReview).toBe(false)
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps student-facing safety language within observation and service-decision scope', () => {
    const messages = chapter14MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter14MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter14SafetyIntervention([
      ev('mcq-14-013', 'ch14-service-safety-sanitation', false, '2026-09-28T18:30:00.000Z', 'micro_check'),
      ev('mcq-14-014', 'ch14-service-safety-sanitation', false, '2026-09-28T18:32:00.000Z', 'micro_check'),
    ])
    messages.push(urgent.studentMessage)

    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(containsProhibitedChapter14SafetyLanguage(message)).toBe(false)
    }
  })

  it('preserves immutable first-attempt evidence and shared grading thresholds', () => {
    expect(CHAPTER14_SAFETY_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER14_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER14_SAFETY_RULES.formalSafetyReassessmentQuestionCount).toBe(5)
  })
})
