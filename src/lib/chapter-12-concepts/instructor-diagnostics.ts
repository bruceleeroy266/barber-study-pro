import type { Chapter12EvidenceRecord, Chapter12Confidence, Chapter12GradeResult, Chapter12Difficulty } from './grading'
import { calculateChapter12ConceptMastery, calculateChapter12Grade } from './grading'
import type { Chapter12ConceptFamilyId } from './types'
import { CHAPTER12_CONCEPT_FAMILY_IDS, getChapter12ConceptFamily } from './concepts'
import { chapter12PremiumQuizQuestions } from '../chapter-12-premium-quiz'
import { chapter12ReassessmentReserve } from './reassessment-reserve'
import { chapter12QuizQuestionConceptMappings } from './mappings'
import type { Chapter12MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter12MicroCheckPercent,
  chapter12MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter12TargetedRemediationPlan } from './targeted-remediation'
import { evaluateChapter12SafetyIntervention, type Chapter12SafetyIntervention } from './safety-intervention'

export interface Chapter12InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter12InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter12Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter12InstructorDiagnosticSummary {
  chapterGrade: Chapter12GradeResult
  overallMastery: number
  overallConfidence: Chapter12Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter12InstructorConceptDiagnostic[]
  weakestConcepts: Chapter12InstructorConceptDiagnostic[]
  concepts: Chapter12InstructorConceptDiagnostic[]
  safetyIntervention: Chapter12SafetyIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter12PremiumQuizQuestions.map((question) => [question.id, question.correct_answer]),
)

const quizDifficulty = new Map<string, Chapter12Difficulty>(
  chapter12PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter12ConceptFamilyId>(
  chapter12QuizQuestionConceptMappings.map((mapping) => [mapping.questionId, mapping.conceptFamilyId]),
)

const reassessmentById = new Map<string, (typeof chapter12ReassessmentReserve)[number]>(
  chapter12ReassessmentReserve.map((question) => [question.id, question]),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter12ConceptFamilyId(value: string | null | undefined): value is Chapter12ConceptFamilyId {
  return !!value && (CHAPTER12_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

function latestInitialChapter12Attempt(
  attempts: readonly Chapter12InstructorQuizAttempt[],
): Chapter12InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-12' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter12QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter12InstructorQuizAttempt[],
): Chapter12EvidenceRecord[] {
  const records: Chapter12EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-12' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-12',
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

export function chapter12ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter12InstructorQuizAttempt[],
): Chapter12EvidenceRecord[] {
  const records: Chapter12EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isChapter12ConceptFamilyId(attempt.target_concept_id) || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (!question || question.conceptFamilyId !== attempt.target_concept_id) continue

      records.push({
        studentId,
        chapterId: 'ch-12',
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

function overallConfidence(concepts: readonly Chapter12InstructorConceptDiagnostic[]): Chapter12Confidence {
  const rank: Record<Chapter12Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter12Confidence[] = [
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

interface Chapter12LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter12ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter12InstructorQuizAttempt[],
): Chapter12LatestFormalReassessment {
  const eligible = attempts
    .filter((attempt) => attempt.is_reassessment && isChapter12ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  const latest = eligible[0]
  if (!latest || !isChapter12ConceptFamilyId(latest.target_concept_id)) {
    return { percent: null, answeredCount: 0, conceptFamilyId: null, completedAt: null }
  }

  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === latest.target_concept_id,
      )
    : [latest]

  const evidence = chapter12ReassessmentAttemptsToEvidence(studentId, grouped)
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

export function buildChapter12InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter12MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter12InstructorQuizAttempt[]
  referenceTime: string
}): Chapter12InstructorDiagnosticSummary {
  const microEvidence = chapter12MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter12QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter12ReassessmentAttemptsToEvidence(input.studentId, input.quizAttempts)
  const evidence = [...microEvidence, ...assessmentEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER12_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter12ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return {
      conceptName: getChapter12ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter12Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter12MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(input.studentId, input.quizAttempts)
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter12Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyIntervention = evaluateChapter12SafetyIntervention(evidence)
  const remediationPlan = buildChapter12TargetedRemediationPlan(evidence, input.referenceTime)
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
        ? `${latestFormal.percent}% — ${getChapter12ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter12ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
