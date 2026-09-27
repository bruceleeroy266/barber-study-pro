import type {
  Chapter8Confidence,
  Chapter8Difficulty,
  Chapter8EvidenceRecord,
  Chapter8GradeResult,
} from './grading'
import { calculateChapter8ConceptMastery, calculateChapter8Grade } from './grading'
import type { Chapter8ConceptFamilyId } from './types'
import {
  CHAPTER8_CONCEPT_FAMILY_IDS,
  getChapter8ConceptFamily,
  isChapter8ConceptFamilyId,
} from './concepts'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import { chapter8ReassessmentReserve } from './reassessment-reserve'
import { chapter8QuizQuestionConceptMappings } from './mappings'
import type { Chapter8MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter8MicroCheckPercent,
  chapter8MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter8TargetedRemediationPlan } from './targeted-remediation'
import {
  CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS,
  evaluateChapter8SafetyEscalation,
  type Chapter8SafetyEscalationResult,
} from './safety-mastery'

export interface Chapter8InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter8InstructorConceptDiagnostic {
  conceptName: string
  conceptFamilyId: Chapter8ConceptFamilyId
  mastery: number
  confidence: Chapter8Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter8InstructorDiagnosticSummary {
  chapterGrade: Chapter8GradeResult
  overallMastery: number
  overallConfidence: Chapter8Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter8InstructorConceptDiagnostic[]
  weakestConcepts: Chapter8InstructorConceptDiagnostic[]
  concepts: Chapter8InstructorConceptDiagnostic[]
  safetyEscalations: Chapter8SafetyEscalationResult[]
  highestSafetyLevel: 'clear' | 'watch' | 'urgent'
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter8PremiumQuizQuestions.map((question) => [question.id, question.correct_answer]),
)

const quizDifficulty = new Map<string, Chapter8Difficulty>(
  chapter8PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter8ConceptFamilyId>(
  chapter8QuizQuestionConceptMappings.map((mapping) => [
    mapping.questionId,
    mapping.conceptFamilyId,
  ]),
)

const reassessmentById = new Map<string, (typeof chapter8ReassessmentReserve)[number]>(
  chapter8ReassessmentReserve.map((question) => [question.id, question]),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function latestInitialChapter8Attempt(
  attempts: readonly Chapter8InstructorQuizAttempt[],
): Chapter8InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-8' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter8QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter8InstructorQuizAttempt[],
): Chapter8EvidenceRecord[] {
  const records: Chapter8EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-8' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-8',
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

export function chapter8ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter8InstructorQuizAttempt[],
): Chapter8EvidenceRecord[] {
  const records: Chapter8EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      !attempt.is_reassessment ||
      !isChapter8ConceptFamilyId(attempt.target_concept_id ?? '') ||
      !attempt.answers_json
    ) {
      continue
    }

    const targetConceptId = attempt.target_concept_id as Chapter8ConceptFamilyId

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (!question || question.conceptFamilyId !== targetConceptId) continue

      records.push({
        studentId,
        chapterId: 'ch-8',
        conceptFamilyId: targetConceptId,
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

function overallConfidence(
  concepts: readonly Chapter8InstructorConceptDiagnostic[],
): Chapter8Confidence {
  const rank: Record<Chapter8Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter8Confidence[] = [
    'insufficient_evidence',
    'emerging',
    'developing',
    'proficient',
    'strong',
  ]
  const supported = concepts.filter((concept) => concept.observations > 0)
  if (!supported.length) return 'insufficient_evidence'
  const averageRank =
    supported.reduce((sum, concept) => sum + rank[concept.confidence], 0) / supported.length
  return labels[Math.max(0, Math.min(4, Math.floor(averageRank)))]
}

interface LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter8ConceptFamilyId | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter8InstructorQuizAttempt[],
): LatestFormalReassessment {
  const eligible = attempts
    .filter(
      (attempt) =>
        attempt.is_reassessment &&
        isChapter8ConceptFamilyId(attempt.target_concept_id ?? ''),
    )
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  const latest = eligible[0]
  if (!latest || !isChapter8ConceptFamilyId(latest.target_concept_id ?? '')) {
    return { percent: null, answeredCount: 0, conceptFamilyId: null }
  }

  const targetConceptId = latest.target_concept_id as Chapter8ConceptFamilyId
  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === targetConceptId,
      )
    : [latest]

  const evidence = chapter8ReassessmentAttemptsToEvidence(studentId, grouped)
  const unique = new Map(evidence.map((record) => [record.itemId, record]))
  const answeredCount = unique.size
  const correctCount = [...unique.values()].filter((record) => record.correct).length

  return {
    percent: answeredCount === 5 ? Math.round((correctCount / 5) * 10000) / 100 : null,
    answeredCount,
    conceptFamilyId: targetConceptId,
  }
}

export function buildChapter8InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter8MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter8InstructorQuizAttempt[]
  referenceTime: string
}): Chapter8InstructorDiagnosticSummary {
  const microEvidence = chapter8MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter8QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter8ReassessmentAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const evidence = [...microEvidence, ...assessmentEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER8_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter8ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )[0]

    return {
      conceptFamilyId,
      conceptName: getChapter8ConceptFamily(conceptFamilyId).name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observations: mastery.observationCount,
      mostRecentEvidenceAt: recent?.timestamp ?? null,
      initialMisses: mastery.initialMissCount,
      reassessmentCorrect: mastery.reassessmentCorrectCount,
    }
  })

  const supportedConcepts = concepts.filter((concept) => concept.observations > 0)
  const overallMastery = supportedConcepts.length
    ? Math.round(
        (supportedConcepts.reduce((sum, concept) => sum + concept.mastery, 0) /
          supportedConcepts.length) *
          100,
      ) / 100
    : 0

  const assessmentAttempt = latestInitialChapter8Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter8MicroCheckPercent(input.microCheckRows)
  const latestFormal = latestFormalReassessment(input.studentId, input.quizAttempts)
  const remediationReassessmentPercent = latestFormal.percent
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const chapterGrade = calculateChapter8Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyEscalations = CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS.map((conceptFamilyId) =>
    evaluateChapter8SafetyEscalation(evidence, conceptFamilyId),
  ).filter((result): result is Chapter8SafetyEscalationResult => result !== null)

  const highestSafetyLevel = safetyEscalations.some((result) => result.level === 'urgent')
    ? 'urgent'
    : safetyEscalations.some((result) => result.level === 'watch')
      ? 'watch'
      : 'clear'

  const remediationPlan = buildChapter8TargetedRemediationPlan(evidence, input.referenceTime)
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
    safetyEscalations,
    highestSafetyLevel,
    remediationStatus: urgentTargets.length
      ? `Urgent remediation — ${urgentTargets[0].conceptName}`
      : priorityTargets.length
        ? `Priority review — ${priorityTargets[0].conceptName}`
        : remediationPlan.targets.length
          ? `Targeted review — ${remediationPlan.targets[0].conceptName}`
          : 'No active remediation',
    latestReassessment: latestFormal.conceptFamilyId
      ? latestFormal.percent != null
        ? `${latestFormal.percent}% — ${getChapter8ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter8ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
