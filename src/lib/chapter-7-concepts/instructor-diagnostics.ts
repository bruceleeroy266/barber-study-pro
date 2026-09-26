import type { Chapter7EvidenceRecord, Chapter7Confidence, Chapter7GradeResult } from './grading'
import { calculateChapter7ConceptMastery, calculateChapter7Grade } from './grading'
import type { Chapter7ConceptFamilyId } from './types'
import { CHAPTER7_CONCEPT_FAMILY_IDS, getChapter7ConceptFamily } from './concepts'
import { chapter7PremiumQuizQuestions } from '../chapter-7-premium-quiz'
import { chapter7QuizQuestionConceptMappings } from './mappings'
import {
  evaluateChapter7InterventionFlags,
  type Chapter7InterventionFlag,
  type Chapter7MasterySnapshot,
  type Chapter7RemediationCycleSummary,
} from './intervention-flags'
import type { Chapter7MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter7MicroCheckPercent,
  chapter7MicroCheckRowsToEvidence,
} from './micro-check-persistence'

export interface Chapter7InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
}

export interface Chapter7InstructorRemediationCycle {
  concept_id: string
  status: string
  outcome: string | null
  reassessment_completed_at: string | null
  created_at: string
}

export interface Chapter7InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter7Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter7InstructorDiagnosticSummary {
  chapterGrade: Chapter7GradeResult
  overallMastery: number
  overallConfidence: Chapter7Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  strongestConcepts: Chapter7InstructorConceptDiagnostic[]
  weakestConcepts: Chapter7InstructorConceptDiagnostic[]
  concepts: Chapter7InstructorConceptDiagnostic[]
  interventionFlags: Chapter7InterventionFlag[]
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map(
  chapter7PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)
const questionDifficulty = new Map(
  chapter7PremiumQuizQuestions.map((question) => [question.id, question.difficulty] as const),
)
const questionConcept = new Map(
  chapter7QuizQuestionConceptMappings.map((mapping) => [mapping.questionId, mapping.conceptFamilyId] as const),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter7ConceptFamilyId(value: string | null | undefined): value is Chapter7ConceptFamilyId {
  return !!value && (CHAPTER7_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

function latestInitialChapter7Attempt(
  attempts: readonly Chapter7InstructorQuizAttempt[],
): Chapter7InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-7' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter7QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter7InstructorQuizAttempt[],
): Chapter7EvidenceRecord[] {
  const records: Chapter7EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-7' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = questionConcept.get(questionId)
      const difficulty = questionDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-7',
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

export function chapter7ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter7InstructorQuizAttempt[],
): Chapter7EvidenceRecord[] {
  const records: Chapter7EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isChapter7ConceptFamilyId(attempt.target_concept_id) || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const knownCorrect = answerKey.get(questionId)
      if (!knownCorrect) continue

      records.push({
        studentId,
        chapterId: 'ch-7',
        conceptFamilyId: attempt.target_concept_id,
        source: 'remediation_reassessment',
        itemId: questionId,
        difficulty: questionDifficulty.get(questionId) ?? 'application',
        correct: selected === knownCorrect,
        attemptPhase: 'reassessment',
        timestamp: attempt.completed_at,
      })
    }
  }

  return records
}

function buildSnapshots(
  evidence: readonly Chapter7EvidenceRecord[],
  referenceTime: string,
): Chapter7MasterySnapshot[] {
  const snapshots: Chapter7MasterySnapshot[] = []

  for (const conceptFamilyId of CHAPTER7_CONCEPT_FAMILY_IDS) {
    const records = evidence
      .filter((record) => record.conceptFamilyId === conceptFamilyId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const timestamps = [...new Set(records.map((record) => record.timestamp))]
    for (const timestamp of timestamps) {
      const throughTimestamp = records.filter(
        (record) => new Date(record.timestamp).getTime() <= new Date(timestamp).getTime(),
      )
      const result = calculateChapter7ConceptMastery(throughTimestamp, referenceTime)
      snapshots.push({
        conceptFamilyId,
        mastery: result.mastery,
        confidence: result.confidence,
        timestamp,
      })
    }
  }

  return snapshots
}

function remediationSummaries(
  cycles: readonly Chapter7InstructorRemediationCycle[],
  attempts: readonly Chapter7InstructorQuizAttempt[],
): Chapter7RemediationCycleSummary[] {
  return cycles.flatMap((cycle, index) => {
    if (!isChapter7ConceptFamilyId(cycle.concept_id)) return []

    const matching = attempts
      .filter(
        (attempt) =>
          attempt.is_reassessment &&
          attempt.target_concept_id === cycle.concept_id &&
          (!cycle.reassessment_completed_at ||
            Math.abs(new Date(attempt.completed_at).getTime() - new Date(cycle.reassessment_completed_at).getTime()) < 86_400_000),
      )
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]

    return [{
      conceptFamilyId: cycle.concept_id,
      cycleId: `cycle-${index + 1}`,
      completed: !!cycle.reassessment_completed_at,
      questionCount: matching?.answers_json ? Object.keys(matching.answers_json).length : 0,
      correctCount: matching?.answers_json && matching.percentage != null
        ? Math.round((Object.keys(matching.answers_json).length * matching.percentage) / 100)
        : 0,
      completedAt: cycle.reassessment_completed_at,
    }]
  })
}

function overallConfidence(concepts: readonly Chapter7InstructorConceptDiagnostic[]): Chapter7Confidence {
  const rank: Record<Chapter7Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter7Confidence[] = [
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

export function buildChapter7InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter7MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter7InstructorQuizAttempt[]
  remediationCycles: readonly Chapter7InstructorRemediationCycle[]
  referenceTime: string
}): Chapter7InstructorDiagnosticSummary {
  const microEvidence = chapter7MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter7QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter7ReassessmentAttemptsToEvidence(input.studentId, input.quizAttempts)
  const evidence = [...microEvidence, ...assessmentEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER7_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter7ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return {
      conceptName: getChapter7ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter7Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter7MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const chapterGrade = calculateChapter7Grade({
    microCheckPercent,
    chapterAssessmentPercent,
  })

  const flags = evaluateChapter7InterventionFlags({
    evidence,
    referenceTime: input.referenceTime,
    completionPercent: input.completionPercent,
    overallMasteryPercent: overallMastery,
    remediationCycles: remediationSummaries(input.remediationCycles, input.quizAttempts),
    masterySnapshots: buildSnapshots(evidence, input.referenceTime),
  })

  const sorted = [...supportedConcepts].sort((a, b) => a.mastery - b.mastery)
  const latestReassessment = input.quizAttempts
    .filter((attempt) => attempt.is_reassessment && isChapter7ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]

  const activeCycle = input.remediationCycles
    .filter((cycle) => cycle.status && !['completed', 'resolved', 'closed'].includes(cycle.status))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

  return {
    chapterGrade,
    overallMastery,
    overallConfidence: overallConfidence(concepts),
    chapterAssessmentPercent,
    microCheckPercent,
    strongestConcepts: [...sorted].reverse().slice(0, 3),
    weakestConcepts: sorted.slice(0, 3),
    concepts,
    interventionFlags: flags,
    remediationStatus: activeCycle
      ? `Active review — ${getChapter7ConceptFamily(activeCycle.concept_id as Chapter7ConceptFamilyId).name}`
      : input.remediationCycles.some((cycle) => cycle.reassessment_completed_at)
        ? 'Latest remediation cycle completed'
        : 'No active remediation',
    latestReassessment: latestReassessment
      ? `${latestReassessment.percentage}% — ${getChapter7ConceptFamily(latestReassessment.target_concept_id as Chapter7ConceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
