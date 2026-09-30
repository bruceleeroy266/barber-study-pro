import type { Chapter5Confidence, Chapter5Difficulty, Chapter5EvidenceRecord, Chapter5GradeResult } from './grading'
import { calculateChapter5ConceptMastery, calculateChapter5Grade } from './grading'
import type { Chapter5ConceptFamilyId } from './types'
import { CHAPTER5_CONCEPT_FAMILY_IDS, chapter5ConceptFamilies } from './concepts'
import { chapter5QuizQuestionConceptMappings, chapter5ReassessmentQuestionConceptMappings } from './mappings'
import { chapter5PremiumQuizQuestions } from '../chapter-5-premium-quiz'
import { chapter5ReassessmentQuestions } from '../chapter-5-reassessment-questions'
import type { Chapter5MicroCheckAttemptRow } from './micro-check-persistence'
import { calculatePersistedChapter5MicroCheckPercent, chapter5MicroCheckRowsToEvidence } from './micro-check-persistence'
import { isLegacyUrgentSafetyConcept, requiredLegacyRecoveryPercent } from '@/lib/reassessment/legacy-safety-recovery'

export interface Chapter5InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter5InstructorConceptDiagnostic {
  conceptFamilyId: Chapter5ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: Chapter5Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter5InstructorDiagnosticSummary {
  chapterGrade: Chapter5GradeResult
  overallMastery: number
  overallConfidence: Chapter5Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter5InstructorConceptDiagnostic[]
  weakestConcepts: Chapter5InstructorConceptDiagnostic[]
  concepts: Chapter5InstructorConceptDiagnostic[]
  remediationStatus: string
  latestReassessment: string
  safetyIntervention: {
    level: 'none' | 'urgent'
    requiresInstructorReview: boolean
    requiresFormalSafetyReassessment: boolean
    instructorReason: string
  }
  evidenceCount: number
}

const familySet=new Set<string>(CHAPTER5_CONCEPT_FAMILY_IDS)
const familyName=new Map(chapter5ConceptFamilies.map(f=>[f.id,f.name]))
const initialById=new Map(chapter5PremiumQuizQuestions.map(q=>[q.id,q]))
const reserveById=new Map(chapter5ReassessmentQuestions.map(q=>[q.id,q]))
const initialMap=new Map<string, Chapter5ConceptFamilyId>(chapter5QuizQuestionConceptMappings.map(m=>[m.questionId,m.conceptFamilyId]))
const reserveMap=new Map<string, Chapter5ConceptFamilyId>(chapter5ReassessmentQuestionConceptMappings.map(m=>[m.questionId,m.conceptFamilyId]))

function isFamily(value:string|null|undefined):value is Chapter5ConceptFamilyId{return !!value&&familySet.has(value)}
function isAnswer(value:unknown):value is 'a'|'b'|'c'|'d'{return value==='a'||value==='b'||value==='c'||value==='d'}
function difficulty(value:string|null|undefined):Chapter5Difficulty{
  if(value==='hard') return 'scenario'
  if(value==='medium') return 'application'
  return 'understanding'
}

export function chapter5InitialAssessmentToEvidence(studentId:string,attempts:readonly Chapter5InstructorQuizAttempt[]):Chapter5EvidenceRecord[]{
  const out:Chapter5EvidenceRecord[]=[]
  for(const attempt of attempts){
    if(attempt.quiz_id!=='quiz-5'||attempt.is_reassessment||!attempt.answers_json)continue
    for(const [questionId,selected] of Object.entries(attempt.answers_json)){
      if(!isAnswer(selected))continue
      const question=initialById.get(questionId); const conceptFamilyId=initialMap.get(questionId)
      if(!question||!conceptFamilyId)continue
      out.push({studentId,chapterId:'ch-5',conceptFamilyId,source:'chapter_assessment',itemId:questionId,difficulty:difficulty(question.difficulty),correct:selected===question.correct_answer,attemptPhase:'initial',timestamp:attempt.completed_at})
    }
  }
  return out
}

export function chapter5ReassessmentToEvidence(studentId:string,attempts:readonly Chapter5InstructorQuizAttempt[]):Chapter5EvidenceRecord[]{
  const out:Chapter5EvidenceRecord[]=[]
  for(const attempt of attempts){
    if(!attempt.is_reassessment||!isFamily(attempt.target_concept_id)||!attempt.answers_json)continue
    const target=attempt.target_concept_id
    for(const [questionId,selected] of Object.entries(attempt.answers_json)){
      if(!isAnswer(selected))continue
      const question=reserveById.get(questionId); const mapped=reserveMap.get(questionId)
      if(!question||mapped!==target)continue
      out.push({studentId,chapterId:'ch-5',conceptFamilyId:target,source:'remediation_reassessment',itemId:questionId,difficulty:difficulty(question.difficulty),correct:selected===question.correct_answer,attemptPhase:'reassessment',timestamp:attempt.completed_at})
    }
  }
  return out
}

function aggregateConfidence(concepts:readonly Chapter5InstructorConceptDiagnostic[]):Chapter5Confidence{
  const rank:Record<Chapter5Confidence,number>={insufficient_evidence:0,emerging:1,developing:2,proficient:3,strong:4}
  const labels:Chapter5Confidence[]=['insufficient_evidence','emerging','developing','proficient','strong']
  const supported=concepts.filter(c=>c.observations>0)
  if(!supported.length)return 'insufficient_evidence'
  const avg=supported.reduce((sum,c)=>sum+rank[c.confidence],0)/supported.length
  return labels[Math.max(0,Math.min(4,Math.floor(avg)))]
}

function latestFormalReassessment(studentId:string,attempts:readonly Chapter5InstructorQuizAttempt[]){
  const eligible=attempts.filter(a=>a.is_reassessment&&isFamily(a.target_concept_id)).sort((a,b)=>new Date(b.completed_at).getTime()-new Date(a.completed_at).getTime())
  const latest=eligible[0]
  if(!latest||!isFamily(latest.target_concept_id))return {percent:null as number|null,answeredCount:0,conceptFamilyId:null as Chapter5ConceptFamilyId|null}
  const target=latest.target_concept_id
  const grouped=latest.remediation_cycle_id?eligible.filter(a=>a.remediation_cycle_id===latest.remediation_cycle_id&&a.target_concept_id===target):[latest]
  const evidence=chapter5ReassessmentToEvidence(studentId,grouped)
  const unique=new Map(evidence.map(r=>[r.itemId,r]))
  const answeredCount=unique.size
  const correct=[...unique.values()].filter(r=>r.correct).length
  return {percent:answeredCount===5?Math.round(correct/5*10000)/100:null,answeredCount,conceptFamilyId:target}
}

export function buildChapter5InstructorDiagnostics(input:{
  studentId:string
  completionPercent:number
  microCheckRows:readonly Chapter5MicroCheckAttemptRow[]
  quizAttempts:readonly Chapter5InstructorQuizAttempt[]
  referenceTime:string
}):Chapter5InstructorDiagnosticSummary{
  const micro=chapter5MicroCheckRowsToEvidence(input.microCheckRows)
  const initial=chapter5InitialAssessmentToEvidence(input.studentId,input.quizAttempts)
  const reassessment=chapter5ReassessmentToEvidence(input.studentId,input.quizAttempts)
  const evidence=[...micro,...initial,...reassessment]

  const concepts=CHAPTER5_CONCEPT_FAMILY_IDS.map(conceptFamilyId=>{
    const records=evidence.filter(r=>r.conceptFamilyId===conceptFamilyId)
    const mastery=calculateChapter5ConceptMastery(records,input.referenceTime)
    const recent=[...records].sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())[0]
    return {conceptFamilyId,conceptName:familyName.get(conceptFamilyId)??conceptFamilyId,mastery:mastery.mastery,confidence:mastery.confidence,observations:mastery.observationCount,mostRecentEvidenceAt:recent?.timestamp??null,initialMisses:mastery.initialMissCount,reassessmentCorrect:mastery.reassessmentCorrectCount}
  })

  const supported=concepts.filter(c=>c.observations>0)
  const overallMastery=supported.length?Math.round(supported.reduce((s,c)=>s+c.mastery,0)/supported.length*100)/100:0
  const latestInitial=input.quizAttempts.filter(a=>a.quiz_id==='quiz-5'&&!a.is_reassessment).sort((a,b)=>new Date(b.completed_at).getTime()-new Date(a.completed_at).getTime())[0]
  const microCheckPercent=calculatePersistedChapter5MicroCheckPercent(input.microCheckRows)
  const formal=latestFormalReassessment(input.studentId,input.quizAttempts)
  const chapterAssessmentPercent=latestInitial?.percentage??null
  const chapterGrade=calculateChapter5Grade({microCheckPercent,chapterAssessmentPercent,remediationReassessmentPercent:formal.percent})
  const sorted=[...supported].sort((a,b)=>a.mastery-b.mastery)
  const weak=sorted.filter(c=>c.mastery<=70||c.initialMisses>=2)
  const urgentSafety = concepts.filter((concept) =>
    isLegacyUrgentSafetyConcept('ch-5', concept.conceptFamilyId) && concept.initialMisses > 0
  )
  const latestSafetyRecovery = formal.conceptFamilyId && isLegacyUrgentSafetyConcept('ch-5', formal.conceptFamilyId)
    ? formal
    : null
  const safetyRecovered = !!latestSafetyRecovery?.percent && latestSafetyRecovery.percent >= requiredLegacyRecoveryPercent('ch-5', latestSafetyRecovery.conceptFamilyId!)
  const safetyIntervention = urgentSafety.length > 0 && !safetyRecovered
    ? { level: 'urgent' as const, requiresInstructorReview: true, requiresFormalSafetyReassessment: true, instructorReason: `Urgent safety recovery requires 100% on five fresh reassessment questions. Preserved initial safety misses: ${urgentSafety.reduce((sum, concept) => sum + concept.initialMisses, 0)}.` }
    : { level: 'none' as const, requiresInstructorReview: false, requiresFormalSafetyReassessment: false, instructorReason: safetyRecovered ? 'Urgent safety reassessment recovered at 100%; original misses remain preserved.' : 'No urgent safety miss detected.' }

  return {
    chapterGrade,overallMastery,overallConfidence:aggregateConfidence(concepts),chapterAssessmentPercent,microCheckPercent,remediationReassessmentPercent:formal.percent,
    strongestConcepts:[...sorted].reverse().slice(0,3),weakestConcepts:sorted.slice(0,3),concepts,
    remediationStatus:weak.length?`Targeted review — ${weak[0].conceptName}`:'No active mastery gap detected',
    latestReassessment:formal.conceptFamilyId?(formal.percent!=null?`${formal.percent}% — ${familyName.get(formal.conceptFamilyId)??formal.conceptFamilyId}`:`${formal.answeredCount}/5 in progress — ${familyName.get(formal.conceptFamilyId)??formal.conceptFamilyId}`):'No reassessment recorded',
    safetyIntervention,
    evidenceCount:evidence.length,
  }
}
