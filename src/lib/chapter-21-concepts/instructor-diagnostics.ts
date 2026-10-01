import type {
  Chapter21EvidenceRecord,
  Chapter21Confidence,
  Chapter21GradeResult,
  Chapter21Difficulty,
} from './grading'
import {
  calculateChapter21ConceptMastery,
  calculateChapter21Grade,
} from './grading'
import type { Chapter21ConceptFamilyId } from './types'
import {
  CHAPTER21_CONCEPT_FAMILY_IDS,
  getChapter21ConceptFamily,
} from './concepts'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import { chapter21ReassessmentReserve } from './reassessment-reserve'
import { chapter21QuizQuestionConceptMappings } from './mappings'
import type { Chapter21MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter21MicroCheckPercent,
  chapter21MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter21TargetedRemediationPlan } from './targeted-remediation'
import type { LiveInstructorActivityEvidenceRow } from '../concept-mastery/live-instructor-grade'
import {
  getFlashcardEvidenceConcept,
  getScenarioEvidenceConcept,
} from '../concept-mastery/activity-evidence-registry'
import {
  evaluateChapter21ComplianceIntervention,
  type Chapter21ComplianceIntervention,
} from './escalation'

export interface Chapter21InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter21InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter21Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter21InstructorDiagnosticSummary {
  chapterGrade: Chapter21GradeResult
  overallMastery: number
  overallConfidence: Chapter21Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter21InstructorConceptDiagnostic[]
  weakestConcepts: Chapter21InstructorConceptDiagnostic[]
  concepts: Chapter21InstructorConceptDiagnostic[]
  complianceIntervention: Chapter21ComplianceIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
  preservedInitialMissCount: number
}

const answerKey = new Map<string, string>(
  chapter21PremiumQuizQuestions.map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const quizDifficulty = new Map<string, Chapter21Difficulty>(
  chapter21PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter21ConceptFamilyId>(
  chapter21QuizQuestionConceptMappings.map((mapping) => [
    mapping.questionId,
    mapping.conceptFamilyId,
  ]),
)

const reassessmentById = new Map<
  string,
  (typeof chapter21ReassessmentReserve)[number]
>(chapter21ReassessmentReserve.map((question) => [question.id, question]))

function isAnswerLetter(
  value: unknown,
): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter21ConceptFamilyId(
  value: string | null | undefined,
): value is Chapter21ConceptFamilyId {
  return (
    !!value &&
    (CHAPTER21_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
  )
}

function latestInitialChapter21Attempt(
  attempts: readonly Chapter21InstructorQuizAttempt[],
): Chapter21InstructorQuizAttempt | null {
  return (
    attempts
      .filter(
        (attempt) => attempt.quiz_id === 'quiz-21' && !attempt.is_reassessment,
      )
      .sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime(),
      )[0] ?? null
  )
}

export function chapter21QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter21InstructorQuizAttempt[],
): Chapter21EvidenceRecord[] {
  const records: Chapter21EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      attempt.quiz_id !== 'quiz-21' ||
      attempt.is_reassessment ||
      !attempt.answers_json
    ) {
      continue
    }

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (
        !correct ||
        !conceptFamilyId ||
        !difficulty ||
        !isAnswerLetter(selected)
      ) {
        continue
      }

      records.push({
        studentId,
        chapterId: 'ch-21',
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

export function chapter21ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter21InstructorQuizAttempt[],
): Chapter21EvidenceRecord[] {
  const records: Chapter21EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      !attempt.is_reassessment ||
      !isChapter21ConceptFamilyId(attempt.target_concept_id) ||
      !attempt.answers_json
    ) {
      continue
    }

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (
        !question ||
        question.conceptFamilyId !== attempt.target_concept_id
      ) {
        continue
      }

      records.push({
        studentId,
        chapterId: 'ch-21',
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

function overallConfidence(
  concepts: readonly Chapter21InstructorConceptDiagnostic[],
): Chapter21Confidence {
  const rank: Record<Chapter21Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter21Confidence[] = [
    'insufficient_evidence',
    'emerging',
    'developing',
    'proficient',
    'strong',
  ]
  const supported = concepts.filter((concept) => concept.observations > 0)
  if (supported.length === 0) return 'insufficient_evidence'
  const averageRank =
    supported.reduce(
      (sum, concept) => sum + rank[concept.confidence],
      0,
    ) / supported.length
  return labels[Math.max(0, Math.min(4, Math.floor(averageRank)))]
}

interface Chapter21LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter21ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter21InstructorQuizAttempt[],
): Chapter21LatestFormalReassessment {
  const eligible = attempts
    .filter(
      (attempt) =>
        attempt.is_reassessment &&
        isChapter21ConceptFamilyId(attempt.target_concept_id),
    )
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() -
        new Date(a.completed_at).getTime(),
    )

  const latest = eligible[0]
  if (!latest || !isChapter21ConceptFamilyId(latest.target_concept_id)) {
    return {
      percent: null,
      answeredCount: 0,
      conceptFamilyId: null,
      completedAt: null,
    }
  }

  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === latest.target_concept_id,
      )
    : [latest]

  const evidence = chapter21ReassessmentAttemptsToEvidence(
    studentId,
    grouped,
  )
  const unique = new Map(evidence.map((record) => [record.itemId, record]))
  const answeredCount = unique.size
  const correctCount = [...unique.values()].filter(
    (record) => record.correct,
  ).length

  return {
    percent:
      answeredCount === 5
        ? Math.round((correctCount / 5) * 10000) / 100
        : null,
    answeredCount,
    conceptFamilyId: latest.target_concept_id,
    completedAt: latest.completed_at,
  }
}

export function buildChapter21InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter21MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter21InstructorQuizAttempt[]
  activityRows?: readonly LiveInstructorActivityEvidenceRow[]
  referenceTime: string
}): Chapter21InstructorDiagnosticSummary {
  const microEvidence = chapter21MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter21QuizAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const reassessmentEvidence = chapter21ReassessmentAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const activityEvidence = (input.activityRows ?? []).reduce<
    Chapter21EvidenceRecord[]
  >((records, row) => {
    if (row.chapter_id !== 'ch-21') return records

    if (row.source === 'flashcard') {
      const conceptFamilyId = getFlashcardEvidenceConcept(
        'ch-21',
        row.item_id,
      )
      if (
        !conceptFamilyId ||
        !(CHAPTER21_CONCEPT_FAMILY_IDS as readonly string[]).includes(
          conceptFamilyId,
        )
      ) {
        return records
      }
      records.push({
        studentId: input.studentId,
        chapterId: 'ch-21',
        conceptFamilyId: conceptFamilyId as Chapter21ConceptFamilyId,
        source: 'flashcard',
        itemId: row.item_id,
        difficulty: 'understanding',
        correct: row.is_correct,
        attemptPhase: 'initial',
        timestamp: row.answered_at ?? input.referenceTime,
      })
      return records
    }

    if (row.source === 'scenario_application') {
      const separator = row.item_id.lastIndexOf(':')
      const sectionId = separator >= 0 ? row.item_id.slice(0, separator) : row.item_id
      const indexText = separator >= 0 ? row.item_id.slice(separator + 1) : ''
      const index = Number(indexText)
      const conceptFamilyId = getScenarioEvidenceConcept(
        'ch-21',
        sectionId,
        Number.isInteger(index) ? index : undefined,
      )
      if (
        !conceptFamilyId ||
        !(CHAPTER21_CONCEPT_FAMILY_IDS as readonly string[]).includes(
          conceptFamilyId,
        )
      ) {
        return records
      }
      records.push({
        studentId: input.studentId,
        chapterId: 'ch-21',
        conceptFamilyId: conceptFamilyId as Chapter21ConceptFamilyId,
        source: 'scenario_application',
        itemId: row.item_id,
        difficulty: 'scenario',
        correct: row.is_correct,
        attemptPhase: 'initial',
        timestamp: row.answered_at ?? input.referenceTime,
      })
    }

    return records
  }, [])

  const evidence = [
    ...microEvidence,
    ...assessmentEvidence,
    ...activityEvidence,
    ...reassessmentEvidence,
  ]

  const concepts = CHAPTER21_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    const mastery = calculateChapter21ConceptMastery(
      records,
      input.referenceTime,
    )
    const recent = [...records].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )[0]

    return {
      conceptName: getChapter21ConceptFamily(conceptFamilyId).name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observations: mastery.observationCount,
      mostRecentEvidenceAt: recent?.timestamp ?? null,
      initialMisses: mastery.initialMissCount,
      reassessmentCorrect: mastery.reassessmentCorrectCount,
    }
  })

  const supportedConcepts = concepts.filter(
    (concept) => concept.observations > 0,
  )
  const overallMastery =
    supportedConcepts.length > 0
      ? Math.round(
          (supportedConcepts.reduce(
            (sum, concept) => sum + concept.mastery,
            0,
          ) /
            supportedConcepts.length) *
            100,
        ) / 100
      : 0

  const assessmentAttempt = latestInitialChapter21Attempt(input.quizAttempts)
  const microCheckPercent =
    calculatePersistedChapter21MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(
    input.studentId,
    input.quizAttempts,
  )
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter21Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const complianceIntervention =
    evaluateChapter21ComplianceIntervention(evidence)
  const remediationPlan = buildChapter21TargetedRemediationPlan(
    evidence,
    input.referenceTime,
  )
  const sorted = [...supportedConcepts].sort(
    (a, b) => a.mastery - b.mastery,
  )
  const complianceTargets = remediationPlan.targets.filter(
    (target) => target.priority === 'compliance',
  )
  const preservedInitialMissCount = concepts.reduce(
    (sum, concept) => sum + concept.initialMisses,
    0,
  )

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
    complianceIntervention,
    remediationStatus:
      complianceTargets.length > 0
        ? `Compliance review — ${complianceTargets[0].conceptName}`
        : remediationPlan.targets.length > 0
          ? `Targeted review — ${remediationPlan.targets[0].conceptName}`
          : 'No active remediation',
    latestReassessment: latestFormal.conceptFamilyId
      ? latestFormal.percent != null
        ? `${latestFormal.percent}% — ${getChapter21ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter21ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
    preservedInitialMissCount,
  }
}
