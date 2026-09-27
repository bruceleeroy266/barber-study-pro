import { describe, expect, it } from 'vitest'
import { chapter9PremiumContent } from '../chapter-9-premium'
import { chapter9PremiumFlashcards } from '../chapter-9-premium-flashcards'
import { chapter9PremiumQuizQuestions } from '../chapter-9-premium-quiz'
import {
  CHAPTER9_CONCEPT_FAMILY_IDS,
  chapter9LearningObjectives,
} from './concepts'
import {
  chapter9ContentConceptMappings,
  chapter9FlashcardConceptMappings,
  chapter9MicroCheckPlacements,
  chapter9QuizQuestionConceptMappings,
  getChapter9ContentBlocksForConcept,
  getChapter9FlashcardsForConcept,
  getChapter9QuizQuestionsForConcept,
} from './mappings'
import {
  buildChapter9MicroCheckEvidence,
  chapter9MicroChecks,
  validateChapter9MicroCheckPlacements,
} from './micro-checks'
import {
  chapter9ReassessmentReserve,
  getChapter9ReassessmentReserve,
} from './reassessment-reserve'
import {
  buildChapter9ReassessmentEvidence,
  buildChapter9TargetedRemediationPlan,
  calculateChapter9RecoveredMastery,
  scoreChapter9ReassessmentCycle,
  selectChapter9ReassessmentQuestions,
} from './targeted-remediation'
import {
  evaluateChapter9SafetyIntervention,
} from './safety-intervention'
import type { Chapter9EvidenceRecord } from './grading'

const ev = (
  conceptFamilyId: Chapter9EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter9EvidenceRecord['source'] = 'chapter_assessment',
  timestamp = '2026-09-27T02:00:00.000Z',
  difficulty: Chapter9EvidenceRecord['difficulty'] = 'scenario',
): Chapter9EvidenceRecord => ({
  studentId: 'student-c9-final',
  chapterId: 'ch-9',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('Final full Chapter 9 certification', () => {
  it('keeps the complete Chapter 9 learning chain structurally intact', () => {
    expect(chapter9LearningObjectives).toHaveLength(8)
    expect(CHAPTER9_CONCEPT_FAMILY_IDS).toHaveLength(10)
    expect(chapter9PremiumFlashcards).toHaveLength(50)
    expect(chapter9PremiumQuizQuestions).toHaveLength(30)
    expect(chapter9MicroChecks.flatMap((check) => check.questions)).toHaveLength(21)
    expect(chapter9ReassessmentReserve).toHaveLength(50)

    expect(new Set(chapter9PremiumFlashcards.map((card) => card.id)).size).toBe(50)
    expect(new Set(chapter9PremiumQuizQuestions.map((question) => question.id)).size).toBe(30)
    expect(new Set(chapter9MicroChecks.flatMap((check) => check.questions.map((q) => q.id))).size).toBe(21)
    expect(new Set(chapter9ReassessmentReserve.map((question) => question.id)).size).toBe(50)
  })

  it('maps every hardened asset exactly once into the canonical concept architecture', () => {
    const flashcardIds = chapter9PremiumFlashcards.map((card) => card.id).sort()
    const mappedFlashcardIds = chapter9FlashcardConceptMappings.map((item) => item.flashcardId).sort()
    expect(mappedFlashcardIds).toEqual(flashcardIds)

    const quizIds = chapter9PremiumQuizQuestions.map((question) => question.id).sort()
    const mappedQuizIds = chapter9QuizQuestionConceptMappings.map((item) => item.questionId).sort()
    expect(mappedQuizIds).toEqual(quizIds)

    const contentIds = new Set(chapter9PremiumContent.sections.map((section) => section.id))
    for (const mapping of chapter9ContentConceptMappings) {
      expect(contentIds.has(mapping.contentBlockId)).toBe(true)
    }

    expect(validateChapter9MicroCheckPlacements()).toBe(true)
    expect(chapter9MicroCheckPlacements).toHaveLength(chapter9MicroChecks.length)
  })

  it('gives every canonical concept lesson/remediation coverage and a five-question fresh reserve', () => {
    for (const conceptFamilyId of CHAPTER9_CONCEPT_FAMILY_IDS) {
      expect(getChapter9ContentBlocksForConcept(conceptFamilyId).length).toBeGreaterThan(0)
      expect(getChapter9ReassessmentReserve(conceptFamilyId)).toHaveLength(5)

      const assessmentCoverage =
        getChapter9FlashcardsForConcept(conceptFamilyId).length +
        getChapter9QuizQuestionsForConcept(conceptFamilyId).length +
        chapter9MicroChecks
          .filter((check) => check.conceptFamilyId === conceptFamilyId)
          .flatMap((check) => check.questions).length

      expect(assessmentCoverage).toBeGreaterThan(0)
    }
  })

  it('keeps the source-grounded lesson free of previously identified residual contradictions', () => {
    const lesson = JSON.stringify(chapter9PremiumContent)

    expect(lesson).not.toContain('What the state board expects you to know')
    expect(lesson).not.toContain("HALF THE BODY'S BLOOD SUPPLY")
    expect(lesson).not.toContain('Approximately 50% of blood flows through skin')
    expect(lesson).not.toContain('Sebaceous cyst and steatoma are the SAME condition')
    expect(lesson).not.toContain('Size is the only difference')
    expect(lesson).not.toContain('oxidized sebum and melanin')
    expect(lesson).not.toContain('2–4 million in the body')
    expect(lesson).not.toContain('Maintains ~98.6°F')
    expect(lesson).not.toContain('before they can damage deeper skin layers and DNA')
    expect(lesson).not.toContain('COMMON DISORDERS ON THE EXAM')
    expect(lesson).not.toContain('MISTAKES THAT COST POINTS ON THE EXAM')
    expect(lesson).not.toContain('Sunscreen SPF 30+ on exposed skin daily')
    expect(lesson).not.toContain('AMERICAN CANCER SOCIETY RECOMMENDATION')
    expect(lesson).not.toContain('Annual professional skin checkups')
    expect(lesson).not.toContain('toxin elimination')
  })

  it('preserves initial micro-check evidence as first-attempt evidence', () => {
    const check = chapter9MicroChecks.find((item) => item.id === 'mc-9-04')!
    const question = check.questions[0]

    const records = buildChapter9MicroCheckEvidence(
      'student-c9-final',
      [{
        questionId: question.id,
        selectedAnswer: question.correctAnswer === 'a' ? 'b' : 'a',
      }],
      '2026-09-27T02:01:00.000Z',
    )
    expect(records).toHaveLength(1)
    const evidence = records[0]

    expect(evidence.source).toBe('micro_check')
    expect(evidence.attemptPhase).toBe('initial')
    expect(evidence.correct).toBe(false)
    expect(evidence.itemId).toBe(question.id)
    expect(evidence.conceptFamilyId).toBe(question.conceptFamilyId)
  })

  it('runs an ordinary detected gap through targeted content, 5-question recovery, and updated mastery without erasing misses', () => {
    const original = [
      ev('ch9-primary-lesions', 'q9-013', false),
      ev('ch9-primary-lesions', 'mcq-9-007', false, 'micro_check', '2026-09-27T02:01:00.000Z'),
      ev('ch9-primary-lesions', 'q9-014', true, 'chapter_assessment', '2026-09-27T02:02:00.000Z', 'application'),
    ]

    const plan = buildChapter9TargetedRemediationPlan(original, '2026-09-27T02:03:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch9-primary-lesions')!

    expect(target.remediationContentBlockIds).toEqual(getChapter9ContentBlocksForConcept('ch9-primary-lesions'))
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)

    const selectedIds = selectChapter9ReassessmentQuestions('ch9-primary-lesions', chapter9ReassessmentReserve)
    const selectedQuestions = getChapter9ReassessmentReserve('ch9-primary-lesions')
    const responses = selectedIds.map((questionId) => ({ questionId, correct: true }))

    const cycle = scoreChapter9ReassessmentCycle({
      cycleId: 'c9-final-ordinary',
      conceptFamilyId: 'ch9-primary-lesions',
      selectedQuestionIds: selectedIds,
      responses,
      passPercent: target.reassessmentPassPercent,
    })
    expect(cycle.passed).toBe(true)
    expect(cycle.percent).toBe(100)

    const reassessmentEvidence = buildChapter9ReassessmentEvidence({
      studentId: 'student-c9-final',
      conceptFamilyId: 'ch9-primary-lesions',
      selectedQuestions,
      responses,
      timestamp: '2026-09-27T02:10:00.000Z',
    })

    const recovered = calculateChapter9RecoveredMastery(
      original,
      reassessmentEvidence,
      'ch9-primary-lesions',
      '2026-09-27T02:11:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.before.initialMissCount).toBe(2)
    expect(recovered.after.initialMissCount).toBe(2)
    expect(recovered.after.reassessmentCorrectCount).toBe(5)
  })

  it('runs a multi-hazard safety pattern through urgent escalation and enforces 5/5 recovery', () => {
    const original = [
      ev('ch9-secondary-lesions', 'q9-018', false, 'chapter_assessment', '2026-09-27T02:00:00.000Z'),
      ev('ch9-inflammatory-infectious-conditions', 'q9-024', false, 'chapter_assessment', '2026-09-27T02:01:00.000Z'),
    ]

    const safety = evaluateChapter9SafetyIntervention(original)
    expect(safety.level).toBe('urgent')
    expect(safety.requiresFormalSafetyReassessment).toBe(true)
    expect(safety.reassessmentQuestionCount).toBe(5)
    expect(safety.reassessmentPassPercent).toBe(100)

    const plan = buildChapter9TargetedRemediationPlan(original, '2026-09-27T02:02:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch9-secondary-lesions')!
    expect(target.priority).toBe('urgent')
    expect(target.reassessmentPassPercent).toBe(100)

    const selected = selectChapter9ReassessmentQuestions('ch9-secondary-lesions', chapter9ReassessmentReserve)
    const fourOfFive = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))
    const allFive = selected.map((questionId) => ({ questionId, correct: true }))

    expect(scoreChapter9ReassessmentCycle({
      cycleId: 'c9-final-urgent-fail',
      conceptFamilyId: 'ch9-secondary-lesions',
      selectedQuestionIds: selected,
      responses: fourOfFive,
      passPercent: 100,
    }).passed).toBe(false)

    expect(scoreChapter9ReassessmentCycle({
      cycleId: 'c9-final-urgent-pass',
      conceptFamilyId: 'ch9-secondary-lesions',
      selectedQuestionIds: selected,
      responses: allFive,
      passPercent: 100,
    }).passed).toBe(true)
  })
})
