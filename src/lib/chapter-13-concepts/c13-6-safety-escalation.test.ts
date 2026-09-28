import { describe, expect, it } from 'vitest'
import type { Chapter13EvidenceRecord } from './grading'
import { chapter13MicroChecks } from './micro-checks'
import { chapter13PremiumQuizQuestions } from '../chapter-13-premium-quiz'
import {
  CHAPTER13_SAFETY_RULES,
  chapter13SafetyTaggedItems,
  classifyChapter13MicroCheckSafetyMiss,
  containsProhibitedChapter13SafetyLanguage,
  evaluateChapter13SafetyIntervention,
  evaluateChapter13SafetyRecovery,
  getChapter13RequiredReassessmentPassPercent,
  getChapter13SafetyTag,
} from './safety-intervention'

const ev = (
  itemId: string,
  conceptFamilyId: Chapter13EvidenceRecord['conceptFamilyId'],
  correct: boolean,
  timestamp: string,
  source: Chapter13EvidenceRecord['source'] = 'chapter_assessment',
): Chapter13EvidenceRecord => ({
  studentId: 'student-c13-safety',
  chapterId: 'ch-13',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C13-6 Chapter 13 safety escalation', () => {
  it('defines only four genuinely high-risk shaving hazard categories', () => {
    const hazards = new Set(chapter13SafetyTaggedItems.map((item) => item.hazard))
    expect(hazards).toEqual(new Set([
      'blood_exposure_response',
      'compromised_skin_service_deferral',
      'medical_scope_boundary',
      'heat_towel_contraindication',
    ]))

    expect(getChapter13SafetyTag('qq-13-010')?.hazard).toBe('blood_exposure_response')
    expect(getChapter13SafetyTag('qq-13-006')?.hazard).toBe('compromised_skin_service_deferral')
    expect(getChapter13SafetyTag('qq-13-014')?.hazard).toBe('medical_scope_boundary')
    expect(getChapter13SafetyTag('qq-13-007')?.hazard).toBe('heat_towel_contraindication')
  })

  it('keeps tagged assessment items bound to their certified safe answers', () => {
    const byId = new Map(chapter13PremiumQuizQuestions.map((item) => [item.id, item]))

    for (const item of chapter13SafetyTaggedItems.filter((tag) => tag.itemId.startsWith('qq-13-'))) {
      const question = byId.get(item.itemId)
      expect(question).toBeDefined()
      const key = question!.correct_answer as 'a' | 'b' | 'c' | 'd'
      const keyed = question![`answer_${key}`]
      expect(String(keyed).length).toBeGreaterThan(0)
    }

    expect(byId.get('qq-13-006')!.answer_a).toContain('pustules')
    expect(byId.get('qq-13-010')!.answer_a).toContain('blood-exposure procedure')
    expect(byId.get('qq-13-014')!.answer_a).toContain('refer')
  })

  it('turns one tagged micro-check miss into immediate targeted safety review without mutating evidence', () => {
    const question = chapter13MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-13-013')!

    const result = classifyChapter13MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('blood_exposure_response')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('stop the service')
  })

  it('does not escalate an ordinary non-safety technique miss', () => {
    const question = chapter13MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-13-007')!

    const result = classifyChapter13MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
    expect(result.requiresInstructorReview).toBe(false)
  })

  it('escalates distinct recent high-risk misses to urgent five-question 100-percent safety reassessment', () => {
    const records = [
      ev('qq-13-006', 'ch13-infection-control-service-safety', false, '2026-09-28T14:00:00.000Z'),
      ev('qq-13-007', 'ch13-infection-control-service-safety', true, '2026-09-28T14:02:00.000Z'),
      ev('qq-13-010', 'ch13-infection-control-service-safety', false, '2026-09-28T14:04:00.000Z'),
    ]

    const result = evaluateChapter13SafetyIntervention(records)

    expect(result.level).toBe('urgent')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
    expect(result.affectedConceptFamilyIds).toContain('ch13-infection-control-service-safety')
  })

  it('does not let repeated misses from one hazard alone trigger urgent escalation', () => {
    const result = evaluateChapter13SafetyIntervention([
      ev('qq-13-010', 'ch13-infection-control-service-safety', false, '2026-09-28T14:00:00.000Z'),
      ev('mcq-13-013', 'ch13-infection-control-service-safety', false, '2026-09-28T14:02:00.000Z', 'micro_check'),
    ])

    expect(result.level).toBe('review')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('requires 100 percent for an urgent safety concept while ordinary recovery remains 80 percent', () => {
    const urgentRecords = [
      ev('qq-13-006', 'ch13-infection-control-service-safety', false, '2026-09-28T14:00:00.000Z'),
      ev('qq-13-010', 'ch13-infection-control-service-safety', false, '2026-09-28T14:02:00.000Z'),
    ]

    expect(getChapter13RequiredReassessmentPassPercent(
      urgentRecords,
      'ch13-infection-control-service-safety',
    )).toBe(100)

    const urgentFourOfFive = evaluateChapter13SafetyRecovery({
      records: urgentRecords,
      conceptFamilyId: 'ch13-infection-control-service-safety',
      responses: [true, true, true, true, false],
    })
    expect(urgentFourOfFive.percent).toBe(80)
    expect(urgentFourOfFive.requiredPassPercent).toBe(100)
    expect(urgentFourOfFive.passed).toBe(false)
    expect(urgentFourOfFive.blocksMasteryRecovery).toBe(true)

    const urgentFiveOfFive = evaluateChapter13SafetyRecovery({
      records: urgentRecords,
      conceptFamilyId: 'ch13-infection-control-service-safety',
      responses: [true, true, true, true, true],
    })
    expect(urgentFiveOfFive.passed).toBe(true)
    expect(urgentFiveOfFive.blocksMasteryRecovery).toBe(false)

    expect(getChapter13RequiredReassessmentPassPercent(
      urgentRecords,
      'ch13-facial-hair-design',
    )).toBe(80)

    const ordinaryFourOfFive = evaluateChapter13SafetyRecovery({
      records: urgentRecords,
      conceptFamilyId: 'ch13-facial-hair-design',
      responses: [true, true, true, true, false],
    })
    expect(ordinaryFourOfFive.requiredPassPercent).toBe(80)
    expect(ordinaryFourOfFive.passed).toBe(true)
    expect(ordinaryFourOfFive.blocksMasteryRecovery).toBe(false)
  })

  it('clears an active safety intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter13SafetyIntervention([
      ev('qq-13-010', 'ch13-infection-control-service-safety', false, '2026-09-28T14:00:00.000Z'),
      ev('qq-13-006', 'ch13-infection-control-service-safety', true, '2026-09-28T14:01:00.000Z'),
      ev('qq-13-007', 'ch13-infection-control-service-safety', true, '2026-09-28T14:02:00.000Z'),
      ev('qq-13-014', 'ch13-hair-growth-ingrown-prevention', true, '2026-09-28T14:03:00.000Z'),
      ev('mcq-13-002', 'ch13-consultation-service-preparation', true, '2026-09-28T14:04:00.000Z', 'micro_check'),
      ev('mcq-13-013', 'ch13-infection-control-service-safety', true, '2026-09-28T14:05:00.000Z', 'micro_check'),
    ])

    expect(CHAPTER13_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.requiresInstructorReview).toBe(false)
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps student-facing safety language within observation, service-decision, exposure, and referral scope', () => {
    const messages = chapter13MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter13MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter13SafetyIntervention([
      ev('qq-13-006', 'ch13-infection-control-service-safety', false, '2026-09-28T14:00:00.000Z'),
      ev('qq-13-010', 'ch13-infection-control-service-safety', false, '2026-09-28T14:02:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(containsProhibitedChapter13SafetyLanguage(message)).toBe(false)
    }
  })

  it('does not change shared grading weights or create a parallel grade formula', () => {
    expect(CHAPTER13_SAFETY_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER13_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
  })
})
