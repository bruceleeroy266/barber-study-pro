import type { Chapter11EvidenceRecord, Chapter11Confidence, Chapter11GradeResult, Chapter11Difficulty } from './grading'
import { calculateChapter11ConceptMastery, calculateChapter11Grade } from './grading'
import type { Chapter11ConceptFamilyId } from './types'
import { CHAPTER11_CONCEPT_FAMILY_IDS, getChapter11ConceptFamily } from './concepts'
import { chapter11PremiumQuizQuestions } from '../chapter-11-premium-quiz'
import { chapter11ReassessmentReserve } from './reassessment-reserve'
import { chapter11QuizQuestionConceptMappings } from './mappings'
import type { Chapter11MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter11MicroCheckPercent,
  chapter11MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter11TargetedRemediationPlan } from './targeted-remediation'
import { evaluateChapter11SafetyIntervention, type Chapter11SafetyIntervention } from './safety-intervention'

export interface Chapter11InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter11InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter11Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter11InstructorDiagnosticSummary {
  chapterGrade: Chapter11GradeResult
  overallMastery: number
  overallConfidence: Chapter11Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter11InstructorConceptDiagnostic[]
  weakestConcepts: Chapter11InstructorConceptDiagnostic[]
  concepts: Chapter11InstructorConceptDiagnostic[]
  safetyIntervention: Chapter11SafetyIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter11PremiumQuizQuestions.map((question) => [question.id, question.correct_answer]),
)

const quizDifficulty = new Map<string, Chapter11Difficulty>(
  chapter11PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter11ConceptFamilyId>(
  chapter11QuizQuestionConceptMappings.map((mapping) => [mapping.questionId, mapping.conceptFamilyId]),
)

const reassessmentById = new Map<string, (typeof chapter11ReassessmentReserve)[number]>(
  chapter11ReassessmentReserve.map((question) => [question.id, question]),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter11ConceptFamilyId(value: string | null | undefined): value is Chapter11ConceptFamilyId {
  return !!value && (CHAPTER11_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

function latestInitialChapter11Attempt(
  attempts: readonly Chapter11InstructorQuizAttempt[],
): Chapter11InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-11' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter11QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter11InstructorQuizAttempt[],
): Chapter11EvidenceRecord[] {
  const records: Chapter11EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-11' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-11',
        conceptFamilyId,
        source: 'chapter_assessment',
        itemId: questionId,
        difficulty,
        correct: selected === correct,
        attemptPhase: 'initial',
        timestamp: attempt.completed_at,
      })
    }
  }

  return records
}

export function chapter11ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter11InstructorQuizAttempt[],
): Chapter11EvidenceRecord[] {
  const records: Chapter11EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isChapter11ConceptFamilyId(attempt.target_concept_id) || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (!question || question.conceptFamilyId !== attempt.target_concept_id) continue

      records.push({
        studentId,
        chapterId: 'ch-11',
        conceptFamilyId: attempt.target_concept_id,
        source: 'remediation_reassessment',
        itemId: questionId,
        difficulty: question.difficulty,
        correct: selected === question.correctAnswer,
        attemptPhase: 'reassessment',
        timestamp: attempt.completed_at,
      })
    }
  }

  return records
}

function overallConfidence(concepts: readonly Chapter11InstructorConceptDiagnostic[]): Chapter11Confidence {
  const rank: Record<Chapter11Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter11Confidence[] = [
    'insufficient_evidence',
    'emerging',
    'developing',
    'proficient',
    'strong',
  ]
  const supported = concepts.filter((concept) => concept.observations > 0)
  if (supported.length === 0) return 'insufficient_evidence'
  const averageRank = supported.reduce((sum, concept) => sum + rank[concept.confidence], 0) / supported.length
  return labels[Math.max(0, Math.min(4, Math.floor(averageRank)))]
}

interface Chapter11LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter11ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter11InstructorQuizAttempt[],
): Chapter11LatestFormalReassessment {
  const eligible = attempts
    .filter((attempt) => attempt.is_reassessment && isChapter11ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  const latest = eligible[0]
  if (!latest || !isChapter11ConceptFamilyId(latest.target_concept_id)) {
    return { percent: null, answeredCount: 0, conceptFamilyId: null, completedAt: null }
  }

  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === latest.target_concept_id,
      )
    : [latest]

  const evidence = chapter11ReassessmentAttemptsToEvidence(studentId, grouped)
  const unique = new Map(evidence.map((record) => [record.itemId, record]))
  const answeredCount = unique.size
  const correctCount = [...unique.values()].filter((record) => record.correct).length

  return {
    percent: answeredCount === 5 ? Math.round((correctCount / 5) * 10000) / 100 : null,
    answeredCount,
    conceptFamilyId: latest.target_concept_id,
    completedAt: latest.completed_at,
  }
}

export function buildChapter11InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter11MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter11InstructorQuizAttempt[]
  referenceTime: string
}): Chapter11InstructorDiagnosticSummary {
  const microEvidence = chapter11MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter11QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter11ReassessmentAttemptsToEvidence(input.studentId, input.quizAttempts)
  const evidence = [...microEvidence, ...assessmentEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER11_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter11ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return {
      conceptName: getChapter11ConceptFamily(conceptFamilyId).name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observations: mastery.observationCount,
      mostRecentEvidenceAt: recent?.timestamp ?? null,
      initialMisses: mastery.initialMissCount,
      reassessmentCorrect: mastery.reassessmentCorrectCount,
    }
  })

  const supportedConcepts = concepts.filter((concept) => concept.observations > 0)
  const overallMastery = supportedConcepts.length > 0
    ? Math.round((supportedConcepts.reduce((sum, concept) => sum + concept.mastery, 0) / supportedConcepts.length) * 100) / 100
    : 0

  const assessmentAttempt = latestInitialChapter11Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter11MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(input.studentId, input.quizAttempts)
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter11Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyIntervention = evaluateChapter11SafetyIntervention(evidence)
  const remediationPlan = buildChapter11TargetedRemediationPlan(evidence, input.referenceTime)
  const sorted = [...supportedConcepts].sort((a, b) => a.mastery - b.mastery)
  const urgentTargets = remediationPlan.targets.filter((target) => target.priority === 'urgent')
  const priorityTargets = remediationPlan.targets.filter((target) => target.priority === 'priority')

  return {
    chapterGrade,
    overallMastery,
    overallConfidence: overallConfidence(concepts),
    chapterAssessmentPercent,
    microCheckPercent,
    remediationReassessmentPercent,
    strongestConcepts: [...sorted].reverse().slice(0, 3),
    weakestConcepts: sorted.slice(0, 3),
    concepts,
    safetyIntervention,
    remediationStatus: urgentTargets.length > 0
      ? `Urgent remediation — ${urgentTargets[0].conceptName}`
      : priorityTargets.length > 0
        ? `Priority review — ${priorityTargets[0].conceptName}`
        : remediationPlan.targets.length > 0
          ? `Targeted review — ${remediationPlan.targets[0].conceptName}`
          : 'No active remediation',
    latestReassessment: latestFormal.conceptFamilyId
      ? latestFormal.percent != null
        ? `${latestFormal.percent}% — ${getChapter11ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter11ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
