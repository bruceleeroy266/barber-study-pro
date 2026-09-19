import type { SourceProvenance, ExamRelevance, ConceptImportance, ProfessionalRelevance, ConceptStatus } from '../chapter-2-concepts/types'

export type Chapter5ConceptFamilyId = 'ch5-combs-brushes' | 'ch5-shears-cutting' | 'ch5-clippers-trimmers' | 'ch5-razors' | 'ch5-thermal-electrical' | 'ch5-equipment-safety'
export type Chapter5LearningObjectiveId = `LO-5-0${1|2|3|4|5|6}`
export type Chapter5FlashcardId = `fc-5-${string}`
export type Chapter5QuizQuestionId = `qq-5-${string}`
export interface Chapter5LearningObjective { id:Chapter5LearningObjectiveId; statement:string; sourceBasis:string; conceptFamilyIds:readonly Chapter5ConceptFamilyId[] }
export interface Chapter5ConceptFamily { id:Chapter5ConceptFamilyId; name:string; learningObjectiveIds:readonly Chapter5LearningObjectiveId[]; learningObjectiveId:Chapter5LearningObjectiveId; description:string; importance:ConceptImportance; professionalRelevance:ProfessionalRelevance; examRelevance:ExamRelevance; sourceProvenance:SourceProvenance; status:ConceptStatus }
export interface Chapter5FlashcardConceptMapping { flashcardId:Chapter5FlashcardId; conceptFamilyId:Chapter5ConceptFamilyId }
export interface Chapter5QuizQuestionConceptMapping { questionId:Chapter5QuizQuestionId; conceptFamilyId:Chapter5ConceptFamilyId }
