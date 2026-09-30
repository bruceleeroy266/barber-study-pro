import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumContent } from '../chapter-19-premium-content'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import { chapter19MicroChecks } from './micro-checks'
import { CHAPTER19_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter19EvidenceRecord } from './grading'
import {
  CHAPTER19_COMPLIANCE_RULES,
  CHAPTER19_SAFETY_RULES,
  chapter19ComplianceTaggedItems,
  chapter19SafetyTaggedItems,
  classifyChapter19MicroCheckMiss,
  evaluateChapter19ComplianceIntervention,
  evaluateChapter19SafetyIntervention,
  getChapter19RequiredReassessmentPassPercent,
} from './escalation'
import {
  buildChapter19RemediationPathForConcept,
  buildChapter19TargetedRemediationPlan,
  CHAPTER19_REMEDIATION_RULES,
  combineChapter19Evidence,
  containsLegacyChapter19RemediationId,
} from './targeted-remediation'
import {
  getChapterDetectionProvider,
  isConceptDetectionSupported,
} from '@/lib/remediation/chapter-registry'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '@/lib/remediation/content-provider-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ev = (
  conceptFamilyId: Chapter19EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter19EvidenceRecord['source'],
  timestamp: string,
  difficulty: Chapter19EvidenceRecord['difficulty'] = 'application',
): Chapter19EvidenceRecord => ({
  studentId: 'student-c19',
  chapterId: 'ch-19',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C19-6 combined-evidence gap detection and targeted remediation', () => {
  it('preserves certified 1-shell / 60 flashcards / 15 assessment / 14 micro-check inventories', () => {
    expect(chapter19PremiumContent.sections).toHaveLength(1)
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(chapter19MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
    expect(CHAPTER19_CONCEPT_FAMILY_IDS).toHaveLength(7)
  })

  it('combines immutable evidence across sources without duplicate contamination', () => {
    const micro = [
      ev(
        'ch19-exam-preparation-test-reasoning',
        'mcq-19-003',
        false,
        'micro_check',
        '2026-09-30T16:00:00.000Z',
      ),
    ]
    const flash = [
      ev(
        'ch19-exam-preparation-test-reasoning',
        'fc-ch19-006',
        true,
        'flashcard',
        '2026-09-30T16:01:00.000Z',
        'understanding',
      ),
    ]
    const assessment = [
      ev(
        'ch19-exam-preparation-test-reasoning',
        'qq-19-02',
        false,
        'chapter_assessment',
        '2026-09-30T16:02:00.000Z',
      ),
    ]

    const combined = combineChapter19Evidence(
      micro,
      flash,
      assessment,
      micro,
    )

    expect(combined).toHaveLength(3)
    expect(new Set(combined.map((record) => record.source))).toEqual(
      new Set(['micro_check', 'flashcard', 'chapter_assessment']),
    )
  })

  it('targets ordinary weak concepts with canonical real-shell and mapped-flashcard remediation', () => {
    const records = combineChapter19Evidence(
      [
        ev(
          'ch19-exam-preparation-test-reasoning',
          'mcq-19-003',
          false,
          'micro_check',
          '2026-09-30T16:00:00.000Z',
        ),
      ],
      [
        ev(
          'ch19-exam-preparation-test-reasoning',
          'qq-19-02',
          false,
          'chapter_assessment',
          '2026-09-30T16:02:00.000Z',
        ),
      ],
    )

    const plan = buildChapter19TargetedRemediationPlan(
      records,
      '2026-09-30T16:03:00.000Z',
    )
    const target = plan.targets.find(
      (item) =>
        item.conceptFamilyId === 'ch19-exam-preparation-test-reasoning',
    )!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds).toEqual(['chapter-19-lesson'])
    expect(target.remediationFlashcardIds.length).toBeGreaterThan(0)
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.plannedReassessmentQuestionCount).toBe(5)
    expect(target.plannedReassessmentPassPercent).toBe(80)
    expect(plan.preservedEvidence).toBe(records)
  })

  it('provides canonical remediation assets for every concept without legacy CH19-R IDs', () => {
    for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
      const path = buildChapter19RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds, conceptFamilyId).toEqual([
        'chapter-19-lesson',
      ])
      expect(path.flashcardIds.length, conceptFamilyId).toBeGreaterThan(0)
      expect(
        [...path.contentBlockIds, ...path.flashcardIds].some(
          containsLegacyChapter19RemediationId,
        ),
        conceptFamilyId,
      ).toBe(false)
    }
  })

  it('registers Chapter 19 in the shared detection and remediation content registries', () => {
    expect(isConceptDetectionSupported('ch-19')).toBe(true)
    expect(hasChapterContentProvider('ch-19')).toBe(true)

    const detectionProvider = getChapterDetectionProvider('ch-19')
    const contentProvider = getChapterContentProvider('ch-19')
    expect(detectionProvider).toBeDefined()
    expect(contentProvider).toBeDefined()

    for (const conceptId of CHAPTER19_CONCEPT_FAMILY_IDS) {
      const assignments =
        detectionProvider!.buildAssignmentsForConcept(conceptId)
      expect(
        assignments.some(
          (item) =>
            item.assignmentType === 'content_block' &&
            item.assetId === 'chapter-19-lesson',
        ),
        conceptId,
      ).toBe(true)
      expect(
        assignments.some((item) => item.assignmentType === 'flashcard'),
        conceptId,
      ).toBe(true)
      expect(
        contentProvider!.getContentBlockIdsForConcept(conceptId),
        conceptId,
      ).toEqual(['chapter-19-lesson'])
      expect(
        contentProvider!.getFlashcardIdsForConcept(conceptId).length,
        conceptId,
      ).toBeGreaterThan(0)
    }
  })

  it('does not revive legacy question-linked remediation routing', () => {
    const legacySource = readFileSync(
      join(process.cwd(), 'src/lib/chapter-19-premium-remediation.ts'),
      'utf8',
    )
    const canonicalSource = readFileSync(
      join(
        process.cwd(),
        'src/lib/chapter-19-concepts/targeted-remediation.ts',
      ),
      'utf8',
    )

    expect(legacySource).not.toMatch(
      /quizQuestionId:\s*['"]qq-19-\d{2}['"]/,
    )
    expect(canonicalSource).not.toContain(
      "from '../chapter-19-premium-remediation'",
    )
    expect(canonicalSource).not.toContain('CH19-R-qq-19-')
  })
})

describe('C19-6 safety escalation', () => {
  it('tags only the practical-exam safety concept for bodily-safety escalation', () => {
    expect(
      new Set(
        chapter19SafetyTaggedItems.map((item) => item.conceptFamilyId),
      ),
    ).toEqual(new Set(['ch19-practical-exam-safety-readiness']))

    expect(new Set(chapter19SafetyTaggedItems.map((item) => item.hazard))).toEqual(
      new Set([
        'infection_control_omission',
        'practical_service_safety_process',
      ]),
    )
  })

  it('turns a practical infection-control miss into immediate targeted safety review', () => {
    const question = chapter19MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-19-006')!

    const result = classifyChapter19MicroCheckMiss(question, false)
    expect(result.safety.level).toBe('review')
    expect(result.safety.requiresTargetedSafetyReview).toBe(true)
    expect(result.safety.requiresInstructorReview).toBe(true)
    expect(result.compliance.level).toBe('none')
  })

  it('escalates two distinct practical safety hazard classes to urgent 5-question / 100-percent recovery', () => {
    const records = [
      ev(
        'ch19-practical-exam-safety-readiness',
        'mcq-19-006',
        false,
        'micro_check',
        '2026-09-30T16:10:00.000Z',
      ),
      ev(
        'ch19-practical-exam-safety-readiness',
        'qq-19-03',
        false,
        'chapter_assessment',
        '2026-09-30T16:11:00.000Z',
      ),
    ]

    const safety = evaluateChapter19SafetyIntervention(records)
    expect(safety.level).toBe('urgent')
    expect(safety.requiresFormalSafetyReassessment).toBe(true)
    expect(safety.reassessmentQuestionCount).toBe(5)
    expect(safety.reassessmentPassPercent).toBe(100)

    const plan = buildChapter19TargetedRemediationPlan(
      records,
      '2026-09-30T16:12:00.000Z',
    )
    const target = plan.targets.find(
      (item) =>
        item.conceptFamilyId === 'ch19-practical-exam-safety-readiness',
    )!
    expect(target.priority).toBe('urgent')
    expect(target.plannedReassessmentPassPercent).toBe(100)
  })

  it('keeps 100 percent recovery limited to urgent practical safety', () => {
    const records = [
      ev(
        'ch19-practical-exam-safety-readiness',
        'mcq-19-006',
        false,
        'micro_check',
        '2026-09-30T16:10:00.000Z',
      ),
      ev(
        'ch19-practical-exam-safety-readiness',
        'qq-19-03',
        false,
        'chapter_assessment',
        '2026-09-30T16:11:00.000Z',
      ),
    ]

    expect(
      getChapter19RequiredReassessmentPassPercent(
        records,
        'ch19-practical-exam-safety-readiness',
      ),
    ).toBe(100)
    expect(
      getChapter19RequiredReassessmentPassPercent(
        records,
        'ch19-licensing-requirements-verification',
      ),
    ).toBe(80)
    expect(
      getChapter19RequiredReassessmentPassPercent(
        records,
        'ch19-employment-law-contracts-compliance',
      ),
    ).toBe(80)
  })
})

describe('C19-6 distinct compliance/legal escalation', () => {
  it('tags only licensing and employment-law concepts for compliance escalation', () => {
    expect(
      new Set(
        chapter19ComplianceTaggedItems.map(
          (item) => item.conceptFamilyId,
        ),
      ),
    ).toEqual(
      new Set([
        'ch19-licensing-requirements-verification',
        'ch19-employment-law-contracts-compliance',
      ]),
    )
  })

  it('routes a licensing miss to compliance review without bodily-safety escalation', () => {
    const question = chapter19MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-19-001')!

    const result = classifyChapter19MicroCheckMiss(question, false)
    expect(result.compliance.level).toBe('review')
    expect(result.compliance.requiresTargetedComplianceReview).toBe(true)
    expect(result.safety.level).toBe('none')
  })

  it('routes an employment-law miss to compliance review without bodily-safety escalation', () => {
    const question = chapter19MicroChecks
      .flatMap((check) => check.questions)
      .find((item) => item.id === 'mcq-19-014')!

    const result = classifyChapter19MicroCheckMiss(question, false)
    expect(result.compliance.level).toBe('review')
    expect(result.compliance.domain).toBe('employment_law_contracts')
    expect(result.safety.level).toBe('none')
  })

  it('elevates repeated compliance misses but keeps recovery at ordinary 80 percent', () => {
    const records = [
      ev(
        'ch19-licensing-requirements-verification',
        'mcq-19-001',
        false,
        'micro_check',
        '2026-09-30T16:20:00.000Z',
      ),
      ev(
        'ch19-licensing-requirements-verification',
        'qq-19-01',
        false,
        'chapter_assessment',
        '2026-09-30T16:21:00.000Z',
      ),
    ]

    const compliance = evaluateChapter19ComplianceIntervention(records)
    expect(compliance.level).toBe('elevated')
    expect(compliance.requiresFormalReassessment).toBe(true)
    expect(compliance.reassessmentQuestionCount).toBe(5)
    expect(compliance.reassessmentPassPercent).toBe(80)

    const plan = buildChapter19TargetedRemediationPlan(
      records,
      '2026-09-30T16:22:00.000Z',
    )
    const target = plan.targets.find(
      (item) =>
        item.conceptFamilyId === 'ch19-licensing-requirements-verification',
    )!
    expect(target.priority).toBe('compliance')
    expect(target.plannedReassessmentPassPercent).toBe(80)
    expect(target.safetyEscalation).toBeNull()
  })

  it('locks ordinary/compliance to 80 and urgent safety to 100', () => {
    expect(CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER19_REMEDIATION_RULES.complianceReassessmentQuestionCount).toBe(5)
    expect(CHAPTER19_REMEDIATION_RULES.complianceReassessmentPassPercent).toBe(80)
    expect(CHAPTER19_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER19_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER19_SAFETY_RULES.formalSafetyReassessmentPassPercent).toBe(100)
    expect(CHAPTER19_COMPLIANCE_RULES.formalComplianceReassessmentPassPercent).toBe(80)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('wires distinct safety and compliance review into the live Chapter 19 micro-check card', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/chapter/Chapter19MicroCheckCard.tsx'),
      'utf8',
    )
    expect(source).toContain('classifyChapter19MicroCheckMiss')
    expect(source).toContain('Safety review required')
    expect(source).toContain('Compliance review required')
    expect(source).toContain('Targeted Safety Review')
    expect(source).toContain('Targeted Compliance Review')
  })
})
