import type { Chapter9EvidenceRecord, Chapter9Confidence, Chapter9GradeResult, Chapter9Difficulty } from './grading'
import { calculateChapter9ConceptMastery, calculateChapter9Grade } from './grading'
import type { Chapter9ConceptFamilyId } from './types'
import { CHAPTER9_CONCEPT_FAMILY_IDS, getChapter9ConceptFamily } from './concepts'
import { chapter9PremiumQuizQuestions } from '../chapter-9-premium-quiz'
import { chapter9ReassessmentReserve } from './reassessment-reserve'
import { chapter9QuizQuestionConceptMappings } from './mappings'
import type { Chapter9MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter9MicroCheckPercent,
  chapter9MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter9TargetedRemediationPlan } from './targeted-remediation'
import { evaluateChapter9SafetyIntervention, type Chapter9SafetyIntervention } from './safety-intervention'

export interface Chapter9InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
}

export interface Chapter9InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter9Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter9InstructorDiagnosticSummary {
  chapterGrade: Chapter9GradeResult
  overallMastery: number
  overallConfidence: Chapter9Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter9InstructorConceptDiagnostic[]
  weakestConcepts: Chapter9InstructorConceptDiagnostic[]
  concepts: Chapter9InstructorConceptDiagnostic[]
  safetyIntervention: Chapter9SafetyIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter9PremiumQuizQuestions.map((question) => [question.id, question.correct_answer]),
)

const quizDifficulty = new Map<string, Chapter9Difficulty>(
  chapter9PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter9ConceptFamilyId>(
  chapter9QuizQuestionConceptMappings.map((mapping) => [mapping.questionId, mapping.conceptFamilyId]),
)

const reassessmentById = new Map(
  chapter9ReassessmentReserve.map((question) => [question.id, question]),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter9ConceptFamilyId(value: string | null | undefined): value is Chapter9ConceptFamilyId {
  return !!value && (CHAPTER9_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

function latestInitialChapter9Attempt(
  attempts: readonly Chapter9InstructorQuizAttempt[],
): Chapter9InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-9' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter9QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter9InstructorQuizAttempt[],
): Chapter9EvidenceRecord[] {
  const records: Chapter9EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-9' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-9',
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

export function chapter9ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter9InstructorQuizAttempt[],
): Chapter9EvidenceRecord[] {
  const records: Chapter9EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isChapter9ConceptFamilyId(attempt.target_concept_id) || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (!question || question.conceptFamilyId !== attempt.target_concept_id) continue

      records.push({
        studentId,
        chapterId: 'ch-9',
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

function overallConfidence(concepts: readonly Chapter9InstructorConceptDiagnostic[]): Chapter9Confidence {
  const rank: Record<Chapter9Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter9Confidence[] = [
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

function latestReassessmentPercent(attempts: readonly Chapter9InstructorQuizAttempt[]): number | null {
  const latest = attempts
    .filter((attempt) => attempt.is_reassessment && isChapter9ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]
  return latest?.percentage ?? null
}

export function buildChapter9InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter9MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter9InstructorQuizAttempt[]
  referenceTime: string
}): Chapter9InstructorDiagnosticSummary {
  const microEvidence = chapter9MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter9QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter9ReassessmentAttemptsToEvidence(input.studentId, input.quizAttempts)
  const evidence = [...microEvidence, ...assessmentEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER9_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter9ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return {
      conceptName: getChapter9ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter9Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter9MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const remediationReassessmentPercent = latestReassessmentPercent(input.quizAttempts)
  const chapterGrade = calculateChapter9Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyIntervention = evaluateChapter9SafetyIntervention(evidence)
  const remediationPlan = buildChapter9TargetedRemediationPlan(evidence, input.referenceTime)
  const sorted = [...supportedConcepts].sort((a, b) => a.mastery - b.mastery)
  const latestReassessment = input.quizAttempts
    .filter((attempt) => attempt.is_reassessment && isChapter9ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]

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
    latestReassessment: latestReassessment && isChapter9ConceptFamilyId(latestReassessment.target_concept_id)
      ? `${latestReassessment.percentage}% — ${getChapter9ConceptFamily(latestReassessment.target_concept_id).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
