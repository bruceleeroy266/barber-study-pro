import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter12PremiumContent } from '../chapter-12-premium'
import { chapter12PremiumFlashcards } from '../chapter-12-premium-flashcards'
import { chapter12PremiumQuizQuestions } from '../chapter-12-premium-quiz'
import {
  ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS,
  chapter12ConceptFamilies,
} from './concepts'
import {
  chapter12ContentConceptMappings,
  chapter12FlashcardConceptMappings,
  chapter12QuizQuestionConceptMappings,
  chapter12RemediationContentConceptMappings,
} from './mappings'
import { chapter12MicroChecks, buildChapter12MicroCheckEvidence } from './micro-checks'
import { evaluateChapter12SafetyIntervention } from './safety-intervention'
import {
  buildChapter12ReassessmentEvidence,
  buildChapter12TargetedRemediationPlan,
  calculateChapter12RecoveredMastery,
  scoreChapter12ReassessmentCycle,
  selectChapter12ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter12ReassessmentReserve,
  getChapter12ReassessmentReserve,
} from './reassessment-reserve'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'
import { buildChapter12InstructorDiagnostics } from './instructor-diagnostics'
import type { Chapter12EvidenceRecord } from './grading'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a', 'b', 'c', 'd'] as const).find((answer) => answer !== correct) ?? 'a'
}

const evidence = (
  conceptFamilyId: Chapter12EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter12EvidenceRecord['source'] = 'chapter_assessment',
  timestamp = '2026-09-28T12:00:00.000Z',
): Chapter12EvidenceRecord => ({
  studentId: 'student-c12-final',
  chapterId: 'ch-12',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C12-8 final Chapter 12 end-to-end certification', () => {
  it('locks the hardened inventory and complete eight-concept coverage', () => {
    expect(chapter12PremiumContent.sections).toHaveLength(18)
    expect(chapter12ContentConceptMappings).toHaveLength(18)
    expect(new Set(chapter12ContentConceptMappings.map((mapping) => mapping.contentBlockId)).size).toBe(18)
    expect(chapter12PremiumFlashcards).toHaveLength(115)
    expect(chapter12PremiumQuizQuestions).toHaveLength(45)
    expect(chapter12MicroChecks.flatMap((check) => check.questions)).toHaveLength(16)
    expect(chapter12ReassessmentReserve).toHaveLength(40)
    expect(chapter12ConceptFamilies).toHaveLength(8)

    expect(new Set(chapter12PremiumFlashcards.map((card) => card.id)).size).toBe(115)
    expect(new Set(chapter12PremiumQuizQuestions.map((question) => question.id)).size).toBe(45)
    expect(new Set(chapter12ReassessmentReserve.map((question) => question.id)).size).toBe(40)

    for (const conceptFamilyId of ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS) {
      expect(chapter12RemediationContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter12FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter12QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter12MicroChecks.some((check) => check.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(getChapter12ReassessmentReserve(conceptFamilyId)).toHaveLength(5)
    }
  })

  it('registers Chapter 12 for live detection, targeted content, and canonical fresh reassessment', () => {
    expect(isConceptDetectionSupported('ch-12')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-12')).toBe(true)

    const detection = getChapterDetectionProvider('ch-12')
    const content = getChapterContentProvider('ch-12')
    expect(detection).toBeDefined()
    expect(content).toBeDefined()

    for (const concept of chapter12ConceptFamilies) {
      const assignments = detection!.buildAssignmentsForConcept(concept.id)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), concept.id).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), concept.id).toBe(true)

      const bundle = content!.buildRemediationContentBundle(concept.id)
      expect(bundle.conceptId).toBe(concept.id)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(1)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(1)
      expect(getChapter12ReassessmentReserve(concept.id).every((q) => q.id.startsWith('r12-'))).toBe(true)
    }
  })

  it('preserves immutable first-attempt micro-check evidence', () => {
    const records = buildChapter12MicroCheckEvidence(
      'student-c12-final',
      [
        { questionId: 'mcq-12-008', selectedAnswer: 'a' },
        { questionId: 'mcq-12-008', selectedAnswer: 'd' },
      ],
      '2026-09-28T12:01:00.000Z',
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      source: 'micro_check',
      attemptPhase: 'initial',
      conceptFamilyId: 'ch12-skin-analysis-product-selection',
      itemId: 'mcq-12-008',
      correct: false,
    })
  })

  it('runs an ordinary gap through targeted remediation, five fresh questions, recovery, and preserved history', () => {
    const original = [
      evidence('ch12-skin-analysis-product-selection', 'qq-12-031', false),
      evidence('ch12-skin-analysis-product-selection', 'mcq-12-008', false, 'micro_check', '2026-09-28T12:01:00.000Z'),
      evidence('ch12-skin-analysis-product-selection', 'qq-12-032', true, 'chapter_assessment', '2026-09-28T12:02:00.000Z'),
    ]
    const snapshot = JSON.stringify(original)

    const plan = buildChapter12TargetedRemediationPlan(original, '2026-09-28T12:03:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch12-skin-analysis-product-selection')!

    expect(target).toBeDefined()
    expect(target.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)

    const selectedIds = selectChapter12ReassessmentQuestions(
      'ch12-skin-analysis-product-selection',
      chapter12ReassessmentReserve,
    )
    const selectedQuestions = getChapter12ReassessmentReserve('ch12-skin-analysis-product-selection')
    expect(selectedIds).toHaveLength(5)
    expect(selectedIds.every((id) => id.startsWith('r12-'))).toBe(true)

    const responses = selectedIds.map((questionId) => ({ questionId, correct: true }))
    expect(scoreChapter12ReassessmentCycle({
      cycleId: 'c12-final-normal',
      conceptFamilyId: 'ch12-skin-analysis-product-selection',
      selectedQuestionIds: selectedIds,
      responses,
      passPercent: 80,
    }).passed).toBe(true)

    const recovery = buildChapter12ReassessmentEvidence({
      studentId: 'student-c12-final',
      conceptFamilyId: 'ch12-skin-analysis-product-selection',
      selectedQuestions,
      responses,
      timestamp: '2026-09-28T12:10:00.000Z',
    })

    const result = calculateChapter12RecoveredMastery(
      original,
      recovery,
      'ch12-skin-analysis-product-selection',
      '2026-09-28T12:11:00.000Z',
    )

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
  })

  it('escalates distinct safety hazards and requires a perfect 5/5 urgent recovery', () => {
    const original = [
      evidence('ch12-contraindications-service-safety', 'qq-12-043', false, 'chapter_assessment', '2026-09-28T12:00:00.000Z'),
      evidence('ch12-sanitation-infection-control', 'qq-12-041', true, 'chapter_assessment', '2026-09-28T12:01:00.000Z'),
      evidence('ch12-contraindications-service-safety', 'qq-12-045', false, 'chapter_assessment', '2026-09-28T12:02:00.000Z'),
    ]

    const safety = evaluateChapter12SafetyIntervention(original)
    expect(safety.level).toBe('urgent')
    expect(safety.reassessmentQuestionCount).toBe(5)
    expect(safety.reassessmentPassPercent).toBe(100)

    const selected = selectChapter12ReassessmentQuestions(
      'ch12-contraindications-service-safety',
      chapter12ReassessmentReserve,
    )
    const fourOfFive = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))
    const fiveOfFive = selected.map((questionId) => ({ questionId, correct: true }))

    expect(scoreChapter12ReassessmentCycle({
      cycleId: 'c12-final-safety-fail',
      conceptFamilyId: 'ch12-contraindications-service-safety',
      selectedQuestionIds: selected,
      responses: fourOfFive,
      passPercent: 100,
    }).passed).toBe(false)

    expect(scoreChapter12ReassessmentCycle({
      cycleId: 'c12-final-safety-pass',
      conceptFamilyId: 'ch12-contraindications-service-safety',
      selectedQuestionIds: selected,
      responses: fiveOfFive,
      passPercent: 100,
    }).passed).toBe(true)
  })

  it('shows preserved misses and reassessment recovery in Chapter 12 instructor diagnostics', () => {
    const target = 'ch12-skin-analysis-product-selection'
    const initialQuestions = chapter12PremiumQuizQuestions.filter((question) =>
      chapter12QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )

    const initialAttempt = {
      quiz_id: 'quiz-12',
      percentage: 0,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [question.id, wrongAnswer(question.correct_answer)]),
      ),
      completed_at: '2026-09-28T12:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const before = buildChapter12InstructorDiagnostics({
      studentId: 'student-c12-final',
      completionPercent: 10,
      microCheckRows: [],
      quizAttempts: [initialAttempt],
      referenceTime: '2026-09-28T12:20:00.000Z',
    })

    const reserve = getChapter12ReassessmentReserve(target)
    const reassessmentAttempts = reserve.map((question, index) => ({
      quiz_id: 'quiz-12',
      percentage: 100,
      answers_json: { [question.id]: question.correctAnswer },
      completed_at: `2026-09-28T12:1${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c12-analysis-1',
    }))

    const after = buildChapter12InstructorDiagnostics({
      studentId: 'student-c12-final',
      completionPercent: 95,
      microCheckRows: [],
      quizAttempts: [initialAttempt, ...reassessmentAttempts],
      referenceTime: '2026-09-28T12:20:00.000Z',
    })

    const conceptName = chapter12ConceptFamilies.find((concept) => concept.id === target)!.name
    const beforeConcept = before.concepts.find((concept) => concept.conceptName === conceptName)!
    const afterConcept = after.concepts.find((concept) => concept.conceptName === conceptName)!

    expect(beforeConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.reassessmentCorrect).toBe(5)
    expect(afterConcept.mastery).toBeGreaterThan(beforeConcept.mastery)
    expect(after.latestReassessment).toContain('100%')
    expect(after.chapterGrade.finalGrade).toBeGreaterThanOrEqual(after.chapterGrade.baseGrade)
  })

  it('keeps completion/progress separate from academic mastery and grade', () => {
    const attempt = {
      quiz_id: 'quiz-12',
      percentage: 80,
      answers_json: {},
      completed_at: '2026-09-28T12:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const lowCompletion = buildChapter12InstructorDiagnostics({
      studentId: 'student-c12-final',
      completionPercent: 5,
      microCheckRows: [],
      quizAttempts: [attempt],
      referenceTime: '2026-09-28T12:20:00.000Z',
    })
    const highCompletion = buildChapter12InstructorDiagnostics({
      studentId: 'student-c12-final',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [attempt],
      referenceTime: '2026-09-28T12:20:00.000Z',
    })

    expect(highCompletion.chapterGrade).toEqual(lowCompletion.chapterGrade)
    expect(highCompletion.overallMastery).toBe(lowCompletion.overallMastery)
  })

  it('uses the same authorized student evidence route for instructor and school-admin Chapter 12 visibility', () => {
    const root = process.cwd()
    const page = readFileSync(join(root, 'src/app/instructor/student/[studentId]/page.tsx'), 'utf8')
    const schoolPanel = readFileSync(join(root, 'src/components/school-owner/StudentPerformancePanel.tsx'), 'utf8')

    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c12-final')).toBe(true)

    expect(page.match(/\.from\('chapter_micro_check_attempts'\)/g)).toHaveLength(1)
    expect(page).toContain("'ch-12'")
    expect(page).toContain("row.chapter_id === 'ch-12'")
    expect(page).toContain('buildChapter12InstructorDiagnostics({')
    expect(page).toContain("attempt.quiz_id === 'quiz-12'")
    expect(page).toContain("attempt.target_concept_id?.startsWith('ch12-')")
    expect(page).toContain('chapter12Diagnostics.safetyIntervention')
    expect(page).toContain("Chapter 12 — Men's Facial Massage and Treatments")
    expect(schoolPanel).toContain('href={`/instructor/student/${row.studentId}`}')
    expect(schoolPanel).toContain('View the same mastery diagnostics used by instructors')
  })

  it('retains the C12-2 source-boundary hardening through final certification', () => {
    const runtime = JSON.stringify({
      content: chapter12PremiumContent,
      flashcards: chapter12PremiumFlashcards,
      quiz: chapter12PremiumQuizQuestions,
      concepts: chapter12ConceptFamilies,
      reserve: chapter12ReassessmentReserve,
    })

    for (const phrase of [
      'appear on every state board exam',
      'Miss them, and you fail',
      'approximately 25% thicker',
      '120-140°F',
      '1000x its weight in water',
      'removes toxins',
      'therapy your clients will pay for',
      'Diabetes is a relative contraindication',
      'require doctor clearance',
    ]) {
      expect(runtime).not.toContain(phrase)
    }
  })
})
