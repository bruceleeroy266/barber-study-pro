import type { Chapter15EvidenceRecord, Chapter15Confidence, Chapter15GradeResult, Chapter15Difficulty } from './grading'
import { calculateChapter15ConceptMastery, calculateChapter15Grade } from './grading'
import type { Chapter15ConceptFamilyId } from './types'
import { CHAPTER15_CONCEPT_FAMILY_IDS, getChapter15ConceptFamily } from './concepts'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import { chapter15ReassessmentReserve } from './reassessment-reserve'
import { chapter15QuizQuestionConceptMappings } from './mappings'
import type { Chapter15MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter15MicroCheckPercent,
  chapter15MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter15TargetedRemediationPlan } from './targeted-remediation'
import { evaluateChapter15SafetyIntervention, type Chapter15SafetyIntervention } from './safety-intervention'

export interface Chapter15InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter15InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter15Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter15InstructorDiagnosticSummary {
  chapterGrade: Chapter15GradeResult
  overallMastery: number
  overallConfidence: Chapter15Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter15InstructorConceptDiagnostic[]
  weakestConcepts: Chapter15InstructorConceptDiagnostic[]
  concepts: Chapter15InstructorConceptDiagnostic[]
  safetyIntervention: Chapter15SafetyIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter15PremiumQuizQuestions.map((question) => [question.id, question.correct_answer]),
)

const quizDifficulty = new Map<string, Chapter15Difficulty>(
  chapter15PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter15ConceptFamilyId>(
  chapter15QuizQuestionConceptMappings.map((mapping) => [mapping.questionId, mapping.conceptFamilyId]),
)

const reassessmentById = new Map<string, (typeof chapter15ReassessmentReserve)[number]>(
  chapter15ReassessmentReserve.map((question) => [question.id, question]),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter15ConceptFamilyId(value: string | null | undefined): value is Chapter15ConceptFamilyId {
  return !!value && (CHAPTER15_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

function latestInitialChapter15Attempt(
  attempts: readonly Chapter15InstructorQuizAttempt[],
): Chapter15InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-15' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter15QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter15InstructorQuizAttempt[],
): Chapter15EvidenceRecord[] {
  const records: Chapter15EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-15' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-15',
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

export function chapter15ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter15InstructorQuizAttempt[],
): Chapter15EvidenceRecord[] {
  const records: Chapter15EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isChapter15ConceptFamilyId(attempt.target_concept_id) || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (!question || question.conceptFamilyId !== attempt.target_concept_id) continue

      records.push({
        studentId,
        chapterId: 'ch-15',
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

function overallConfidence(concepts: readonly Chapter15InstructorConceptDiagnostic[]): Chapter15Confidence {
  const rank: Record<Chapter15Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter15Confidence[] = [
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

interface Chapter15LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter15ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter15InstructorQuizAttempt[],
): Chapter15LatestFormalReassessment {
  const eligible = attempts
    .filter((attempt) => attempt.is_reassessment && isChapter15ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  const latest = eligible[0]
  if (!latest || !isChapter15ConceptFamilyId(latest.target_concept_id)) {
    return { percent: null, answeredCount: 0, conceptFamilyId: null, completedAt: null }
  }

  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === latest.target_concept_id,
      )
    : [latest]

  const evidence = chapter15ReassessmentAttemptsToEvidence(studentId, grouped)
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

export function buildChapter15InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter15MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter15InstructorQuizAttempt[]
  referenceTime: string
}): Chapter15InstructorDiagnosticSummary {
  const microEvidence = chapter15MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter15QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter15ReassessmentAttemptsToEvidence(input.studentId, input.quizAttempts)
  const evidence = [...microEvidence, ...assessmentEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER15_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter15ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return {
      conceptName: getChapter15ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter15Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter15MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(input.studentId, input.quizAttempts)
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter15Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyIntervention = evaluateChapter15SafetyIntervention(evidence)
  const remediationPlan = buildChapter15TargetedRemediationPlan(evidence, input.referenceTime)
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
        ? `${latestFormal.percent}% — ${getChapter15ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter15ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
