import { chapter21PremiumFlashcards } from '../chapter-21-premium-flashcards'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import type { Chapter21ConceptFamilyId } from './types'

export interface Chapter21LessonSectionConceptMapping {
  lessonSectionId:
    | 'chapter-21-introduction'
    | 'ch21-lo1'
    | 'ch21-lo2'
    | 'ch21-lo3'
    | 'ch21-lo4'
    | 'ch21-lo5'
    | 'ch21-lo6'
    | 'ch21-lo7'
    | 'ch21-lo8'
  conceptFamilyIds: readonly Chapter21ConceptFamilyId[]
}

export interface Chapter21FlashcardConceptMapping {
  flashcardId: `fc-ch21-${string}`
  conceptFamilyId: Chapter21ConceptFamilyId
}

export interface Chapter21QuizQuestionConceptMapping {
  questionId: `qq-21-${string}`
  conceptFamilyId: Chapter21ConceptFamilyId
}

export interface Chapter21MicroCheckPlacement {
  id: `mc-21-${string}`
  afterSectionId:
    | 'ch21-lo1'
    | 'ch21-lo2'
    | 'ch21-lo3'
    | 'ch21-lo4'
    | 'ch21-lo5'
    | 'ch21-lo6'
    | 'ch21-lo7'
    | 'ch21-lo8'
  conceptFamilyId: Chapter21ConceptFamilyId
  plannedQuestionCount: 2
  purpose: string
}

export const chapter21LessonSectionConceptMappings: readonly Chapter21LessonSectionConceptMapping[] = [
  {
    lessonSectionId: 'chapter-21-introduction',
    conceptFamilyIds: [
      'ch21-business-entry-paths',
      'ch21-shop-opening-planning',
      'ch21-ownership-legal-structures',
      'ch21-business-plan-financial-planning',
      'ch21-recordkeeping-financial-compliance',
      'ch21-booth-rental-independent-business-responsibilities',
      'ch21-shop-operations-management',
      'ch21-advertising-marketing-client-consent',
    ],
  },
  { lessonSectionId: 'ch21-lo1', conceptFamilyIds: ['ch21-business-entry-paths'] },
  { lessonSectionId: 'ch21-lo2', conceptFamilyIds: ['ch21-shop-opening-planning'] },
  { lessonSectionId: 'ch21-lo3', conceptFamilyIds: ['ch21-ownership-legal-structures'] },
  { lessonSectionId: 'ch21-lo4', conceptFamilyIds: ['ch21-business-plan-financial-planning'] },
  { lessonSectionId: 'ch21-lo5', conceptFamilyIds: ['ch21-recordkeeping-financial-compliance'] },
  { lessonSectionId: 'ch21-lo6', conceptFamilyIds: ['ch21-booth-rental-independent-business-responsibilities'] },
  { lessonSectionId: 'ch21-lo7', conceptFamilyIds: ['ch21-shop-operations-management'] },
  { lessonSectionId: 'ch21-lo8', conceptFamilyIds: ['ch21-advertising-marketing-client-consent'] },
] as const

const flashcardConceptFamilyById = Object.fromEntries([
  ...Array.from({ length: 5 }, (_, i) => [`fc-ch21-${String(i + 1).padStart(3, '0')}`, 'ch21-business-entry-paths']),
  ...Array.from({ length: 5 }, (_, i) => [`fc-ch21-${String(i + 6).padStart(3, '0')}`, 'ch21-shop-opening-planning']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch21-${String(i + 11).padStart(3, '0')}`, 'ch21-ownership-legal-structures']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch21-${String(i + 21).padStart(3, '0')}`, 'ch21-business-plan-financial-planning']),
  ...Array.from({ length: 5 }, (_, i) => [`fc-ch21-${String(i + 31).padStart(3, '0')}`, 'ch21-recordkeeping-financial-compliance']),
  ...Array.from({ length: 5 }, (_, i) => [`fc-ch21-${String(i + 36).padStart(3, '0')}`, 'ch21-booth-rental-independent-business-responsibilities']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch21-${String(i + 41).padStart(3, '0')}`, 'ch21-shop-operations-management']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch21-${String(i + 51).padStart(3, '0')}`, 'ch21-advertising-marketing-client-consent']),
]) as Record<string, Chapter21ConceptFamilyId>

export const chapter21FlashcardConceptMappings: readonly Chapter21FlashcardConceptMapping[] =
  chapter21PremiumFlashcards.map((card) => {
    const conceptFamilyId = flashcardConceptFamilyById[card.id]
    if (!conceptFamilyId) {
      throw new Error(`Unknown Chapter 21 flashcard mapping: ${card.id}`)
    }
    return {
      flashcardId: card.id as `fc-ch21-${string}`,
      conceptFamilyId,
    }
  })

const assessmentQuestionConceptFamily = {
  'qq-21-01': 'ch21-business-entry-paths',
  'qq-21-02': 'ch21-business-entry-paths',
  'qq-21-03': 'ch21-shop-opening-planning',
  'qq-21-04': 'ch21-ownership-legal-structures',
  'qq-21-05': 'ch21-ownership-legal-structures',
  'qq-21-06': 'ch21-booth-rental-independent-business-responsibilities',
  'qq-21-07': 'ch21-business-plan-financial-planning',
  'qq-21-08': 'ch21-business-plan-financial-planning',
  'qq-21-09': 'ch21-recordkeeping-financial-compliance',
  'qq-21-10': 'ch21-recordkeeping-financial-compliance',
  'qq-21-11': 'ch21-booth-rental-independent-business-responsibilities',
  'qq-21-12': 'ch21-shop-operations-management',
  'qq-21-13': 'ch21-shop-operations-management',
  'qq-21-14': 'ch21-advertising-marketing-client-consent',
  'qq-21-15': 'ch21-advertising-marketing-client-consent',
  'qq-21-16': 'ch21-advertising-marketing-client-consent',
  'qq-21-17': 'ch21-shop-opening-planning',
} as const satisfies Record<string, Chapter21ConceptFamilyId>

export const chapter21QuizQuestionConceptMappings: readonly Chapter21QuizQuestionConceptMapping[] =
  chapter21PremiumQuizQuestions.map((question) => {
    const conceptFamilyId =
      assessmentQuestionConceptFamily[
        question.id as keyof typeof assessmentQuestionConceptFamily
      ]
    if (!conceptFamilyId) {
      throw new Error(`Unknown Chapter 21 assessment mapping: ${question.id}`)
    }
    return {
      questionId: question.id as `qq-21-${string}`,
      conceptFamilyId,
    }
  })

export function getChapter21FlashcardsForConcept(
  conceptFamilyId: Chapter21ConceptFamilyId,
) {
  return chapter21FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter21QuizQuestionsForConcept(
  conceptFamilyId: Chapter21ConceptFamilyId,
) {
  return chapter21QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}

export function getChapter21LessonSectionsForConcept(
  conceptFamilyId: Chapter21ConceptFamilyId,
) {
  return chapter21LessonSectionConceptMappings
    .filter((mapping) => mapping.conceptFamilyIds.includes(conceptFamilyId))
    .map((mapping) => mapping.lessonSectionId)
}

export const chapter21MicroCheckPlacements: readonly Chapter21MicroCheckPlacement[] = [
  {
    id: 'mc-21-01',
    afterSectionId: 'ch21-lo1',
    conceptFamilyId: 'ch21-business-entry-paths',
    plannedQuestionCount: 2,
    purpose: 'Check choice of business-entry path using control, overhead, resources, risk, and readiness.',
  },
  {
    id: 'mc-21-02',
    afterSectionId: 'ch21-lo2',
    conceptFamilyId: 'ch21-shop-opening-planning',
    plannedQuestionCount: 2,
    purpose: 'Check shop-opening decisions involving location, startup planning, licensing, staffing, and client experience.',
  },
  {
    id: 'mc-21-03',
    afterSectionId: 'ch21-lo3',
    conceptFamilyId: 'ch21-ownership-legal-structures',
    plannedQuestionCount: 2,
    purpose: 'Check legal-structure reasoning without treating simplified liability or tax descriptions as universal rules.',
  },
  {
    id: 'mc-21-04',
    afterSectionId: 'ch21-lo4',
    conceptFamilyId: 'ch21-business-plan-financial-planning',
    plannedQuestionCount: 2,
    purpose: 'Check business-plan, market-analysis, pricing, cash-flow, and projection decisions.',
  },
  {
    id: 'mc-21-05',
    afterSectionId: 'ch21-lo5',
    conceptFamilyId: 'ch21-recordkeeping-financial-compliance',
    plannedQuestionCount: 2,
    purpose: 'Check recordkeeping, reporting support, documentation, client records, and verification of current requirements.',
  },
  {
    id: 'mc-21-06',
    afterSectionId: 'ch21-lo6',
    conceptFamilyId: 'ch21-booth-rental-independent-business-responsibilities',
    plannedQuestionCount: 2,
    purpose: 'Check rental-agreement, actual working relationship, tax, insurance, licensing, expense, and client-management responsibilities.',
  },
  {
    id: 'mc-21-07',
    afterSectionId: 'ch21-lo7',
    conceptFamilyId: 'ch21-shop-operations-management',
    plannedQuestionCount: 2,
    purpose: 'Check scheduling, accountability, service quality, financial discipline, shop culture, and operational decisions.',
  },
  {
    id: 'mc-21-08',
    afterSectionId: 'ch21-lo8',
    conceptFamilyId: 'ch21-advertising-marketing-client-consent',
    plannedQuestionCount: 2,
    purpose: 'Check ethical advertising, truthful marketing, client consent, privacy, referrals, partnerships, and rebooking decisions.',
  },
] as const
