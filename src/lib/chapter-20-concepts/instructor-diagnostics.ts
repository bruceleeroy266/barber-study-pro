import type {
  Chapter20EvidenceRecord,
  Chapter20Confidence,
  Chapter20GradeResult,
  Chapter20Difficulty,
} from './grading'
import {
  calculateChapter20ConceptMastery,
  calculateChapter20Grade,
} from './grading'
import type { Chapter20ConceptFamilyId } from './types'
import {
  CHAPTER20_CONCEPT_FAMILY_IDS,
  getChapter20ConceptFamily,
} from './concepts'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { chapter20ReassessmentReserve } from './reassessment-reserve'
import { chapter20QuizQuestionConceptMappings } from './mappings'
import type { Chapter20MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter20MicroCheckPercent,
  chapter20MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter20TargetedRemediationPlan } from './targeted-remediation'
import type { LiveInstructorActivityEvidenceRow } from '../concept-mastery/live-instructor-grade'
import {
  getFlashcardEvidenceConcept,
  getScenarioEvidenceConcept,
} from '../concept-mastery/activity-evidence-registry'
import {
  evaluateChapter20ComplianceIntervention,
  type Chapter20ComplianceIntervention,
} from './escalation'

export interface Chapter20InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter20InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter20Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter20InstructorDiagnosticSummary {
  chapterGrade: Chapter20GradeResult
  overallMastery: number
  overallConfidence: Chapter20Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter20InstructorConceptDiagnostic[]
  weakestConcepts: Chapter20InstructorConceptDiagnostic[]
  concepts: Chapter20InstructorConceptDiagnostic[]
  complianceIntervention: Chapter20ComplianceIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
  preservedInitialMissCount: number
}

const answerKey = new Map<string, string>(
  chapter20PremiumQuizQuestions.map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const quizDifficulty = new Map<string, Chapter20Difficulty>(
  chapter20PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter20ConceptFamilyId>(
  chapter20QuizQuestionConceptMappings.map((mapping) => [
    mapping.questionId,
    mapping.conceptFamilyId,
  ]),
)

const reassessmentById = new Map<
  string,
  (typeof chapter20ReassessmentReserve)[number]
>(chapter20ReassessmentReserve.map((question) => [question.id, question]))

function isAnswerLetter(
  value: unknown,
): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter20ConceptFamilyId(
  value: string | null | undefined,
): value is Chapter20ConceptFamilyId {
  return (
    !!value &&
    (CHAPTER20_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
  )
}

function latestInitialChapter20Attempt(
  attempts: readonly Chapter20InstructorQuizAttempt[],
): Chapter20InstructorQuizAttempt | null {
  return (
    attempts
      .filter(
        (attempt) => attempt.quiz_id === 'quiz-20' && !attempt.is_reassessment,
      )
      .sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime(),
      )[0] ?? null
  )
}

export function chapter20QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter20InstructorQuizAttempt[],
): Chapter20EvidenceRecord[] {
  const records: Chapter20EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      attempt.quiz_id !== 'quiz-20' ||
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
        chapterId: 'ch-20',
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

export function chapter20ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter20InstructorQuizAttempt[],
): Chapter20EvidenceRecord[] {
  const records: Chapter20EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      !attempt.is_reassessment ||
      !isChapter20ConceptFamilyId(attempt.target_concept_id) ||
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
        chapterId: 'ch-20',
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
  concepts: readonly Chapter20InstructorConceptDiagnostic[],
): Chapter20Confidence {
  const rank: Record<Chapter20Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter20Confidence[] = [
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

interface Chapter20LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter20ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter20InstructorQuizAttempt[],
): Chapter20LatestFormalReassessment {
  const eligible = attempts
    .filter(
      (attempt) =>
        attempt.is_reassessment &&
        isChapter20ConceptFamilyId(attempt.target_concept_id),
    )
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() -
        new Date(a.completed_at).getTime(),
    )

  const latest = eligible[0]
  if (!latest || !isChapter20ConceptFamilyId(latest.target_concept_id)) {
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

  const evidence = chapter20ReassessmentAttemptsToEvidence(
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

export function buildChapter20InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter20MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter20InstructorQuizAttempt[]
  activityRows?: readonly LiveInstructorActivityEvidenceRow[]
  referenceTime: string
}): Chapter20InstructorDiagnosticSummary {
  const microEvidence = chapter20MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter20QuizAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const reassessmentEvidence = chapter20ReassessmentAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const activityEvidence = (input.activityRows ?? []).reduce<
    Chapter20EvidenceRecord[]
  >((records, row) => {
    if (row.chapter_id !== 'ch-20') return records

    if (row.source === 'flashcard') {
      const conceptFamilyId = getFlashcardEvidenceConcept(
        'ch-20',
        row.item_id,
      )
      if (
        !conceptFamilyId ||
        !(CHAPTER20_CONCEPT_FAMILY_IDS as readonly string[]).includes(
          conceptFamilyId,
        )
      ) {
        return records
      }
      records.push({
        studentId: input.studentId,
        chapterId: 'ch-20',
        conceptFamilyId: conceptFamilyId as Chapter20ConceptFamilyId,
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
        'ch-20',
        sectionId,
        Number.isInteger(index) ? index : undefined,
      )
      if (
        !conceptFamilyId ||
        !(CHAPTER20_CONCEPT_FAMILY_IDS as readonly string[]).includes(
          conceptFamilyId,
        )
      ) {
        return records
      }
      records.push({
        studentId: input.studentId,
        chapterId: 'ch-20',
        conceptFamilyId: conceptFamilyId as Chapter20ConceptFamilyId,
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

  const concepts = CHAPTER20_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    const mastery = calculateChapter20ConceptMastery(
      records,
      input.referenceTime,
    )
    const recent = [...records].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )[0]

    return {
      conceptName: getChapter20ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter20Attempt(input.quizAttempts)
  const microCheckPercent =
    calculatePersistedChapter20MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(
    input.studentId,
    input.quizAttempts,
  )
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter20Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const complianceIntervention =
    evaluateChapter20ComplianceIntervention(evidence)
  const remediationPlan = buildChapter20TargetedRemediationPlan(
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
        ? `${latestFormal.percent}% — ${getChapter20ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter20ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
    preservedInitialMissCount,
  }
}
