import { chapter12QuizQuestionConceptMappings } from '@/lib/chapter-12-concepts/mappings'
import { chapter12ReassessmentReserve } from '@/lib/chapter-12-concepts/reassessment-reserve'
import type {
  ConceptId,
  QuizQuestionId,
  ChapterId,
  ICanonicalMappingProvider,
} from '@/lib/reassessment/types'

export class Chapter12MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-12'
  private readonly questionToConceptMap = new Map<QuizQuestionId, ConceptId>()
  private readonly conceptToQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()
  private readonly conceptToReserveQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()

  constructor() {
    const mappings = [
      ...chapter12QuizQuestionConceptMappings.map((mapping) => ({
        questionId: mapping.questionId as string,
        conceptId: mapping.conceptFamilyId as string,
      })),
      ...chapter12ReassessmentReserve.map((question) => ({
        questionId: question.id as string,
        conceptId: question.conceptFamilyId as string,
      })),
    ]

    for (const mapping of mappings) {
      this.questionToConceptMap.set(mapping.questionId, mapping.conceptId)
      this.conceptToQuestionsMap.set(
        mapping.conceptId,
        [...(this.conceptToQuestionsMap.get(mapping.conceptId) ?? []), mapping.questionId],
      )
    }

    for (const question of chapter12ReassessmentReserve) {
      const conceptId = question.conceptFamilyId as string
      this.conceptToReserveQuestionsMap.set(
        conceptId,
        [...(this.conceptToReserveQuestionsMap.get(conceptId) ?? []), question.id],
      )
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

let instance: Chapter12MappingProvider | null = null
export function getChapter12MappingProvider() {
  return instance ??= new Chapter12MappingProvider()
}
export function resetChapter12MappingProvider() {
  instance = null
}
