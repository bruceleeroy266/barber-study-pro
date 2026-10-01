import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter21PremiumFlashcards } from '../chapter-21-premium-flashcards'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import {
  CHAPTER21_CONCEPT_FAMILY_IDS,
  CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import { chapter21MicroChecks } from './micro-checks'
import { chapter21ReassessmentReserve } from './reassessment-reserve'
import {
  chapter21FlashcardConceptMappings,
  chapter21QuizQuestionConceptMappings,
  chapter21RemediationContentConceptMappings,
} from './mappings'
import { chapter21ScenarioEvidenceMappings } from './detection'
import {
  CHAPTER21_REMEDIATION_RULES,
  buildChapter21RemediationPathForConcept,
} from './targeted-remediation'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { hasChapterContentProvider } from '../remediation/content-provider-registry'
import { isConceptDetectionSupported } from '../remediation/chapter-registry'
import { hasCanonicalMappingProvider } from '../reassessment/provider-registry'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('C21-9 final end-to-end certification', () => {
  it('locks the canonical Chapter 21 inventories', () => {
    expect(CHAPTER21_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(chapter21PremiumFlashcards).toHaveLength(60)
    expect(chapter21PremiumQuizQuestions).toHaveLength(17)
    expect(chapter21MicroChecks).toHaveLength(8)
    expect(chapter21MicroChecks.flatMap((check) => check.questions)).toHaveLength(16)
    expect(chapter21ReassessmentReserve).toHaveLength(40)
  })

  it('certifies complete concept coverage across lesson, flashcards, assessment, micro-checks, remediation, and reassessment', () => {
    const expectedFlashcardCounts = new Map<string, number>([
      ['ch21-business-entry-paths', 5],
      ['ch21-shop-opening-planning', 5],
      ['ch21-ownership-legal-structures', 10],
      ['ch21-business-plan-financial-planning', 10],
      ['ch21-recordkeeping-financial-compliance', 5],
      ['ch21-booth-rental-independent-business-responsibilities', 5],
      ['ch21-shop-operations-management', 10],
      ['ch21-advertising-marketing-client-consent', 10],
    ])

    for (const conceptFamilyId of CHAPTER21_CONCEPT_FAMILY_IDS) {
      expect(
        chapter21FlashcardConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
      ).toHaveLength(expectedFlashcardCounts.get(conceptFamilyId)!)

      expect(
        chapter21QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
      ).toBe(true)

      expect(
        chapter21MicroChecks.find(
          (check) => check.conceptFamilyId === conceptFamilyId,
        )?.questions,
      ).toHaveLength(2)

      expect(
        chapter21RemediationContentConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
      ).toHaveLength(1)

      expect(
        chapter21ReassessmentReserve.filter(
          (question) => question.conceptFamilyId === conceptFamilyId,
        ),
      ).toHaveLength(5)
    }
  })

  it('keeps assessment, micro-check, and reassessment namespaces isolated', () => {
    const assessmentIds = new Set(chapter21PremiumQuizQuestions.map((question) => question.id))
    const microIds = new Set(chapter21MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))
    const reassessmentIds = new Set(chapter21ReassessmentReserve.map((question) => question.id))

    expect([...assessmentIds].every((id) => id.startsWith('qq-21-'))).toBe(true)
    expect([...microIds].every((id) => id.startsWith('mcq-21-'))).toBe(true)
    expect([...reassessmentIds].every((id) => id.startsWith('r21-'))).toBe(true)

    expect([...assessmentIds].some((id) => microIds.has(id as never) || reassessmentIds.has(id as never))).toBe(false)
    expect([...microIds].some((id) => reassessmentIds.has(id as never))).toBe(false)
  })

  it('locks ordinary and compliance recovery at five questions and 80 percent with no bodily-safety path', () => {
    expect(CHAPTER21_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER21_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER21_REMEDIATION_RULES.complianceReassessmentQuestionCount).toBe(5)
    expect(CHAPTER21_REMEDIATION_RULES.complianceReassessmentPassPercent).toBe(80)
    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch21-shop-opening-planning',
      'ch21-ownership-legal-structures',
      'ch21-recordkeeping-financial-compliance',
      'ch21-booth-rental-independent-business-responsibilities',
      'ch21-advertising-marketing-client-consent',
    ])
  })

  it('locks targeted remediation to one canonical LO block plus the real mapped flashcard subset', () => {
    const expectedFlashcardCounts = new Map<string, number>([
      ['ch21-business-entry-paths', 5],
      ['ch21-shop-opening-planning', 5],
      ['ch21-ownership-legal-structures', 10],
      ['ch21-business-plan-financial-planning', 10],
      ['ch21-recordkeeping-financial-compliance', 5],
      ['ch21-booth-rental-independent-business-responsibilities', 5],
      ['ch21-shop-operations-management', 10],
      ['ch21-advertising-marketing-client-consent', 10],
    ])

    for (const conceptFamilyId of CHAPTER21_CONCEPT_FAMILY_IDS) {
      const path = buildChapter21RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds).toHaveLength(1)
      expect(path.flashcardIds).toHaveLength(expectedFlashcardCounts.get(conceptFamilyId)!)
      expect(path.plannedReassessmentQuestionCount).toBe(5)
      expect(path.plannedReassessmentPassPercent).toBe(80)
    }
  })

  it('certifies real durable activity inventories for 60 flashcards and 13 scenario/application items', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-21')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-21')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-21')).toHaveLength(13)
    expect(chapter21ScenarioEvidenceMappings).toHaveLength(13)
  })

  it('certifies shared runtime registration for detection, remediation content, and reassessment', () => {
    expect(isConceptDetectionSupported('ch-21')).toBe(true)
    expect(hasChapterContentProvider('ch-21')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-21')).toBe(true)
  })

  it('locks shared grading weights to 20/10/40/15/15', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('keeps instructor and school-admin diagnostics behind role and same-school authorization', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(
      'if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))',
    )
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain('buildChapter21InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-21', chapter21Diagnostics)")
  })

  it('keeps raw answers and internal evidence identifiers out of the rendered Chapter 21 diagnostic panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker =
      '{/* Chapter 21 mastery, business/legal compliance, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    expect(start).toBeGreaterThanOrEqual(0)
    const end = page.indexOf('</section>', start)
    const section = page.slice(start, end + '</section>'.length)

    expect(section).not.toContain('answers_json')
    expect(section).not.toContain('question_id')
    expect(section).not.toContain('item_id')
    expect(section).not.toContain('remediation_cycle_id')
    expect(section).not.toContain('studentId')
  })

  it('preserves append-only reassessment recovery implementation', () => {
    const source = read('src/lib/chapter-21-concepts/targeted-remediation.ts')
    expect(source).toContain('appendChapter21ReassessmentEvidence')
    expect(source).toContain('originalEvidencePreserved')
    expect(source).toContain("source !== 'remediation_reassessment'")
    expect(source).toContain("attemptPhase !== 'reassessment'")
  })

  it('keeps authoritative micro-check and activity writes server-side', () => {
    const micro = read('src/app/api/chapter-21/micro-check/route.ts')
    const activity = read('src/app/api/chapter-21/activity-evidence/route.ts')
    expect(micro).toContain('createServiceRoleClient')
    expect(activity).toContain('createServiceRoleClient')
    expect(micro).not.toContain('body.userId')
    expect(activity).not.toContain('body.userId')
    expect(activity).not.toContain('body.conceptId')
    expect(activity).not.toContain('body.isCorrect')
  })

  it('keeps the hardened learner content and canonical Chapter 21 metadata intact', () => {
    const lesson = read('src/lib/chapter-21-premium-content.ts')
    const flashcards = read('src/lib/chapter-21-premium-flashcards.ts')
    const quiz = read('src/lib/chapter-21-premium-quiz.ts')

    expect(lesson).toContain("standardId: 'LO-21-01'")
    expect(lesson).toContain("standardId: 'LO-21-08'")
    expect(lesson).toContain('data-graded="false"')
    expect(flashcards).not.toContain('Approximately 25–30%')
    expect(quiz).not.toContain('3-6 months of expenses')
    expect(quiz).not.toMatch(/learningObjective:\s*['"]CH21-LO0[1-8]['"]/)
  })
})
