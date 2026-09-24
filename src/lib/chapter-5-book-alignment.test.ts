import { describe, expect, it } from 'vitest'
import { chapter5PremiumContent } from './chapter-5-premium'
import { chapter5PremiumFlashcards } from './chapter-5-premium-flashcards'
import { chapter5PremiumQuizQuestions } from './chapter-5-premium-quiz'
import { chapter5ContentConceptMappings } from './chapter-5-concepts/mappings'

describe('C5 source-book lesson alignment', () => {
  const lesson = JSON.stringify(chapter5PremiumContent)

  it('serves every new source-aligned lesson block and maps it to a canonical Chapter 5 family', () => {
    const expected = [
      'comb-brush-source-detail',
      'shear-source-detail',
      'clipper-source-detail',
      'razor-anatomy-source-detail',
      'razor-procedures-source-detail',
      'equipment-source-detail',
      'thermal-iron-manipulation-source',
      'towel-hand-wrap-source',
      'hair-clippings-cleanup',
    ]
    const ids = chapter5PremiumContent.sections.map((section) => section.id)

    for (const id of expected) {
      expect(ids).toContain(id)
      expect(chapter5ContentConceptMappings.some((mapping) => mapping.contentBlockId === id)).toBe(true)
    }
  })

  it('covers all 18 source-book learning-objective targets at lesson level', () => {
    const objectiveEvidence: Record<string, string[]> = {
      LO1: ['COMBS & BRUSHES MASTERY', 'SHEAR ANATOMY', 'CLIPPERS & TRIMMERS', 'STRAIGHT RAZOR MASTERY'],
      LO2: ['GRAPHITE', 'TAIL COMB', 'FINE/NARROW TEETH', 'NATURAL BRISTLE'],
      LO3: ['FRENCH STYLE', 'GERMAN STYLE', 'bumper', 'CAST', 'FORGED', 'CONVEX EDGE', 'BEVELED EDGE'],
      LO4: ['OPPOSING HANDLE', 'OFFSET HANDLE', 'CRANE HANDLE', 'THINNING/TEXTURIZING', 'BLENDING SHEARS'],
      LO5: ['SHEAR PALMING', 'COMB GRIP', 'ring finger'],
      LO6: ['SHEAR MAINTENANCE PROTOCOL', 'OIL PIVOT POINT', 'STORE IN PROTECTIVE CASE'],
      LO7: ['DETACHABLE-BLADE', 'ADJUSTABLE-BLADE', 'moving blade', 'still blade', 'rotary', 'pivot', 'magnetic'],
      LO8: ['OUTLINERS/TRIMMERS', 'T-BLADE DESIGN', 'Light pressure'],
      LO9: ['carbon-steel', 'ceramic', '00000', 'ATTACHMENT COMBS', 'free wrist', 'Do not set outliner blades flush'],
      LO10: ['CHANGEABLE-BLADE', 'CONVENTIONAL', 'Head, back, shoulder, tang, handle, point, cutting edge, blade, heel, shank, and pivot'],
      LO11: ['Razor Shapers / Hair Razors', 'texturizing and shaping hair'],
      LO12: ['Holding Changes With the Task', 'SHAVING', 'HONING / STROPPING', 'PALMING WITH COMB'],
      LO13: ['balance, temper, grind, finish, size, and style', '5/8 inch', '7/8 inch', 'CROCUS FINISH'],
      LO14: ['Procedure 5-1 — Honing', 'DIAGONAL STROKES', 'EQUAL SIDES', 'LIGHTEN PRESSURE'],
      LO15: ['Procedure 5-2 — Stropping', 'ROLL ON THE BACK', 'EVEN DIAGONAL STROKES'],
      LO16: ['BARBER CHAIR', 'LATHERIZER', 'ELECTRIC MASSAGER', 'ELECTRO/LIGHT THERAPY EQUIPMENT', 'comedone extractors', 'tweezers'],
      LO17: ['REMOVING HAIR CLIPPINGS SAFELY', 'vacuum system', 'PROCEDURE 5-3 — TOWEL WRAPPING THE HAND'],
      LO18: ['THERMAL IRON MANIPULATION — SOURCE PROCEDURE', 'SECTION - TEST HEAT - CONTROL THE IRON - PROTECT THE SCALP - MOVE CONSISTENTLY'],
    }

    for (const [objective, evidence] of Object.entries(objectiveEvidence)) {
      for (const term of evidence) {
        expect(lesson, `${objective} missing lesson evidence: ${term}`).toContain(term)
      }
    }
  })

  it('keeps source-aligned production lesson in ASCYN PRO wording rather than source-brand copy', () => {
    expect(lesson).not.toContain('Milady')
  })

  it('locks the lesson phase without changing flashcard or initial-quiz counts', () => {
    expect(chapter5PremiumFlashcards).toHaveLength(70)
    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
  })
})
