import type { SourceProvenance, ExamRelevance, ConceptImportance, ProfessionalRelevance, ConceptStatus } from '../chapter-2-concepts/types'

export type Chapter1ConceptFamilyId =
  | 'ch1-origins-culture'
  | 'ch1-barber-surgeons-symbols'
  | 'ch1-tools-technology'
  | 'ch1-licensing-organizations'
  | 'ch1-modern-profession'

export type Chapter1LearningObjectiveId = `LO-1-${'01'|'02'|'03'|'04'|'05'}`
export type Chapter1FlashcardId = `fc-1-${string}`
export type Chapter1QuizQuestionId = `qq-1-${string}`

export interface Chapter1LearningObjective { id:Chapter1LearningObjectiveId; statement:string; sourceBasis:string; conceptFamilyIds:readonly Chapter1ConceptFamilyId[] }
export interface Chapter1ConceptFamily {
 id:Chapter1ConceptFamilyId; name:string; learningObjectiveIds:readonly Chapter1LearningObjectiveId[]; learningObjectiveId:Chapter1LearningObjectiveId;
 description:string; importance:ConceptImportance; professionalRelevance:ProfessionalRelevance; examRelevance:ExamRelevance; sourceProvenance:SourceProvenance; status:ConceptStatus
}
export interface Chapter1ContentConceptMapping {contentBlockId:string; conceptFamilyId:Chapter1ConceptFamilyId}
export interface Chapter1FlashcardConceptMapping {flashcardId:Chapter1FlashcardId; conceptFamilyId:Chapter1ConceptFamilyId}
export interface Chapter1QuizQuestionConceptMapping {questionId:Chapter1QuizQuestionId; conceptFamilyId:Chapter1ConceptFamilyId}
