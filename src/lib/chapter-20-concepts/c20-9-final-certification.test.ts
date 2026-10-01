import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter20PremiumFlashcards } from '../chapter-20-premium-flashcards'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import {
  CHAPTER20_CONCEPT_FAMILY_IDS,
  CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import { chapter20MicroChecks } from './micro-checks'
import { chapter20ReassessmentReserve } from './reassessment-reserve'
import {
  chapter20FlashcardConceptMappings,
  chapter20QuizQuestionConceptMappings,
  chapter20RemediationContentConceptMappings,
} from './mappings'
import { chapter20ScenarioEvidenceMappings } from './detection'
import {
  CHAPTER20_REMEDIATION_RULES,
  buildChapter20RemediationPathForConcept,
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

describe('C20-9 final end-to-end certification', () => {
  it('locks the canonical Chapter 20 inventories', () => {
    expect(CHAPTER20_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(chapter20PremiumFlashcards).toHaveLength(60)
    expect(chapter20PremiumQuizQuestions).toHaveLength(17)
    expect(chapter20MicroChecks).toHaveLength(6)
    expect(chapter20MicroChecks.flatMap((check) => check.questions)).toHaveLength(12)
    expect(chapter20ReassessmentReserve).toHaveLength(30)
  })

  it('certifies complete concept coverage across lesson, flashcards, assessment, micro-checks, remediation, and reassessment', () => {
    for (const conceptFamilyId of CHAPTER20_CONCEPT_FAMILY_IDS) {
      expect(
        chapter20FlashcardConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
      ).toHaveLength(10)

      expect(
        chapter20QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
      ).toBe(true)

      expect(
        chapter20MicroChecks.find(
          (check) => check.conceptFamilyId === conceptFamilyId,
        )?.questions,
      ).toHaveLength(2)

      expect(
        chapter20RemediationContentConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
      ).toHaveLength(1)

      expect(
        chapter20ReassessmentReserve.filter(
          (question) => question.conceptFamilyId === conceptFamilyId,
        ),
      ).toHaveLength(5)
    }
  })

  it('keeps assessment, micro-check, and reassessment namespaces isolated', () => {
    const assessmentIds = new Set(chapter20PremiumQuizQuestions.map((question) => question.id))
    const microIds = new Set(chapter20MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))
    const reassessmentIds = new Set(chapter20ReassessmentReserve.map((question) => question.id))

    expect([...assessmentIds].every((id) => id.startsWith('qq-20-'))).toBe(true)
    expect([...microIds].every((id) => id.startsWith('mcq-20-'))).toBe(true)
    expect([...reassessmentIds].every((id) => id.startsWith('r20-'))).toBe(true)

    expect([...assessmentIds].some((id) => microIds.has(id as never) || reassessmentIds.has(id as never))).toBe(false)
    expect([...microIds].some((id) => reassessmentIds.has(id as never))).toBe(false)
  })

  it('locks ordinary and compliance recovery at five questions and 80 percent with no bodily-safety path', () => {
    expect(CHAPTER20_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER20_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER20_REMEDIATION_RULES.complianceReassessmentQuestionCount).toBe(5)
    expect(CHAPTER20_REMEDIATION_RULES.complianceReassessmentPassPercent).toBe(80)
    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-client-retention-marketing-consent',
    ])
  })

  it('locks targeted remediation to one LO block plus ten flashcards per concept', () => {
    for (const conceptFamilyId of CHAPTER20_CONCEPT_FAMILY_IDS) {
      const path = buildChapter20RemediationPathForConcept(conceptFamilyId)
      expect(path.contentBlockIds).toHaveLength(1)
      expect(path.flashcardIds).toHaveLength(10)
      expect(path.plannedReassessmentQuestionCount).toBe(5)
      expect(path.plannedReassessmentPassPercent).toBe(80)
    }
  })

  it('certifies real durable activity inventories for 60 flashcards and 13 scenario/application items', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-20')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-20')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-20')).toHaveLength(13)
    expect(chapter20ScenarioEvidenceMappings).toHaveLength(13)
  })

  it('certifies shared runtime registration for detection, remediation content, and reassessment', () => {
    expect(isConceptDetectionSupported('ch-20')).toBe(true)
    expect(hasChapterContentProvider('ch-20')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-20')).toBe(true)
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
    expect(page).toContain('buildChapter20InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-20', chapter20Diagnostics)")
  })

  it('keeps raw answers and internal evidence identifiers out of the rendered Chapter 20 diagnostic panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker =
      '{/* Chapter 20 mastery, compliance, remediation & instructor visibility */}'
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
    const source = read('src/lib/chapter-20-concepts/targeted-remediation.ts')
    expect(source).toContain('appendChapter20ReassessmentEvidence')
    expect(source).toContain('originalEvidencePreserved')
    expect(source).toContain("source !== 'remediation_reassessment'")
    expect(source).toContain("attemptPhase !== 'reassessment'")
  })

  it('keeps authoritative micro-check and activity writes server-side', () => {
    const micro = read('src/app/api/chapter-20/micro-check/route.ts')
    const activity = read('src/app/api/chapter-20/activity-evidence/route.ts')
    expect(micro).toContain('createServiceRoleClient')
    expect(activity).toContain('createServiceRoleClient')
    expect(micro).not.toContain('body.userId')
    expect(activity).not.toContain('body.userId')
    expect(activity).not.toContain('body.conceptId')
    expect(activity).not.toContain('body.isCorrect')
  })
})
