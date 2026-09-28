import { describe, expect, it } from 'vitest'
import { chapter12PremiumQuizQuestions } from '../chapter-12-premium-quiz'
import { chapter12QuizQuestionConceptMappings } from './mappings'
import { chapter12AssessmentAudit } from './c12-4-assessment-audit'
import { ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS } from './concepts'

const optionFor = (
  question: (typeof chapter12PremiumQuizQuestions)[number],
  key: string,
) => {
  const options = {
    a: question.answer_a,
    b: question.answer_b,
    c: question.answer_c,
    d: question.answer_d,
  } as const
  return options[key as keyof typeof options]
}

describe('C12-4 45-question assessment audit and repair', () => {
  it('retains exactly 45 stable unique assessment IDs', () => {
    expect(chapter12PremiumQuizQuestions).toHaveLength(45)
    const ids = chapter12PremiumQuizQuestions.map((question) => question.id)
    expect(new Set(ids).size).toBe(45)
    expect(ids[0]).toBe('qq-12-001')
    expect(ids[44]).toBe('qq-12-045')
    expect(
      chapter12PremiumQuizQuestions.map((question) => question.order_index),
    ).toEqual(Array.from({ length: 45 }, (_, index) => index + 1))
  })

  it('provides a source-grounded item-level audit entry for all 45 questions', () => {
    expect(chapter12AssessmentAudit).toHaveLength(45)
    const auditIds = chapter12AssessmentAudit.map((entry) => entry.questionId)
    const questionIds = chapter12PremiumQuizQuestions.map((question) => question.id)

    expect(new Set(auditIds).size).toBe(45)
    expect([...auditIds].sort()).toEqual([...questionIds].sort())

    for (const entry of chapter12AssessmentAudit) {
      expect(entry.verdict, entry.questionId).toBe('REWRITE')
      expect(entry.sourceRefs.length, entry.questionId).toBeGreaterThan(0)
    }
  })

  it('has four nonempty unique options and a valid reviewed key for every item', () => {
    for (const question of chapter12PremiumQuizQuestions) {
      const options = [
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
      ]

      expect(options.every((option) => option.trim().length > 0), question.id).toBe(true)
      expect(new Set(options.map((option) => option.trim().toLowerCase())).size, question.id).toBe(4)
      expect(['a', 'b', 'c', 'd'], question.id).toContain(question.correct_answer)
      expect(optionFor(question, question.correct_answer)?.trim().length, question.id).toBeGreaterThan(0)
      expect(question.explanation, question.id).toBeTruthy()
      expect(question.explanation?.trim().length ?? 0, question.id).toBeGreaterThan(35)
    }
  })

  it('repairs the A=45 defect with deliberate near-even answer positions', () => {
    const distribution = { a: 0, b: 0, c: 0, d: 0 }
    for (const question of chapter12PremiumQuizQuestions) {
      distribution[question.correct_answer as keyof typeof distribution] += 1
    }

    expect(distribution).toEqual({ a: 12, b: 11, c: 11, d: 11 })
  })

  it('uses the audited 15 easy / 18 medium / 12 hard difficulty calibration', () => {
    const distribution = { easy: 0, medium: 0, hard: 0 }
    for (const question of chapter12PremiumQuizQuestions) {
      distribution[question.difficulty as keyof typeof distribution] += 1
    }
    expect(distribution).toEqual({ easy: 15, medium: 18, hard: 12 })

    const hardIds = chapter12PremiumQuizQuestions
      .filter((question) => question.difficulty === 'hard')
      .map((question) => question.id)

    expect(hardIds).toEqual([
      'qq-12-002',
      'qq-12-022',
      'qq-12-029',
      'qq-12-031',
      'qq-12-034',
      'qq-12-035',
      'qq-12-037',
      'qq-12-041',
      'qq-12-042',
      'qq-12-043',
      'qq-12-044',
      'qq-12-045',
    ])
  })

  it('aligns every assessment item exactly once with its audited canonical concept', () => {
    expect(chapter12QuizQuestionConceptMappings).toHaveLength(45)
    const mappingIds = chapter12QuizQuestionConceptMappings.map((mapping) => mapping.questionId)
    expect(new Set(mappingIds).size).toBe(45)

    const mapping = new Map(
      chapter12QuizQuestionConceptMappings.map((entry) => [
        entry.questionId,
        entry.conceptFamilyId,
      ]),
    )

    for (const audit of chapter12AssessmentAudit) {
      expect(mapping.get(audit.questionId), audit.questionId).toBe(audit.conceptFamilyId)
    }

    const canonical = new Set(ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS)
    for (const entry of chapter12QuizQuestionConceptMappings) {
      expect(canonical.has(entry.conceptFamilyId), entry.questionId).toBe(true)
    }
  })

  it('covers all eight concepts with the intended assessment distribution', () => {
    const counts = new Map<string, number>()
    for (const mapping of chapter12QuizQuestionConceptMappings) {
      counts.set(mapping.conceptFamilyId, (counts.get(mapping.conceptFamilyId) ?? 0) + 1)
    }

    expect(Object.fromEntries(counts)).toEqual({
      'ch12-client-care-professional-practice': 4,
      'ch12-facial-anatomy-neurovascular': 10,
      'ch12-massage-principles-manipulations': 8,
      'ch12-equipment-electrotherapy': 7,
      'ch12-skin-analysis-product-selection': 6,
      'ch12-facial-treatment-procedures': 4,
      'ch12-sanitation-infection-control': 3,
      'ch12-contraindications-service-safety': 3,
    })
  })

  it('does not reintroduce rejected unsupported or out-of-scope legacy claims', () => {
    const bank = chapter12PremiumQuizQuestions
      .map((question) =>
        [
          question.question,
          question.answer_a,
          question.answer_b,
          question.answer_c,
          question.answer_d,
          question.explanation,
        ].join('\n'),
      )
      .join('\n')

    const rejected = [
      'about 20 percent of skin care clientele',
      'appear on every state board exam',
      'Miss them, and you fail',
      'uncontrolled high blood pressure. Which finding means massage should be withheld',
      'No more than 5 minutes',
      'deep pore cleansing',
      'primary actions are thermal and antiseptic',
      'producing a lifting effect on aging skin',
    ]

    for (const phrase of rejected) {
      expect(bank, phrase).not.toContain(phrase)
    }
  })

  it('keeps difficulty and concept fields synchronized with the audit manifest', () => {
    const questionById = new Map(
      chapter12PremiumQuizQuestions.map((question) => [question.id, question]),
    )

    for (const audit of chapter12AssessmentAudit) {
      const question = questionById.get(audit.questionId)
      expect(question, audit.questionId).toBeDefined()
      expect(question?.difficulty, audit.questionId).toBe(audit.difficulty)
    }
  })
})
