import { describe, expect, it } from 'vitest'
import { chapter5PremiumQuizQuestions } from './chapter-5-premium-quiz'
import {
  chapter5QuizQuestionConceptMappings,
  getChapter5ConceptForQuizQuestion,
} from './chapter-5-concepts/mappings'

const rewrittenIds = [
  'qq-5-001','qq-5-004','qq-5-007','qq-5-008','qq-5-009','qq-5-010','qq-5-011','qq-5-013',
  'qq-5-016','qq-5-017','qq-5-018','qq-5-020','qq-5-022','qq-5-024','qq-5-025','qq-5-027',
  'qq-5-035','qq-5-037','qq-5-038','qq-5-039','qq-5-040','qq-5-041','qq-5-042','qq-5-043',
  'qq-5-044','qq-5-045','qq-5-046','qq-5-047','qq-5-049','qq-5-050',
]

const retainedIds = [
  'qq-5-002','qq-5-003','qq-5-005','qq-5-006','qq-5-012','qq-5-014','qq-5-015','qq-5-019',
  'qq-5-021','qq-5-023','qq-5-026','qq-5-028','qq-5-029','qq-5-030','qq-5-031','qq-5-032',
  'qq-5-033','qq-5-034','qq-5-036','qq-5-048',
]

describe('C5 50-question source-book quiz hardening', () => {
  const bank = chapter5PremiumQuizQuestions
  const corpus = JSON.stringify(bank).toLowerCase()

  it('locks exactly 50 unique stable question ids with the audited 30/20 split', () => {
    expect(bank).toHaveLength(50)
    expect(new Set(bank.map((q) => q.id)).size).toBe(50)
    expect(rewrittenIds).toHaveLength(30)
    expect(retainedIds).toHaveLength(20)
    expect(new Set([...rewrittenIds, ...retainedIds]).size).toBe(50)

    for (let n = 1; n <= 50; n += 1) {
      expect(bank.some((q) => q.id === `qq-5-${String(n).padStart(3, '0')}`)).toBe(true)
    }
  })

  it('requires every rewritten question to use the full five-step test-taking explanation', () => {
    for (const id of rewrittenIds) {
      const q = bank.find((item) => item.id === id)
      expect(q, `missing rewritten question ${id}`).toBeDefined()
      expect(q?.difficulty, `${id} should remain difficult`).toBe('hard')
      expect(q?.explanation).toContain('Read carefully.')
      expect(q?.explanation).toContain('Identify the keyword:')
      expect(q?.explanation).toContain('Eliminate wrong answers:')
      expect(q?.explanation).toContain('Apply safety/procedure logic:')
      expect(q?.explanation).toContain('Make the best remaining choice:')
    }
  })

  it('keeps every question single-answer, nonduplicative, and internally valid', () => {
    expect(new Set(bank.map((q) => q.question.trim().toLowerCase())).size).toBe(50)

    for (const q of bank) {
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d]
      expect(options.every((option) => option.trim().length > 0), `${q.id} has an empty option`).toBe(true)
      expect(new Set(options.map((option) => option.trim().toLowerCase())).size, `${q.id} has duplicate options`).toBe(4)
      expect(['a','b','c','d']).toContain(q.correct_answer)
    }
  })

  it('maps all 50 questions exactly once and reassigns reclaimed procedure slots to the correct families', () => {
    expect(chapter5QuizQuestionConceptMappings).toHaveLength(50)
    expect(new Set(chapter5QuizQuestionConceptMappings.map((m) => m.questionId)).size).toBe(50)
    for (const q of bank) expect(getChapter5ConceptForQuizQuestion(q.id)).not.toBeNull()

    expect(getChapter5ConceptForQuizQuestion('qq-5-037')).toBe('ch5-razors')
    expect(getChapter5ConceptForQuizQuestion('qq-5-038')).toBe('ch5-razors')
    expect(getChapter5ConceptForQuizQuestion('qq-5-050')).toBe('ch5-thermal-electrical')
  })

  it('provides direct assessment evidence across all 18 source-book objectives', () => {
    const objectiveEvidence: Record<string, string[]> = {
      LO1: ['clippers with guards, trimmer, straight razor, and comb'],
      LO2: ['antistatic and resistant to heat', 'taper comb', 'round brush'],
      LO3: ['convex edge', '6½–7½ inches', 'tension/pivot screw', 'cast and forged shears'],
      LO4: ['crane', 'thinning/blending shear'],
      LO5: ['left-handed shears', 'reversed'],
      LO6: ['tension check', 'anything other than clean hair'],
      LO7: ['rotary, pivot, magnetic', 'clipper motor description'],
      LO8: ['t-blade', 'outliner', 'light hand/free wrist'],
      LO9: ['attachment comb or guard', 'carbon-steel and ceramic', '00000'],
      LO10: ['changeable-blade razors', 'head, back, shoulder, tang, point, edge, heel, shank, pivot'],
      LO11: ['razor shaper or hair razor', 'texturizing and shaping hair'],
      LO12: ['holding a straight razor for shaving', 'shank during honing or stropping'],
      LO13: ['hollow-ground and wedge', 'crocus finish'],
      LO14: ['source procedure for honing', 'gradually lighten pressure'],
      LO15: ['stropping', 'roll the razor on its back'],
      LO16: ['haircutting cape', 'hot-towel cabinet, latherizer, electric massager'],
      LO17: ['loose hair clippings', 'clean folded towel'],
      LO18: ['preparing to manipulate a thermal iron', 'protect the scalp'],
    }

    for (const [objective, evidence] of Object.entries(objectiveEvidence)) {
      for (const term of evidence) {
        expect(corpus, `${objective} missing quiz evidence: ${term}`).toContain(term.toLowerCase())
      }
    }
  })

  it('removes audited source conflicts, stale claims, and duplicate legacy framings', () => {
    const forbidden = [
      'two most durable and heat-resistant comb materials',
      '5.5 to 6 inches',
      'convex edge (hollow ground)',
      'crushes the cutting edge and ruins the blade',
      'zero-gap means',
      'the blades are dull and need replacement',
      'lithium-ion provides consistent power until depleted',
      'traditional cut-throat razor and a shavette',
      'which razor grip is used for the upper lip and chin',
      'reverse freehand is the taught grip for this upper-lip scenario',
      '90% of work',
      'magnetic/pivot motor',
      'with the grain first, then across, then against if needed',
      'tool falls on the floor during service',
    ]

    for (const phrase of forbidden) expect(corpus).not.toContain(phrase.toLowerCase())
  })

  it('keeps source-aligned rewritten questions in ASCYN PRO wording rather than source-brand copy', () => {
    expect(corpus).not.toContain('milady')
  })
})
