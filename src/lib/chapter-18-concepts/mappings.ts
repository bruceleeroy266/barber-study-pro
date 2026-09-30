import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import type { Chapter18ConceptFamilyId } from './types'

export interface Chapter18LessonSectionConceptMapping {
  lessonSectionKey:
    | 'why-study'
    | 'hair-analysis'
    | 'color-theory'
    | 'haircolor-products'
    | 'developers-lighteners-toners'
    | 'application-terms'
    | 'safety-special-problems'
    | 'facial-hair-coloring'
    | 'consultation-record-keeping'
    | 'key-takeaways'
  conceptFamilyIds: readonly Chapter18ConceptFamilyId[]
}

export interface Chapter18ContentConceptMapping {
  contentBlockId: 'chapter-18-lesson'
  conceptFamilyId: Chapter18ConceptFamilyId
}

export interface Chapter18FlashcardConceptMapping {
  flashcardId: `fc-ch18-${string}`
  conceptFamilyId: Chapter18ConceptFamilyId
}

export interface Chapter18QuizQuestionConceptMapping {
  questionId: `qq-18-${string}`
  conceptFamilyId: Chapter18ConceptFamilyId
}

export interface Chapter18MicroCheckPlacement {
  id: `mc-18-${string}`
  afterSectionId: 'chapter-18-lesson'
  conceptFamilyId: Chapter18ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter18LessonSectionConceptMappings: readonly Chapter18LessonSectionConceptMapping[] = [
  { lessonSectionKey: 'why-study', conceptFamilyIds: ['ch18-analysis-structure', 'ch18-service-safety-chemical-handling'] },
  { lessonSectionKey: 'hair-analysis', conceptFamilyIds: ['ch18-analysis-structure', 'ch18-correction-gray-porosity'] },
  { lessonSectionKey: 'color-theory', conceptFamilyIds: ['ch18-color-theory'] },
  { lessonSectionKey: 'haircolor-products', conceptFamilyIds: ['ch18-color-products', 'ch18-service-safety-chemical-handling'] },
  { lessonSectionKey: 'developers-lighteners-toners', conceptFamilyIds: ['ch18-developers-lighteners-toners', 'ch18-service-safety-chemical-handling'] },
  { lessonSectionKey: 'application-terms', conceptFamilyIds: ['ch18-application-consultation-procedures', 'ch18-correction-gray-porosity'] },
  { lessonSectionKey: 'safety-special-problems', conceptFamilyIds: ['ch18-correction-gray-porosity', 'ch18-service-safety-chemical-handling'] },
  { lessonSectionKey: 'facial-hair-coloring', conceptFamilyIds: ['ch18-application-consultation-procedures', 'ch18-service-safety-chemical-handling'] },
  { lessonSectionKey: 'consultation-record-keeping', conceptFamilyIds: ['ch18-analysis-structure', 'ch18-application-consultation-procedures'] },
  { lessonSectionKey: 'key-takeaways', conceptFamilyIds: ['ch18-analysis-structure', 'ch18-color-theory', 'ch18-color-products', 'ch18-developers-lighteners-toners', 'ch18-application-consultation-procedures', 'ch18-service-safety-chemical-handling'] },
] as const

// The runtime lesson is intentionally still one legacy HTML shell in C18-1.
// Binding it once makes Chapter 18 eligible for the shared activity-evidence
// registry without inventing non-existent runtime section IDs. The semantic
// 10-section mapping above carries the multi-concept lesson coverage.
export const chapter18ContentConceptMappings: readonly Chapter18ContentConceptMapping[] = [
  { contentBlockId: 'chapter-18-lesson', conceptFamilyId: 'ch18-application-consultation-procedures' },
] as const


export const chapter18RemediationContentConceptMappings: readonly Chapter18ContentConceptMapping[] =
  [
    'ch18-analysis-structure',
    'ch18-color-theory',
    'ch18-color-products',
    'ch18-developers-lighteners-toners',
    'ch18-application-consultation-procedures',
    'ch18-correction-gray-porosity',
    'ch18-service-safety-chemical-handling',
  ].map((conceptFamilyId) => ({
    contentBlockId: 'chapter-18-lesson',
    conceptFamilyId,
  })) as readonly Chapter18ContentConceptMapping[]

const safetyFlashcardIds = new Set([
  'fc-ch18-019',
  'fc-ch18-020',
  'fc-ch18-023',
  'fc-ch18-034',
  'fc-ch18-035',
  'fc-ch18-036',
  'fc-ch18-048',
  'fc-ch18-049',
  'fc-ch18-050',
])

const flashcardCategoryToConceptFamily = {
  'Hair Analysis & Structure': 'ch18-analysis-structure',
  'Color Theory': 'ch18-color-theory',
  'Haircolor Products': 'ch18-color-products',
  'Developers, Lighteners & Toners': 'ch18-developers-lighteners-toners',
  'Application Terms & Procedures': 'ch18-application-consultation-procedures',
  'Corrective & Support Products': 'ch18-correction-gray-porosity',
  'Safety': 'ch18-service-safety-chemical-handling',
} as const satisfies Record<string, Chapter18ConceptFamilyId>

export const chapter18FlashcardConceptMappings: readonly Chapter18FlashcardConceptMapping[] =
  chapter18PremiumFlashcards.map((card) => {
    const conceptFamilyId = safetyFlashcardIds.has(card.id)
      ? 'ch18-service-safety-chemical-handling'
      : flashcardCategoryToConceptFamily[card.category as keyof typeof flashcardCategoryToConceptFamily]

    if (!conceptFamilyId) throw new Error(`Unknown Chapter 18 flashcard category: ${card.category ?? 'missing'}`)
    return {
      flashcardId: card.id as `fc-ch18-${string}`,
      conceptFamilyId,
    }
  })

const assessmentQuestionConceptFamily = {
  'qq-18-01': 'ch18-analysis-structure',
  'qq-18-02': 'ch18-analysis-structure',
  'qq-18-03': 'ch18-color-theory',
  'qq-18-04': 'ch18-color-products',
  'qq-18-05': 'ch18-developers-lighteners-toners',
  'qq-18-06': 'ch18-color-theory',
  'qq-18-07': 'ch18-correction-gray-porosity',
  'qq-18-08': 'ch18-color-products',
  'qq-18-09': 'ch18-application-consultation-procedures',
  'qq-18-10': 'ch18-application-consultation-procedures',
  'qq-18-11': 'ch18-color-products',
  'qq-18-12': 'ch18-service-safety-chemical-handling',
  'qq-18-13': 'ch18-service-safety-chemical-handling',
  'qq-18-14': 'ch18-service-safety-chemical-handling',
  'qq-18-15': 'ch18-correction-gray-porosity',
} as const satisfies Record<string, Chapter18ConceptFamilyId>

export const chapter18QuizQuestionConceptMappings: readonly Chapter18QuizQuestionConceptMapping[] =
  chapter18PremiumQuizQuestions.map((question) => {
    const conceptFamilyId = assessmentQuestionConceptFamily[question.id as keyof typeof assessmentQuestionConceptFamily]
    if (!conceptFamilyId) throw new Error(`Unknown Chapter 18 assessment mapping: ${question.id}`)
    return {
      questionId: question.id as `qq-18-${string}`,
      conceptFamilyId,
    }
  })


export const chapter18MicroCheckPlacements: readonly Chapter18MicroCheckPlacement[] = [
  {
    id: 'mc-18-01',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-analysis-structure',
    plannedQuestionCount: 2,
    purpose: 'Check hair integrity, elasticity, porosity, and analysis decisions before color or lightening.',
  },
  {
    id: 'mc-18-02',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-color-theory',
    plannedQuestionCount: 2,
    purpose: 'Check level, tone, complementary relationships, and neutralization reasoning.',
  },
  {
    id: 'mc-18-03',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-color-products',
    plannedQuestionCount: 2,
    purpose: 'Check distinctions among temporary, semipermanent, demipermanent, permanent, oxidative, and direct-dye systems.',
  },
  {
    id: 'mc-18-04',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-developers-lighteners-toners',
    plannedQuestionCount: 2,
    purpose: 'Check product-specific developer, lightener, toner, lift, scalp-use, and processing decisions.',
  },
  {
    id: 'mc-18-05',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-application-consultation-procedures',
    plannedQuestionCount: 2,
    purpose: 'Check consultation, service history, strand testing, retouch placement, and application planning.',
  },
  {
    id: 'mc-18-06',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-correction-gray-porosity',
    plannedQuestionCount: 2,
    purpose: 'Check tint-back, filler/equalization, gray-coverage, and porosity-sensitive formulation decisions.',
  },
  {
    id: 'mc-18-07',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-service-safety-chemical-handling',
    plannedQuestionCount: 2,
    purpose: 'Check scalp contraindications, allergy-alert/product-use boundaries, facial-hair restrictions, and chemical-service safety.',
  },
] as const

export function getChapter18FlashcardsForConcept(conceptFamilyId: Chapter18ConceptFamilyId) {
  return chapter18FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.flashcardId)
}

export function getChapter18QuizQuestionsForConcept(conceptFamilyId: Chapter18ConceptFamilyId) {
  return chapter18QuizQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.questionId)
}

export function getChapter18LessonSectionsForConcept(conceptFamilyId: Chapter18ConceptFamilyId) {
  return chapter18LessonSectionConceptMappings
    .filter((mapping) => mapping.conceptFamilyIds.includes(conceptFamilyId))
    .map((mapping) => mapping.lessonSectionKey)
}

export function getChapter18RemediationContentBlocksForConcept(conceptFamilyId: Chapter18ConceptFamilyId) {
  return chapter18RemediationContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}
