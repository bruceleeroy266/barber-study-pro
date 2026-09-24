import {
  chapter6QuizQuestionConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-6-concepts/mappings'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS } from '@/lib/chapter-6-concepts/concepts'
import { buildConceptEvidence, detectConceptState, type ConceptDetectionResult as BindingResult } from '@/lib/chapter-6-concepts/detection'
import type { Chapter6ConceptFamilyId } from '@/lib/chapter-6-concepts/types'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId, QuizQuestionId } from '../types'
import type { IConceptDetectionProvider, ConceptDetectionResult } from '../provider-registry'

export type FetchQuizAttemptsCallback = (attemptIds: string[]) => Promise<QuizAttempt[]>
export interface Chapter6DetectionProviderConfig { fetchQuizAttempts: FetchQuizAttemptsCallback }

export class Chapter6DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-6'
  private readonly conceptToQuestionsMap = new Map<ConceptId, Set<QuizQuestionId>>()
  private readonly validConceptIds = new Set<ConceptId>(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS as readonly string[])
  constructor(private readonly config: Chapter6DetectionProviderConfig) {
    for (const mapping of [...chapter6QuizQuestionConceptMappings, ...chapter6ReassessmentQuestionConceptMappings]) {
      const c=mapping.conceptFamilyId as string, q=mapping.questionId as string
      const set=this.conceptToQuestionsMap.get(c) ?? new Set<QuizQuestionId>(); set.add(q); this.conceptToQuestionsMap.set(c,set)
    }
  }
  async detectConceptState(conceptId: ConceptId, evidenceIds: string[]): Promise<ConceptDetectionResult|null> {
    if(!this.validConceptIds.has(conceptId)) return null
    const attempts=await this.config.fetchQuizAttempts(evidenceIds)
    if(!attempts.length) return null
    const allowed=this.conceptToQuestionsMap.get(conceptId)
    if(!allowed?.size) return null
    const filtered=attempts.map(a=>({...a,answers_json:Object.fromEntries(Object.entries(a.answers_json).filter(([id])=>allowed.has(id)))}))
    const evidence=buildConceptEvidence(conceptId as Chapter6ConceptFamilyId, filtered)
    const result=detectConceptState(evidence)
    return this.map(result)
  }
  private map(result: BindingResult): ConceptDetectionResult { return {conceptId:result.conceptId,state:result.state,confidence:result.confidence,evidence:result.evidence} }
  isValidConcept(conceptId: ConceptId){ return this.validConceptIds.has(conceptId) }
}
export function createChapter6DetectionProvider(config: Chapter6DetectionProviderConfig){ return new Chapter6DetectionProvider(config) }
