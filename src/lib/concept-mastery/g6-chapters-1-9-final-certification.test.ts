import { describe, expect, it } from 'vitest'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import { CHAPTER1_GRADE_WEIGHTS } from '../chapter-1-concepts/grading'
import { CHAPTER2_GRADE_WEIGHTS } from '../chapter-2-concepts/grading'
import { CHAPTER3_GRADE_WEIGHTS } from '../chapter-3-concepts/grading'
import { CHAPTER4_GRADE_WEIGHTS } from '../chapter-4-concepts/grading'
import { CHAPTER5_GRADE_WEIGHTS } from '../chapter-5-concepts/grading'
import { CHAPTER6_GRADE_WEIGHTS } from '../chapter-6-concepts/grading'
import { CHAPTER7_GRADE_WEIGHTS } from '../chapter-7-concepts/grading'
import { CHAPTER8_GRADE_WEIGHTS } from '../chapter-8-concepts/grading'
import { CHAPTER9_GRADE_WEIGHTS } from '../chapter-9-concepts/grading'
import { chapter1MicroChecks } from '../chapter-1-concepts/micro-checks'
import { chapter2MicroChecks } from '../chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '../chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '../chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '../chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '../chapter-6-concepts/micro-checks'
import { chapter7MicroChecks } from '../chapter-7-concepts/micro-checks'
import { chapter8MicroChecks } from '../chapter-8-concepts/micro-checks'
import { chapter9MicroChecks } from '../chapter-9-concepts/micro-checks'
import { ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS } from '../chapter-1-concepts/concepts'
import { ACTIVE_CONCEPT_IDS as ACTIVE_CHAPTER2_CONCEPT_IDS } from '../chapter-2-concepts/concepts'
import { CHAPTER3_CONCEPT_FAMILY_IDS } from '../chapter-3-concepts/concepts'
import { ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS } from '../chapter-4-concepts/concepts'
import { ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS } from '../chapter-5-concepts/concepts'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS } from '../chapter-6-concepts/concepts'
import { ACTIVE_CHAPTER7_CONCEPT_FAMILY_IDS } from '../chapter-7-concepts/concepts'
import { ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS } from '../chapter-8-concepts/concepts'
import { ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS } from '../chapter-9-concepts/concepts'
import { chapter1PremiumQuizQuestions } from '../chapter-1-premium-quiz'
import { chapter2PremiumQuizQuestions } from '../chapter-2-premium-quiz'
import { chapter3PremiumQuizQuestions } from '../chapter-3-premium-quiz'
import { chapter4PremiumQuizQuestions } from '../chapter-4-premium-quiz'
import { chapter5PremiumQuizQuestions } from '../chapter-5-premium-quiz'
import { chapter6PremiumQuizQuestions } from '../chapter-6-premium-quiz'
import { chapter7PremiumQuizQuestions } from '../chapter-7-premium-quiz'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import { chapter9PremiumQuizQuestions } from '../chapter-9-premium-quiz'
import { buildChapter1InstructorDiagnostics } from '../chapter-1-concepts/instructor-diagnostics'
import { buildChapter2InstructorDiagnostics } from '../chapter-2-concepts/instructor-diagnostics'
import { buildChapter3InstructorDiagnostics } from '../chapter-3-concepts/instructor-diagnostics'
import { buildChapter4InstructorDiagnostics } from '../chapter-4-concepts/instructor-diagnostics'
import { buildChapter5InstructorDiagnostics } from '../chapter-5-concepts/instructor-diagnostics'
import { buildChapter6InstructorDiagnostics } from '../chapter-6-concepts/instructor-diagnostics'
import { buildChapter7InstructorDiagnostics } from '../chapter-7-concepts/instructor-diagnostics'
import { buildChapter8InstructorDiagnostics } from '../chapter-8-concepts/instructor-diagnostics'
import { buildChapter9InstructorDiagnostics } from '../chapter-9-concepts/instructor-diagnostics'
import { getCanonicalMappingProvider, resetMappingProviderRegistry } from '../reassessment/provider-registry'
import { getChapterContentProvider } from '../remediation/content-provider-registry'
import { getKnowledgeCheckLength } from '../remediation/knowledge-check'
import { isConceptDetectionSupported } from '../remediation/chapter-registry'

const chapterIds = ['ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9'] as const
const conceptsByChapter = [
  ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER2_CONCEPT_IDS,
  CHAPTER3_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER7_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS,
  ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS,
] as const
const initialBanks = [
  chapter1PremiumQuizQuestions, chapter2PremiumQuizQuestions, chapter3PremiumQuizQuestions,
  chapter4PremiumQuizQuestions, chapter5PremiumQuizQuestions, chapter6PremiumQuizQuestions,
  chapter7PremiumQuizQuestions, chapter8PremiumQuizQuestions, chapter9PremiumQuizQuestions,
]
const microChecks = [
  chapter1MicroChecks, chapter2MicroChecks, chapter3MicroChecks, chapter4MicroChecks, chapter5MicroChecks,
  chapter6MicroChecks, chapter7MicroChecks, chapter8MicroChecks, chapter9MicroChecks,
]

describe('G6 Chapters 1–9 final unified grading certification', () => {
  it('locks one canonical grading weight contract across all nine chapters', () => {
    for (const weights of [
      CHAPTER1_GRADE_WEIGHTS, CHAPTER2_GRADE_WEIGHTS, CHAPTER3_GRADE_WEIGHTS,
      CHAPTER4_GRADE_WEIGHTS, CHAPTER5_GRADE_WEIGHTS, CHAPTER6_GRADE_WEIGHTS,
      CHAPTER7_GRADE_WEIGHTS, CHAPTER8_GRADE_WEIGHTS, CHAPTER9_GRADE_WEIGHTS,
    ]) {
      expect(weights).toEqual(SHARED_GRADE_WEIGHTS)
      expect(Object.values(weights).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
    }
  })

  it('registers every chapter in detection, targeted content, reassessment, and five-question sequencing', () => {
    resetMappingProviderRegistry()
    for (const chapterId of chapterIds) {
      expect(isConceptDetectionSupported(chapterId), chapterId).toBe(true)
      expect(getChapterContentProvider(chapterId), chapterId).toBeDefined()
      expect(() => getCanonicalMappingProvider(chapterId), chapterId).not.toThrow()
      expect(getKnowledgeCheckLength(chapterId), chapterId).toBe(5)
    }
  })

  it('gives every active concept fresh formal reassessment capacity and excludes initial questions from formal pools', () => {
    resetMappingProviderRegistry()
    chapterIds.forEach((chapterId, chapterIndex) => {
      const provider = getCanonicalMappingProvider(chapterId)
      const initialIds = new Set(initialBanks[chapterIndex].map((question) => question.id))
      for (const conceptId of conceptsByChapter[chapterIndex]) {
        const pool = provider.getQuestionsForConcept(conceptId)
        expect(pool.length, `${chapterId}:${conceptId}`).toBeGreaterThanOrEqual(5)
        expect(new Set(pool).size, `${chapterId}:${conceptId}`).toBe(pool.length)
        expect(pool.every((id) => !initialIds.has(id)), `${chapterId}:${conceptId}`).toBe(true)
      }
    })
  })

  it('provides immutable micro-check evidence for every chapter and covers every active concept family', () => {
    microChecks.forEach((checks, chapterIndex) => {
      const covered = new Set(checks.map((check) => 'conceptFamilyId' in check ? check.conceptFamilyId : check.conceptId))
      for (const conceptId of conceptsByChapter[chapterIndex]) {
        expect(covered.has(conceptId as never), `${chapterIds[chapterIndex]}:${conceptId}`).toBe(true)
      }
      const questionIds = checks.flatMap((check) => check.questions.map((question) => question.id))
      expect(new Set(questionIds).size, chapterIds[chapterIndex]).toBe(questionIds.length)
    })
  })

  it('keeps instructor diagnostic builders available for Chapters 1–9', () => {
    for (const builder of [
      buildChapter1InstructorDiagnostics, buildChapter2InstructorDiagnostics, buildChapter3InstructorDiagnostics,
      buildChapter4InstructorDiagnostics, buildChapter5InstructorDiagnostics, buildChapter6InstructorDiagnostics,
      buildChapter7InstructorDiagnostics, buildChapter8InstructorDiagnostics, buildChapter9InstructorDiagnostics,
    ]) {
      expect(typeof builder).toBe('function')
    }
  })

  it('serves concept-targeted lesson and flashcard remediation material for every active concept', () => {
    chapterIds.forEach((chapterId, chapterIndex) => {
      const provider = getChapterContentProvider(chapterId)!
      for (const conceptId of conceptsByChapter[chapterIndex]) {
        const bundle = provider.buildRemediationContentBundle(conceptId)
        expect(bundle.contentBlockCount, `${chapterId}:${conceptId}`).toBeGreaterThanOrEqual(1)
        expect(bundle.flashcardCount, `${chapterId}:${conceptId}`).toBeGreaterThanOrEqual(3)
      }
    })
  })
})
