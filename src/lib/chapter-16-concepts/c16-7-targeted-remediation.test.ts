import { describe, expect, it } from 'vitest'
import { chapter16PremiumContent } from '../chapter-16-premium'
import { chapter16PremiumFlashcards } from '../chapter-16-premium-flashcards'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import { chapter16MicroChecks } from './micro-checks'
import { CHAPTER16_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter16EvidenceRecord } from './grading'
import {
  buildChapter16RemediationPathForConcept,
  buildChapter16TargetedRemediationPlan,
  CHAPTER16_REMEDIATION_RULES,
} from './targeted-remediation'
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

describe('C16-7 targeted remediation', () => {
  it('preserves all certified Chapter 16 inventories', () => {
    expect(chapter16PremiumContent.sections).toHaveLength(93)
    expect(chapter16PremiumFlashcards).toHaveLength(68)
    expect(chapter16PremiumQuizQuestions).toHaveLength(30)
    expect(chapter16MicroChecks).toHaveLength(8)
    expect(chapter16MicroChecks.flatMap((check) => check.questions)).toHaveLength(16)
  })

  it('builds standard remediation from canonical lesson blocks and flashcards', () => {
    const records = [
      ev('ch16-blunt-cut','mcq-16-003',false,'micro_check','2026-09-29T23:30:00.000Z'),
      ev('ch16-blunt-cut','qq-16-007',false,'chapter_assessment','2026-09-29T23:31:00.000Z'),
      ev('ch16-blunt-cut','fc-ch16-010',true,'flashcard','2026-09-29T23:32:00.000Z','understanding'),
    ]

    const plan = buildChapter16TargetedRemediationPlan(records,'2026-09-29T23:33:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch16-blunt-cut')

    expect(target).toBeTruthy()
    expect(target?.priority).toBe('standard')
    expect(target?.remediationContentBlockIds).toContain('blunt-cut-introduction')
    expect(target?.remediationContentBlockIds).toContain('blunt-cut-scenario')
    expect(target?.remediationFlashcardIds).toContain('fc-ch16-010')
    expect(target?.requiresFormalReassessment).toBe(true)
    expect(target?.plannedReassessmentQuestionCount).toBe(5)
    expect(target?.plannedReassessmentPassPercent).toBe(80)
    expect(plan.preservedEvidence).toBe(records)
  })

  it('provides non-empty canonical remediation paths for all eight concepts', () => {
    for (const conceptFamilyId of CHAPTER16_CONCEPT_FAMILY_IDS) {
      const path = buildChapter16RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
    }
  })

  it('prioritizes a single safety-sensitive miss without forcing formal reassessment yet', () => {
    const records = [
      ev('ch16-advanced-techniques-texturizing','mcq-16-013',false,'micro_check','2026-09-29T23:40:00.000Z'),
    ]
    const plan = buildChapter16TargetedRemediationPlan(records,'2026-09-29T23:41:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch16-advanced-techniques-texturizing')

    expect(target?.priority).toBe('priority')
    expect(target?.safetyEscalation).toBe('review')
    expect(target?.requiresFormalReassessment).toBe(false)
    expect(target?.plannedReassessmentPassPercent).toBe(80)
  })

  it('escalates both safety concepts to urgent with a planned perfect five-question reassessment', () => {
    const records = [
      ev('ch16-advanced-techniques-texturizing','mcq-16-013',false,'micro_check','2026-09-29T23:40:00.000Z'),
      ev('ch16-styling-finishing-safety','mcq-16-015',false,'micro_check','2026-09-29T23:41:00.000Z'),
    ]
    const plan = buildChapter16TargetedRemediationPlan(records,'2026-09-29T23:42:00.000Z')
    const urgent = plan.targets.filter((target) => target.priority === 'urgent')

    expect(urgent).toHaveLength(2)
    expect(urgent.every((target) => target.requiresFormalReassessment)).toBe(true)
    expect(urgent.every((target) => target.plannedReassessmentQuestionCount === 5)).toBe(true)
    expect(urgent.every((target) => target.plannedReassessmentPassPercent === 100)).toBe(true)
  })

  it('sorts urgent targets ahead of ordinary weak concepts', () => {
    const records = [
      ev('ch16-blunt-cut','mcq-16-003',false,'micro_check','2026-09-29T23:30:00.000Z'),
      ev('ch16-blunt-cut','qq-16-007',false,'chapter_assessment','2026-09-29T23:31:00.000Z'),
      ev('ch16-advanced-techniques-texturizing','mcq-16-013',false,'micro_check','2026-09-29T23:40:00.000Z'),
      ev('ch16-styling-finishing-safety','mcq-16-015',false,'micro_check','2026-09-29T23:41:00.000Z'),
    ]
    const plan = buildChapter16TargetedRemediationPlan(records,'2026-09-29T23:42:00.000Z')
    expect(plan.targets[0].priority).toBe('urgent')
    expect(plan.targets[1].priority).toBe('urgent')
    expect(plan.targets.some((target) => target.conceptFamilyId === 'ch16-blunt-cut' && target.priority === 'standard')).toBe(true)
  })

  it('keeps Chapter 16 registered for canonical lesson + flashcard remediation assignments', () => {
    expect(isConceptDetectionSupported('ch-16')).toBe(true)
    const provider = getChapterDetectionProvider('ch-16')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER16_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })

  it('locks future recovery policy at five questions with 80/100 thresholds', () => {
    expect(CHAPTER16_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER16_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER16_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER16_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
  })
})
