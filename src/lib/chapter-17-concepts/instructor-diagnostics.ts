import type { Chapter17EvidenceRecord, Chapter17Confidence, Chapter17GradeResult, Chapter17Difficulty } from './grading'
import { calculateChapter17ConceptMastery, calculateChapter17Grade } from './grading'
import type { Chapter17ConceptFamilyId } from './types'
import { CHAPTER17_CONCEPT_FAMILY_IDS, getChapter17ConceptFamily } from './concepts'
import { chapter17PremiumQuizQuestions } from '../chapter-17-premium-quiz'
import { chapter17ReassessmentReserve } from './reassessment-reserve'
import { chapter17QuizQuestionConceptMappings } from './mappings'
import type { Chapter17MicroCheckAttemptRow } from './micro-check-persistence'
import {
  calculatePersistedChapter17MicroCheckPercent,
  chapter17MicroCheckRowsToEvidence,
} from './micro-check-persistence'
import { buildChapter17TargetedRemediationPlan } from './targeted-remediation'
import type { LiveInstructorActivityEvidenceRow } from '../concept-mastery/live-instructor-grade'
import { getFlashcardEvidenceConcept, getScenarioEvidenceConcept } from '../concept-mastery/activity-evidence-registry'
import { evaluateChapter17SafetyIntervention, type Chapter17SafetyIntervention } from './safety-intervention'

export interface Chapter17InstructorQuizAttempt {
  quiz_id: string
  percentage: number
  answers_json: Record<string, unknown> | null
  completed_at: string
  is_reassessment?: boolean | null
  target_concept_id?: string | null
  remediation_cycle_id?: string | null
}

export interface Chapter17InstructorConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence: Chapter17Confidence
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface Chapter17InstructorDiagnosticSummary {
  chapterGrade: Chapter17GradeResult
  overallMastery: number
  overallConfidence: Chapter17Confidence
  chapterAssessmentPercent: number | null
  microCheckPercent: number | null
  remediationReassessmentPercent: number | null
  strongestConcepts: Chapter17InstructorConceptDiagnostic[]
  weakestConcepts: Chapter17InstructorConceptDiagnostic[]
  concepts: Chapter17InstructorConceptDiagnostic[]
  safetyIntervention: Chapter17SafetyIntervention
  remediationStatus: string
  latestReassessment: string
  evidenceCount: number
}

const answerKey = new Map<string, string>(
  chapter17PremiumQuizQuestions.map((question) => [question.id, question.correct_answer]),
)

const quizDifficulty = new Map<string, Chapter17Difficulty>(
  chapter17PremiumQuizQuestions.map((question) => [
    question.id,
    question.difficulty === 'hard'
      ? 'scenario'
      : question.difficulty === 'medium'
        ? 'application'
        : 'understanding',
  ]),
)

const quizConcept = new Map<string, Chapter17ConceptFamilyId>(
  chapter17QuizQuestionConceptMappings.map((mapping) => [mapping.questionId, mapping.conceptFamilyId]),
)

const reassessmentById = new Map<string, (typeof chapter17ReassessmentReserve)[number]>(
  chapter17ReassessmentReserve.map((question) => [question.id, question]),
)

function isAnswerLetter(value: unknown): value is 'a' | 'b' | 'c' | 'd' {
  return value === 'a' || value === 'b' || value === 'c' || value === 'd'
}

function isChapter17ConceptFamilyId(value: string | null | undefined): value is Chapter17ConceptFamilyId {
  return !!value && (CHAPTER17_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
}

function latestInitialChapter17Attempt(
  attempts: readonly Chapter17InstructorQuizAttempt[],
): Chapter17InstructorQuizAttempt | null {
  return attempts
    .filter((attempt) => attempt.quiz_id === 'quiz-17' && !attempt.is_reassessment)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0] ?? null
}

export function chapter17QuizAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter17InstructorQuizAttempt[],
): Chapter17EvidenceRecord[] {
  const records: Chapter17EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (attempt.quiz_id !== 'quiz-17' || attempt.is_reassessment || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      const correct = answerKey.get(questionId)
      const conceptFamilyId = quizConcept.get(questionId)
      const difficulty = quizDifficulty.get(questionId)
      if (!correct || !conceptFamilyId || !difficulty || !isAnswerLetter(selected)) continue

      records.push({
        studentId,
        chapterId: 'ch-17',
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

export function chapter17ReassessmentAttemptsToEvidence(
  studentId: string,
  attempts: readonly Chapter17InstructorQuizAttempt[],
): Chapter17EvidenceRecord[] {
  const records: Chapter17EvidenceRecord[] = []

  for (const attempt of attempts) {
    if (!attempt.is_reassessment || !isChapter17ConceptFamilyId(attempt.target_concept_id) || !attempt.answers_json) continue

    for (const [questionId, selected] of Object.entries(attempt.answers_json)) {
      if (!isAnswerLetter(selected)) continue
      const question = reassessmentById.get(questionId)
      if (!question || question.conceptFamilyId !== attempt.target_concept_id) continue

      records.push({
        studentId,
        chapterId: 'ch-17',
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

function overallConfidence(concepts: readonly Chapter17InstructorConceptDiagnostic[]): Chapter17Confidence {
  const rank: Record<Chapter17Confidence, number> = {
    insufficient_evidence: 0,
    emerging: 1,
    developing: 2,
    proficient: 3,
    strong: 4,
  }
  const labels: Chapter17Confidence[] = [
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

interface Chapter17LatestFormalReassessment {
  percent: number | null
  answeredCount: number
  conceptFamilyId: Chapter17ConceptFamilyId | null
  completedAt: string | null
}

function latestFormalReassessment(
  studentId: string,
  attempts: readonly Chapter17InstructorQuizAttempt[],
): Chapter17LatestFormalReassessment {
  const eligible = attempts
    .filter((attempt) => attempt.is_reassessment && isChapter17ConceptFamilyId(attempt.target_concept_id))
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  const latest = eligible[0]
  if (!latest || !isChapter17ConceptFamilyId(latest.target_concept_id)) {
    return { percent: null, answeredCount: 0, conceptFamilyId: null, completedAt: null }
  }

  const grouped = latest.remediation_cycle_id
    ? eligible.filter(
        (attempt) =>
          attempt.remediation_cycle_id === latest.remediation_cycle_id &&
          attempt.target_concept_id === latest.target_concept_id,
      )
    : [latest]

  const evidence = chapter17ReassessmentAttemptsToEvidence(studentId, grouped)
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

export function buildChapter17InstructorDiagnostics(input: {
  studentId: string
  completionPercent: number
  microCheckRows: readonly Chapter17MicroCheckAttemptRow[]
  quizAttempts: readonly Chapter17InstructorQuizAttempt[]
  activityRows?: readonly LiveInstructorActivityEvidenceRow[]
  referenceTime: string
}): Chapter17InstructorDiagnosticSummary {
  const microEvidence = chapter17MicroCheckRowsToEvidence(input.microCheckRows)
  const assessmentEvidence = chapter17QuizAttemptsToEvidence(input.studentId, input.quizAttempts)
  const reassessmentEvidence = chapter17ReassessmentAttemptsToEvidence(input.studentId, input.quizAttempts)
  const activityEvidence: Chapter17EvidenceRecord[] = (input.activityRows ?? []).flatMap((row) => {
    if (row.chapter_id !== 'ch-17') return []
    if (row.source === 'flashcard') {
      const conceptFamilyId = getFlashcardEvidenceConcept('ch-17', row.item_id)
      if (!conceptFamilyId || !(CHAPTER17_CONCEPT_FAMILY_IDS as readonly string[]).includes(conceptFamilyId)) return []
      return [{
        studentId: input.studentId,
        chapterId: 'ch-17' as const,
        conceptFamilyId: conceptFamilyId as Chapter17ConceptFamilyId,
        source: 'flashcard' as const,
        itemId: row.item_id,
        difficulty: 'understanding' as const,
        correct: row.is_correct,
        attemptPhase: 'initial' as const,
        timestamp: input.referenceTime,
      }]
    }
    if (row.source === 'scenario_application') {
      const [sectionId, indexText] = row.item_id.split(':')
      const index = Number(indexText)
      const conceptFamilyId = getScenarioEvidenceConcept('ch-17', sectionId, Number.isInteger(index) ? index : undefined)
      if (!conceptFamilyId || !(CHAPTER17_CONCEPT_FAMILY_IDS as readonly string[]).includes(conceptFamilyId)) return []
      return [{
        studentId: input.studentId,
        chapterId: 'ch-17' as const,
        conceptFamilyId: conceptFamilyId as Chapter17ConceptFamilyId,
        source: 'scenario_application' as const,
        itemId: row.item_id,
        difficulty: 'scenario' as const,
        correct: row.is_correct,
        attemptPhase: 'initial' as const,
        timestamp: input.referenceTime,
      }]
    }
    return []
  })
  const evidence = [...microEvidence, ...assessmentEvidence, ...activityEvidence, ...reassessmentEvidence]

  const concepts = CHAPTER17_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const records = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter17ConceptMastery(records, input.referenceTime)
    const recent = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return {
      conceptName: getChapter17ConceptFamily(conceptFamilyId).name,
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

  const assessmentAttempt = latestInitialChapter17Attempt(input.quizAttempts)
  const microCheckPercent = calculatePersistedChapter17MicroCheckPercent(input.microCheckRows)
  const chapterAssessmentPercent = assessmentAttempt?.percentage ?? null
  const latestFormal = latestFormalReassessment(input.studentId, input.quizAttempts)
  const remediationReassessmentPercent = latestFormal.percent
  const chapterGrade = calculateChapter17Grade({
    microCheckPercent,
    chapterAssessmentPercent,
    remediationReassessmentPercent,
  })

  const safetyIntervention = evaluateChapter17SafetyIntervention(evidence)
  const remediationPlan = buildChapter17TargetedRemediationPlan(evidence, input.referenceTime)
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
        ? `${latestFormal.percent}% — ${getChapter17ConceptFamily(latestFormal.conceptFamilyId).name}`
        : `${latestFormal.answeredCount}/5 in progress — ${getChapter17ConceptFamily(latestFormal.conceptFamilyId).name}`
      : 'No reassessment recorded',
    evidenceCount: evidence.length,
  }
}
