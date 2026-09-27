import type { Chapter1ConceptFamilyId, Chapter1ContentConceptMapping, Chapter1FlashcardConceptMapping, Chapter1QuizQuestionConceptMapping } from './types'

const fc=(ids:number[],conceptFamilyId:Chapter1ConceptFamilyId):Chapter1FlashcardConceptMapping[]=>ids.map(n=>({flashcardId:`fc-1-${String(n).padStart(3,'0')}`,conceptFamilyId}))
const qq=(ids:number[],conceptFamilyId:Chapter1ConceptFamilyId):Chapter1QuizQuestionConceptMapping[]=>ids.map(n=>({questionId:`qq-1-${String(n).padStart(3,'0')}`,conceptFamilyId}))
const cb=(ids:string[],conceptFamilyId:Chapter1ConceptFamilyId):Chapter1ContentConceptMapping[]=>ids.map(contentBlockId=>({contentBlockId,conceptFamilyId}))

export const chapter1ContentConceptMappings:readonly Chapter1ContentConceptMapping[]=[
 ...cb(['why-study','why-study-quote','ancient-origins','shaving-beard-culture'],'ch1-origins-culture'),
 ...cb(['bloodletting','medical-services','barber-pole-guild'],'ch1-barber-surgeons-symbols'),
 ...cb(['tool-evolution'],'ch1-tools-technology'),
 ...cb(['why-licensing','historical-milestones'],'ch1-licensing-organizations'),
 ...cb(['modern-requirements','modern-standards','legacy-quote'],'ch1-modern-profession'),
]

export const chapter1FlashcardConceptMappings:readonly Chapter1FlashcardConceptMapping[]=[
 ...fc([1,2,5,6,7,8,9,10,13,14,15,17,36,37,39,41,42],'ch1-origins-culture'),
 ...fc([4,12,19,20,23,24,25,27,30,31,38,43],'ch1-barber-surgeons-symbols'),
 ...fc([3,11,16,32,44,45],'ch1-tools-technology'),
 ...fc([18,21,22,28,29,33,34],'ch1-licensing-organizations'),
 ...fc([26,35,40],'ch1-modern-profession'),
].sort((a,b)=>a.flashcardId.localeCompare(b.flashcardId))

export const chapter1QuizQuestionConceptMappings:readonly Chapter1QuizQuestionConceptMapping[]=[
 ...qq([1,2,7,10,11,13,16,17,20,23,27,28],'ch1-origins-culture'),
 ...qq([4,9,12,21,22,25,26,29],'ch1-barber-surgeons-symbols'),
 ...qq([3,6,14,19],'ch1-tools-technology'),
 ...qq([5,8,15,24],'ch1-licensing-organizations'),
 ...qq([18,30],'ch1-modern-profession'),
].sort((a,b)=>a.questionId.localeCompare(b.questionId))

export const chapter1ReassessmentQuestionConceptMappings:readonly Chapter1QuizQuestionConceptMapping[]=[
 ...qq(Array.from({length:15},(_,i)=>31+i),'ch1-origins-culture'),
 ...qq(Array.from({length:15},(_,i)=>46+i),'ch1-barber-surgeons-symbols'),
 ...qq(Array.from({length:15},(_,i)=>61+i),'ch1-tools-technology'),
 ...qq(Array.from({length:15},(_,i)=>76+i),'ch1-licensing-organizations'),
 ...qq(Array.from({length:15},(_,i)=>91+i),'ch1-modern-profession'),
].sort((a,b)=>a.questionId.localeCompare(b.questionId))
