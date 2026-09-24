import {
  chapter6QuizQuestionConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-6-concepts/mappings'
import type { ConceptId, QuizQuestionId, ChapterId, ICanonicalMappingProvider } from '@/lib/reassessment/types'

export class Chapter6MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-6'
  private readonly questionToConceptMap = new Map<QuizQuestionId, ConceptId>()
  private readonly conceptToQuestionsMap = new Map<ConceptId, QuizQuestionId[]>()

  constructor() {
    for (const mapping of [...chapter6QuizQuestionConceptMappings, ...chapter6ReassessmentQuestionConceptMappings]) {
      const q = mapping.questionId as string
      const c = mapping.conceptFamilyId as string
      this.questionToConceptMap.set(q, c)
      this.conceptToQuestionsMap.set(c, [...(this.conceptToQuestionsMap.get(c) ?? []), q])
    }
  }
  getConceptForQuestion(questionId: QuizQuestionId){ return this.questionToConceptMap.get(questionId) }
  getQuestionsForConcept(conceptId: ConceptId){ return this.conceptToQuestionsMap.get(conceptId) ?? [] }
  isQuestionMappedToConcept(questionId: QuizQuestionId, conceptId: ConceptId){ return this.questionToConceptMap.get(questionId) === conceptId }
  getAllConceptIds(){ return Array.from(this.conceptToQuestionsMap.keys()) }
  getAllQuestionIds(){ return Array.from(this.questionToConceptMap.keys()) }
}
let instance: Chapter6MappingProvider | null = null
export function getChapter6MappingProvider(){ return instance ??= new Chapter6MappingProvider() }
export function resetChapter6MappingProvider(){ instance = null }
