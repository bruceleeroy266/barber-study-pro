import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumContent } from '../chapter-15-premium'
import { chapter15PremiumFlashcards } from '../chapter-15-premium-flashcards'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import { chapter15MicroChecks } from './micro-checks'
import { CHAPTER15_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter15EvidenceRecord } from './grading'
import {
  CHAPTER15_SAFETY_RULES,
  chapter15SafetyTaggedItems,
  classifyChapter15MicroCheckSafetyMiss,
  containsProhibitedChapter15SafetyLanguage,
  evaluateChapter15SafetyIntervention,
  getChapter15RequiredReassessmentPassPercent,
  getChapter15SafetyTag,
} from './safety-intervention'
import {
  buildChapter15RemediationPathForConcept,
  buildChapter15TargetedRemediationPlan,
  CHAPTER15_REMEDIATION_RULES,
  combineChapter15Evidence,
} from './targeted-remediation'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'

const ev = (
  conceptFamilyId: Chapter15EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter15EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter15EvidenceRecord['difficulty'] = 'application',
): Chapter15EvidenceRecord => ({
  studentId: 'student-c15',
  chapterId: 'ch-15',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C15-6 combined-evidence gap detection and targeted remediation', () => {
  it('preserves certified inventories and the 14-question micro-check layer', () => {
    expect(chapter15PremiumContent.sections).toHaveLength(54)
    expect(chapter15PremiumFlashcards).toHaveLength(90)
    expect(chapter15PremiumQuizQuestions).toHaveLength(72)
    expect(chapter15MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
  })

  it('combines immutable evidence from micro-checks, flashcards, assessment, and scenarios without duplicates', () => {
    const micro = [ev('ch15-system-selection-measurement-template','mcq-15-007',false,'micro_check','2026-09-29T06:00:00.000Z')]
    const flash = [ev('ch15-system-selection-measurement-template','fc-ch15-036',true,'flashcard','2026-09-29T06:01:00.000Z','understanding')]
    const assessment = [ev('ch15-system-selection-measurement-template','qq-15-031',false,'chapter_assessment','2026-09-29T06:02:00.000Z')]
    const scenario = [ev('ch15-system-selection-measurement-template','stock-custom-scenario',false,'scenario_application','2026-09-29T06:03:00.000Z','scenario')]

    const combined = combineChapter15Evidence(micro, flash, assessment, scenario, micro)

    expect(combined).toHaveLength(4)
    expect(new Set(combined.map((record) => record.source))).toEqual(new Set([
      'micro_check',
      'flashcard',
      'chapter_assessment',
      'scenario_application',
    ]))
  })

  it('targets a weak concept using combined evidence and returns canonical lesson + flashcard paths', () => {
    const records = combineChapter15Evidence(
      [ev('ch15-system-selection-measurement-template','mcq-15-007',false,'micro_check','2026-09-29T06:00:00.000Z')],
      [ev('ch15-system-selection-measurement-template','fc-ch15-036',true,'flashcard','2026-09-29T06:01:00.000Z','understanding')],
      [ev('ch15-system-selection-measurement-template','qq-15-031',false,'chapter_assessment','2026-09-29T06:02:00.000Z')],
      [ev('ch15-system-selection-measurement-template','stock-custom-scenario',false,'scenario_application','2026-09-29T06:03:00.000Z','scenario')],
    )

    const plan = buildChapter15TargetedRemediationPlan(records,'2026-09-29T06:04:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch15-system-selection-measurement-template')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds).toContain('template-creation')
    expect(target.remediationFlashcardIds).toContain('fc-ch15-036')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)
    expect(plan.preservedEvidence).toBe(records)
  })

  it('provides a non-empty canonical remediation path for every concept family', () => {
    for (const conceptFamilyId of CHAPTER15_CONCEPT_FAMILY_IDS) {
      const path = buildChapter15RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
    }
  })

  it('registers Chapter 15 in the shared detection/remediation assignment registry', () => {
    expect(isConceptDetectionSupported('ch-15')).toBe(true)
    const provider = getChapterDetectionProvider('ch-15')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER15_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })
})

describe('C15-6 safety-sensitive escalation', () => {
  it('defines only the intended high-risk hazard classes and tags current evidence items', () => {
    expect(new Set(chapter15SafetyTaggedItems.map((item) => item.hazard))).toEqual(new Set([
      'medication_scope_boundary',
      'surgical_scope_boundary',
      'attachment_cure_water_exposure',
      'chemical_service_compatibility',
    ]))

    const microIds = new Set(chapter15MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))
    const assessmentIds = new Set(chapter15PremiumQuizQuestions.map((question) => question.id))

    for (const item of chapter15SafetyTaggedItems) {
      expect(microIds.has(item.itemId as never) || assessmentIds.has(item.itemId as never), item.itemId).toBe(true)
    }
  })

  it('turns one high-risk micro-check miss into immediate targeted review', () => {
    const question = chapter15MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-15-003')!

    const result = classifyChapter15MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('medication_scope_boundary')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('licensed healthcare professional')
  })

  it('does not escalate an ordinary cutting/customization miss', () => {
    const question = chapter15MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-15-013')!

    const result = classifyChapter15MicroCheckSafetyMiss(question, false)
    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
  })

  it('escalates recent misses across distinct hazard types to urgent 5-question / 100-percent policy', () => {
    const records = [
      ev('ch15-alternatives-scope-referral','mcq-15-003',false,'micro_check','2026-09-29T06:10:00.000Z','scenario'),
      ev('ch15-attachment-methods-bonding','mcq-15-009',false,'micro_check','2026-09-29T06:11:00.000Z','application'),
    ]

    const result = evaluateChapter15SafetyIntervention(records)
    expect(result.level).toBe('urgent')
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
    expect(result.affectedConceptFamilyIds).toEqual(expect.arrayContaining([
      'ch15-alternatives-scope-referral',
      'ch15-attachment-methods-bonding',
    ]))

    const plan = buildChapter15TargetedRemediationPlan(records,'2026-09-29T06:12:00.000Z')
    expect(plan.targets.filter((target) => target.priority === 'urgent')).toHaveLength(2)
    expect(plan.targets.filter((target) => target.priority === 'urgent').every(
      (target) => target.plannedReassessmentPassPercent === 100,
    )).toBe(true)
  })

  it('does not let repeated misses from one hazard type alone trigger urgent escalation', () => {
    const records = [
      ev('ch15-attachment-methods-bonding','mcq-15-009',false,'micro_check','2026-09-29T06:10:00.000Z'),
      ev('ch15-attachment-methods-bonding','qq-15-038',false,'chapter_assessment','2026-09-29T06:11:00.000Z'),
    ]

    const result = evaluateChapter15SafetyIntervention(records)
    expect(result.level).toBe('review')
    expect(result.hazard).toBe('attachment_cure_water_exposure')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('requires 100 percent only for concepts affected by an urgent safety intervention', () => {
    const records = [
      ev('ch15-alternatives-scope-referral','mcq-15-003',false,'micro_check','2026-09-29T06:10:00.000Z'),
      ev('ch15-cleaning-maintenance-chemical-care','mcq-15-011',false,'micro_check','2026-09-29T06:11:00.000Z'),
    ]

    expect(getChapter15RequiredReassessmentPassPercent(records,'ch15-alternatives-scope-referral')).toBe(100)
    expect(getChapter15RequiredReassessmentPassPercent(records,'ch15-cleaning-maintenance-chemical-care')).toBe(100)
    expect(getChapter15RequiredReassessmentPassPercent(records,'ch15-cutting-blending-customization')).toBe(80)
  })

  it('clears an intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter15SafetyIntervention([
      ev('ch15-alternatives-scope-referral','mcq-15-003',false,'micro_check','2026-09-29T06:10:00.000Z'),
      ev('ch15-alternatives-scope-referral','mcq-15-004',true,'micro_check','2026-09-29T06:11:00.000Z'),
      ev('ch15-attachment-methods-bonding','mcq-15-009',true,'micro_check','2026-09-29T06:12:00.000Z'),
      ev('ch15-cleaning-maintenance-chemical-care','mcq-15-011',true,'micro_check','2026-09-29T06:13:00.000Z'),
      ev('ch15-alternatives-scope-referral','qq-15-056',true,'chapter_assessment','2026-09-29T06:14:00.000Z'),
      ev('ch15-attachment-methods-bonding','qq-15-038',true,'chapter_assessment','2026-09-29T06:15:00.000Z'),
    ])

    expect(CHAPTER15_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps student-facing escalation language within scope and avoids diagnosis/prescribing language', () => {
    const messages = chapter15MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter15MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter15SafetyIntervention([
      ev('ch15-alternatives-scope-referral','mcq-15-003',false,'micro_check','2026-09-29T06:10:00.000Z'),
      ev('ch15-cleaning-maintenance-chemical-care','mcq-15-011',false,'micro_check','2026-09-29T06:11:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    for (const message of messages) {
      expect(containsProhibitedChapter15SafetyLanguage(message), message).toBe(false)
    }
  })

  it('locks remediation policy to ordinary 80 percent and urgent safety 100 percent', () => {
    expect(CHAPTER15_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER15_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER15_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER15_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER15_SAFETY_RULES.formalSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER15_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
  })

  it('wires immediate Chapter 15 safety review into the live micro-check card', () => {
    const source = readFileSync(join(process.cwd(),'src/components/chapter/Chapter15MicroCheckCard.tsx'),'utf8')
    expect(source).toContain('classifyChapter15MicroCheckSafetyMiss')
    expect(source).toContain('Safety/scope review required')
    expect(source).toContain('Targeted Safety Review')
  })
})
