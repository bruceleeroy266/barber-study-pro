import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { QuizAttempt } from '@/types'
import {
  detectAllChapter21CombinedConceptGaps,
  chapter21ScenarioEvidenceMappings,
} from './detection'
import {
  CHAPTER21_COMPLIANCE_RULES,
  evaluateChapter21ComplianceIntervention,
  getChapter21ComplianceTag,
} from './escalation'
import {
  buildChapter21TargetedRemediationPlan,
  buildChapter21RemediationPathForConcept,
} from './targeted-remediation'
import type { Chapter21EvidenceRecord } from './grading'
import {
  CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  getChapterDetectionProvider,
  isConceptDetectionSupported,
} from '../remediation/chapter-registry'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '../remediation/content-provider-registry'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceConcept,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'

const read = (path: string) =>
  readFileSync(join(process.cwd(), path), 'utf8')

const ts = '2026-10-01T01:30:00.000Z'

function evidence(
  conceptFamilyId: Chapter21EvidenceRecord['conceptFamilyId'],
  source: Chapter21EvidenceRecord['source'],
  itemId: string,
  correct: boolean,
): Chapter21EvidenceRecord {
  return {
    studentId: 'student-c21',
    chapterId: 'ch-21',
    conceptFamilyId,
    source,
    itemId,
    difficulty: 'application',
    correct,
    attemptPhase: 'initial',
    timestamp: ts,
  }
}

describe('C21-6 combined gap detection, compliance escalation, and targeted remediation', () => {
  it('combines assessment, micro-check, flashcard, and scenario evidence into one concept detector', () => {
    const attempt: QuizAttempt = {
      id: 'attempt-c21',
      user_id: 'student-c21',
      quiz_id: 'quiz-21',
      score: 0,
      total_questions: 1,
      percentage: 0,
      answers_json: { 'qq-21-11': 'a' },
      completed_at: ts,
      is_reassessment: false,
      remediation_cycle_id: null,
      target_concept_id: null,
    }

    const result = detectAllChapter21CombinedConceptGaps(
      [attempt],
      [
        {
          question_id: 'mcq-21-011',
          selected_answer: 'a',
          answered_at: ts,
        },
      ],
      [
        {
          source: 'flashcard',
          item_id: 'fc-ch21-036',
          is_correct: false,
          answered_at: ts,
        },
        {
          source: 'scenario_application',
          item_id: 'ch21-kc4:1',
          is_correct: false,
          answered_at: ts,
        },
      ],
    )

    const boothRental = result.get(
      'ch21-booth-rental-independent-business-responsibilities',
    )
    expect(boothRental).toBeDefined()
    expect(boothRental!.evidence.totalObservations).toBe(4)
    expect(boothRental!.evidence.misses).toBe(4)
    expect(['emerging_weakness', 'repeated_weakness']).toContain(
      boothRental!.state,
    )
  })

  it('locks the full combined evidence inventories to 60 flashcards and 13 scored scenarios', () => {
    expect(getFlashcardEvidenceInventory('ch-21')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-21')).toHaveLength(13)
    expect(chapter21ScenarioEvidenceMappings).toHaveLength(13)
    expect(isUnifiedActivityEvidenceChapter('ch-21')).toBe(true)
  })

  it('maps mixed Chapter 21 scenario sections at item granularity', () => {
    expect(getScenarioEvidenceConcept('ch-21', 'ch21-kc1', 0)).toBe(
      'ch21-business-entry-paths',
    )
    expect(getScenarioEvidenceConcept('ch-21', 'ch21-kc1', 1)).toBe(
      'ch21-shop-opening-planning',
    )
    expect(getScenarioEvidenceConcept('ch-21', 'ch21-kc4', 0)).toBe(
      'ch21-recordkeeping-financial-compliance',
    )
    expect(getScenarioEvidenceConcept('ch-21', 'ch21-kc4', 1)).toBe(
      'ch21-booth-rental-independent-business-responsibilities',
    )
    expect(
      getScenarioEvidenceConcept(
        'ch-21',
        'ch21-real-shop-scenarios',
        4,
      ),
    ).toBe('ch21-advertising-marketing-client-consent')
  })

  it('elevates repeated compliance misses without creating bodily-safety escalation', () => {
    const rows: Chapter21EvidenceRecord[] = [
      evidence(
        'ch21-booth-rental-independent-business-responsibilities',
        'micro_check',
        'mcq-21-011',
        false,
      ),
      evidence(
        'ch21-booth-rental-independent-business-responsibilities',
        'chapter_assessment',
        'qq-21-11',
        false,
      ),
    ]

    const compliance = evaluateChapter21ComplianceIntervention(rows)
    expect(compliance.level).toBe('elevated')
    expect(compliance.requiresFormalReassessment).toBe(true)
    expect(compliance.reassessmentQuestionCount).toBe(5)
    expect(compliance.reassessmentPassPercent).toBe(80)

    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(
      CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
    ).toEqual([
      'ch21-shop-opening-planning',
      'ch21-ownership-legal-structures',
      'ch21-recordkeeping-financial-compliance',
      'ch21-booth-rental-independent-business-responsibilities',
      'ch21-advertising-marketing-client-consent',
    ])
  })

  it('recognizes the four Chapter 21 compliance domains', () => {
    expect(getChapter21ComplianceTag('mcq-21-003')?.domain).toBe(
      'business_licensing_entity',
    )
    expect(getChapter21ComplianceTag('qq-21-05')?.domain).toBe(
      'business_licensing_entity',
    )
    expect(getChapter21ComplianceTag('mcq-21-009')?.domain).toBe(
      'recordkeeping_tax_reporting',
    )
    expect(getChapter21ComplianceTag('mcq-21-011')?.domain).toBe(
      'booth_rental_worker_classification',
    )
    expect(getChapter21ComplianceTag('mcq-21-015')?.domain).toBe(
      'privacy_advertising_consent',
    )
    expect(getChapter21ComplianceTag('qq-21-07')).toBeNull()
  })

  it('routes each weak concept to its canonical LO and exact mapped flashcard subset', () => {
    const recordkeeping = buildChapter21RemediationPathForConcept(
      'ch21-recordkeeping-financial-compliance',
    )
    expect(recordkeeping.contentBlockIds).toEqual(['ch21-lo5'])
    expect(recordkeeping.flashcardIds).toEqual([
      'fc-ch21-031',
      'fc-ch21-032',
      'fc-ch21-033',
      'fc-ch21-034',
      'fc-ch21-035',
    ])
    expect(recordkeeping.plannedReassessmentQuestionCount).toBe(5)
    expect(recordkeeping.plannedReassessmentPassPercent).toBe(80)

    const ownership = buildChapter21RemediationPathForConcept(
      'ch21-ownership-legal-structures',
    )
    expect(ownership.contentBlockIds).toEqual(['ch21-lo3'])
    expect(ownership.flashcardIds).toHaveLength(10)
    expect(ownership.flashcardIds[0]).toBe('fc-ch21-011')
    expect(ownership.flashcardIds[9]).toBe('fc-ch21-020')
  })

  it('builds compliance-priority remediation targets and never marks them as safety', () => {
    const rows: Chapter21EvidenceRecord[] = [
      evidence(
        'ch21-recordkeeping-financial-compliance',
        'micro_check',
        'mcq-21-009',
        false,
      ),
      evidence(
        'ch21-recordkeeping-financial-compliance',
        'chapter_assessment',
        'qq-21-09',
        false,
      ),
    ]

    const plan = buildChapter21TargetedRemediationPlan(rows, ts)
    const target = plan.targets.find(
      (item) =>
        item.conceptFamilyId ===
        'ch21-recordkeeping-financial-compliance',
    )

    expect(target).toBeDefined()
    expect(target!.priority).toBe('compliance')
    expect(target!.complianceEscalation).toBe('elevated')
    expect(target!.safetyEscalation).toBeNull()
    expect(target!.plannedReassessmentPassPercent).toBe(80)
    expect(target!.remediationContentBlockIds).toEqual(['ch21-lo5'])
    expect(target!.remediationFlashcardIds).toHaveLength(5)
    expect(plan.preservedEvidence).toEqual(rows)
  })

  it('registers Chapter 21 with shared detection, content, and activity-evidence providers', () => {
    expect(isConceptDetectionSupported('ch-21')).toBe(true)
    expect(getChapterDetectionProvider('ch-21')?.chapterId).toBe('ch-21')
    expect(hasChapterContentProvider('ch-21')).toBe(true)
    expect(getChapterContentProvider('ch-21')?.chapterId).toBe('ch-21')
    expect(isUnifiedActivityEvidenceChapter('ch-21')).toBe(true)
  })

  it('uses server-authoritative activity persistence for Chapter 21', () => {
    const route = read(
      'src/app/api/chapter-21/activity-evidence/route.ts',
    )
    const client = read(
      'src/lib/concept-mastery/activity-evidence.ts',
    )

    expect(route).toContain('createServiceRoleClient')
    expect(route).toContain(
      "getFlashcardEvidenceConcept('ch-21'",
    )
    expect(route).toContain(
      "getScenarioEvidenceConcept(",
    )
    expect(route).toContain("'ch-21'")
    expect(route).toContain(
      'isCorrect = selectedAnswer === scenario.correctAnswer',
    )
    expect(route).not.toContain('body.userId')
    expect(route).not.toContain('body.conceptId')
    expect(route).not.toContain('body.isCorrect')
    expect(route).toContain("error?.code === '23505'")
    expect(client).toContain("input.chapterId === 'ch-21'")
    expect(client).toContain("'chapter-21'")
  })

  it('feeds Chapter 21 durable combined evidence into the production remediation orchestrator', () => {
    const source = read(
      'src/lib/remediation/detection-orchestrator.ts',
    )

    expect(source).toContain("chapterId === 'ch-21'")
    expect(source).toContain('getChapter21MicroCheckEvidence')
    expect(source).toContain('getChapter21ActivityEvidence')
    expect(source).toContain(
      'detectAllChapter21CombinedConceptGaps',
    )
  })

  it('surfaces targeted compliance review in the live Chapter 21 micro-check UI', () => {
    const source = read(
      'src/components/chapter/Chapter21MicroCheckCard.tsx',
    )

    expect(source).toContain('classifyChapter21MicroCheckMiss')
    expect(source).toContain('Compliance review required')
    expect(source).toContain('Targeted Compliance Review')
    expect(source).not.toContain('Safety review')
  })

  it('locks Chapter 21 compliance recovery policy to five questions at 80 percent', () => {
    expect(
      CHAPTER21_COMPLIANCE_RULES
        .formalComplianceReassessmentQuestionCount,
    ).toBe(5)
    expect(
      CHAPTER21_COMPLIANCE_RULES
        .formalComplianceReassessmentPassPercent,
    ).toBe(80)
  })

  it('keeps stale booth-renter scenario rules out of scored activity evidence', () => {
    const content = read(
      'src/lib/chapter-21-premium-content.ts',
    )

    expect(content).not.toContain(
      'Booth renters are independent and responsible for reporting their own income',
    )
    expect(content).not.toContain(
      'receive a 1099 if applicable, and are responsible for their own taxes and records',
    )
    expect(content).toContain(
      'Tax treatment and forms depend on the actual classification and current requirements',
    )
  })
})
