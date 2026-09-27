import type { Chapter6Confidence, Chapter6Difficulty, Chapter6EvidenceRecord, Chapter6GradeResult } from './grading'
import { calculateChapter6ConceptMastery, calculateChapter6Grade } from './grading'
import type { Chapter6ConceptFamilyId } from './types'
import { CHAPTER6_CONCEPT_FAMILY_IDS, chapter6ConceptFamilies } from './concepts'
import { chapter6QuizQuestionConceptMappings, chapter6ReassessmentQuestionConceptMappings } from './mappings'
import { chapter6PremiumQuizQuestions } from '../chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from '../chapter-6-reassessment-questions'
import type { Chapter6MicroCheckAttemptRow } from './micro-check-persistence'
import { calculatePersistedChapter6MicroCheckPercent, chapter6MicroCheckRowsToEvidence } from './micro-check-persistence'

export interface Chapter6InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter6InstructorConceptDiagnostic {
  conceptFamilyId: Chapter6ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: Chapter6Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter6InstructorDiagnosticSummary {
  chapterGrade: Chapter6GradeResult
  overallMastery: number
  overallConfidence: Chapter6Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter6InstructorConceptDiagnostic[]
  weakestConcepts: Chapter6InstructorConceptDiagnostic[]
  concepts: Chapter6InstructorConceptDiagnostic[]
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const familySet=new Set<string>(CHAPTER6_CONCEPT_FAMILY_IDS)
const familyName=new Map(chapter6ConceptFamilies.map(f=>[f.id,f.name]))
const initialById=new Map(chapter6PremiumQuizQuestions.map(q=>[q.id,q]))
const reserveById=new Map(chapter6ReassessmentQuestions.map(q=>[q.id,q]))
const initialMap=new Map<string, Chapter6ConceptFamilyId>(chapter6QuizQuestionConceptMappings.map(m=>[m.questionId,m.conceptFamilyId]))
const reserveMap=new Map<string, Chapter6ConceptFamilyId>(chapter6ReassessmentQuestionConceptMappings.map(m=>[m.questionId,m.conceptFamilyId]))

function isFamily(value:string|null|undefined):value is Chapter6ConceptFamilyId{return !!value&&familySet.has(value)}
function isAnswer(value:unknown):value is 'a'|'b'|'c'|'d'{return value==='a'||value==='b'||value==='c'||value==='d'}
function difficulty(value:string|null|undefined):Chapter6Difficulty{
  if(value==='hard') return 'scenario'
  if(value==='medium') return 'application'
  return 'understanding'
}

export function chapter6InitialAssessmentToEvidence(studentId:string,attempts:readonly Chapter6InstructorQuizAttempt[]):Chapter6EvidenceRecord[]{
  const out:Chapter6EvidenceRecord[]=[]
  for(const attempt of attempts){
    if(attempt.quiz_id!=='quiz-6'||attempt.is_reassessment||!attempt.answers_json)continue
    for(const [questionId,selected] of Object.entries(attempt.answers_json)){
      if(!isAnswer(selected))continue
      const question=initialById.get(questionId); const conceptFamilyId=initialMap.get(questionId)
      if(!question||!conceptFamilyId)continue
      out.push({studentId,chapterId:'ch-6',conceptFamilyId,source:'chapter_assessment',itemId:questionId,difficulty:difficulty(question.difficulty),correct:selected===question.correct_answer,attemptPhase:'initial',timestamp:attempt.completed_at})
    }
  }
  return out
}

export function chapter6ReassessmentToEvidence(studentId:string,attempts:readonly Chapter6InstructorQuizAttempt[]):Chapter6EvidenceRecord[]{
  const out:Chapter6EvidenceRecord[]=[]
  for(const attempt of attempts){
    if(!attempt.is_reassessment||!isFamily(attempt.target_concept_id)||!attempt.answers_json)continue
    const target=attempt.target_concept_id
    for(const [questionId,selected] of Object.entries(attempt.answers_json)){
      if(!isAnswer(selected))continue
      const question=reserveById.get(questionId); const mapped=reserveMap.get(questionId)
      if(!question||mapped!==target)continue
      out.push({studentId,chapterId:'ch-6',conceptFamilyId:target,source:'remediation_reassessment',itemId:questionId,difficulty:difficulty(question.difficulty),correct:selected===question.correct_answer,attemptPhase:'reassessment',timestamp:attempt.completed_at})
    }
  }
  return out
}

function aggregateConfidence(concepts:readonly Chapter6InstructorConceptDiagnostic[]):Chapter6Confidence{
  const rank:Record<Chapter6Confidence,number>={insufficient_evidence:0,emerging:1,developing:2,proficient:3,strong:4}
  const labels:Chapter6Confidence[]=['insufficient_evidence','emerging','developing','proficient','strong']
  const supported=concepts.filter(c=>c.observations>0)
  if(!supported.length)return 'insufficient_evidence'
  const avg=supported.reduce((sum,c)=>sum+rank[c.confidence],0)/supported.length
  return labels[Math.max(0,Math.min(4,Math.floor(avg)))]
}

function latestFormalReassessment(studentId:string,attempts:readonly Chapter6InstructorQuizAttempt[]){
  const eligible=attempts.filter(a=>a.is_reassessment&&isFamily(a.target_concept_id)).sort((a,b)=>new Date(b.completed_at).getTime()-new Date(a.completed_at).getTime())
  const latest=eligible[0]
  if(!latest||!isFamily(latest.target_concept_id))return {percent:null as number|null,answeredCount:0,conceptFamilyId:null as Chapter6ConceptFamilyId|null}
  const target=latest.target_concept_id
  const grouped=latest.remediation_cycle_id?eligible.filter(a=>a.remediation_cycle_id===latest.remediation_cycle_id&&a.target_concept_id===target):[latest]
  const evidence=chapter6ReassessmentToEvidence(studentId,grouped)
  const unique=new Map(evidence.map(r=>[r.itemId,r]))
  const answeredCount=unique.size
  const correct=[...unique.values()].filter(r=>r.correct).length
  return {percent:answeredCount===5?Math.round(correct/5*10000)/100:null,answeredCount,conceptFamilyId:target}
}

export function buildChapter6InstructorDiagnostics(input:{
  studentId:string
  completionPercent:number
  microCheckRows:readonly Chapter6MicroCheckAttemptRow[]
  quizAttempts:readonly Chapter6InstructorQuizAttempt[]
  referenceTime:string
}):Chapter6InstructorDiagnosticSummary{
  const micro=chapter6MicroCheckRowsToEvidence(input.microCheckRows)
  const initial=chapter6InitialAssessmentToEvidence(input.studentId,input.quizAttempts)
  const reassessment=chapter6ReassessmentToEvidence(input.studentId,input.quizAttempts)
  const evidence=[...micro,...initial,...reassessment]

  const concepts=CHAPTER6_CONCEPT_FAMILY_IDS.map(conceptFamilyId=>{
    const records=evidence.filter(r=>r.conceptFamilyId===conceptFamilyId)
    const mastery=calculateChapter6ConceptMastery(records,input.referenceTime)
    const recent=[...records].sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())[0]
    return {conceptFamilyId,conceptName:familyName.get(conceptFamilyId)??conceptFamilyId,mastery:mastery.mastery,confidence:mastery.confidence,observations:mastery.observationCount,mostRecentEvidenceAt:recent?.timestamp??null,initialMisses:mastery.initialMissCount,reassessmentCorrect:mastery.reassessmentCorrectCount}
  })

  const supported=concepts.filter(c=>c.observations>0)
  const overallMastery=supported.length?Math.round(supported.reduce((s,c)=>s+c.mastery,0)/supported.length*100)/100:0
  const latestInitial=input.quizAttempts.filter(a=>a.quiz_id==='quiz-6'&&!a.is_reassessment).sort((a,b)=>new Date(b.completed_at).getTime()-new Date(a.completed_at).getTime())[0]
  const microCheckPercent=calculatePersistedChapter6MicroCheckPercent(input.microCheckRows)
  const formal=latestFormalReassessment(input.studentId,input.quizAttempts)
  const chapterAssessmentPercent=latestInitial?.percentage??null
  const chapterGrade=calculateChapter6Grade({microCheckPercent,chapterAssessmentPercent,remediationReassessmentPercent:formal.percent})
  const sorted=[...supported].sort((a,b)=>a.mastery-b.mastery)
  const weak=sorted.filter(c=>c.mastery<=70||c.initialMisses>=2)

  return {
    chapterGrade,overallMastery,overallConfidence:aggregateConfidence(concepts),chapterAssessmentPercent,microCheckPercent,remediationReassessmentPercent:formal.percent,
    strongestConcepts:[...sorted].reverse().slice(0,3),weakestConcepts:sorted.slice(0,3),concepts,
    remediationStatus:weak.length?`Targeted review — ${weak[0].conceptName}`:'No active mastery gap detected',
    latestReassessment:formal.conceptFamilyId?(formal.percent!=null?`${formal.percent}% — ${familyName.get(formal.conceptFamilyId)??formal.conceptFamilyId}`:`${formal.answeredCount}/5 in progress — ${familyName.get(formal.conceptFamilyId)??formal.conceptFamilyId}`):'No reassessment recorded',
    evidenceCount:evidence.length,
  }
}
