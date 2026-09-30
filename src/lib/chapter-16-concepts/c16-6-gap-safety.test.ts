import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumContent } from '../chapter-16-premium'
import { chapter16PremiumFlashcards } from '../chapter-16-premium-flashcards'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import { chapter16MicroChecks } from './micro-checks'
import { CHAPTER16_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter16EvidenceRecord } from './grading'
import { combineChapter16Evidence, detectChapter16EvidenceGaps } from './gap-detection'
import {
  CHAPTER16_SAFETY_RULES,
  chapter16SafetyTaggedItems,
  classifyChapter16MicroCheckSafetyMiss,
  evaluateChapter16SafetyIntervention,
  getChapter16RequiredReassessmentPassPercent,
} from './safety-intervention'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'

const ev = (
  conceptFamilyId: Chapter16EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter16EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter16EvidenceRecord['difficulty'] = 'application',
): Chapter16EvidenceRecord => ({
  studentId: 'student-c16',
  chapterId: 'ch-16',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C16-6 combined-evidence gap detection', () => {
  it('preserves all certified Chapter 16 inventories', () => {
    expect(chapter16PremiumContent.sections).toHaveLength(93)
    expect(chapter16PremiumFlashcards).toHaveLength(68)
    expect(chapter16PremiumQuizQuestions).toHaveLength(30)
    expect(chapter16MicroChecks).toHaveLength(8)
    expect(chapter16MicroChecks.flatMap((check) => check.questions)).toHaveLength(16)
  })

  it('combines immutable evidence without duplicating preserved first attempts', () => {
    const record = ev('ch16-blunt-cut','mcq-16-003',false,'micro_check','2026-09-29T22:00:00.000Z')
    const combined = combineChapter16Evidence([record], [record])
    expect(combined).toHaveLength(1)
    expect(combined[0]).toBe(record)
  })

  it('detects an ordinary weak concept from combined evidence without safety escalation', () => {
    const records = combineChapter16Evidence(
      [ev('ch16-blunt-cut','mcq-16-003',false,'micro_check','2026-09-29T22:00:00.000Z')],
      [ev('ch16-blunt-cut','qq-16-007',false,'chapter_assessment','2026-09-29T22:01:00.000Z')],
    )
    const gaps = detectChapter16EvidenceGaps(records,'2026-09-29T22:02:00.000Z')
    const target = gaps.find((gap) => gap.conceptFamilyId === 'ch16-blunt-cut')
    expect(target).toBeTruthy()
    expect(target?.priority).toBe('standard')
    expect(target?.safetyEscalation).toBeNull()
  })

  it('registers Chapter 16 in the shared concept detection registry', () => {
    expect(isConceptDetectionSupported('ch-16')).toBe(true)
    const provider = getChapterDetectionProvider('ch-16')
    expect(provider).toBeDefined()
    for (const conceptId of CHAPTER16_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })
})

describe('C16-6 narrow safety escalation', () => {
  it('tags only razor/tool suitability and thermal heat/client-protection hazards', () => {
    expect(new Set(chapter16SafetyTaggedItems.map((item) => item.hazard))).toEqual(new Set([
      'razor_tool_suitability',
      'thermal_heat_client_protection',
    ]))
    expect(chapter16SafetyTaggedItems).toHaveLength(4)
  })

  it('turns a tagged razor micro-check miss into immediate review', () => {
    const question = chapter16MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-16-013')!
    const result = classifyChapter16MicroCheckSafetyMiss(question, false)
    expect(result.level).toBe('review')
    expect(result.hazard).toBe('razor_tool_suitability')
    expect(result.requiresTargetedSafetyReview).toBe(true)
    expect(result.requiresInstructorReview).toBe(true)
    expect(result.requiresFormalSafetyReassessment).toBe(false)
  })

  it('does not escalate an ordinary design miss', () => {
    const question = chapter16MicroChecks.flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-16-003')!
    const result = classifyChapter16MicroCheckSafetyMiss(question, false)
    expect(result.level).toBe('none')
    expect(result.requiresTargetedSafetyReview).toBe(false)
  })

  it('requires both distinct hazards before urgent safety escalation', () => {
    const oneHazard = evaluateChapter16SafetyIntervention([
      ev('ch16-styling-finishing-safety','mcq-16-015',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch16-styling-finishing-safety','qq-16-027',false,'chapter_assessment','2026-09-29T22:11:00.000Z'),
    ])
    expect(oneHazard.level).toBe('review')

    const twoHazards = evaluateChapter16SafetyIntervention([
      ev('ch16-advanced-techniques-texturizing','mcq-16-013',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch16-styling-finishing-safety','mcq-16-015',false,'micro_check','2026-09-29T22:11:00.000Z'),
    ])
    expect(twoHazards.level).toBe('urgent')
    expect(twoHazards.requiresFormalSafetyReassessment).toBe(true)
    expect(twoHazards.reassessmentQuestionCount).toBe(5)
    expect(twoHazards.reassessmentPassPercent).toBe(100)
  })

  it('uses 100 percent only for concepts affected by an urgent safety intervention', () => {
    const records = [
      ev('ch16-advanced-techniques-texturizing','mcq-16-013',false,'micro_check','2026-09-29T22:10:00.000Z'),
      ev('ch16-styling-finishing-safety','mcq-16-015',false,'micro_check','2026-09-29T22:11:00.000Z'),
    ]
    expect(getChapter16RequiredReassessmentPassPercent(records,'ch16-advanced-techniques-texturizing')).toBe(100)
    expect(getChapter16RequiredReassessmentPassPercent(records,'ch16-styling-finishing-safety')).toBe(100)
    expect(getChapter16RequiredReassessmentPassPercent(records,'ch16-blunt-cut')).toBe(80)
  })

  it('locks the safety policy to five-question perfect urgent recovery', () => {
    expect(CHAPTER16_SAFETY_RULES.formalSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER16_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER16_SAFETY_RULES.ordinaryReassessmentPassPercent).toBe(80)
  })

  it('surfaces immediate safety review in the live Chapter 16 micro-check card', () => {
    const source = readFileSync(join(process.cwd(),'src/components/chapter/Chapter16MicroCheckCard.tsx'),'utf8')
    expect(source).toContain('classifyChapter16MicroCheckSafetyMiss')
    expect(source).toContain('Safety review required')
    expect(source).toContain('Targeted Safety Review')
  })
})
