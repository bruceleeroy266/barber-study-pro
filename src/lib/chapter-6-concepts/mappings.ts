import type { Chapter6ConceptFamilyId,Chapter6ContentConceptMapping,Chapter6FlashcardConceptMapping,Chapter6QuizQuestionConceptMapping } from './types'

const range=(start:number,end:number)=>Array.from({length:end-start+1},(_,i)=>start+i)
const fc=(ids:number[],conceptFamilyId:Chapter6ConceptFamilyId):Chapter6FlashcardConceptMapping[]=>ids.map(n=>({flashcardId:`fc-6-${String(n).padStart(3,'0')}`,conceptFamilyId}))
const qq=(ids:number[],conceptFamilyId:Chapter6ConceptFamilyId):Chapter6QuizQuestionConceptMapping[]=>ids.map(n=>({questionId:`qq-6-${String(n).padStart(3,'0')}`,conceptFamilyId}))
const cb=(ids:string[],conceptFamilyId:Chapter6ConceptFamilyId):Chapter6ContentConceptMapping[]=>ids.map(contentBlockId=>({contentBlockId,conceptFamilyId}))

export const chapter6ContentConceptMappings:readonly Chapter6ContentConceptMapping[]=[
  ...cb(['cells-tissues'],'ch6-cells-tissues'),
  ...cb(['body-systems'],'ch6-body-systems'),
  ...cb(['skeletal-system'],'ch6-skeletal'),
  ...cb(['muscular-system'],'ch6-muscular'),
  ...cb(['nervous-system'],'ch6-nervous'),
  ...cb(['circulatory-system'],'ch6-cardiovascular'),
  ...cb(['lymphatic-system'],'ch6-lymphatic'),
  ...cb(['integumentary-system'],'ch6-integumentary'),
  ...cb(['endocrine-system'],'ch6-endocrine'),
  ...cb(['other-systems'],'ch6-other-systems'),
]

/**
 * Stable IDs are assigned to the existing enhanced deck by its canonical
 * concatenation order in chapter6AllEnhanced. The source cards do not yet
 * carry IDs, so these mappings deliberately lock that order until C6-2/C6-3
 * normalize the deck into premium Flashcard records.
 */
export const chapter6FlashcardConceptMappings:readonly Chapter6FlashcardConceptMapping[]=[
  ...fc(range(1,12),'ch6-cells-tissues'),
  ...fc(range(13,22),'ch6-body-systems'),
  ...fc(range(23,34),'ch6-skeletal'),
  ...fc(range(35,46),'ch6-muscular'),
  ...fc(range(47,58),'ch6-nervous'),
  ...fc(range(59,70),'ch6-cardiovascular'),
  ...fc(range(71,80),'ch6-lymphatic'),
  ...fc(range(81,90),'ch6-integumentary'),
  ...fc(range(91,98),'ch6-endocrine'),
  ...fc(range(99,105),'ch6-other-systems'),
].sort((a,b)=>a.flashcardId.localeCompare(b.flashcardId))

export const chapter6QuizQuestionConceptMappings:readonly Chapter6QuizQuestionConceptMapping[]=[
  ...qq(range(1,6),'ch6-cells-tissues'),
  ...qq(range(7,10),'ch6-body-systems'),
  ...qq(range(11,15),'ch6-skeletal'),
  ...qq(range(16,20),'ch6-muscular'),
  ...qq(range(21,25),'ch6-nervous'),
  ...qq(range(26,30),'ch6-cardiovascular'),
  ...qq(range(31,34),'ch6-lymphatic'),
  ...qq(range(35,40),'ch6-integumentary'),
  ...qq(range(41,45),'ch6-endocrine'),
  ...qq(range(46,50),'ch6-other-systems'),
].sort((a,b)=>a.questionId.localeCompare(b.questionId))

export const chapter6ReassessmentQuestionConceptMappings:readonly Chapter6QuizQuestionConceptMapping[]=[
  ...qq(range(51,65),'ch6-cells-tissues'),
  ...qq(range(66,80),'ch6-body-systems'),
  ...qq(range(81,95),'ch6-skeletal'),
  ...qq(range(96,110),'ch6-muscular'),
  ...qq(range(111,125),'ch6-nervous'),
  ...qq(range(126,140),'ch6-cardiovascular'),
  ...qq(range(141,155),'ch6-lymphatic'),
  ...qq(range(156,170),'ch6-integumentary'),
  ...qq(range(171,185),'ch6-endocrine'),
  ...qq(range(186,200),'ch6-other-systems'),
].sort((a,b)=>a.questionId.localeCompare(b.questionId))

export const CHAPTER6_MIN_DIAGNOSTIC_QUESTIONS_PER_CONCEPT=3

export function getChapter6ConceptForFlashcard(id:string):Chapter6ConceptFamilyId|null {
  return chapter6FlashcardConceptMappings.find(x=>x.flashcardId===id)?.conceptFamilyId??null
}
export function getChapter6ConceptForQuizQuestion(id:string):Chapter6ConceptFamilyId|null {
  return chapter6QuizQuestionConceptMappings.find(x=>x.questionId===id)?.conceptFamilyId??null
}
export function getChapter6QuizEvidenceCount(conceptFamilyId:Chapter6ConceptFamilyId):number {
  return chapter6QuizQuestionConceptMappings.filter(x=>x.conceptFamilyId===conceptFamilyId).length
}
export function getChapter6FlashcardEvidenceCount(conceptFamilyId:Chapter6ConceptFamilyId):number {
  return chapter6FlashcardConceptMappings.filter(x=>x.conceptFamilyId===conceptFamilyId).length
}
