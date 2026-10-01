import { chapter21QuizQuestionConceptMappings } from '@/lib/chapter-21-concepts/mappings'
import { chapter21ReassessmentReserve } from '@/lib/chapter-21-concepts/reassessment-reserve'
import type {
  ConceptId,
  QuizQuestionId,
  ChapterId,
  ICanonicalMappingProvider,
} from '@/lib/reassessment/types'

export class Chapter21MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-21'
  private readonly questionToConceptMap = new Map<QuizQuestionId, ConceptId>()
  private readonly conceptToQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()
  private readonly conceptToReserveQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()

  constructor() {
    const mappings = [
      ...chapter21QuizQuestionConceptMappings.map((mapping) => ({
        questionId: mapping.questionId as string,
        conceptId: mapping.conceptFamilyId as string,
      })),
      ...chapter21ReassessmentReserve.map((question) => ({
        questionId: question.id as string,
        conceptId: question.conceptFamilyId as string,
      })),
    ]

    for (const mapping of mappings) {
      this.questionToConceptMap.set(mapping.questionId, mapping.conceptId)
      this.conceptToQuestionsMap.set(mapping.conceptId, [
        ...(this.conceptToQuestionsMap.get(mapping.conceptId) ?? []),
        mapping.questionId,
      ])
    }

    for (const question of chapter21ReassessmentReserve) {
      const conceptId = question.conceptFamilyId as string
      this.conceptToReserveQuestionsMap.set(conceptId, [
        ...(this.conceptToReserveQuestionsMap.get(conceptId) ?? []),
        question.id,
      ])
    }
  }

  getConceptForQuestion(questionId: QuizQuestionId) {
    return this.questionToConceptMap.get(questionId)
  }

  getQuestionsForConcept(conceptId: ConceptId) {
    return this.conceptToReserveQuestionsMap.get(conceptId) ?? []
  }

  isQuestionMappedToConcept(questionId: QuizQuestionId, conceptId: ConceptId) {
    return this.questionToConceptMap.get(questionId) === conceptId
  }

  getAllConceptIds() {
    return Array.from(this.conceptToQuestionsMap.keys())
  }

  getAllQuestionIds() {
    return Array.from(this.questionToConceptMap.keys())
  }
}

let instance: Chapter21MappingProvider | null = null

export function getChapter21MappingProvider() {
  return (instance ??= new Chapter21MappingProvider())
}

export function resetChapter21MappingProvider() {
  instance = null
}
