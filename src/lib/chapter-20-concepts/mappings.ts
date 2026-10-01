import { chapter20PremiumFlashcards } from '../chapter-20-premium-flashcards'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import type { Chapter20ConceptFamilyId } from './types'

export interface Chapter20LessonSectionConceptMapping {
  lessonSectionId:
    | 'ch20-introduction'
    | 'ch20-lo1'
    | 'ch20-lo2'
    | 'ch20-lo3'
    | 'ch20-lo4'
    | 'ch20-lo5'
    | 'ch20-lo6'
  conceptFamilyIds: readonly Chapter20ConceptFamilyId[]
}

export interface Chapter20FlashcardConceptMapping {
  flashcardId: `fc-ch20-${string}`
  conceptFamilyId: Chapter20ConceptFamilyId
}

export interface Chapter20QuizQuestionConceptMapping {
  questionId: `qq-20-${string}`
  conceptFamilyId: Chapter20ConceptFamilyId
}

export interface Chapter20MicroCheckPlacement {
  id: `mc-20-${string}`
  afterSectionId:
    | 'ch20-lo1'
    | 'ch20-lo2'
    | 'ch20-lo3'
    | 'ch20-lo4'
    | 'ch20-lo5'
    | 'ch20-lo6'
  conceptFamilyId: Chapter20ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter20LessonSectionConceptMappings: readonly Chapter20LessonSectionConceptMapping[] = [
  {
    lessonSectionId: 'ch20-introduction',
    conceptFamilyIds: [
      'ch20-professional-transition-workplace-expectations',
      'ch20-teamwork-workplace-relationships',
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-ethical-selling-retailing',
      'ch20-client-retention-marketing-consent',
    ],
  },
  { lessonSectionId: 'ch20-lo1', conceptFamilyIds: ['ch20-professional-transition-workplace-expectations'] },
  { lessonSectionId: 'ch20-lo2', conceptFamilyIds: ['ch20-teamwork-workplace-relationships'] },
  { lessonSectionId: 'ch20-lo3', conceptFamilyIds: ['ch20-employment-classification-compensation'] },
  { lessonSectionId: 'ch20-lo4', conceptFamilyIds: ['ch20-financial-responsibility-income-reporting'] },
  { lessonSectionId: 'ch20-lo5', conceptFamilyIds: ['ch20-ethical-selling-retailing'] },
  { lessonSectionId: 'ch20-lo6', conceptFamilyIds: ['ch20-client-retention-marketing-consent'] },
] as const

const flashcardConceptFamilyById = Object.fromEntries([
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch20-${String(i + 1).padStart(3, '0')}`, 'ch20-professional-transition-workplace-expectations']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch20-${String(i + 11).padStart(3, '0')}`, 'ch20-teamwork-workplace-relationships']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch20-${String(i + 21).padStart(3, '0')}`, 'ch20-employment-classification-compensation']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch20-${String(i + 31).padStart(3, '0')}`, 'ch20-financial-responsibility-income-reporting']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch20-${String(i + 41).padStart(3, '0')}`, 'ch20-ethical-selling-retailing']),
  ...Array.from({ length: 10 }, (_, i) => [`fc-ch20-${String(i + 51).padStart(3, '0')}`, 'ch20-client-retention-marketing-consent']),
]) as Record<string, Chapter20ConceptFamilyId>

export const chapter20FlashcardConceptMappings: readonly Chapter20FlashcardConceptMapping[] =
  chapter20PremiumFlashcards.map((card) => {
    const conceptFamilyId = flashcardConceptFamilyById[card.id]
    if (!conceptFamilyId) throw new Error(`Unknown Chapter 20 flashcard mapping: ${card.id}`)
    return { flashcardId: card.id as `fc-ch20-${string}`, conceptFamilyId }
  })

const assessmentQuestionConceptFamily = {
  'qq-20-01': 'ch20-professional-transition-workplace-expectations',
  'qq-20-02': 'ch20-professional-transition-workplace-expectations',
  'qq-20-03': 'ch20-professional-transition-workplace-expectations',
  'qq-20-04': 'ch20-teamwork-workplace-relationships',
  'qq-20-05': 'ch20-teamwork-workplace-relationships',
  'qq-20-06': 'ch20-teamwork-workplace-relationships',
  'qq-20-07': 'ch20-employment-classification-compensation',
  'qq-20-08': 'ch20-employment-classification-compensation',
  'qq-20-09': 'ch20-employment-classification-compensation',
  'qq-20-10': 'ch20-financial-responsibility-income-reporting',
  'qq-20-11': 'ch20-financial-responsibility-income-reporting',
  'qq-20-12': 'ch20-financial-responsibility-income-reporting',
  'qq-20-13': 'ch20-ethical-selling-retailing',
  'qq-20-14': 'ch20-ethical-selling-retailing',
  'qq-20-15': 'ch20-client-retention-marketing-consent',
  'qq-20-16': 'ch20-client-retention-marketing-consent',
  'qq-20-17': 'ch20-client-retention-marketing-consent',
} as const satisfies Record<string, Chapter20ConceptFamilyId>

export const chapter20QuizQuestionConceptMappings: readonly Chapter20QuizQuestionConceptMapping[] =
  chapter20PremiumQuizQuestions.map((question) => {
    const conceptFamilyId = assessmentQuestionConceptFamily[question.id as keyof typeof assessmentQuestionConceptFamily]
    if (!conceptFamilyId) throw new Error(`Unknown Chapter 20 assessment mapping: ${question.id}`)
    return { questionId: question.id as `qq-20-${string}`, conceptFamilyId }
  })

export function getChapter20FlashcardsForConcept(conceptFamilyId: Chapter20ConceptFamilyId) {
  return chapter20FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter20QuizQuestionsForConcept(conceptFamilyId: Chapter20ConceptFamilyId) {
  return chapter20QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}

export function getChapter20LessonSectionsForConcept(conceptFamilyId: Chapter20ConceptFamilyId) {
  return chapter20LessonSectionConceptMappings
    .filter((mapping) => mapping.conceptFamilyIds.includes(conceptFamilyId))
    .map((mapping) => mapping.lessonSectionId)
}


export const chapter20MicroCheckPlacements: readonly Chapter20MicroCheckPlacement[] = [
  {
    id: 'mc-20-01',
    afterSectionId: 'ch20-lo1',
    conceptFamilyId: 'ch20-professional-transition-workplace-expectations',
    plannedQuestionCount: 2,
    purpose: 'Check application of reliability, job expectations, accountability, and professional transition decisions.',
  },
  {
    id: 'mc-20-02',
    afterSectionId: 'ch20-lo2',
    conceptFamilyId: 'ch20-teamwork-workplace-relationships',
    plannedQuestionCount: 2,
    purpose: 'Check teamwork, direct conflict resolution, constructive communication, and workplace relationship decisions.',
  },
  {
    id: 'mc-20-03',
    afterSectionId: 'ch20-lo3',
    conceptFamilyId: 'ch20-employment-classification-compensation',
    plannedQuestionCount: 2,
    purpose: 'Check facts-and-circumstances reasoning for worker classification, compensation, and role-specific business responsibilities.',
  },
  {
    id: 'mc-20-04',
    afterSectionId: 'ch20-lo4',
    conceptFamilyId: 'ch20-financial-responsibility-income-reporting',
    plannedQuestionCount: 2,
    purpose: 'Check income tracking, reporting, budgeting, and verification of current tax or financial requirements.',
  },
  {
    id: 'mc-20-05',
    afterSectionId: 'ch20-lo5',
    conceptFamilyId: 'ch20-ethical-selling-retailing',
    plannedQuestionCount: 2,
    purpose: 'Check client-centered recommendations, objection handling, informed choice, and non-pressure selling.',
  },
  {
    id: 'mc-20-06',
    afterSectionId: 'ch20-lo6',
    conceptFamilyId: 'ch20-client-retention-marketing-consent',
    plannedQuestionCount: 2,
    purpose: 'Check retention, rebooking, referral/marketing choices, privacy, and client-consent reasoning.',
  },
] as const


export interface Chapter20RemediationContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter20ConceptFamilyId
}

export const chapter20RemediationContentConceptMappings: readonly Chapter20RemediationContentConceptMapping[] = [
  { contentBlockId: 'ch20-lo1', conceptFamilyId: 'ch20-professional-transition-workplace-expectations' },
  { contentBlockId: 'ch20-lo2', conceptFamilyId: 'ch20-teamwork-workplace-relationships' },
  { contentBlockId: 'ch20-lo3', conceptFamilyId: 'ch20-employment-classification-compensation' },
  { contentBlockId: 'ch20-lo4', conceptFamilyId: 'ch20-financial-responsibility-income-reporting' },
  { contentBlockId: 'ch20-lo5', conceptFamilyId: 'ch20-ethical-selling-retailing' },
  { contentBlockId: 'ch20-lo6', conceptFamilyId: 'ch20-client-retention-marketing-consent' },
] as const

export const chapter20ContentConceptMappings: readonly Chapter20RemediationContentConceptMapping[] = [
  ...chapter20RemediationContentConceptMappings,
  { contentBlockId: 'ch20-kc1', conceptFamilyId: 'ch20-professional-transition-workplace-expectations' },
  { contentBlockId: 'ch20-kc3', conceptFamilyId: 'ch20-employment-classification-compensation' },
  { contentBlockId: 'ch20-kc4', conceptFamilyId: 'ch20-financial-responsibility-income-reporting' },
  { contentBlockId: 'ch20-kc5', conceptFamilyId: 'ch20-ethical-selling-retailing' },
  { contentBlockId: 'ch20-real-shop-scenarios', conceptFamilyId: 'ch20-teamwork-workplace-relationships' },
] as const

export function getChapter20RemediationContentBlocksForConcept(
  conceptFamilyId: Chapter20ConceptFamilyId,
): readonly string[] {
  return chapter20RemediationContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}
