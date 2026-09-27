import { describe, expect, it } from 'vitest'
import { chapter10PremiumQuizQuestions } from '../chapter-10-premium-quiz'
import {
  chapter10QuizQuestionConceptMappings,
  getChapter10QuizQuestionsForConcept,
} from './mappings'
import { CHAPTER10_CONCEPT_FAMILY_IDS } from './concepts'

const KEEP_IDS = new Set(["qq-10-011","qq-10-013","qq-10-015","qq-10-018","qq-10-020","qq-10-021","qq-10-022","qq-10-023","qq-10-028","qq-10-029","qq-10-030","qq-10-031","qq-10-039","qq-10-048","qq-10-052","qq-10-058","qq-10-068","qq-10-074"])
const REPAIR_IDS = new Set(["qq-10-001","qq-10-002","qq-10-003","qq-10-006","qq-10-009","qq-10-014","qq-10-016","qq-10-037","qq-10-042","qq-10-043","qq-10-045","qq-10-046","qq-10-047","qq-10-051","qq-10-057","qq-10-059","qq-10-060","qq-10-061","qq-10-064","qq-10-071"])
const REWRITE_IDS = new Set(["qq-10-004","qq-10-005","qq-10-007","qq-10-008","qq-10-010","qq-10-012","qq-10-017","qq-10-019","qq-10-024","qq-10-025","qq-10-026","qq-10-027","qq-10-032","qq-10-033","qq-10-034","qq-10-035","qq-10-036","qq-10-038","qq-10-040","qq-10-041","qq-10-044","qq-10-049","qq-10-050","qq-10-053","qq-10-054","qq-10-055","qq-10-056","qq-10-062","qq-10-063","qq-10-065","qq-10-066","qq-10-067","qq-10-069","qq-10-070","qq-10-072","qq-10-073","qq-10-075"])

const textBank = JSON.stringify(chapter10PremiumQuizQuestions)

describe('C10-4 assessment source and adversarial hardening', () => {
  it('audits all 75 assessment items exactly once as KEEP / REPAIR / REWRITE', () => {
    const runtimeIds = chapter10PremiumQuizQuestions.map((item) => item.id).sort()
    const classified = [...KEEP_IDS, ...REPAIR_IDS, ...REWRITE_IDS].sort()

    expect(runtimeIds).toHaveLength(75)
    expect(new Set(runtimeIds).size).toBe(75)
    expect(classified).toEqual(runtimeIds)
    expect(new Set(classified).size).toBe(75)
    expect(KEEP_IDS.size).toBe(18)
    expect(REPAIR_IDS.size).toBe(20)
    expect(REWRITE_IDS.size).toBe(37)
  })

  it('preserves all stable IDs, order indexes, and one-to-one C10-1 concept mappings', () => {
    const runtimeIds = chapter10PremiumQuizQuestions.map((item) => item.id).sort()
    const mappedIds = chapter10QuizQuestionConceptMappings.map((m) => m.questionId).sort()

    expect(mappedIds).toEqual(runtimeIds)
    expect(new Set(mappedIds).size).toBe(75)

    for (const item of chapter10PremiumQuizQuestions) {
      const expected = Number(item.id.slice(-3))
      expect(item.order_index).toBe(expected)
    }
  })

  it('keeps every canonical Chapter 10 concept represented in the assessment bank', () => {
    for (const conceptId of CHAPTER10_CONCEPT_FAMILY_IDS) {
      expect(getChapter10QuizQuestionsForConcept(conceptId).length).toBeGreaterThan(0)
    }
  })

  it('eliminates the all-A answer-key defect with a near-even deterministic distribution', () => {
    const counts = { a: 0, b: 0, c: 0, d: 0 }
    for (const item of chapter10PremiumQuizQuestions) counts[item.correct_answer] += 1
    expect(counts).toEqual({ a: 19, b: 19, c: 19, d: 18 })
  })

  it('keeps at least 30 scenario/application-oriented prompts after hardening', () => {
    const applicationPattern = /(client|barber|during|before|which statement|which finding|which phase|a strand|a strong pH|scalp analysis|chemical service)/i
    const applicationCount = chapter10PremiumQuizQuestions.filter((item) =>
      applicationPattern.test(item.question),
    ).length
    expect(applicationCount).toBeGreaterThanOrEqual(30)
  })

  it('blocks unsupported legacy claims identified in the 75-item adversarial audit', () => {
    const banned = [
      '63 million',
      'alopecia senilis',
      'alopecia syphilitica',
      'lanthionine',
      'one-third of hair',
      'final third of hair',
      'extreme heat',
      '48 hours',
      'physician or pharmacist',
      'fragilitas crinium',
      'growth most rapid',
      'hypertrophies',
      'cysteine',
      'cystine',
      'tinea sycosis',
      'sycosis barbae',
      'state board exam',
      'Trichology Certification Exam',
      'early detection of skin cancer',
      '3 feet',
      '1 mm',
      'no known negative side effects',
    ]

    for (const phrase of banned) expect(textBank.toLowerCase()).not.toContain(phrase.toLowerCase())
  })

  it('retains source-recorded Chapter 10 anchors', () => {
    for (const phrase of [
      '75-100',
      '2,200',
      'carbon',
      'oxygen',
      'hydrogen',
      'nitrogen',
      'sulfur',
      '2–10 years',
      '3–6 months',
      'less than 10%',
      '½ inch',
      'alopecia totalis',
      'alopecia universalis',
      'pityriasis',
      'malassezia',
      'tinea barbae',
      'tinea capitis',
      'tinea favosa',
      'pediculosis capitis',
      'scabies',
      'porosity',
      'elasticity',
    ]) {
      expect(textBank.toLowerCase()).toContain(phrase.toLowerCase())
    }
  })

  it('does not make the correct answer conspicuously longer or shorter than every distractor', () => {
    for (const item of chapter10PremiumQuizQuestions) {
      const answers = {
        a: item.answer_a,
        b: item.answer_b,
        c: item.answer_c,
        d: item.answer_d,
      }
      const correctLength = answers[item.correct_answer].length
      const distractorLengths = Object.entries(answers)
        .filter(([key]) => key !== item.correct_answer)
        .map(([, value]) => value.length)

      expect(correctLength).toBeLessThanOrEqual(Math.max(...distractorLengths) * 1.8)
      expect(correctLength).toBeGreaterThanOrEqual(Math.min(...distractorLengths) * 0.45)
    }
  })
})
