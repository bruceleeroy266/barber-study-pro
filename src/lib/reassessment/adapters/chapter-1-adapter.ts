import {
  chapter1QuizQuestionConceptMappings,
  chapter1ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-1-concepts/mappings'
import type { ConceptId, QuizQuestionId, ChapterId, ICanonicalMappingProvider } from '@/lib/reassessment/types'

export class Chapter1MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-1'
  private readonly questionToConceptMap = new Map<QuizQuestionId, ConceptId>()
  private readonly conceptToQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()
  private readonly conceptToReserveQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()

  constructor() {
    for (const mapping of [...chapter1QuizQuestionConceptMappings, ...chapter1ReassessmentQuestionConceptMappings]) {
      const q = mapping.questionId as string
      const c = mapping.conceptFamilyId as string
      this.questionToConceptMap.set(q, c)
      this.conceptToQuestionsMap.set(c, [...(this.conceptToQuestionsMap.get(c) ?? []), q])
    }
    for (const mapping of chapter1ReassessmentQuestionConceptMappings) {
      const q = mapping.questionId as string
      const c = mapping.conceptFamilyId as string
      this.conceptToReserveQuestionsMap.set(c, [...(this.conceptToReserveQuestionsMap.get(c) ?? []), q])
    }
  }
  getConceptForQuestion(questionId: QuizQuestionId){ return this.questionToConceptMap.get(questionId) }
  getQuestionsForConcept(conceptId: ConceptId){ return this.conceptToReserveQuestionsMap.get(conceptId) ?? [] }
  isQuestionMappedToConcept(questionId: QuizQuestionId, conceptId: ConceptId){ return this.questionToConceptMap.get(questionId) === conceptId }
  getAllConceptIds(){ return Array.from(this.conceptToQuestionsMap.keys()) }
  getAllQuestionIds(){ return Array.from(this.questionToConceptMap.keys()) }
}
let instance: Chapter1MappingProvider | null = null
export function getChapter1MappingProvider(){ return instance ??= new Chapter1MappingProvider() }
export function resetChapter1MappingProvider(){ instance = null }
