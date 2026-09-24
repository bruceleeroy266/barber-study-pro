import { describe, expect, it } from 'vitest'
import { chapter4PremiumQuizQuestions } from './chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from './chapter-4-reassessment-questions'
import { chapter4QuizQuestionConceptMappings } from './chapter-4-concepts/mappings'

const rewriteIds = new Set([
  'qq-4-001','qq-4-004','qq-4-006','qq-4-007','qq-4-009','qq-4-012','qq-4-013',
  'qq-4-015','qq-4-018','qq-4-020','qq-4-022','qq-4-023','qq-4-024','qq-4-027',
])

const retainedIds = new Set([
  'qq-4-002','qq-4-003','qq-4-005','qq-4-008','qq-4-010','qq-4-011','qq-4-014','qq-4-016',
  'qq-4-017','qq-4-019','qq-4-021','qq-4-025','qq-4-026','qq-4-028','qq-4-029','qq-4-030',
])

describe('C4 30-question Milady + NIC quiz hardening', () => {
  it('preserves exactly 30 stable initial-question ids and leaves the reserve at 90', () => {
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4ReassessmentQuestions).toHaveLength(90)
    const ids = chapter4PremiumQuizQuestions.map((q) => q.id)
    expect(ids).toEqual(Array.from({ length: 30 }, (_, i) => `qq-4-${String(i + 1).padStart(3, '0')}`))
    expect(new Set(ids).size).toBe(30)
  })

  it('locks the exact 14 rewrite / 16 retain disposition', () => {
    expect(rewriteIds.size).toBe(14)
    expect(retainedIds.size).toBe(16)
    expect(new Set([...rewriteIds, ...retainedIds]).size).toBe(30)
    for (const q of chapter4PremiumQuizQuestions) {
      expect(rewriteIds.has(q.id) || retainedIds.has(q.id), q.id).toBe(true)
    }
  })

  it('gives every rewritten item real hard-question construction and the five-step explanation', () => {
    const required = [
      'Read carefully',
      'Identify the keyword',
      'Eliminate',
      'Apply safety/procedure logic',
      'Make the best remaining choice',
    ]
    for (const q of chapter4PremiumQuizQuestions.filter((q) => rewriteIds.has(q.id))) {
      expect(q.difficulty, q.id).toBe('hard')
      for (const phrase of required) expect(q.explanation, `${q.id} missing ${phrase}`).toContain(phrase)
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d].map((v) => v.trim().toLowerCase())
      expect(new Set(options).size, `${q.id} duplicate options`).toBe(4)
      expect(q.question.trim().length, `${q.id} weak stem`).toBeGreaterThan(60)
    }
  })

  it('adds direct assessment evidence for all eight source learning objectives', () => {
    const bank = JSON.stringify(chapter4PremiumQuizQuestions).toLowerCase()
    const evidence: Record<string, string[]> = {
      LO1: ['osha', 'epa', 'state board', 'safety data sheet', 'label'],
      LO2: ['cocci', 'bacilli', 'spirilla', 'inactive spore-forming'],
      LO3: ['indirect transmission', 'asymptomatic', 'local infection', 'systemic infection', 'immunity', 'bloodborne pathogens'],
      LO4: ['contact time', 'sterilization', 'clean it, disinfect'],
      LO5: ['antiseptic', 'epa-registered', 'intended use'],
      LO6: ['standard precautions', 'sharps container', 'blood-exposure'],
      LO7: ['frayed power cord', 'damp', 'single-use item'],
      LO8: ['current applicable requirements', 'licensing', 'open, draining lesion'],
    }
    for (const [lo, terms] of Object.entries(evidence)) {
      for (const term of terms) expect(bank, `${lo} missing ${term}`).toContain(term.toLowerCase())
    }
  })

  it('maps every initial question exactly once to the concept it currently diagnoses', () => {
    expect(chapter4QuizQuestionConceptMappings).toHaveLength(30)
    expect(new Set(chapter4QuizQuestionConceptMappings.map((m) => m.questionId)).size).toBe(30)

    const expectedCounts = {
      'ch4-pathogens-transmission': 8,
      'ch4-disinfection-sterilization': 6,
      'ch4-cross-contamination': 2,
      'ch4-blood-exposure-ppe': 4,
      'ch4-regulatory-chemical-safety': 4,
      'ch4-safe-practice-compliance': 6,
    }
    const actual = Object.fromEntries(
      Object.keys(expectedCounts).map((family) => [
        family,
        chapter4QuizQuestionConceptMappings.filter((m) => m.conceptFamilyId === family).length,
      ]),
    )
    expect(actual).toEqual(expectedCounts)

    const byId = new Map(chapter4QuizQuestionConceptMappings.map((m) => [m.questionId, m.conceptFamilyId]))
    expect(byId.get('qq-4-012')).toBe('ch4-pathogens-transmission')
    expect(byId.get('qq-4-013')).toBe('ch4-pathogens-transmission')
    expect(byId.get('qq-4-015')).toBe('ch4-pathogens-transmission')
    expect(byId.get('qq-4-020')).toBe('ch4-safe-practice-compliance')
  })

  it('keeps stems unique and removes previously rejected source-conflict claims', () => {
    const stems = chapter4PremiumQuizQuestions.map((q) => q.question.trim().toLowerCase())
    expect(new Set(stems).size).toBe(30)
    const bank = JSON.stringify(chapter4PremiumQuizQuestions)
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
    ]
    for (const phrase of forbidden) expect(bank).not.toContain(phrase)
  })

  it('keeps production assessment wording source-brand neutral', () => {
    expect(JSON.stringify(chapter4PremiumQuizQuestions)).not.toContain('Milady')
  })
})
