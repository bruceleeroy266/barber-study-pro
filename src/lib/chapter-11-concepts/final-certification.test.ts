import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter11PremiumContent } from '../chapter-11-premium'
import { chapter11PremiumFlashcards } from '../chapter-11-premium-flashcards'
import { chapter11PremiumQuizQuestions } from '../chapter-11-premium-quiz'
import {
  ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS,
  chapter11ConceptFamilies,
} from './concepts'
import {
  chapter11ContentConceptMappings,
  chapter11FlashcardConceptMappings,
  chapter11QuizQuestionConceptMappings,
} from './mappings'
import { chapter11MicroChecks, buildChapter11MicroCheckEvidence } from './micro-checks'
import { evaluateChapter11SafetyIntervention } from './safety-intervention'
import {
  buildChapter11ReassessmentEvidence,
  buildChapter11TargetedRemediationPlan,
  calculateChapter11RecoveredMastery,
  scoreChapter11ReassessmentCycle,
  selectChapter11ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter11ReassessmentReserve,
  getChapter11ReassessmentReserve,
} from './reassessment-reserve'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { createHistoricalExclusionEngine } from '@/lib/reassessment/exclusion-engine'
import { hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'
import { buildChapter11InstructorDiagnostics } from './instructor-diagnostics'
import type { Chapter11EvidenceRecord } from './grading'
import type {
  HistoricalQuizAttempt,
  IExclusionDatabaseClient,
  ReassessmentQuestionHistoryRecord,
} from '@/lib/reassessment/types'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a', 'b', 'c', 'd'] as const).find((answer) => answer !== correct) ?? 'a'
}

const evidence = (
  conceptFamilyId: Chapter11EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter11EvidenceRecord['source'] = 'chapter_assessment',
  timestamp = '2026-09-28T03:50:00.000Z',
): Chapter11EvidenceRecord => ({
  studentId: 'student-c11-final',
  chapterId: 'ch-11',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

class ExclusionDb implements IExclusionDatabaseClient {
  constructor(private readonly attempts: HistoricalQuizAttempt[]) {}
  async getHistoricalQuizAttempts() { return this.attempts }
  async getReassessmentQuestionHistory(): Promise<ReassessmentQuestionHistoryRecord[]> { return [] }
  async recordQuestionAttempt() { return 'history-c11' }
  async checkAndRecordPoolExhaustion() { return 'exhaustion-c11' }
}

describe('C11-8 final Chapter 11 end-to-end certification', () => {
  it('locks the hardened inventory and canonical coverage', () => {
    expect(chapter11PremiumContent).toBeDefined()
    expect(chapter11ContentConceptMappings).toHaveLength(27)
    expect(chapter11PremiumFlashcards).toHaveLength(80)
    expect(chapter11PremiumQuizQuestions).toHaveLength(50)
    expect(chapter11MicroChecks.flatMap((check) => check.questions)).toHaveLength(17)
    expect(chapter11ReassessmentReserve).toHaveLength(40)
    expect(chapter11ConceptFamilies).toHaveLength(8)

    expect(new Set(chapter11PremiumFlashcards.map((card) => card.id)).size).toBe(80)
    expect(new Set(chapter11PremiumQuizQuestions.map((question) => question.id)).size).toBe(50)
    expect(new Set(chapter11ReassessmentReserve.map((question) => question.id)).size).toBe(40)

    for (const conceptFamilyId of ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS) {
      expect(chapter11ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter11FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter11QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter11MicroChecks.some((check) => check.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(getChapter11ReassessmentReserve(conceptFamilyId)).toHaveLength(5)
    }
  })

  it('registers Chapter 11 for live detection, targeted content, and fresh reassessment selection', async () => {
    expect(isConceptDetectionSupported('ch-11')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-11')).toBe(true)

    const provider = getChapterContentProvider('ch-11')
    expect(provider).toBeDefined()

    for (const concept of chapter11ConceptFamilies) {
      const bundle = provider!.buildRemediationContentBundle(concept.id)
      expect(bundle.conceptId).toBe(concept.id)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(1)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(1)
      expect(provider!.filterFlashcardsByConcept(concept.id).every((card) => card.is_active)).toBe(true)
    }

    const target = 'ch11-analysis-product-selection'
    const initialIds = chapter11QuizQuestionConceptMappings
      .filter((mapping) => mapping.conceptFamilyId === target)
      .map((mapping) => mapping.questionId)

    const historical: HistoricalQuizAttempt = {
      id: 'hist-c11-1',
      userId: 'student-c11-final',
      quizId: 'quiz-11',
      answersJson: Object.fromEntries(initialIds.map((id) => [id, 'a'])),
      completedAt: new Date('2026-09-28T03:40:00.000Z'),
    }

    const engine = createHistoricalExclusionEngine(new ExclusionDb([historical]), 'ch-11')
    const selected = await engine.selectReassessmentQuestion(
      'student-c11-final',
      target,
      'cycle-c11-final-1',
    )

    expect(selected.success).toBe(true)
    expect(selected.selectedQuestionId).toBe('r11-analysis-001')
    expect(selected.selectedQuestionId?.startsWith('r11-')).toBe(true)
    expect(initialIds.every((id) => selected.exclusionSet.combinedExclusionSet.has(id))).toBe(true)
  })

  it('preserves first-attempt micro-check evidence', () => {
    const records = buildChapter11MicroCheckEvidence(
      'student-c11-final',
      [
        { questionId: 'mcq-11-003', selectedAnswer: 'b' },
        { questionId: 'mcq-11-003', selectedAnswer: 'a' },
      ],
      '2026-09-28T03:41:00.000Z',
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      source: 'micro_check',
      attemptPhase: 'initial',
      conceptFamilyId: 'ch11-analysis-product-selection',
      itemId: 'mcq-11-003',
      correct: false,
    })
  })

  it('runs a normal gap through targeted content, five fresh questions, recovery, and preserved history', () => {
    const original = [
      evidence('ch11-analysis-product-selection', 'qq-11-013', false),
      evidence('ch11-analysis-product-selection', 'mcq-11-003', false, 'micro_check', '2026-09-28T03:51:00.000Z'),
      evidence('ch11-analysis-product-selection', 'qq-11-014', true, 'chapter_assessment', '2026-09-28T03:52:00.000Z'),
    ]
    const snapshot = JSON.stringify(original)

    const plan = buildChapter11TargetedRemediationPlan(original, '2026-09-28T03:53:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch11-analysis-product-selection')!

    expect(target).toBeDefined()
    expect(target.remediationContentBlockIds).toEqual(
      chapter11ContentConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === 'ch11-analysis-product-selection')
        .map((mapping) => mapping.contentBlockId),
    )
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)

    const selectedIds = selectChapter11ReassessmentQuestions(
      'ch11-analysis-product-selection',
      chapter11ReassessmentReserve,
    )
    const selectedQuestions = getChapter11ReassessmentReserve('ch11-analysis-product-selection')
    expect(selectedIds).toHaveLength(5)
    expect(selectedIds.every((id) => id.startsWith('r11-'))).toBe(true)

    const responses = selectedIds.map((questionId) => ({ questionId, correct: true }))
    const cycle = scoreChapter11ReassessmentCycle({
      cycleId: 'c11-final-normal',
      conceptFamilyId: 'ch11-analysis-product-selection',
      selectedQuestionIds: selectedIds,
      responses,
      passPercent: 80,
    })
    expect(cycle.passed).toBe(true)
    expect(cycle.percent).toBe(100)

    const recovery = buildChapter11ReassessmentEvidence({
      studentId: 'student-c11-final',
      conceptFamilyId: 'ch11-analysis-product-selection',
      selectedQuestions,
      responses,
      timestamp: '2026-09-28T04:00:00.000Z',
    })

    const result = calculateChapter11RecoveredMastery(
      original,
      recovery,
      'ch11-analysis-product-selection',
      '2026-09-28T04:01:00.000Z',
    )

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
  })

  it('runs distinct safety misses through urgent escalation and requires 5/5', () => {
    const original = [
      evidence('ch11-service-safety-referral', 'qq-11-039', false, 'chapter_assessment', '2026-09-28T03:50:00.000Z'),
      evidence('ch11-service-safety-referral', 'qq-11-038', true, 'chapter_assessment', '2026-09-28T03:51:00.000Z'),
      evidence('ch11-service-safety-referral', 'qq-11-043', false, 'chapter_assessment', '2026-09-28T03:52:00.000Z'),
    ]

    const safety = evaluateChapter11SafetyIntervention(original)
    expect(safety.level).toBe('urgent')
    expect(safety.reassessmentQuestionCount).toBe(5)
    expect(safety.reassessmentPassPercent).toBe(100)

    const selected = selectChapter11ReassessmentQuestions(
      'ch11-service-safety-referral',
      chapter11ReassessmentReserve,
    )
    const fourOfFive = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))
    const allFive = selected.map((questionId) => ({ questionId, correct: true }))

    expect(scoreChapter11ReassessmentCycle({
      cycleId: 'c11-final-safety-fail',
      conceptFamilyId: 'ch11-service-safety-referral',
      selectedQuestionIds: selected,
      responses: fourOfFive,
      passPercent: 100,
    }).passed).toBe(false)

    expect(scoreChapter11ReassessmentCycle({
      cycleId: 'c11-final-safety-pass',
      conceptFamilyId: 'ch11-service-safety-referral',
      selectedQuestionIds: selected,
      responses: allFive,
      passPercent: 100,
    }).passed).toBe(true)
  })

  it('shows preserved initial misses and five-question recovery in instructor diagnostics', () => {
    const target = 'ch11-analysis-product-selection'
    const initialQuestions = chapter11PremiumQuizQuestions.filter((question) =>
      chapter11QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )

    const initialAttempt = {
      quiz_id: 'quiz-11',
      percentage: 0,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [question.id, wrongAnswer(question.correct_answer)]),
      ),
      completed_at: '2026-09-28T03:40:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const before = buildChapter11InstructorDiagnostics({
      studentId: 'student-c11-final',
      completionPercent: 80,
      microCheckRows: [],
      quizAttempts: [initialAttempt],
      referenceTime: '2026-09-28T04:10:00.000Z',
    })

    const reserve = getChapter11ReassessmentReserve(target)
    const reassessmentAttempts = reserve.map((question, index) => ({
      quiz_id: 'quiz-11',
      percentage: 100,
      answers_json: { [question.id]: question.correctAnswer },
      completed_at: `2026-09-28T04:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c11-analysis-1',
    }))

    const after = buildChapter11InstructorDiagnostics({
      studentId: 'student-c11-final',
      completionPercent: 80,
      microCheckRows: [],
      quizAttempts: [initialAttempt, ...reassessmentAttempts],
      referenceTime: '2026-09-28T04:10:00.000Z',
    })

    const conceptName = chapter11ConceptFamilies.find((concept) => concept.id === target)!.name
    const beforeConcept = before.concepts.find((concept) => concept.conceptName === conceptName)!
    const afterConcept = after.concepts.find((concept) => concept.conceptName === conceptName)!

    expect(beforeConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.reassessmentCorrect).toBe(5)
    expect(afterConcept.mastery).toBeGreaterThan(beforeConcept.mastery)
    expect(after.latestReassessment).toContain('100%')
    expect(after.latestReassessment).toContain(conceptName)
    expect(after.chapterGrade.finalGrade).toBeGreaterThanOrEqual(after.chapterGrade.baseGrade)
  })

  it('uses one authorized student evidence route for instructor and school-admin Chapter 11 visibility', () => {
    const root = process.cwd()
    const page = readFileSync(join(root, 'src/app/instructor/student/[studentId]/page.tsx'), 'utf8')
    const schoolPanel = readFileSync(join(root, 'src/components/school-owner/StudentPerformancePanel.tsx'), 'utf8')

    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c11-final')).toBe(true)

    expect(page.match(/\.from\('chapter_micro_check_attempts'\)/g)).toHaveLength(1)
    expect(page).toContain(".in('chapter_id', ['ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9','ch-10','ch-11','ch-12','ch-13'])")
    expect(page).toContain("row.chapter_id === 'ch-11'")
    expect(page).toContain('buildChapter11InstructorDiagnostics({')
    expect(page).toContain("attempt.quiz_id === 'quiz-11'")
    expect(page).toContain("attempt.target_concept_id?.startsWith('ch11-')")
    expect(page).toContain('chapter11Diagnostics.safetyIntervention')
    expect(page).toContain('Chapter 11 — Treatment of the Hair and Scalp')
    expect(schoolPanel).toContain('href={`/instructor/student/${row.studentId}`}')
    expect(schoolPanel).toContain('View the same mastery diagnostics used by instructors')
  })

  it('keeps the certified runtime free of previously removed unsupported claims', () => {
    const runtime = JSON.stringify({
      content: chapter11PremiumContent,
      flashcards: chapter11PremiumFlashcards,
      quiz: chapter11PremiumQuizQuestions,
      concepts: chapter11ConceptFamilies,
      reserve: chapter11ReassessmentReserve,
    }).toLowerCase()

    for (const phrase of [
      'master healing',
      'state board exam',
      'pyrithione zinc',
      'selenium sulfide',
      'ketoconazole',
      'seborrheic dermatitis',
      'pityriasis steatoides',
      'pityriasis capitis simplex',
      'skin cancer',
      'hypertroph',
      '4.5 to 7.5',
      '3.0 to 5.5',
    ]) {
      expect(runtime).not.toContain(phrase)
    }
  })
})
