import { describe, expect, it } from 'vitest'
import type { Chapter10EvidenceRecord } from './grading'
import { chapter10MicroChecks } from './micro-checks'
import {
  CHAPTER10_SAFETY_RULES,
  chapter10SafetyTaggedItems,
  classifyChapter10MicroCheckSafetyMiss,
  containsProhibitedChapter10SafetyLanguage,
  evaluateChapter10SafetyIntervention,
  getChapter10SafetyTag,
} from './safety-intervention'

const ev = (
  itemId: string,
  conceptFamilyId: Chapter10EvidenceRecord['conceptFamilyId'],
  correct: boolean,
  timestamp: string,
  source: Chapter10EvidenceRecord['source'] = 'chapter_assessment',
): Chapter10EvidenceRecord => ({
  studentId: 'student-c10-safety',
  chapterId: 'ch-10',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C10-6 Chapter 10 safety escalation', () => {
  it('tags the source-supported Chapter 10 high-risk hazard categories', () => {
    const hazards = new Set(chapter10SafetyTaggedItems.map((item) => item.hazard))
    expect(hazards).toEqual(new Set([
      'parasite_service_stop',
      'contagious_condition_referral',
      'chemical_service_compromised_scalp',
      'scope_diagnosis_treatment_boundary',
    ]))

    expect(getChapter10SafetyTag('mcq-10-017')?.hazard).toBe('parasite_service_stop')
    expect(getChapter10SafetyTag('mcq-10-018')?.hazard).toBe('chemical_service_compromised_scalp')
    expect(getChapter10SafetyTag('mcq-10-019')?.hazard).toBe('scope_diagnosis_treatment_boundary')
    expect(getChapter10SafetyTag('qq-10-040')?.hazard).toBe('contagious_condition_referral')
  })

  it('turns one tagged micro-check miss into immediate targeted review without mutating the evidence record', () => {
    const question = chapter10MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-10-017')!

    const result = classifyChapter10MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('parasite_service_stop')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('do not begin the service')
  })

  it('does not escalate an ordinary non-safety miss', () => {
    const question = chapter10MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-10-001')!

    const result = classifyChapter10MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
    expect(result.requiresInstructorReview).toBe(false)
  })

  it('escalates repeated distinct high-risk misses to urgent five-question 100-percent safety reassessment', () => {
    const records = [
      ev('qq-10-034', 'ch10-service-safety-referral', false, '2026-09-27T23:40:00.000Z'),
      ev('qq-10-066', 'ch10-service-safety-referral', true, '2026-09-27T23:42:00.000Z'),
      ev('qq-10-067', 'ch10-service-safety-referral', false, '2026-09-27T23:44:00.000Z'),
    ]

    const result = evaluateChapter10SafetyIntervention(records)

    expect(result.level).toBe('urgent')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
  })

  it('does not let two misses from only one hazard satisfy the distinct-hazard urgent rule', () => {
    const records = [
      ev('qq-10-034', 'ch10-service-safety-referral', false, '2026-09-27T23:40:00.000Z'),
      ev('qq-10-066', 'ch10-service-safety-referral', false, '2026-09-27T23:42:00.000Z'),
    ]

    const result = evaluateChapter10SafetyIntervention(records)

    expect(result.level).toBe('review')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('clears an active safety intervention only after five consecutive correct tagged safety observations', () => {
    const records = [
      ev('qq-10-034', 'ch10-service-safety-referral', false, '2026-09-27T23:30:00.000Z'),
      ev('qq-10-035', 'ch10-service-safety-referral', true, '2026-09-27T23:31:00.000Z'),
      ev('qq-10-040', 'ch10-service-safety-referral', true, '2026-09-27T23:32:00.000Z'),
      ev('qq-10-066', 'ch10-service-safety-referral', true, '2026-09-27T23:33:00.000Z'),
      ev('qq-10-067', 'ch10-service-safety-referral', true, '2026-09-27T23:34:00.000Z'),
      ev('mcq-10-019', 'ch10-service-safety-referral', true, '2026-09-27T23:35:00.000Z', 'micro_check'),
    ]

    const result = evaluateChapter10SafetyIntervention(records)

    expect(CHAPTER10_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.requiresInstructorReview).toBe(false)
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps every student-facing safety message within observation/service/referral scope', () => {
    const messages = chapter10MicroChecks
      .flatMap((check) => check.questions)
      .map((question) => classifyChapter10MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter10SafetyIntervention([
      ev('qq-10-034', 'ch10-service-safety-referral', false, '2026-09-27T23:40:00.000Z'),
      ev('qq-10-067', 'ch10-service-safety-referral', false, '2026-09-27T23:42:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(containsProhibitedChapter10SafetyLanguage(message)).toBe(false)
    }
  })
})
