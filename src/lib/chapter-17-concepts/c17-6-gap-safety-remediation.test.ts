import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import { chapter17MicroChecks } from './micro-checks'
import { CHAPTER17_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter17EvidenceRecord } from './grading'
import {
  CHAPTER17_SAFETY_RULES,
  chapter17SafetyTaggedItems,
  classifyChapter17MicroCheckSafetyMiss,
  containsProhibitedChapter17SafetyLanguage,
  evaluateChapter17SafetyIntervention,
  getChapter17RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  buildChapter17RemediationPathForConcept,
  buildChapter17TargetedRemediationPlan,
  CHAPTER17_REMEDIATION_RULES,
  combineChapter17Evidence,
} from './targeted-remediation'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'

const ev = (
  conceptFamilyId: Chapter17EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter17EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter17EvidenceRecord['difficulty'] = 'application',
): Chapter17EvidenceRecord => ({
  studentId: 'student-c17',
  chapterId: 'ch-17',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C17-6 combined-evidence gap detection and targeted remediation', () => {
  it('preserves certified 24/60/30/16 + 14 micro-check inventories', () => {
    expect(chapter17PremiumContent.sections).toHaveLength(24)
    expect(chapter17PremiumFlashcards).toHaveLength(60)
    expect(chapter17PremiumQuizQuestions).toHaveLength(30)
    expect(chapter17LearningQuestions).toHaveLength(16)
    expect(chapter17MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
  })

  it('combines immutable evidence from micro-checks, flashcards, assessment, and scenarios without duplicates', () => {
    const micro = [ev('ch17-consultation-hair-analysis','mcq-17-001',false,'micro_check','2026-09-29T22:00:00.000Z')]
    const flash = [ev('ch17-consultation-hair-analysis','fc-ch17-006',true,'flashcard','2026-09-29T22:01:00.000Z','understanding')]
    const assessment = [ev('ch17-consultation-hair-analysis','qq-17-001',false,'chapter_assessment','2026-09-29T22:02:00.000Z')]
    const scenario = [ev('ch17-consultation-hair-analysis','scenario-1:0',false,'scenario_application','2026-09-29T22:03:00.000Z','scenario')]

    const combined = combineChapter17Evidence(micro, flash, assessment, scenario, micro)

    expect(combined).toHaveLength(4)
    expect(new Set(combined.map((record) => record.source))).toEqual(new Set([
      'micro_check',
      'flashcard',
      'chapter_assessment',
      'scenario_application',
    ]))
  })

  it('targets a weak concept from combined evidence and returns canonical lesson + flashcard remediation', () => {
    const records = combineChapter17Evidence(
      [ev('ch17-consultation-hair-analysis','mcq-17-001',false,'micro_check','2026-09-29T22:00:00.000Z')],
      [ev('ch17-consultation-hair-analysis','fc-ch17-006',true,'flashcard','2026-09-29T22:01:00.000Z','understanding')],
      [ev('ch17-consultation-hair-analysis','qq-17-001',false,'chapter_assessment','2026-09-29T22:02:00.000Z')],
      [ev('ch17-consultation-hair-analysis','scenario-1:0',false,'scenario_application','2026-09-29T22:03:00.000Z','scenario')],
    )

    const plan = buildChapter17TargetedRemediationPlan(records,'2026-09-29T22:04:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch17-consultation-hair-analysis')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds).toContain('hair-analysis')
    expect(target.remediationFlashcardIds).toContain('fc-ch17-006')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)
    expect(plan.preservedEvidence).toBe(records)
  })

  it('provides a non-empty canonical remediation path for every concept family', () => {
    for (const conceptFamilyId of CHAPTER17_CONCEPT_FAMILY_IDS) {
      const path = buildChapter17RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
    }
  })

  it('registers Chapter 17 in the shared detection/remediation assignment registry', () => {
    expect(isConceptDetectionSupported('ch-17')).toBe(true)
    const provider = getChapterDetectionProvider('ch-17')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER17_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })
})

describe('C17-6 chemical-service safety escalation', () => {
  it('defines exactly the intended four high-risk hazard classes and tags real evidence items', () => {
    expect(new Set(chapter17SafetyTaggedItems.map((item) => item.hazard))).toEqual(new Set([
      'chemical_incompatibility',
      'scalp_compromise_burning',
      'overprocessing_control',
      'unsafe_service_sequence',
    ]))

    const microIds = new Set(chapter17MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))
    const assessmentIds = new Set(chapter17PremiumQuizQuestions.map((question) => question.id))

    for (const item of chapter17SafetyTaggedItems) {
      expect(microIds.has(item.itemId as never) || assessmentIds.has(item.itemId as never), item.itemId).toBe(true)
    }
  })

  it('turns a known incompatibility micro-check miss into immediate targeted review', () => {
    const question = chapter17MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-17-011')!

    const result = classifyChapter17MicroCheckSafetyMiss(question, false)

    expect(result.level).toBe('review')
    expect(result.hazard).toBe('chemical_incompatibility')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
    expect(result.studentMessage).toContain('does not override a known incompatibility')
  })

  it('turns scalp compromise or burning misses into immediate targeted review', () => {
    const scalp = chapter17MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-17-002')!
    const burning = chapter17MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-17-008')!

    expect(classifyChapter17MicroCheckSafetyMiss(scalp, false).hazard).toBe('scalp_compromise_burning')
    expect(classifyChapter17MicroCheckSafetyMiss(burning, false).hazard).toBe('scalp_compromise_burning')
  })

  it('does not independently escalate an ordinary texturizer concept miss', () => {
    const question = chapter17MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-17-013')!
    const result = classifyChapter17MicroCheckSafetyMiss(question, false)
    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
  })

  it('escalates distinct recent hazards to urgent five-question / 100-percent recovery policy', () => {
    const records = [
      ev('ch17-safety-strand-tests-compatibility','mcq-17-011',false,'micro_check','2026-09-29T22:10:00.000Z','scenario'),
      ev('ch17-chemical-relaxing-procedures','mcq-17-008',false,'micro_check','2026-09-29T22:11:00.000Z','scenario'),
    ]

    const result = evaluateChapter17SafetyIntervention(records)
    expect(result.level).toBe('urgent')
    expect(result.requiresFormalSafetyReassessment).toBe(true)
    expect(result.reassessmentQuestionCount).toBe(5)
    expect(result.reassessmentPassPercent).toBe(100)
    expect(result.affectedConceptFamilyIds).toEqual(expect.arrayContaining([
      'ch17-safety-strand-tests-compatibility',
      'ch17-chemical-relaxing-procedures',
    ]))

    const plan = buildChapter17TargetedRemediationPlan(records,'2026-09-29T22:12:00.000Z')
    expect(plan.targets.filter((target) => target.priority === 'urgent')).toHaveLength(2)
    expect(plan.targets.filter((target) => target.priority === 'urgent').every(
      (target) => target.plannedReassessmentPassPercent === 100,
    )).toBe(true)
  })

  it('recognizes overprocessing and unsafe service sequencing as separate hazards', () => {
    const records = [
      ev('ch17-permanent-waving-procedures','mcq-17-006',false,'micro_check','2026-09-29T22:10:00.000Z','scenario'),
      ev('ch17-curl-reformation','mcq-17-010',false,'micro_check','2026-09-29T22:11:00.000Z','scenario'),
    ]
    const result = evaluateChapter17SafetyIntervention(records)
    expect(result.level).toBe('urgent')
    expect(result.requiresFormalSafetyReassessment).toBe(true)
  })

  it('does not let repeated misses from one hazard class alone trigger urgent escalation', () => {
    const records = [
      ev('ch17-permanent-waving-procedures','mcq-17-006',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch17-permanent-waving-procedures','qq-17-016',false,'chapter_assessment','2026-09-29T22:11:00.000Z'),
    ]

    const result = evaluateChapter17SafetyIntervention(records)
    expect(result.level).toBe('review')
    expect(result.hazard).toBe('overprocessing_control')
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('requires 100 percent only for concepts affected by an urgent safety intervention', () => {
    const records = [
      ev('ch17-safety-strand-tests-compatibility','mcq-17-011',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch17-chemical-relaxing-procedures','mcq-17-008',false,'micro_check','2026-09-29T22:11:00.000Z'),
    ]

    expect(getChapter17RequiredReassessmentPassPercent(records,'ch17-safety-strand-tests-compatibility')).toBe(100)
    expect(getChapter17RequiredReassessmentPassPercent(records,'ch17-chemical-relaxing-procedures')).toBe(100)
    expect(getChapter17RequiredReassessmentPassPercent(records,'ch17-texturizers-chemical-blowouts')).toBe(80)
  })

  it('clears an intervention only after five consecutive correct tagged observations', () => {
    const result = evaluateChapter17SafetyIntervention([
      ev('ch17-safety-strand-tests-compatibility','mcq-17-011',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch17-consultation-hair-analysis','mcq-17-002',true,'micro_check','2026-09-29T22:11:00.000Z'),
      ev('ch17-chemical-relaxing-procedures','mcq-17-008',true,'micro_check','2026-09-29T22:12:00.000Z'),
      ev('ch17-permanent-waving-procedures','mcq-17-006',true,'micro_check','2026-09-29T22:13:00.000Z'),
      ev('ch17-curl-reformation','mcq-17-010',true,'micro_check','2026-09-29T22:14:00.000Z'),
      ev('ch17-chemical-relaxing-procedures','qq-17-024',true,'chapter_assessment','2026-09-29T22:15:00.000Z'),
    ])

    expect(CHAPTER17_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations).toBe(5)
    expect(result.level).toBe('none')
    expect(result.instructorReason).toContain('5 consecutive correct')
  })

  it('keeps student-facing escalation wording non-diagnostic and non-prescriptive', () => {
    const messages = chapter17MicroChecks.flatMap((check) => check.questions)
      .map((question) => classifyChapter17MicroCheckSafetyMiss(question, false).studentMessage)
      .filter(Boolean)

    const urgent = evaluateChapter17SafetyIntervention([
      ev('ch17-safety-strand-tests-compatibility','mcq-17-011',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch17-chemical-relaxing-procedures','mcq-17-008',false,'micro_check','2026-09-29T22:11:00.000Z'),
    ])
    messages.push(urgent.studentMessage)

    for (const message of messages) {
      expect(containsProhibitedChapter17SafetyLanguage(message), message).toBe(false)
    }
  })

  it('locks remediation policy to ordinary 80 percent and urgent safety 100 percent', () => {
    expect(CHAPTER17_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER17_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER17_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER17_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER17_SAFETY_RULES.formalSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER17_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
  })

  it('wires immediate Chapter 17 safety review into the live micro-check card', () => {
    const source = readFileSync(join(process.cwd(),'src/components/chapter/Chapter17MicroCheckCard.tsx'),'utf8')
    expect(source).toContain('classifyChapter17MicroCheckSafetyMiss')
    expect(source).toContain('Safety review required')
    expect(source).toContain('Targeted Safety Review')
  })
})
