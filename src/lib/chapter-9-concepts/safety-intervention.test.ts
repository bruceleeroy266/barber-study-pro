import { describe, expect, it } from 'vitest'
import type { Chapter9EvidenceRecord } from './grading'
import { chapter9MicroChecks } from './micro-checks'
import {
  CHAPTER9_SAFETY_RULES,
  chapter9SafetyTaggedItems,
  classifyChapter9MicroCheckSafetyMiss,
  containsProhibitedDiagnosticLanguage,
  evaluateChapter9SafetyIntervention,
  getChapter9SafetyTag,
} from './safety-intervention'

const ev = (
  itemId: string,
  conceptFamilyId: Chapter9EvidenceRecord['conceptFamilyId'],
  correct: boolean,
  timestamp: string,
  source: Chapter9EvidenceRecord['source'] = 'chapter_assessment',
): Chapter9EvidenceRecord => ({
  studentId: 'student-c9-safety',
  chapterId: 'ch-9',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C9-6 safety / clinical-boundary intervention', () => {
  it('tags the required high-risk hazard categories across micro-check and assessment evidence', () => {
    const hazards = new Set(chapter9SafetyTaggedItems.map((item) => item.hazard))
    expect(hazards).toEqual(new Set([
      'active_infectious_lesion',
      'suspicious_changing_lesion',
      'open_compromised_skin',
      'heat_regulation_danger',
      'scope_diagnosis_boundary',
    ]))

    expect(getChapter9SafetyTag('mcq-9-014')?.hazard).toBe('active_infectious_lesion')
    expect(getChapter9SafetyTag('q9-024')?.hazard).toBe('active_infectious_lesion')
    expect(getChapter9SafetyTag('mcq-9-019')?.hazard).toBe('suspicious_changing_lesion')
    expect(getChapter9SafetyTag('q9-018')?.hazard).toBe('open_compromised_skin')
    expect(getChapter9SafetyTag('q9-022')?.hazard).toBe('heat_regulation_danger')
    expect(getChapter9SafetyTag('q9-030')?.hazard).toBe('scope_diagnosis_boundary')
  })

  it('turns a single high-risk micro-check miss into immediate targeted safety review without changing first-attempt evidence', () => {
    const question = chapter9MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-9-019')!

    const result = classifyChapter9MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('suspicious_changing_lesion')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('Do not label or diagnose')
  })

  it('does not escalate ordinary Chapter 9 concept misses as clinical-boundary hazards', () => {
    const question = chapter9MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-9-003')!

    const result = classifyChapter9MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
    expect(result.requiresInstructorReview).toBe(false)
  })

  it('escalates repeated distinct high-risk misses to urgent remediation and a perfect five-question safety reassessment', () => {
    const records = [
      ev('q9-018', 'ch9-secondary-lesions', false, '2026-09-27T01:00:00.000Z'),
      ev('q9-022', 'ch9-sebaceous-sudoriferous-disorders', true, '2026-09-27T01:02:00.000Z'),
      ev('q9-024', 'ch9-inflammatory-infectious-conditions', false, '2026-09-27T01:04:00.000Z'),
    ]

    const result = evaluateChapter9SafetyIntervention(records)

    expect(result.level).toBe('urgent')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
    expect(result.studentMessage).toContain('does not diagnose medical conditions')
  })

  it('does not let two misses of the same hazard alone satisfy the distinct-hazard urgent rule', () => {
    const records = [
      ev('q9-024', 'ch9-inflammatory-infectious-conditions', false, '2026-09-27T01:00:00.000Z'),
      ev('q9-026', 'ch9-pigmentation-hypertrophies', false, '2026-09-27T01:02:00.000Z'),
    ]

    const result = evaluateChapter9SafetyIntervention(records)

    expect(result.level).toBe('review')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('clears an active safety intervention only after five consecutive correct tagged safety observations', () => {
    const records = [
      ev('q9-018', 'ch9-secondary-lesions', false, '2026-09-27T01:00:00.000Z'),
      ev('q9-022', 'ch9-sebaceous-sudoriferous-disorders', true, '2026-09-27T01:01:00.000Z'),
      ev('q9-024', 'ch9-inflammatory-infectious-conditions', true, '2026-09-27T01:02:00.000Z'),
      ev('q9-029', 'ch9-skin-cancer-recognition', true, '2026-09-27T01:03:00.000Z'),
      ev('q9-030', 'ch9-service-safety-referral', true, '2026-09-27T01:04:00.000Z'),
      ev('mcq-9-021', 'ch9-service-safety-referral', true, '2026-09-27T01:05:00.000Z', 'micro_check'),
    ]

    const result = evaluateChapter9SafetyIntervention(records)

    expect(CHAPTER9_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.requiresInstructorReview).toBe(false)
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps every student-facing intervention free of prohibited diagnostic/treatment phrasing', () => {
    const messages = chapter9MicroChecks
      .flatMap((check) => check.questions)
      .map((question) => classifyChapter9MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter9SafetyIntervention([
      ev('q9-018', 'ch9-secondary-lesions', false, '2026-09-27T01:00:00.000Z'),
      ev('q9-024', 'ch9-inflammatory-infectious-conditions', false, '2026-09-27T01:02:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(containsProhibitedDiagnosticLanguage(message)).toBe(false)
    }
  })
})
