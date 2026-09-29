import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import type { Chapter17ConceptFamilyId } from './types'

export interface Chapter17ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter17ConceptFamilyId
}

export interface Chapter17FlashcardConceptMapping {
  flashcardId: `fc-ch17-${string}`
  conceptFamilyId: Chapter17ConceptFamilyId
}

export interface Chapter17QuizQuestionConceptMapping {
  questionId: `qq-17-${string}`
  conceptFamilyId: Chapter17ConceptFamilyId
}

export interface Chapter17LearningQuestionConceptMapping {
  questionId: `lq-17-${string}`
  conceptFamilyId: Chapter17ConceptFamilyId
}

export interface Chapter17MicroCheckPlacement {
  id: `mc-17-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter17ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

const competencyToConceptFamily = {
  'CH17-C01': 'ch17-consultation-hair-analysis',
  'CH17-C02': 'ch17-chemistry-bond-transformation',
  'CH17-C03': 'ch17-permanent-waving-procedures',
  'CH17-C04': 'ch17-chemical-relaxing-procedures',
  'CH17-C05': 'ch17-curl-reformation',
  'CH17-C06': 'ch17-safety-strand-tests-compatibility',
  'CH17-C07': 'ch17-texturizers-chemical-blowouts',
} as const satisfies Record<string, Chapter17ConceptFamilyId>

function conceptForCompetency(competencyId: string | undefined): Chapter17ConceptFamilyId {
  const concept = competencyId ? competencyToConceptFamily[competencyId as keyof typeof competencyToConceptFamily] : undefined
  if (!concept) throw new Error(`Unknown Chapter 17 competency mapping: ${competencyId ?? 'missing'}`)
  return concept
}

export const chapter17ContentConceptMappings: readonly Chapter17ContentConceptMapping[] = [
  ...['why-study','hair-analysis','texture-confidence','scenario-1','texture-reflection']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch17-consultation-hair-analysis' as const })),
  ...['what-is-texture','vocabulary-anchors','bond-science','compare-chemistries','memory-tricks']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch17-chemistry-bond-transformation' as const })),
  ...['perm-waves','perm-procedure','perm-service-check']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch17-permanent-waving-procedures' as const })),
  ...['relaxers','relaxer-procedure']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch17-chemical-relaxing-procedures' as const })),
  { contentBlockId: 'curl-reformation', conceptFamilyId: 'ch17-curl-reformation' },
  ...['tools-materials','relaxer-warning','safety-checklist','try-this','common-mistakes','instructor-tips','board-alerts']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch17-safety-strand-tests-compatibility' as const })),
  { contentBlockId: 'texturizers', conceptFamilyId: 'ch17-texturizers-chemical-blowouts' },
]

export const chapter17FlashcardConceptMappings: readonly Chapter17FlashcardConceptMapping[] =
  chapter17PremiumFlashcards.map((card) => ({
    flashcardId: card.id as `fc-ch17-${string}`,
    conceptFamilyId: conceptForCompetency(card.competency_id),
  }))

export const chapter17QuizQuestionConceptMappings: readonly Chapter17QuizQuestionConceptMapping[] =
  chapter17PremiumQuizQuestions.map((question) => ({
    questionId: question.id as `qq-17-${string}`,
    conceptFamilyId: conceptForCompetency(question.competency_id),
  }))

export const chapter17LearningQuestionConceptMappings: readonly Chapter17LearningQuestionConceptMapping[] =
  chapter17LearningQuestions.map((question) => ({
    questionId: question.id as `lq-17-${string}`,
    conceptFamilyId: conceptForCompetency(question.competency_id),
  }))

export const chapter17MicroCheckPlacements: readonly Chapter17MicroCheckPlacement[] = [
  {
    id: 'mc-17-01',
    afterSectionId: 'hair-analysis',
    conceptFamilyId: 'ch17-consultation-hair-analysis',
    plannedQuestionCount: 2,
    purpose: 'Check consultation, service history, texture, porosity, elasticity, density, and scalp-analysis decisions.',
  },
  {
    id: 'mc-17-02',
    afterSectionId: 'bond-science',
    conceptFamilyId: 'ch17-chemistry-bond-transformation',
    plannedQuestionCount: 2,
    purpose: 'Check reduction, bond rearrangement, oxidation/neutralization, and chemical-texture chemistry.',
  },
  {
    id: 'mc-17-03',
    afterSectionId: 'perm-service-check',
    conceptFamilyId: 'ch17-permanent-waving-procedures',
    plannedQuestionCount: 2,
    purpose: 'Check rod/wrap selection, test-curl decisions, rinsing, processing, and neutralization sequence.',
  },
  {
    id: 'mc-17-04',
    afterSectionId: 'relaxer-procedure',
    conceptFamilyId: 'ch17-chemical-relaxing-procedures',
    plannedQuestionCount: 2,
    purpose: 'Check relaxer type, base/no-base application, processing, rinsing, and finishing sequence.',
  },
  {
    id: 'mc-17-05',
    afterSectionId: 'curl-reformation',
    conceptFamilyId: 'ch17-curl-reformation',
    plannedQuestionCount: 2,
    purpose: 'Check the source-presented curl-reformation sequence and processing-risk considerations.',
  },
  {
    id: 'mc-17-06',
    afterSectionId: 'common-mistakes',
    conceptFamilyId: 'ch17-safety-strand-tests-compatibility',
    plannedQuestionCount: 2,
    purpose: 'Check contraindications, strand tests, chemical compatibility, protection, monitoring, and damage prevention.',
  },
  {
    id: 'mc-17-07',
    afterSectionId: 'texturizers',
    conceptFamilyId: 'ch17-texturizers-chemical-blowouts',
    plannedQuestionCount: 2,
    purpose: 'Check texturizer and chemical blowout outcomes and distinctions from full relaxing.',
  },
]

export function getChapter17ContentBlocksForConcept(conceptFamilyId: Chapter17ConceptFamilyId) {
  return chapter17ContentConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.contentBlockId)
}

export function getChapter17FlashcardsForConcept(conceptFamilyId: Chapter17ConceptFamilyId) {
  return chapter17FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.flashcardId)
}

export function getChapter17QuizQuestionsForConcept(conceptFamilyId: Chapter17ConceptFamilyId) {
  return chapter17QuizQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.questionId)
}
