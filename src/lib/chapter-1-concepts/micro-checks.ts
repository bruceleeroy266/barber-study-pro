import type { Chapter1ConceptFamilyId } from './types'
import type { Chapter1Difficulty, Chapter1EvidenceRecord } from './grading'

export type Chapter1MicroCheckAnswer='a'|'b'|'c'|'d'
export interface Chapter1MicroCheckQuestion {
 id:`mcq-1-${string}`; conceptFamilyId:Chapter1ConceptFamilyId; difficulty:Exclude<Chapter1Difficulty,'recall'>;
 question:string; answer_a:string; answer_b:string; answer_c:string; answer_d:string;
 correctAnswer:Chapter1MicroCheckAnswer; explanation:string
}
export interface Chapter1MicroCheck {
 id:`mc-1-${string}`; afterSectionId:string; conceptFamilyId:Chapter1ConceptFamilyId; title:string;
 questions:readonly Chapter1MicroCheckQuestion[]
}
const q=(id:Chapter1MicroCheckQuestion['id'],conceptFamilyId:Chapter1ConceptFamilyId,difficulty:Chapter1MicroCheckQuestion['difficulty'],question:string,answer_a:string,answer_b:string,answer_c:string,answer_d:string,correctAnswer:Chapter1MicroCheckAnswer,explanation:string):Chapter1MicroCheckQuestion=>({id,conceptFamilyId,difficulty,question,answer_a,answer_b,answer_c,answer_d,correctAnswer,explanation})

export const chapter1MicroChecks:readonly Chapter1MicroCheck[]=[
{id:'mc-1-01',afterSectionId:'ancient-origins',conceptFamilyId:'ch1-origins-culture',title:'Origins & Culture Check',questions:[
q('mcq-1-001','ch1-origins-culture','understanding','What does the Latin word barba mean?','Beard.','Scissors.','Surgeon.','Shop.','a','The profession name traces to the Latin barba, meaning beard.'),
q('mcq-1-002','ch1-origins-culture','application','Why did Alexander the Great order soldiers to shave?','To reduce the risk of enemies grabbing their beards in combat.','To mark them as priests.','To avoid a beard tax.','To copy Egyptian priests.','a','The lesson connects shaving to a military tactical advantage.')
]},
{id:'mc-1-02',afterSectionId:'barber-pole-guild',conceptFamilyId:'ch1-barber-surgeons-symbols',title:'Barber-Surgeon & Symbolism Check',questions:[
q('mcq-1-003','ch1-barber-surgeons-symbols','understanding','What historical practice is most closely tied to the traditional red-and-white barber pole?','Bloodletting and bandaging.','Electric clipper repair.','Hair coloring.','Licensing exams.','a','The pole developed from the barber-surgeon era and bloodletting traditions.'),
q('mcq-1-004','ch1-barber-surgeons-symbols','application','Which statement best explains the 1745 milestone?','Surgeons formally separated from barbers in England.','Minnesota passed the first barber law.','NABBA was founded.','The first electric clipper was invented.','a','1745 marks the formal separation of surgeons from barbers in the chapter history.')
]},
{id:'mc-1-03',afterSectionId:'tool-evolution',conceptFamilyId:'ch1-tools-technology',title:'Tools & Technology Check',questions:[
q('mcq-1-005','ch1-tools-technology','understanding','Which progression best reflects barbering tool development?','Primitive cutting materials → metal shears and razors → powered clippers.','Electric clippers → flint blades → bronze tools.','Safety razors → stone tools → scissors.','Modern cordless clippers → shell blades → straight razors.','a','The chapter presents tool development as a long progression from simple cutting materials to modern powered equipment.'),
q('mcq-1-006','ch1-tools-technology','application','Which name is associated with early practical electric hair clippers?','Leo J. Wahl.','Pythagoras.','Ticinius Mena.','Alexander the Great.','a','Wahl is associated with practical electric clipper development in the chapter materials.')
]},
{id:'mc-1-04',afterSectionId:'why-licensing',conceptFamilyId:'ch1-licensing-organizations',title:'Licensing & Organizations Check',questions:[
q('mcq-1-007','ch1-licensing-organizations','understanding','Which state passed the first barber licensing law in 1897?','Minnesota.','Oklahoma.','New York.','California.','a','Chapter 1 identifies Minnesota in 1897 as the first state barber licensing law.'),
q('mcq-1-008','ch1-licensing-organizations','application','What is the strongest reason modern barber licensing exists?','To protect the public through education, sanitation, safety, and competency standards.','To standardize haircut prices.','To replace shop sanitation rules.','To preserve historical trivia.','a','The lesson connects licensing to public protection and professional standards.')
]},
{id:'mc-1-05',afterSectionId:'modern-standards',conceptFamilyId:'ch1-modern-profession',title:'Modern Profession Check',questions:[
q('mcq-1-009','ch1-modern-profession','understanding','Which statement best connects barbering history to modern practice?','History helps explain current professional identity, regulation, symbols, and standards.','History replaces current safety rules.','History matters only to museums.','History has no relationship to professional practice.','a','The chapter uses history to explain how the modern profession developed.'),
q('mcq-1-010','ch1-modern-profession','scenario','A student says studying Chapter 1 cannot help professional practice. What is the best correction?','It explains how regulation, client trust, professional identity, and industry standards developed over time.','It only teaches obsolete haircut techniques.','It eliminates the need to learn current rules.','It matters only for antique tool collectors.','a','Historical context supports professional understanding even when modern practice follows current rules.')
]},
]

export interface Chapter1MicroCheckResponse{questionId:Chapter1MicroCheckQuestion['id'];selectedAnswer:Chapter1MicroCheckAnswer}
export function buildChapter1MicroCheckEvidence(studentId:string,responses:readonly Chapter1MicroCheckResponse[],timestamp:string):Chapter1EvidenceRecord[]{
 const map=new Map(chapter1MicroChecks.flatMap(check=>check.questions.map(question=>[question.id,question] as const)))
 const seen=new Set<string>(); const out:Chapter1EvidenceRecord[]=[]
 for(const response of responses){if(seen.has(response.questionId))continue; const question=map.get(response.questionId); if(!question)continue; seen.add(response.questionId); out.push({studentId,chapterId:'ch-1',conceptFamilyId:question.conceptFamilyId,source:'micro_check',itemId:question.id,difficulty:question.difficulty,correct:response.selectedAnswer===question.correctAnswer,attemptPhase:'initial',timestamp})}
 return out
}
