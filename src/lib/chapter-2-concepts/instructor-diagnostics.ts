import type {
  Chapter2Confidence,
  Chapter2Difficulty,
  Chapter2EvidenceRecord,
  Chapter2GradeResult,
} from './grading'
import { calculateChapter2ConceptMastery, calculateChapter2Grade } from './grading'
import type { ConceptId } from './types'
import { ACTIVE_CONCEPT_IDS, chapter2Concepts } from './concepts'
import {
  chapter2QuizQuestionMappings,
} from './mappings'
import { chapter2PremiumQuizQuestions } from '../chapter-2-premium-quiz'
import { chapter2ReassessmentQuestions } from '../chapter-2-reassessment-questions'
import type { Chapter2MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter2MicroCheckPercent,
  chapter2MicroCheckRowsToEvidence,
} from './micro-check-persistence'

export interface Chapter2InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter2InstructorConceptDiagnostic {
  conceptId: ConceptId
  conceptName: string
  mastery: number
  confidence: Chapter2Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter2InstructorDiagnosticSummary {
  chapterGrade: Chapter2GradeResult
  overallMastery: number
  overallConfidence: Chapter2Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter2InstructorConceptDiagnostic[]
  weakestConcepts: Chapter2InstructorConceptDiagnostic[]
  concepts: Chapter2InstructorConceptDiagnostic[]
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const activeConceptSet = new Set<string>(ACTIVE_CONCEPT_IDS)
const conceptName = new Map(
  chapter2Concepts.filter((concept) => concept.status === 'active').map((concept) => [concept.id, concept.name]),
)

const initialQuestionById = new Map(
  chapter2PremiumQuizQuestions.map((question) => [question.id, question]),
)
const reassessmentQuestionById = new Map(
  chapter2ReassessmentQuestions.map((question) => [question.id, question]),
)
const questionConcept = new Map<string, ConceptId>(
  chapter2QuizQuestionMappings.map((mapping) => [mapping.questionId, mapping.conceptId]),
)

function isConceptId(value: string | null | undefined): value is ConceptId {
  return !!value && activeConceptSet.has(value)
}

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function toDifficulty(value: string | null | undefined): Chapter2Difficulty {
  if (value === 'hard') return 'scenario'
  if (value === 'medium') return 'application'
  return 'understanding'
}

export function chapter2InitialAssessmentToEvidence(
  studentId: string,
  attempts: readonly Chapter2InstructorQuizAttempt[],
): Chapter2EvidenceRecord[] {
  const records: Chapter2EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-2' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = initialQuestionById.get(questionId)
      const conceptId = questionConcept.get(questionId)
      if (!question || !conceptId || !isConceptId(conceptId)) continue

      records.push({
        studentId,
        chapterId: 'ch-2',
        conceptId,
        source: 'chapter_assessment',
        itemId: questionId,
        difficulty: toDifficulty(question.difficulty),
        correct: selected === question.correct_answer,
        attemptPhase: 'initial',
        timestamp: attempt.completed_at,
      })
    }
  }

  return records
}

export function chapter2ReassessmentToEvidence(
  studentId: string,
  attempts: readonly Chapter2InstructorQuizAttempt[],
): Chapter2EvidenceRecord[] {
  const records: Chapter2EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isConceptId(attempt.target_concept_id) || !attempt.answers_json) continue

    const targetConceptId = attempt.target_concept_id

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentQuestionById.get(questionId)
      const mappedConcept = questionConcept.get(questionId)
      if (!question || mappedConcept !== targetConceptId) continue

      records.push({
        studentId,
        chapterId: 'ch-2',
        conceptId: targetConceptId,
        source: 'remediation_reassessment',
        itemId: questionId,
        difficulty: toDifficulty(question.difficulty),
        correct: selected === question.correct_answer,
        attemptPhase: 'reassessment',
        timestamp: attempt.completed_at,
      })
    }
  }

  return records
}

function aggregateConfidence(
  concepts: readonly Chapter2InstructorConceptDiagnostic[],
): Chapter2Confidence {
  const rank: Record<Chapter2Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter2Confidence[] = [
    'insufficient_evidence',
    'emerging',
    'developing',
    'proficient',
    'strong',
  ]
  const supported = concepts.filter((concept) => concept.observations > 0)
  if (!supported.length) return 'insufficient_evidence'
  const average = supported.reduce((sum, concept) => sum + rank[concept.confidence], 0) / supported.length
  return labels[Math.max(0, Math.min(4, Math.floor(average)))]
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter2InstructorQuizAttempt[],
): {
  percent: number | null
  answeredCount: number
  conceptId: ConceptId | null
} {
  const eligible = attempts
    .filter((attempt) => attempt.is_reassessment && isConceptId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  const latest = eligible[0]
  if (!latest || !isConceptId(latest.target_concept_id)) {
    return { percent: null, answeredCount: 0, conceptId: null }
  }

  const targetConceptId = latest.target_concept_id
  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === targetConceptId,
      )
    : [latest]

  const evidence = chapter2ReassessmentToEvidence(studentId, grouped)
  const unique = new Map(evidence.map((record) => [record.itemId, record]))
  const answeredCount = unique.size
  const correctCount = [...unique.values()].filter((record) => record.correct).length

  return {
    percent: answeredCount === 5 ? Math.round((correctCount / 5) * 10000) / 100 : null,
    answeredCount,
    conceptId: targetConceptId,
  }
}

export function buildChapter2InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter2MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter2InstructorQuizAttempt[]
  referenceTime: string
}): Chapter2InstructorDiagnosticSummary {
  const microEvidence = chapter2MicroCheckRowsToEvidence(input.microCheckRows)
  const initialEvidence = chapter2InitialAssessmentToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter2ReassessmentToEvidence(input.studentId, input.quizAttempts)
  const evidence = [...microEvidence, ...initialEvidence, ...reassessmentEvidence]

  const concepts = ACTIVE_CONCEPT_IDS.map((conceptId) => {
    const records = evidence.filter((record) => record.conceptId === conceptId)
    const mastery = calculateChapter2ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )[0]

    return {
      conceptId,
      conceptName: conceptName.get(conceptId) ?? conceptId,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observations: mastery.observationCount,
      mostRecentEvidenceAt: recent?.timestamp ?? null,
      initialMisses: mastery.initialMissCount,
      reassessmentCorrect: mastery.reassessmentCorrectCount,
    }
  })

  const supported = concepts.filter((concept) => concept.observations > 0)
  const overallMastery = supported.length
    ? Math.round((supported.reduce((sum, concept) => sum + concept.mastery, 0) / supported.length) * 100) / 100
    : 0

  const latestInitial = input.quizAttempts
    .filter((attempt) => attempt.quiz_id === 'quiz-2' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]

  const microCheckPercent = calculatePersistedChapter2MicroCheckPercent(input.microCheckRows)
  const latestReassessment = latestFormalReassessment(input.studentId, input.quizAttempts)
  const chapterAssessmentPercent = latestInitial?.percentage ?? null
  const chapterGrade = calculateChapter2Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent: latestReassessment.percent,
  })

  const sorted = [...supported].sort((a, b) => a.mastery - b.mastery)
  const weak = sorted.filter((concept) => concept.mastery <= 70 || concept.initialMisses >= 2)

  return {
    chapterGrade,
    overallMastery,
    overallConfidence: aggregateConfidence(concepts),
    chapterAssessmentPercent,
    microCheckPercent,
    remediationReassessmentPercent: latestReassessment.percent,
    strongestConcepts: [...sorted].reverse().slice(0, 3),
    weakestConcepts: sorted.slice(0, 3),
    concepts,
    remediationStatus: weak.length
      ? `Targeted review — ${weak[0].conceptName}`
      : 'No active mastery gap detected',
    latestReassessment: latestReassessment.conceptId
      ? latestReassessment.percent != null
        ? `${latestReassessment.percent}% — ${conceptName.get(latestReassessment.conceptId) ?? latestReassessment.conceptId}`
        : `${latestReassessment.answeredCount}/5 in progress — ${conceptName.get(latestReassessment.conceptId) ?? latestReassessment.conceptId}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
