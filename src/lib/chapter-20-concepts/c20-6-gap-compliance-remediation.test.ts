import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { QuizAttempt } from '@/types'
import {
  detectAllChapter20CombinedConceptGaps,
  chapter20ScenarioEvidenceMappings,
} from './detection'
import {
  CHAPTER20_COMPLIANCE_RULES,
  evaluateChapter20ComplianceIntervention,
  getChapter20ComplianceTag,
} from './escalation'
import {
  buildChapter20TargetedRemediationPlan,
  buildChapter20RemediationPathForConcept,
} from './targeted-remediation'
import type { Chapter20EvidenceRecord } from './grading'
import {
  CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
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
  getScenarioEvidenceConcept,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

const ts = '2026-09-30T21:30:00.000Z'

function evidence(
  conceptFamilyId: Chapter20EvidenceRecord['conceptFamilyId'],
  source: Chapter20EvidenceRecord['source'],
  itemId: string,
  correct: boolean,
): Chapter20EvidenceRecord {
  return {
    studentId: 'student-c20',
    chapterId: 'ch-20',
    conceptFamilyId,
    source,
    itemId,
    difficulty: 'application',
    correct,
    attemptPhase: 'initial',
    timestamp: ts,
  }
}

describe('C20-6 gap detection, compliance escalation, and targeted remediation', () => {
  it('combines assessment, micro-check, flashcard, and scenario evidence into one concept detector', () => {
    const attempt: QuizAttempt = {
      id: 'attempt-c20',
      user_id: 'student-c20',
      quiz_id: 'quiz-20',
      score: 0,
      total_questions: 1,
      percentage: 0,
      answers_json: { 'qq-20-07': 'a' },
      completed_at: ts,
      is_reassessment: false,
      remediation_cycle_id: null,
      target_concept_id: null,
    }

    const result = detectAllChapter20CombinedConceptGaps(
      [attempt],
      [
        {
          question_id: 'mcq-20-005',
          selected_answer: 'a',
          answered_at: ts,
        },
      ],
      [
        {
          source: 'flashcard',
          item_id: 'fc-ch20-021',
          is_correct: false,
          answered_at: ts,
        },
        {
          source: 'scenario_application',
          item_id: 'ch20-kc3:0',
          is_correct: false,
          answered_at: ts,
        },
      ],
    )

    const classification = result.get(
      'ch20-employment-classification-compensation',
    )
    expect(classification).toBeDefined()
    expect(classification!.evidence.totalObservations).toBe(4)
    expect(classification!.evidence.misses).toBe(4)
    expect(['emerging_weakness', 'repeated_weakness']).toContain(
      classification!.state,
    )
  })

  it('maps mixed real-shop scenarios at item granularity', () => {
    expect(chapter20ScenarioEvidenceMappings).toHaveLength(13)
    expect(
      getScenarioEvidenceConcept('ch-20', 'ch20-real-shop-scenarios', 0),
    ).toBe('ch20-teamwork-workplace-relationships')
    expect(
      getScenarioEvidenceConcept('ch-20', 'ch20-real-shop-scenarios', 1),
    ).toBe('ch20-ethical-selling-retailing')
    expect(
      getScenarioEvidenceConcept('ch-20', 'ch20-real-shop-scenarios', 2),
    ).toBe('ch20-financial-responsibility-income-reporting')
    expect(
      getScenarioEvidenceConcept('ch-20', 'ch20-real-shop-scenarios', 4),
    ).toBe('ch20-employment-classification-compensation')
  })

  it('elevates repeated compliance misses without creating bodily-safety escalation', () => {
    const rows: Chapter20EvidenceRecord[] = [
      evidence(
        'ch20-employment-classification-compensation',
        'micro_check',
        'mcq-20-005',
        false,
      ),
      evidence(
        'ch20-employment-classification-compensation',
        'chapter_assessment',
        'qq-20-07',
        false,
      ),
    ]

    const compliance = evaluateChapter20ComplianceIntervention(rows)
    expect(compliance.level).toBe('elevated')
    expect(compliance.requiresFormalReassessment).toBe(true)
    expect(compliance.reassessmentQuestionCount).toBe(5)
    expect(compliance.reassessmentPassPercent).toBe(80)

    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-client-retention-marketing-consent',
    ])
  })

  it('recognizes compliance evidence across classification, tax, and client-consent concepts', () => {
    expect(getChapter20ComplianceTag('qq-20-07')?.domain).toBe(
      'worker_classification_compensation',
    )
    expect(getChapter20ComplianceTag('mcq-20-007')?.domain).toBe(
      'tax_income_reporting',
    )
    expect(getChapter20ComplianceTag('mcq-20-011')?.domain).toBe(
      'privacy_client_consent',
    )
    expect(getChapter20ComplianceTag('qq-20-13')).toBeNull()
  })

  it('routes weak concepts to canonical lesson blocks and the exact 10-card family subset', () => {
    const path = buildChapter20RemediationPathForConcept(
      'ch20-financial-responsibility-income-reporting',
    )
    expect(path.contentBlockIds).toEqual(['ch20-lo4'])
    expect(path.flashcardIds).toHaveLength(10)
    expect(path.flashcardIds[0]).toBe('fc-ch20-031')
    expect(path.flashcardIds[9]).toBe('fc-ch20-040')
    expect(path.plannedReassessmentQuestionCount).toBe(5)
    expect(path.plannedReassessmentPassPercent).toBe(80)
  })

  it('builds compliance-priority remediation targets and never marks them as safety', () => {
    const rows: Chapter20EvidenceRecord[] = [
      evidence(
        'ch20-financial-responsibility-income-reporting',
        'micro_check',
        'mcq-20-007',
        false,
      ),
      evidence(
        'ch20-financial-responsibility-income-reporting',
        'chapter_assessment',
        'qq-20-10',
        false,
      ),
    ]

    const plan = buildChapter20TargetedRemediationPlan(rows, ts)
    const target = plan.targets.find(
      (item) =>
        item.conceptFamilyId ===
        'ch20-financial-responsibility-income-reporting',
    )

    expect(target).toBeDefined()
    expect(target!.priority).toBe('compliance')
    expect(target!.complianceEscalation).toBe('elevated')
    expect(target!.safetyEscalation).toBeNull()
    expect(target!.plannedReassessmentPassPercent).toBe(80)
    expect(target!.remediationContentBlockIds).toEqual(['ch20-lo4'])
    expect(target!.remediationFlashcardIds).toHaveLength(10)
    expect(plan.preservedEvidence).toEqual(rows)
  })

  it('registers Chapter 20 with shared detection, content, and activity-evidence providers', () => {
    expect(isConceptDetectionSupported('ch-20')).toBe(true)
    expect(getChapterDetectionProvider('ch-20')?.chapterId).toBe('ch-20')
    expect(hasChapterContentProvider('ch-20')).toBe(true)
    expect(getChapterContentProvider('ch-20')?.chapterId).toBe('ch-20')
    expect(isUnifiedActivityEvidenceChapter('ch-20')).toBe(true)
  })

  it('uses server-authoritative activity persistence for Chapter 20', () => {
    const route = read('src/app/api/chapter-20/activity-evidence/route.ts')
    const client = read('src/lib/concept-mastery/activity-evidence.ts')

    expect(route).toContain('createServiceRoleClient')
    expect(route).toContain("getFlashcardEvidenceConcept('ch-20'")
    expect(route).toContain("getScenarioEvidenceConcept('ch-20'")
    expect(route).not.toContain('body.userId')
    expect(route).not.toContain('body.conceptId')
    expect(route).not.toContain('body.isCorrect')
    expect(client).toContain("input.chapterId === 'ch-19' || input.chapterId === 'ch-20'")
  })

  it('feeds Chapter 20 durable combined evidence into the real remediation orchestrator', () => {
    const source = read('src/lib/remediation/detection-orchestrator.ts')
    expect(source).toContain("chapterId === 'ch-20'")
    expect(source).toContain('getChapter20MicroCheckEvidence')
    expect(source).toContain('getChapter20ActivityEvidence')
    expect(source).toContain('detectAllChapter20CombinedConceptGaps')
  })

  it('surfaces targeted compliance review in the live Chapter 20 micro-check UI', () => {
    const source = read('src/components/chapter/Chapter20MicroCheckCard.tsx')
    expect(source).toContain('classifyChapter20MicroCheckMiss')
    expect(source).toContain('Compliance review required')
    expect(source).toContain('Targeted Compliance Review')
  })

  it('locks Chapter 20 compliance recovery policy to five questions at 80 percent', () => {
    expect(CHAPTER20_COMPLIANCE_RULES.formalComplianceReassessmentQuestionCount).toBe(5)
    expect(CHAPTER20_COMPLIANCE_RULES.formalComplianceReassessmentPassPercent).toBe(80)
  })
})
