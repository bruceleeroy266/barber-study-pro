import type {
  Chapter19EvidenceRecord,
  Chapter19Confidence,
  Chapter19GradeResult,
  Chapter19Difficulty,
} from './grading'
import {
  calculateChapter19ConceptMastery,
  calculateChapter19Grade,
} from './grading'
import type { Chapter19ConceptFamilyId } from './types'
import {
  CHAPTER19_CONCEPT_FAMILY_IDS,
  getChapter19ConceptFamily,
} from './concepts'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import { chapter19ReassessmentReserve } from './reassessment-reserve'
import { chapter19QuizQuestionConceptMappings } from './mappings'
import type { Chapter19MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter19MicroCheckPercent,
  chapter19MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter19TargetedRemediationPlan } from './targeted-remediation'
import type { LiveInstructorActivityEvidenceRow } from '../concept-mastery/live-instructor-grade'
import {
  getFlashcardEvidenceConcept,
  getScenarioEvidenceConcept,
} from '../concept-mastery/activity-evidence-registry'
import {
  evaluateChapter19ComplianceIntervention,
  evaluateChapter19SafetyIntervention,
  type Chapter19ComplianceIntervention,
  type Chapter19SafetyIntervention,
} from './escalation'

export interface Chapter19InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter19InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter19Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter19InstructorDiagnosticSummary {
  chapterGrade: Chapter19GradeResult
  overallMastery: number
  overallConfidence: Chapter19Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter19InstructorConceptDiagnostic[]
  weakestConcepts: Chapter19InstructorConceptDiagnostic[]
  concepts: Chapter19InstructorConceptDiagnostic[]
  safetyIntervention: Chapter19SafetyIntervention
  complianceIntervention: Chapter19ComplianceIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter19PremiumQuizQuestions.map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const quizDifficulty = new Map<string, Chapter19Difficulty>(
  chapter19PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter19ConceptFamilyId>(
  chapter19QuizQuestionConceptMappings.map((mapping) => [
    mapping.questionId,
    mapping.conceptFamilyId,
  ]),
)

const reassessmentById = new Map<
  string,
  (typeof chapter19ReassessmentReserve)[number]
>(chapter19ReassessmentReserve.map((question) => [question.id, question]))

function isAnswerLetter(
  value: unknown,
): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter19ConceptFamilyId(
  value: string | null | undefined,
): value is Chapter19ConceptFamilyId {
  return (
    !!value &&
    (CHAPTER19_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
  )
}

function latestInitialChapter19Attempt(
  attempts: readonly Chapter19InstructorQuizAttempt[],
): Chapter19InstructorQuizAttempt | null {
  return (
    attempts
      .filter(
        (attempt) => attempt.quiz_id === 'quiz-19' && !attempt.is_reassessment,
      )
      .sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime(),
      )[0] ?? null
  )
}

export function chapter19QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter19InstructorQuizAttempt[],
): Chapter19EvidenceRecord[] {
  const records: Chapter19EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      attempt.quiz_id !== 'quiz-19' ||
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
        chapterId: 'ch-19',
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

export function chapter19ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter19InstructorQuizAttempt[],
): Chapter19EvidenceRecord[] {
  const records: Chapter19EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (
      !attempt.is_reassessment ||
      !isChapter19ConceptFamilyId(attempt.target_concept_id) ||
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
        chapterId: 'ch-19',
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
  concepts: readonly Chapter19InstructorConceptDiagnostic[],
): Chapter19Confidence {
  const rank: Record<Chapter19Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter19Confidence[] = [
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

interface Chapter19LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter19ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter19InstructorQuizAttempt[],
): Chapter19LatestFormalReassessment {
  const eligible = attempts
    .filter(
      (attempt) =>
        attempt.is_reassessment &&
        isChapter19ConceptFamilyId(attempt.target_concept_id),
    )
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() -
        new Date(a.completed_at).getTime(),
    )

  const latest = eligible[0]
  if (!latest || !isChapter19ConceptFamilyId(latest.target_concept_id)) {
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

  const evidence = chapter19ReassessmentAttemptsToEvidence(
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

export function buildChapter19InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter19MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter19InstructorQuizAttempt[]
  activityRows?: readonly LiveInstructorActivityEvidenceRow[]
  referenceTime: string
}): Chapter19InstructorDiagnosticSummary {
  const microEvidence = chapter19MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter19QuizAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const reassessmentEvidence = chapter19ReassessmentAttemptsToEvidence(
    input.studentId,
    input.quizAttempts,
  )
  const activityEvidence = (input.activityRows ?? []).reduce<
    Chapter19EvidenceRecord[]
  >((records, row) => {
    if (row.chapter_id !== 'ch-19') return records

    if (row.source === 'flashcard') {
      const conceptFamilyId = getFlashcardEvidenceConcept(
        'ch-19',
        row.item_id,
      )
      if (
        !conceptFamilyId ||
        !(CHAPTER19_CONCEPT_FAMILY_IDS as readonly string[]).includes(
          conceptFamilyId,
        )
      ) {
        return records
      }
      records.push({
        studentId: input.studentId,
        chapterId: 'ch-19',
        conceptFamilyId: conceptFamilyId as Chapter19ConceptFamilyId,
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
      const [sectionId, indexText] = row.item_id.split(':')
      const index = Number(indexText)
      const conceptFamilyId = getScenarioEvidenceConcept(
        'ch-19',
        sectionId,
        Number.isInteger(index) ? index : undefined,
      )
      if (
        !conceptFamilyId ||
        !(CHAPTER19_CONCEPT_FAMILY_IDS as readonly string[]).includes(
          conceptFamilyId,
        )
      ) {
        return records
      }
      records.push({
        studentId: input.studentId,
        chapterId: 'ch-19',
        conceptFamilyId: conceptFamilyId as Chapter19ConceptFamilyId,
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

  const concepts = CHAPTER19_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    const mastery = calculateChapter19ConceptMastery(
      records,
      input.referenceTime,
    )
    const recent = [...records].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )[0]

    return {
      conceptName: getChapter19ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter19Attempt(input.quizAttempts)
  const microCheckPercent =
    calculatePersistedChapter19MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(
    input.studentId,
    input.quizAttempts,
  )
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter19Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyIntervention = evaluateChapter19SafetyIntervention(evidence)
  const complianceIntervention =
    evaluateChapter19ComplianceIntervention(evidence)
  const remediationPlan = buildChapter19TargetedRemediationPlan(
    evidence,
    input.referenceTime,
  )
  const sorted = [...supportedConcepts].sort(
    (a, b) => a.mastery - b.mastery,
  )
  const urgentTargets = remediationPlan.targets.filter(
    (target) => target.priority === 'urgent',
  )
  const priorityTargets = remediationPlan.targets.filter(
    (target) => target.priority === 'priority',
  )
  const complianceTargets = remediationPlan.targets.filter(
    (target) => target.priority === 'compliance',
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
    safetyIntervention,
    complianceIntervention,
    remediationStatus:
      urgentTargets.length > 0
        ? `Urgent safety remediation — ${urgentTargets[0].conceptName}`
        : priorityTargets.length > 0
          ? `Priority safety review — ${priorityTargets[0].conceptName}`
          : complianceTargets.length > 0
            ? `Compliance review — ${complianceTargets[0].conceptName}`
            : remediationPlan.targets.length > 0
              ? `Targeted review — ${remediationPlan.targets[0].conceptName}`
              : 'No active remediation',
    latestReassessment: latestFormal.conceptFamilyId
      ? latestFormal.percent != null
        ? `${latestFormal.percent}% — ${getChapter19ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter19ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
