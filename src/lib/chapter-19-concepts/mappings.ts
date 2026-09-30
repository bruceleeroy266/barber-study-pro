import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import type { Chapter19ConceptFamilyId } from './types'

export interface Chapter19LessonSectionConceptMapping {
  lessonSectionKey:
    | 'licensing-path'
    | 'written-theory-exam'
    | 'practical-skills-component'
    | 'school-to-employment-evidence'
    | 'research-shop'
    | 'interview-professionally'
    | 'read-before-agree'
    | 'career-launch-checklist'
  conceptFamilyIds: readonly Chapter19ConceptFamilyId[]
}

export interface Chapter19ContentConceptMapping {
  contentBlockId: 'chapter-19-lesson'
  conceptFamilyId: Chapter19ConceptFamilyId
}

export interface Chapter19FlashcardConceptMapping {
  flashcardId: `fc-ch19-${string}`
  conceptFamilyId: Chapter19ConceptFamilyId
}

export interface Chapter19QuizQuestionConceptMapping {
  questionId: `qq-19-${string}`
  conceptFamilyId: Chapter19ConceptFamilyId
}

export interface Chapter19MicroCheckPlacement {
  id: `mc-19-${string}`
  afterSectionId: 'chapter-19-lesson'
  conceptFamilyId: Chapter19ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter19LessonSectionConceptMappings: readonly Chapter19LessonSectionConceptMapping[] = [
  { lessonSectionKey: 'licensing-path', conceptFamilyIds: ['ch19-licensing-requirements-verification'] },
  { lessonSectionKey: 'written-theory-exam', conceptFamilyIds: ['ch19-exam-preparation-test-reasoning'] },
  {
    lessonSectionKey: 'practical-skills-component',
    conceptFamilyIds: ['ch19-practical-exam-safety-readiness', 'ch19-licensing-requirements-verification'],
  },
  {
    lessonSectionKey: 'school-to-employment-evidence',
    conceptFamilyIds: ['ch19-employment-readiness-professionalism', 'ch19-resume-portfolio-application-materials'],
  },
  {
    lessonSectionKey: 'research-shop',
    conceptFamilyIds: ['ch19-job-search-shop-research-interview', 'ch19-employment-readiness-professionalism'],
  },
  {
    lessonSectionKey: 'interview-professionally',
    conceptFamilyIds: ['ch19-job-search-shop-research-interview', 'ch19-employment-law-contracts-compliance'],
  },
  { lessonSectionKey: 'read-before-agree', conceptFamilyIds: ['ch19-employment-law-contracts-compliance'] },
  {
    lessonSectionKey: 'career-launch-checklist',
    conceptFamilyIds: [
      'ch19-licensing-requirements-verification',
      'ch19-exam-preparation-test-reasoning',
      'ch19-practical-exam-safety-readiness',
      'ch19-employment-readiness-professionalism',
      'ch19-resume-portfolio-application-materials',
      'ch19-job-search-shop-research-interview',
      'ch19-employment-law-contracts-compliance',
    ],
  },
] as const

// Chapter 19 remains one legacy runtime lesson shell in C19-1.
// The semantic section mapping above carries the real multi-concept coverage;
// this single binding avoids inventing runtime section IDs.
export const chapter19ContentConceptMappings: readonly Chapter19ContentConceptMapping[] = [
  { contentBlockId: 'chapter-19-lesson', conceptFamilyId: 'ch19-employment-readiness-professionalism' },
] as const

const flashcardConceptFamilyById = {
  'fc-ch19-001': 'ch19-licensing-requirements-verification',
  'fc-ch19-002': 'ch19-employment-readiness-professionalism',
  'fc-ch19-003': 'ch19-job-search-shop-research-interview',
  'fc-ch19-004': 'ch19-licensing-requirements-verification',
  'fc-ch19-005': 'ch19-licensing-requirements-verification',
  'fc-ch19-006': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-007': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-008': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-009': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-010': 'ch19-licensing-requirements-verification',
  'fc-ch19-011': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-012': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-013': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-014': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-015': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-016': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-017': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-018': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-019': 'ch19-exam-preparation-test-reasoning',
  'fc-ch19-020': 'ch19-licensing-requirements-verification',
  'fc-ch19-021': 'ch19-licensing-requirements-verification',
  'fc-ch19-022': 'ch19-practical-exam-safety-readiness',
  'fc-ch19-023': 'ch19-practical-exam-safety-readiness',
  'fc-ch19-024': 'ch19-practical-exam-safety-readiness',
  'fc-ch19-025': 'ch19-practical-exam-safety-readiness',
  'fc-ch19-026': 'ch19-employment-readiness-professionalism',
  'fc-ch19-027': 'ch19-employment-readiness-professionalism',
  'fc-ch19-028': 'ch19-employment-readiness-professionalism',
  'fc-ch19-029': 'ch19-employment-readiness-professionalism',
  'fc-ch19-030': 'ch19-job-search-shop-research-interview',
  'fc-ch19-031': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-032': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-033': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-034': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-035': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-036': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-037': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-038': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-039': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-040': 'ch19-job-search-shop-research-interview',
  'fc-ch19-041': 'ch19-job-search-shop-research-interview',
  'fc-ch19-042': 'ch19-job-search-shop-research-interview',
  'fc-ch19-043': 'ch19-resume-portfolio-application-materials',
  'fc-ch19-044': 'ch19-job-search-shop-research-interview',
  'fc-ch19-045': 'ch19-job-search-shop-research-interview',
  'fc-ch19-046': 'ch19-job-search-shop-research-interview',
  'fc-ch19-047': 'ch19-job-search-shop-research-interview',
  'fc-ch19-048': 'ch19-job-search-shop-research-interview',
  'fc-ch19-049': 'ch19-job-search-shop-research-interview',
  'fc-ch19-050': 'ch19-job-search-shop-research-interview',
  'fc-ch19-051': 'ch19-job-search-shop-research-interview',
  'fc-ch19-052': 'ch19-job-search-shop-research-interview',
  'fc-ch19-053': 'ch19-job-search-shop-research-interview',
  'fc-ch19-054': 'ch19-job-search-shop-research-interview',
  'fc-ch19-055': 'ch19-job-search-shop-research-interview',
  'fc-ch19-056': 'ch19-employment-law-contracts-compliance',
  'fc-ch19-057': 'ch19-employment-law-contracts-compliance',
  'fc-ch19-058': 'ch19-employment-law-contracts-compliance',
  'fc-ch19-059': 'ch19-employment-law-contracts-compliance',
  'fc-ch19-060': 'ch19-resume-portfolio-application-materials',
} as const satisfies Record<string, Chapter19ConceptFamilyId>

export const chapter19FlashcardConceptMappings: readonly Chapter19FlashcardConceptMapping[] =
  chapter19PremiumFlashcards.map((card) => {
    const conceptFamilyId = flashcardConceptFamilyById[card.id as keyof typeof flashcardConceptFamilyById]
    if (!conceptFamilyId) throw new Error(`Unknown Chapter 19 flashcard mapping: ${card.id}`)
    return { flashcardId: card.id as `fc-ch19-${string}`, conceptFamilyId }
  })

const assessmentQuestionConceptFamily = {
  'qq-19-01': 'ch19-licensing-requirements-verification',
  'qq-19-02': 'ch19-exam-preparation-test-reasoning',
  'qq-19-03': 'ch19-practical-exam-safety-readiness',
  'qq-19-04': 'ch19-employment-readiness-professionalism',
  'qq-19-05': 'ch19-employment-readiness-professionalism',
  'qq-19-06': 'ch19-employment-readiness-professionalism',
  'qq-19-07': 'ch19-resume-portfolio-application-materials',
  'qq-19-08': 'ch19-resume-portfolio-application-materials',
  'qq-19-09': 'ch19-resume-portfolio-application-materials',
  'qq-19-10': 'ch19-job-search-shop-research-interview',
  'qq-19-11': 'ch19-job-search-shop-research-interview',
  'qq-19-12': 'ch19-job-search-shop-research-interview',
  'qq-19-13': 'ch19-job-search-shop-research-interview',
  'qq-19-14': 'ch19-employment-law-contracts-compliance',
  'qq-19-15': 'ch19-employment-law-contracts-compliance',
} as const satisfies Record<string, Chapter19ConceptFamilyId>

export const chapter19QuizQuestionConceptMappings: readonly Chapter19QuizQuestionConceptMapping[] =
  chapter19PremiumQuizQuestions.map((question) => {
    const conceptFamilyId = assessmentQuestionConceptFamily[question.id as keyof typeof assessmentQuestionConceptFamily]
    if (!conceptFamilyId) throw new Error(`Unknown Chapter 19 assessment mapping: ${question.id}`)
    return { questionId: question.id as `qq-19-${string}`, conceptFamilyId }
  })



export const chapter19RemediationContentConceptMappings: readonly Chapter19ContentConceptMapping[] =
  [
    'ch19-licensing-requirements-verification',
    'ch19-exam-preparation-test-reasoning',
    'ch19-practical-exam-safety-readiness',
    'ch19-employment-readiness-professionalism',
    'ch19-resume-portfolio-application-materials',
    'ch19-job-search-shop-research-interview',
    'ch19-employment-law-contracts-compliance',
  ].map((conceptFamilyId) => ({
    contentBlockId: 'chapter-19-lesson',
    conceptFamilyId,
  })) as readonly Chapter19ContentConceptMapping[]

export const chapter19MicroCheckPlacements: readonly Chapter19MicroCheckPlacement[] = [
  {
    id: 'mc-19-01',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-licensing-requirements-verification',
    plannedQuestionCount: 2,
    purpose: 'Check jurisdiction-specific licensing verification and official-source reasoning.',
  },
  {
    id: 'mc-19-02',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-exam-preparation-test-reasoning',
    plannedQuestionCount: 2,
    purpose: 'Check test reasoning, question interpretation, and study-strategy application.',
  },
  {
    id: 'mc-19-03',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-practical-exam-safety-readiness',
    plannedQuestionCount: 2,
    purpose: 'Check practical-exam procedure verification, infection control, and service-safety readiness.',
  },
  {
    id: 'mc-19-04',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-employment-readiness-professionalism',
    plannedQuestionCount: 2,
    purpose: 'Check integrity, work ethic, self-assessment, and professional behavior.',
  },
  {
    id: 'mc-19-05',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-resume-portfolio-application-materials',
    plannedQuestionCount: 2,
    purpose: 'Check accurate résumé, portfolio, cover-letter, and application decisions.',
  },
  {
    id: 'mc-19-06',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-job-search-shop-research-interview',
    plannedQuestionCount: 2,
    purpose: 'Check employer research, interview preparation, professional presentation, and follow-up.',
  },
  {
    id: 'mc-19-07',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-employment-law-contracts-compliance',
    plannedQuestionCount: 2,
    purpose: 'Check legal/compliance caution, interview-law boundaries, and agreement review without misclassifying them as bodily safety.',
  },
] as const

export function getChapter19RemediationContentBlocksForConcept(
  conceptFamilyId: Chapter19ConceptFamilyId,
) {
  return chapter19RemediationContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter19FlashcardsForConcept(conceptFamilyId: Chapter19ConceptFamilyId) {
  return chapter19FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter19QuizQuestionsForConcept(conceptFamilyId: Chapter19ConceptFamilyId) {
  return chapter19QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}

export function getChapter19LessonSectionsForConcept(conceptFamilyId: Chapter19ConceptFamilyId) {
  return chapter19LessonSectionConceptMappings
    .filter((mapping) => mapping.conceptFamilyIds.includes(conceptFamilyId))
    .map((mapping) => mapping.lessonSectionKey)
}
