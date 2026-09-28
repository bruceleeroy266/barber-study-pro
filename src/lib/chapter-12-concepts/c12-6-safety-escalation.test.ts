import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Chapter12EvidenceRecord } from './grading'
import { chapter12MicroChecks } from './micro-checks'
import { chapter12PremiumQuizQuestions } from '../chapter-12-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  CHAPTER12_SAFETY_RULES,
  chapter12SafetyTaggedItems,
  classifyChapter12MicroCheckSafetyMiss,
  containsProhibitedChapter12SafetyLanguage,
  evaluateChapter12SafetyIntervention,
  getChapter12SafetyTag,
} from './safety-intervention'

const ev = (
  itemId: string,
  conceptFamilyId: Chapter12EvidenceRecord['conceptFamilyId'],
  correct: boolean,
  timestamp: string,
  source: Chapter12EvidenceRecord['source'] = 'chapter_assessment',
): Chapter12EvidenceRecord => ({
  studentId: 'student-c12-safety',
  chapterId: 'ch-12',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C12-6 Chapter 12 safety escalation', () => {
  it('defines five source-supported Chapter 12 high-risk hazard categories', () => {
    const hazards = new Set(chapter12SafetyTaggedItems.map((item) => item.hazard))
    expect(hazards).toEqual(new Set([
      'contamination_exposure_control',
      'contagious_condition_service_deferral',
      'equipment_contraindication_deferral',
      'adverse_reaction_stop_service',
      'scope_diagnosis_treatment_boundary',
    ]))

    expect(getChapter12SafetyTag('mcq-12-012')?.hazard).toBe('contamination_exposure_control')
    expect(getChapter12SafetyTag('mcq-12-013')?.hazard).toBe('contagious_condition_service_deferral')
    expect(getChapter12SafetyTag('mcq-12-006')?.hazard).toBe('equipment_contraindication_deferral')
    expect(getChapter12SafetyTag('mcq-12-014')?.hazard).toBe('adverse_reaction_stop_service')
    expect(getChapter12SafetyTag('mcq-12-010')?.hazard).toBe('scope_diagnosis_treatment_boundary')
  })

  it('tags only current Chapter 12 micro-check and assessment evidence items', () => {
    const microIds = new Set(
      chapter12MicroChecks.flatMap((check) => check.questions.map((question) => question.id)),
    )
    const assessmentIds = new Set(chapter12PremiumQuizQuestions.map((question) => question.id))

    for (const item of chapter12SafetyTaggedItems) {
      expect(
        microIds.has(item.itemId as `mcq-12-${string}`) ||
        assessmentIds.has(item.itemId as `qq-12-${string}`),
        item.itemId,
      ).toBe(true)
    }
  })

  it('keeps tagged assessment items bound to nonempty certified safe answers', () => {
    const byId = new Map(chapter12PremiumQuizQuestions.map((item) => [item.id, item]))

    for (const item of chapter12SafetyTaggedItems.filter((tag) => tag.itemId.startsWith('qq-12-'))) {
      const question = byId.get(item.itemId)
      expect(question, item.itemId).toBeDefined()
      const key = question!.correct_answer as 'a' | 'b' | 'c' | 'd'
      const keyed = question![`answer_${key}`]
      expect(keyed.length, item.itemId).toBeGreaterThan(0)
    }

    expect(byId.get('qq-12-042')!.answer_b).toContain('Stop the service')
    expect(byId.get('qq-12-043')!.answer_c).toContain('Defer the facial service')
    expect(byId.get('qq-12-044')!.answer_d).toContain('Defer the electrical service')
    expect(byId.get('qq-12-045')!.answer_a).toContain('Stop the service')
  })

  it('turns one tagged micro-check miss into immediate targeted review without mutating evidence', () => {
    const question = chapter12MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-12-013')!

    const result = classifyChapter12MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('contagious_condition_service_deferral')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('defer the affected facial service')
  })

  it('does not escalate an ordinary non-safety micro-check miss', () => {
    const question = chapter12MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-12-001')!

    const result = classifyChapter12MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
    expect(result.requiresInstructorReview).toBe(false)
  })

  it('escalates repeated distinct high-risk misses to urgent five-question 100-percent safety reassessment', () => {
    const result = evaluateChapter12SafetyIntervention([
      ev('qq-12-043', 'ch12-contraindications-service-safety', false, '2026-09-28T08:00:00.000Z'),
      ev('qq-12-041', 'ch12-sanitation-infection-control', true, '2026-09-28T08:02:00.000Z'),
      ev('qq-12-045', 'ch12-contraindications-service-safety', false, '2026-09-28T08:04:00.000Z'),
    ])

    expect(result.level).toBe('urgent')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
  })

  it('does not let two misses from one hazard alone trigger urgent escalation', () => {
    const result = evaluateChapter12SafetyIntervention([
      ev('qq-12-041', 'ch12-sanitation-infection-control', false, '2026-09-28T08:00:00.000Z'),
      ev('qq-12-042', 'ch12-sanitation-infection-control', false, '2026-09-28T08:02:00.000Z'),
    ])

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('contamination_exposure_control')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('clears an active intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter12SafetyIntervention([
      ev('qq-12-043', 'ch12-contraindications-service-safety', false, '2026-09-28T08:00:00.000Z'),
      ev('qq-12-041', 'ch12-sanitation-infection-control', true, '2026-09-28T08:01:00.000Z'),
      ev('qq-12-044', 'ch12-contraindications-service-safety', true, '2026-09-28T08:02:00.000Z'),
      ev('qq-12-045', 'ch12-contraindications-service-safety', true, '2026-09-28T08:03:00.000Z'),
      ev('qq-12-038', 'ch12-facial-treatment-procedures', true, '2026-09-28T08:04:00.000Z'),
      ev('mcq-12-012', 'ch12-sanitation-infection-control', true, '2026-09-28T08:05:00.000Z', 'micro_check'),
    ])

    expect(CHAPTER12_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.requiresInstructorReview).toBe(false)
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps safety intervention language inside observation/service/referral scope', () => {
    const messages = chapter12MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter12MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter12SafetyIntervention([
      ev('qq-12-043', 'ch12-contraindications-service-safety', false, '2026-09-28T08:00:00.000Z'),
      ev('qq-12-045', 'ch12-contraindications-service-safety', false, '2026-09-28T08:02:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    expect(messages.length).toBeGreaterThan(0)
    for (const message of messages) {
      expect(containsProhibitedChapter12SafetyLanguage(message), message).toBe(false)
    }
  })

  it('shows targeted safety review in the Chapter 12 micro-check experience', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/chapter/Chapter12MicroCheckCard.tsx'),
      'utf8',
    )

    expect(source).toContain('classifyChapter12MicroCheckSafetyMiss')
    expect(source).toContain('⚠ Safety review required')
    expect(source).toContain('Safety / Scope Intervention')
    expect(source).toContain('safetyIntervention.studentMessage')
  })

  it('does not change the shared 20/10/40/15/15 grade formula', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
