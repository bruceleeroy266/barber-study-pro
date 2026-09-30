import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter18PremiumContent } from '../chapter-18-premium'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import { chapter18MicroChecks } from './micro-checks'
import { CHAPTER18_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter18EvidenceRecord } from './grading'
import {
  CHAPTER18_SAFETY_RULES,
  chapter18SafetyTaggedItems,
  classifyChapter18MicroCheckSafetyMiss,
  containsProhibitedChapter18SafetyLanguage,
  evaluateChapter18SafetyIntervention,
  getChapter18RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  buildChapter18RemediationPathForConcept,
  buildChapter18TargetedRemediationPlan,
  CHAPTER18_REMEDIATION_RULES,
  combineChapter18Evidence,
} from './targeted-remediation'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '@/lib/remediation/content-provider-registry'

const ev = (
  conceptFamilyId: Chapter18EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter18EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter18EvidenceRecord['difficulty'] = 'application',
): Chapter18EvidenceRecord => ({
  studentId: 'student-c18',
  chapterId: 'ch-18',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C18-6 combined-evidence gap detection and targeted remediation', () => {
  it('preserves certified 1-shell / 50 flashcards / 15 assessment / 14 micro-check inventories', () => {
    expect(chapter18PremiumContent.sections).toHaveLength(1)
    expect(chapter18PremiumFlashcards).toHaveLength(50)
    expect(chapter18PremiumQuizQuestions).toHaveLength(15)
    expect(chapter18MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
  })

  it('combines immutable evidence from micro-checks, flashcards, assessment, and scenarios without duplicates', () => {
    const micro = [ev('ch18-analysis-structure','mcq-18-001',false,'micro_check','2026-09-30T03:00:00.000Z')]
    const flash = [ev('ch18-analysis-structure','fc-ch18-003',true,'flashcard','2026-09-30T03:01:00.000Z','understanding')]
    const assessment = [ev('ch18-analysis-structure','qq-18-01',false,'chapter_assessment','2026-09-30T03:02:00.000Z')]
    const scenario = [ev('ch18-analysis-structure','scenario-18-1:0',false,'scenario_application','2026-09-30T03:03:00.000Z','scenario')]

    const combined = combineChapter18Evidence(micro, flash, assessment, scenario, micro)

    expect(combined).toHaveLength(4)
    expect(new Set(combined.map((record) => record.source))).toEqual(new Set([
      'micro_check',
      'flashcard',
      'chapter_assessment',
      'scenario_application',
    ]))
  })

  it('targets a weak concept from combined evidence and returns real-shell + flashcard remediation', () => {
    const records = combineChapter18Evidence(
      [ev('ch18-analysis-structure','mcq-18-001',false,'micro_check','2026-09-30T03:00:00.000Z')],
      [ev('ch18-analysis-structure','fc-ch18-003',true,'flashcard','2026-09-30T03:01:00.000Z','understanding')],
      [ev('ch18-analysis-structure','qq-18-01',false,'chapter_assessment','2026-09-30T03:02:00.000Z')],
    )

    const plan = buildChapter18TargetedRemediationPlan(records,'2026-09-30T03:04:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch18-analysis-structure')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds).toEqual(['chapter-18-lesson'])
    expect(target.remediationFlashcardIds.length).toBeGreaterThan(0)
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)
    expect(plan.preservedEvidence).toBe(records)
  })

  it('provides a non-empty real-shell remediation path and flashcards for every concept family', () => {
    for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      const path = buildChapter18RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds, conceptFamilyId).toEqual(['chapter-18-lesson'])
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
    }
  })

  it('registers Chapter 18 in shared detection and remediation content registries', () => {
    expect(isConceptDetectionSupported('ch-18')).toBe(true)
    expect(hasChapterContentProvider('ch-18')).toBe(true)

    const detectionProvider = getChapterDetectionProvider('ch-18')
    const contentProvider = getChapterContentProvider('ch-18')
    expect(detectionProvider).toBeDefined()
    expect(contentProvider).toBeDefined()

    for (const conceptId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      const assignments = detectionProvider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block' && item.assetId === 'chapter-18-lesson'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
      expect(contentProvider!.getContentBlockIdsForConcept(conceptId), conceptId).toEqual(['chapter-18-lesson'])
      expect(contentProvider!.getFlashcardIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
    }
  })
})

describe('C18-6 haircolor/lightener safety escalation', () => {
  it('defines exactly four Chapter 18 high-risk hazard classes and tags real evidence items', () => {
    expect(new Set(chapter18SafetyTaggedItems.map((item) => item.hazard))).toEqual(new Set([
      'allergy_scalp_contraindication',
      'product_use_handling_boundary',
      'compatibility_unknown_history',
      'overlap_overprocessing_control',
    ]))

    const validIds = new Set([
      ...chapter18MicroChecks.flatMap((check) => check.questions.map((question) => question.id)),
      ...chapter18PremiumQuizQuestions.map((question) => question.id),
      ...chapter18PremiumFlashcards.map((card) => card.id),
    ])

    for (const item of chapter18SafetyTaggedItems) {
      expect(validIds.has(item.itemId), item.itemId).toBe(true)
    }
  })

  it('turns a compromised-scalp miss into immediate targeted safety review', () => {
    const question = chapter18MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-18-013')!

    const result = classifyChapter18MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('allergy_scalp_contraindication')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('postpone chemical color')
  })

  it('turns prohibited application-area misses into immediate targeted review', () => {
    const offScalp = chapter18MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-18-008')!
    const facial = chapter18MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-18-014')!

    expect(classifyChapter18MicroCheckSafetyMiss(offScalp, false).hazard).toBe('product_use_handling_boundary')
    expect(classifyChapter18MicroCheckSafetyMiss(facial, false).hazard).toBe('product_use_handling_boundary')
  })

  it('does not independently escalate an ordinary color-theory miss', () => {
    const question = chapter18MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-18-003')!
    const result = classifyChapter18MicroCheckSafetyMiss(question, false)
    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
  })

  it('escalates recent distinct hazards to urgent five-question / 100-percent recovery policy', () => {
    const records = [
      ev('ch18-service-safety-chemical-handling','mcq-18-013',false,'micro_check','2026-09-30T03:10:00.000Z','scenario'),
      ev('ch18-developers-lighteners-toners','mcq-18-008',false,'micro_check','2026-09-30T03:11:00.000Z','scenario'),
    ]

    const result = evaluateChapter18SafetyIntervention(records)
    expect(result.level).toBe('urgent')
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)

    const plan = buildChapter18TargetedRemediationPlan(records,'2026-09-30T03:12:00.000Z')
    expect(plan.targets.filter((target) => target.priority === 'urgent')).toHaveLength(2)
    expect(plan.targets.filter((target) => target.priority === 'urgent').every(
      (target) => target.plannedReassessmentPassPercent === 100,
    )).toBe(true)
  })

  it('recognizes compatibility and overlap/overprocessing as separate hazards', () => {
    const records = [
      ev('ch18-application-consultation-procedures','mcq-18-010',false,'micro_check','2026-09-30T03:10:00.000Z','scenario'),
      ev('ch18-application-consultation-procedures','mcq-18-009',false,'micro_check','2026-09-30T03:11:00.000Z','application'),
    ]
    const result = evaluateChapter18SafetyIntervention(records)
    expect(result.level).toBe('urgent')
    expect(result.requiresFormalSafetyReassessment).toBe(true)
  })

  it('does not let repeated misses from one hazard class alone trigger urgent escalation', () => {
    const records = [
      ev('ch18-service-safety-chemical-handling','mcq-18-014',false,'micro_check','2026-09-30T03:10:00.000Z'),
      ev('ch18-service-safety-chemical-handling','qq-18-13',false,'chapter_assessment','2026-09-30T03:11:00.000Z'),
    ]

    const result = evaluateChapter18SafetyIntervention(records)
    expect(result.level).toBe('review')
    expect(result.hazard).toBe('product_use_handling_boundary')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('requires 100 percent only for concepts affected by urgent multi-hazard intervention', () => {
    const records = [
      ev('ch18-service-safety-chemical-handling','mcq-18-013',false,'micro_check','2026-09-30T03:10:00.000Z'),
      ev('ch18-developers-lighteners-toners','mcq-18-008',false,'micro_check','2026-09-30T03:11:00.000Z'),
    ]

    expect(getChapter18RequiredReassessmentPassPercent(records,'ch18-service-safety-chemical-handling')).toBe(100)
    expect(getChapter18RequiredReassessmentPassPercent(records,'ch18-developers-lighteners-toners')).toBe(100)
    expect(getChapter18RequiredReassessmentPassPercent(records,'ch18-color-theory')).toBe(80)
  })

  it('clears an intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter18SafetyIntervention([
      ev('ch18-service-safety-chemical-handling','mcq-18-013',false,'micro_check','2026-09-30T03:10:00.000Z'),
      ev('ch18-developers-lighteners-toners','mcq-18-008',true,'micro_check','2026-09-30T03:11:00.000Z'),
      ev('ch18-service-safety-chemical-handling','mcq-18-014',true,'micro_check','2026-09-30T03:12:00.000Z'),
      ev('ch18-application-consultation-procedures','mcq-18-010',true,'micro_check','2026-09-30T03:13:00.000Z'),
      ev('ch18-application-consultation-procedures','mcq-18-009',true,'micro_check','2026-09-30T03:14:00.000Z'),
      ev('ch18-service-safety-chemical-handling','qq-18-12',true,'chapter_assessment','2026-09-30T03:15:00.000Z'),
    ])

    expect(CHAPTER18_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps student-facing escalation wording non-diagnostic and non-prescriptive', () => {
    const messages = chapter18MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter18MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter18SafetyIntervention([
      ev('ch18-service-safety-chemical-handling','mcq-18-013',false,'micro_check','2026-09-30T03:10:00.000Z'),
      ev('ch18-developers-lighteners-toners','mcq-18-008',false,'micro_check','2026-09-30T03:11:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    for (const message of messages) {
      expect(containsProhibitedChapter18SafetyLanguage(message), message).toBe(false)
    }
  })

  it('locks remediation policy to ordinary 80 percent and urgent safety 100 percent', () => {
    expect(CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER18_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER18_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER18_SAFETY_RULES.formalSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER18_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
  })

  it('wires immediate Chapter 18 safety review into the live micro-check card', () => {
    const source = readFileSync(join(process.cwd(),'src/components/chapter/Chapter18MicroCheckCard.tsx'),'utf8')
    expect(source).toContain('classifyChapter18MicroCheckSafetyMiss')
    expect(source).toContain('Safety review required')
    expect(source).toContain('Targeted Safety Review')
  })
})
