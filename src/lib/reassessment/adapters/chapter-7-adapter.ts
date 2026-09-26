import {
  chapter7QuizQuestionConceptMappings,
  chapter7ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-7-concepts/mappings'
import type { ConceptId, QuizQuestionId, ChapterId, ICanonicalMappingProvider } from '@/lib/reassessment/types'

export class Chapter7MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-7'
  private readonly questionToConceptMap = new Map<QuizQuestionId, ConceptId>()
  private readonly conceptToQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()

  constructor() {
    for (const mapping of [
      ...chapter7QuizQuestionConceptMappings,
      ...chapter7ReassessmentQuestionConceptMappings,
    ]) {
      const questionId = mapping.questionId as string
      const conceptId = mapping.conceptFamilyId as string
      this.questionToConceptMap.set(questionId, conceptId)
      this.conceptToQuestionsMap.set(
        conceptId,
        [...(this.conceptToQuestionsMap.get(conceptId) ?? []), questionId],
      )
    }
  }

  getConceptForQuestion(questionId: QuizQuestionId) {
    return this.questionToConceptMap.get(questionId)
  }

  getQuestionsForConcept(conceptId: ConceptId) {
    return this.conceptToQuestionsMap.get(conceptId) ?? []
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

let instance: Chapter7MappingProvider | null = null

export function getChapter7MappingProvider() {
  return instance ??= new Chapter7MappingProvider()
}

export function resetChapter7MappingProvider() {
  instance = null
}
