import { describe, expect, it } from 'vitest'
import { chapter4PremiumQuizQuestions } from './chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from './chapter-4-reassessment-questions'
import { chapter4ReassessmentQuestionConceptMappings } from './chapter-4-concepts/mappings'
import { ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS } from './chapter-4-concepts/concepts'

const rewriteIds = new Set([
  'qq-4-031','qq-4-032','qq-4-033','qq-4-036','qq-4-037','qq-4-038','qq-4-042','qq-4-043','qq-4-044',
  'qq-4-046','qq-4-047','qq-4-048','qq-4-049','qq-4-050','qq-4-051','qq-4-055','qq-4-057','qq-4-058',
  'qq-4-059','qq-4-060','qq-4-061','qq-4-062','qq-4-064','qq-4-066','qq-4-067','qq-4-069','qq-4-071',
  'qq-4-076','qq-4-077','qq-4-078','qq-4-080','qq-4-081','qq-4-082','qq-4-085','qq-4-086','qq-4-088',
  'qq-4-090','qq-4-091','qq-4-092','qq-4-093','qq-4-094','qq-4-096','qq-4-099','qq-4-100','qq-4-101',
  'qq-4-104','qq-4-106','qq-4-107','qq-4-110','qq-4-111','qq-4-114','qq-4-115','qq-4-116','qq-4-118',
])

const retainedIds = new Set([
  'qq-4-034','qq-4-035','qq-4-039','qq-4-040','qq-4-041','qq-4-045','qq-4-052','qq-4-053','qq-4-054',
  'qq-4-056','qq-4-063','qq-4-065','qq-4-068','qq-4-070','qq-4-072','qq-4-073','qq-4-074','qq-4-075',
  'qq-4-079','qq-4-083','qq-4-084','qq-4-087','qq-4-089','qq-4-095','qq-4-097','qq-4-098','qq-4-102',
  'qq-4-103','qq-4-105','qq-4-108','qq-4-109','qq-4-112','qq-4-113','qq-4-117','qq-4-119','qq-4-120',
])

describe('C4 reassessment reserve — Milady + NIC hardening certification', () => {
  it('preserves exactly 90 stable reserve ids with no overlap with the initial bank', () => {
    expect(chapter4ReassessmentQuestions).toHaveLength(90)
    const ids = chapter4ReassessmentQuestions.map((q) => q.id)
    expect(ids).toEqual(Array.from({ length: 90 }, (_, i) => `qq-4-${String(i + 31).padStart(3, '0')}`))
    expect(new Set(ids).size).toBe(90)
    const initial = new Set(chapter4PremiumQuizQuestions.map((q) => q.id))
    for (const id of ids) expect(initial.has(id), id).toBe(false)
  })

  it('locks the exact 54 rewrite / 36 retain disposition', () => {
    expect(rewriteIds.size).toBe(54)
    expect(retainedIds.size).toBe(36)
    expect(new Set([...rewriteIds, ...retainedIds]).size).toBe(90)
    for (const q of chapter4ReassessmentQuestions) {
      expect(rewriteIds.has(q.id) || retainedIds.has(q.id), q.id).toBe(true)
    }
  })

  it('keeps six 15-question family pools, sufficient for three unseen five-question cycles', () => {
    expect(chapter4ReassessmentQuestionConceptMappings).toHaveLength(90)
    expect(new Set(chapter4ReassessmentQuestionConceptMappings.map((m) => m.questionId)).size).toBe(90)
    for (const family of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      const ids = chapter4ReassessmentQuestionConceptMappings
        .filter((m) => m.conceptFamilyId === family)
        .map((m) => m.questionId)
      expect(ids, family).toHaveLength(15)
      expect(new Set(ids).size, family).toBe(15)
      expect(Math.floor(ids.length / 5), family).toBe(3)
    }
  })

  it('hardens all 54 rewrites by construction rather than metadata-only relabeling', () => {
    for (const q of chapter4ReassessmentQuestions.filter((q) => rewriteIds.has(q.id))) {
      expect(q.difficulty, q.id).toBe('hard')
      expect(q.question.trim().length, q.id).toBeGreaterThan(55)
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d].map((x) => x.trim().toLowerCase())
      expect(new Set(options).size, q.id).toBe(4)
    }
  })

  it('uses the five-step strategy in every reserve explanation', () => {
    const required = ['Read carefully', 'Identify the keyword', 'Eliminate wrong answers', 'Apply safety/procedure logic', 'Make the best remaining choice']
    for (const q of chapter4ReassessmentQuestions) {
      for (const phrase of required) expect(q.explanation, `${q.id} missing ${phrase}`).toContain(phrase)
    }
  })

  it('keeps answer positions balanced across the 90-question reserve', () => {
    const counts = chapter4ReassessmentQuestions.reduce<Record<string, number>>((acc, q) => {
      acc[q.correct_answer] = (acc[q.correct_answer] ?? 0) + 1
      return acc
    }, {})
    expect(counts).toEqual({ a: 23, b: 23, c: 22, d: 22 })
  })

  it('keeps stems unique and every question key valid', () => {
    expect(new Set(chapter4ReassessmentQuestions.map((q) => q.question.trim().toLowerCase())).size).toBe(90)
    for (const q of chapter4ReassessmentQuestions) {
      expect(['a', 'b', 'c', 'd']).toContain(q.correct_answer)
      expect(new Set([q.answer_a, q.answer_b, q.answer_c, q.answer_d]).size).toBe(4)
    }
  })

  it('contains direct evidence for all eight Chapter 4 learning-objective areas', () => {
    const bank = JSON.stringify(chapter4ReassessmentQuestions).toLowerCase()
    const evidence: Record<string, string[]> = {
      LO1: ['osha', 'epa', 'safety data sheet', 'ghs', 'state regulatory authority'],
      LO2: ['cocci', 'bacilli', 'spirilla', 'nonpathogenic', 'bacteria'],
      LO3: ['local infection', 'systemic infection', 'immunity', 'indirect transmission', 'bloodborne'],
      LO4: ['cleaning', 'disinfection', 'sterilization', 'spore testing', 'contact time'],
      LO5: ['antiseptic', 'hospital disinfectant', 'tuberculocidal', 'intended use'],
      LO6: ['standard precautions', 'sharps container', 'eye protection', 'blood exposure'],
      LO7: ['damaged equipment', 'water/electrical', 'ventilation', 'trip hazard'],
      LO8: ['current requirements', 'licensing', 'professional responsibility', 'emergency information'],
    }
    for (const [lo, terms] of Object.entries(evidence)) {
      for (const term of terms) expect(bank, `${lo} missing ${term}`).toContain(term.toLowerCase())
    }
  })

  it('removes source-conflict and stale-procedure language from the reserve', () => {
    const bank = JSON.stringify(chapter4ReassessmentQuestions)
    const forbidden = [
      '50% of pathogens',
      '99.9%',
      '100x more contagious',
      '$50,000+',
      'permanent revocation',
      'OSHA inspectors ask for this FIRST',
      'replace at 3/4 full',
      'Most disinfectants require 10 minutes',
      'Disinfectant needs 10 MINUTES',
      'health authorities recommend hepatitis B vaccination for barbers',
      'client contact should wait until the lesion resolves',
      'then resume with proper precautions',
    ]
    for (const phrase of forbidden) expect(bank).not.toContain(phrase)
  })

  it('keeps source-aligned production wording source-brand neutral', () => {
    const bank = JSON.stringify(chapter4ReassessmentQuestions)
    expect(bank).not.toContain('Milady')
    expect(bank).not.toContain('NIC')
  })
})
