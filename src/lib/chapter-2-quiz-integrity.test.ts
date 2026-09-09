/**
 * ASCYN PRO — Chapter 2 Quiz Integrity Tests (Phase 2D)
 *
 * Protects the corrected 48-question assessment:
 *   - bank shape (48 questions, unique IDs, 4 options, valid keys/explanations)
 *   - answer-position balance (12/12/12/12 ±1) and blind-strategy ceiling (<80%)
 *   - no strong correct-is-longest length pattern
 *   - canonical mapping integrity (25/25 active concepts, 14/14 LOs, C-2-22 excluded)
 *   - qq-2-021 reconciled explanation / qq-2-030 supported replacement
 *   - provenance firewall (no board-exam claims, no publisher-flavored lists)
 *   - financial/framework safety framing
 *
 * Thresholds carry headroom on purpose: they protect integrity without
 * freezing one exact option ordering forever.
 */

import { describe, it, expect } from 'vitest'
import { chapter2PremiumQuizQuestions } from './chapter-2-premium-quiz'
import { chapter2ReassessmentQuestions } from './chapter-2-reassessment-questions'
import { chapter2QuizQuestionMappings } from './chapter-2-concepts/mappings'
import {
  chapter2Concepts,
  ACTIVE_CONCEPT_IDS,
} from './chapter-2-concepts/concepts'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const questions = chapter2PremiumQuizQuestions
const fileSource = readFileSync(
  resolve(process.cwd(), 'src/lib/chapter-2-premium-quiz.ts'),
  'utf-8'
)

// Initial-bank scope: the locked 48. Mapping resolution additionally unions
// the 25-question reassessment reserve (post-lock Option A) so every mapping
// in the combined 73-entry table resolves to a real question.
const byId = new Map(
  [...questions, ...chapter2ReassessmentQuestions].map((q) => [q.id, q]),
)
const mappingByQuestion = new Map<string, string>(
  chapter2QuizQuestionMappings.map((m) => [m.questionId, m.conceptId])
)
const loByConcept = new Map(chapter2Concepts.map((c) => [c.id, c.learningObjectiveId]))

function optionLengths(q: (typeof questions)[number]): Record<string, number> {
  return {
    a: q.answer_a.length,
    b: q.answer_b.length,
    c: q.answer_c.length,
    d: q.answer_d.length,
  }
}

describe('Chapter 2 quiz — bank shape', () => {
  it('contains exactly 48 questions', () => {
    expect(questions).toHaveLength(48)
  })

  it('uses unique valid IDs', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(48)
    for (const id of ids) {
      expect(id).toMatch(/^qq-2-\d{3}$/)
    }
  })

  it('every question has 4 distinct options, a valid key, and a substantive explanation', () => {
    for (const q of questions) {
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d]
      expect(new Set(options.map((o) => o.trim().toLowerCase())).size).toBe(4)
      expect(['a', 'b', 'c', 'd']).toContain(q.correct_answer)
      expect((q.explanation ?? '').trim().length).toBeGreaterThanOrEqual(40)
      expect(q.difficulty).toMatch(/^(easy|medium|hard)$/)
    }
  })
})

describe('Chapter 2 quiz — answer-position integrity', () => {
  const counts = { a: 0, b: 0, c: 0, d: 0 }
  for (const q of questions) counts[q.correct_answer as keyof typeof counts] += 1

  it('positions are balanced (12 each, ±1 tolerance)', () => {
    for (const letter of ['a', 'b', 'c', 'd'] as const) {
      expect(counts[letter]).toBeGreaterThanOrEqual(11)
      expect(counts[letter]).toBeLessThanOrEqual(13)
    }
  })

  it('blind single-position strategy cannot reach the 80% passing threshold', () => {
    const blindMax = Math.max(...Object.values(counts))
    expect(blindMax / questions.length).toBeLessThan(0.8)
  })

  it('no strong correct-is-longest pattern exists', () => {
    let uniquelyLongest = 0
    let worstMargin = 0
    for (const q of questions) {
      const lens = optionLengths(q)
      const correctLen = lens[q.correct_answer as keyof typeof lens]
      const distractorMax = Math.max(
        ...Object.entries(lens)
          .filter(([k]) => k !== q.correct_answer)
          .map(([, v]) => v)
      )
      worstMargin = Math.max(worstMargin, correctLen - distractorMax)
      const values = Object.values(lens)
      const max = Math.max(...values)
      if (correctLen === max && values.filter((v) => v === max).length === 1) {
        uniquelyLongest += 1
      }
    }
    // Correct is uniquely the longest in no more than half the bank…
    expect(uniquelyLongest / questions.length).toBeLessThanOrEqual(0.5)
    // …and never by a margin a test-taker could exploit (> 20 chars)
    expect(worstMargin).toBeLessThanOrEqual(20)
  })
})

describe('Chapter 2 quiz — canonical mapping integrity', () => {
  it('every question maps to exactly one ACTIVE concept; every mapping resolves to a real question', () => {
    for (const q of questions) {
      const conceptId = mappingByQuestion.get(q.id)
      expect(conceptId, `${q.id} unmapped`).toBeDefined()
      expect(ACTIVE_CONCEPT_IDS).toContain(conceptId)
    }
    expect(chapter2QuizQuestionMappings).toHaveLength(73)
    for (const m of chapter2QuizQuestionMappings) {
      expect(byId.has(m.questionId)).toBe(true)
    }
  })

  it('all 25 active concepts are assessed; retired C-2-22 has zero questions', () => {
    const assessed = new Set(chapter2QuizQuestionMappings.map((m) => m.conceptId))
    expect(assessed.size).toBe(25)
    for (const id of ACTIVE_CONCEPT_IDS) {
      expect(assessed.has(id)).toBe(true)
    }
    expect(assessed.has('C-2-22')).toBe(false)
  })

  it('all 14 learning objectives are assessed', () => {
    const los = new Set(
      chapter2QuizQuestionMappings.map((m) => loByConcept.get(m.conceptId))
    )
    expect(los.size).toBe(14)
    for (let i = 1; i <= 14; i++) {
      expect(los.has(`LO-2-${String(i).padStart(2, '0')}`)).toBe(true)
    }
  })
})

describe('Chapter 2 quiz — Phase 2D corrections', () => {
  it('qq-2-021 explanation carries the canonical seven-skill list, not the publisher-flavored one', () => {
    const q = byId.get('qq-2-021')!
    const explanation = (q.explanation ?? '').toLowerCase()
    for (const marker of [
      'punctuality',
      'money management',
      'client relationship',
      'stress management',
      'communication',
      'goal setting',
      'time management',
    ]) {
      expect(explanation).toContain(marker)
    }
    expect(q.explanation).not.toMatch(/image-building|self-actualization|decision-making|customer service/i)
    // Exactly one defensible correct answer: all three member-distractors are canonical
    expect(explanation).toContain('advanced chemistry')
  })

  it('qq-2-030 replacement stays C-2-11 and tests taught note-taking material', () => {
    expect(mappingByQuestion.get('qq-2-030')).toBe('C-2-11')
    const q = byId.get('qq-2-030')!
    expect(q.question).toMatch(/note-taking/i)
    expect(q.explanation).toMatch(/24 hours|flashcards|mind map/i)
    expect(q.explanation).toMatch(/reviewing notes within 24 hours|transferring key information/i)
  })

  it('contains no unsupported memory-framework enumeration', () => {
    expect(fileSource).not.toMatch(/mnemonic/i)
  })

  it('no question tests content absent from Chapter 2 material (spot: note-taking first step is taught)', () => {
    const q049 = byId.get('qq-2-049')!
    expect(q049.explanation).toMatch(/emphasized/i)
  })
})

describe('Chapter 2 quiz — provenance firewall and framing', () => {
  it('contains no board-exam claims or DIRECT_VERIFIED framing', () => {
    expect(fileSource).not.toMatch(/board[- ]exam style/i)
    expect(fileSource).not.toMatch(/official board exam/i)
    expect(fileSource).not.toMatch(/DIRECT_VERIFIED(?! exam-readiness)/)
  })

  it('financial guidance remains framed as adjustable guideline, not universal advice', () => {
    const q003 = byId.get('qq-2-003')!
    expect(q003.explanation).toMatch(/starting point|not a fixed rule/i)
    const q012 = byId.get('qq-2-012')!
    expect(q012.explanation).toMatch(/depends on income|consult a tax professional/i)
  })

  it('named frameworks stay ASCYN-framed (no textbook attribution in source)', () => {
    for (const id of ['qq-2-002', 'qq-2-005', 'qq-2-008', 'qq-2-028', 'qq-2-018']) {
      const q = byId.get(id)!
      expect(q.explanation).not.toMatch(/textbook|Milady|publisher/i)
    }
  })
})
