import { describe, expect, it } from 'vitest'
import type { Chapter11EvidenceRecord } from './grading'
import { chapter11MicroChecks } from './micro-checks'
import { chapter11PremiumQuizQuestions } from '../chapter-11-premium-quiz'
import {
  CHAPTER11_SAFETY_RULES,
  chapter11SafetyTaggedItems,
  classifyChapter11MicroCheckSafetyMiss,
  containsProhibitedChapter11SafetyLanguage,
  evaluateChapter11SafetyIntervention,
  getChapter11SafetyTag,
} from './safety-intervention'

const ev = (
  itemId: string,
  conceptFamilyId: Chapter11EvidenceRecord['conceptFamilyId'],
  correct: boolean,
  timestamp: string,
  source: Chapter11EvidenceRecord['source'] = 'chapter_assessment',
): Chapter11EvidenceRecord => ({
  studentId: 'student-c11-safety',
  chapterId: 'ch-11',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C11-6 Chapter 11 safety escalation', () => {
  it('defines four source-supported Chapter 11 high-risk hazard categories', () => {
    const hazards = new Set(chapter11SafetyTaggedItems.map((item) => item.hazard))
    expect(hazards).toEqual(new Set([
      'parasite_treatment_referral',
      'staphylococcal_treatment_referral',
      'compromised_scalp_service_decision',
      'scope_diagnosis_treatment_boundary',
    ]))

    expect(getChapter11SafetyTag('mcq-11-013')?.hazard).toBe('parasite_treatment_referral')
    expect(getChapter11SafetyTag('mcq-11-014')?.hazard).toBe('staphylococcal_treatment_referral')
    expect(getChapter11SafetyTag('qq-11-031')?.hazard).toBe('compromised_scalp_service_decision')
    expect(getChapter11SafetyTag('qq-11-042')?.hazard).toBe('scope_diagnosis_treatment_boundary')
  })

  it('keeps every tagged assessment item bound to its certified safe answer', () => {
    const byId = new Map(chapter11PremiumQuizQuestions.map((item) => [item.id, item]))

    for (const item of chapter11SafetyTaggedItems.filter((tag) => tag.itemId.startsWith('qq-11-'))) {
      const question = byId.get(item.itemId)
      expect(question).toBeDefined()
      const keyed = question![`answer_${question!.correct_answer}` as 'answer_a'|'answer_b'|'answer_c'|'answer_d']
      expect(keyed.length).toBeGreaterThan(0)
    }

    expect(byId.get('qq-11-039')!.answer_a).toContain('refer the client to a physician')
    expect(byId.get('qq-11-040')!.answer_d).toContain('refer the client to a physician')
    expect(byId.get('qq-11-042')!.answer_b).toContain('refer appropriately')
  })

  it('turns one tagged micro-check miss into immediate targeted review without mutating evidence', () => {
    const question = chapter11MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-11-013')!

    const result = classifyChapter11MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('parasite_treatment_referral')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('refer the client to a physician')
  })

  it('does not escalate an ordinary non-safety micro-check miss', () => {
    const question = chapter11MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-11-001')!

    const result = classifyChapter11MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
    expect(result.requiresInstructorReview).toBe(false)
  })

  it('escalates repeated distinct high-risk misses to urgent five-question 100-percent safety reassessment', () => {
    const result = evaluateChapter11SafetyIntervention([
      ev('qq-11-039', 'ch11-service-safety-referral', false, '2026-09-28T03:10:00.000Z'),
      ev('qq-11-038', 'ch11-service-safety-referral', true, '2026-09-28T03:12:00.000Z'),
      ev('qq-11-043', 'ch11-service-safety-referral', false, '2026-09-28T03:14:00.000Z'),
    ])

    expect(result.level).toBe('urgent')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
  })

  it('does not let two misses from one hazard alone trigger urgent escalation', () => {
    const result = evaluateChapter11SafetyIntervention([
      ev('qq-11-038', 'ch11-service-safety-referral', false, '2026-09-28T03:10:00.000Z'),
      ev('qq-11-042', 'ch11-service-safety-referral', false, '2026-09-28T03:12:00.000Z'),
    ])

    expect(result.level).toBe('review')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('clears an active safety intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter11SafetyIntervention([
      ev('qq-11-039', 'ch11-service-safety-referral', false, '2026-09-28T03:00:00.000Z'),
      ev('qq-11-031', 'ch11-scalp-condition-recognition', true, '2026-09-28T03:01:00.000Z'),
      ev('qq-11-038', 'ch11-service-safety-referral', true, '2026-09-28T03:02:00.000Z'),
      ev('qq-11-040', 'ch11-service-safety-referral', true, '2026-09-28T03:03:00.000Z'),
      ev('qq-11-042', 'ch11-service-safety-referral', true, '2026-09-28T03:04:00.000Z'),
      ev('mcq-11-015', 'ch11-service-safety-referral', true, '2026-09-28T03:05:00.000Z', 'micro_check'),
    ])

    expect(CHAPTER11_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.requiresInstructorReview).toBe(false)
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps all student-facing safety language within observation/service/referral scope', () => {
    const messages = chapter11MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter11MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter11SafetyIntervention([
      ev('qq-11-039', 'ch11-service-safety-referral', false, '2026-09-28T03:10:00.000Z'),
      ev('qq-11-043', 'ch11-service-safety-referral', false, '2026-09-28T03:12:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(containsProhibitedChapter11SafetyLanguage(message)).toBe(false)
    }
  })
})
