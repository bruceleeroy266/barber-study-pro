import {
  chapter8QuizQuestionConceptMappings,
} from '@/lib/chapter-8-concepts/mappings'
import { chapter8ReassessmentReserve } from '@/lib/chapter-8-concepts/reassessment-reserve'
import type { ConceptId, QuizQuestionId, ChapterId, ICanonicalMappingProvider } from '@/lib/reassessment/types'

export class Chapter8MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-8'
  private readonly questionToConceptMap = new Map<QuizQuestionId, ConceptId>()
  private readonly conceptToQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()
  private readonly conceptToReserveQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()

  constructor() {
    const mappings = [
      ...chapter8QuizQuestionConceptMappings.map((mapping) => ({
        questionId: mapping.questionId as string,
        conceptId: mapping.conceptFamilyId as string,
      })),
      ...chapter8ReassessmentReserve.map((question) => ({
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

    for (const question of chapter8ReassessmentReserve) {
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
    // C8-7 formal remediation must draw only from the locked unseen reserve.
    // Initial-assessment questions remain in questionToConceptMap so historical
    // evidence can still be resolved semantically, but they are never eligible
    // for reassessment selection.
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

let instance: Chapter8MappingProvider | null = null

export function getChapter8MappingProvider() {
  return instance ??= new Chapter8MappingProvider()
}

export function resetChapter8MappingProvider() {
  instance = null
}
