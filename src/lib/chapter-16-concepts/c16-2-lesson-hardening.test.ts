import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumContent } from '../chapter-16-premium'
import {
  chapter16ContentConceptMappings,
  chapter16FlashcardConceptMappings,
  chapter16QuizQuestionConceptMappings,
} from './mappings'
import { CHAPTER16_GRADE_WEIGHTS } from './grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const root = process.cwd()
const lesson = readFileSync(join(root, 'src/lib/chapter-16-premium.ts'), 'utf8')

describe('C16-2 source-grounded lesson hardening', () => {
  it('preserves the existing 93-block lesson architecture and C16-1 mappings', () => {
    const ids = chapter16PremiumContent.sections.map((section) => section.id)

    expect(ids).toHaveLength(93)
    expect(new Set(ids).size).toBe(93)
    expect(chapter16ContentConceptMappings).toHaveLength(93)
    expect(chapter16FlashcardConceptMappings).toHaveLength(68)
    expect(chapter16QuizQuestionConceptMappings).toHaveLength(30)
    expect(CHAPTER16_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
  })

  it('removes unsupported licensing-exam frequency and certainty claims from the lesson', () => {
    expect(lesson).not.toContain('Expect licensing exams to test these ideas')
    expect(lesson).not.toContain('Licensing exams frequently test')
    expect(lesson).not.toContain('Expect licensing exams to focus')
    expect(lesson).not.toContain('Licensing exams often test')
    expect(lesson).not.toContain('Licensing exams consistently test')
    expect(lesson).not.toContain('Licensing exams expect you to understand')
    expect(lesson).not.toContain('Licensing exams expect professionalism')
  })

  it('reframes board-alert sections as instructional core concepts rather than exam predictions', () => {
    expect(lesson).not.toContain('🚨 BOARD ALERT:')
    expect(lesson).toContain('CORE CONCEPTS: BLUNT CUT')
    expect(lesson).toContain('CORE CONCEPTS: GRADUATED CUT')
    expect(lesson).toContain('CORE CONCEPTS: UNIFORM LAYERED CUT')
    expect(lesson).toContain('CORE CONCEPTS: LONG LAYERED CUT')
    expect(lesson).toContain('CORE CONCEPTS: HAIR ANALYSIS')
    expect(lesson).toContain('CORE CONCEPTS: ADVANCED TECHNIQUES')
    expect(lesson).toContain('CORE CONCEPTS: STYLING & SAFETY')
  })

  it('narrows curly-hair absolutes and preserves individualized analysis', () => {
    expect(lesson).not.toContain('Curls should never be treated like straight hair')
    expect(lesson).not.toContain("removes the curl's memory and produces an uneven shape")
    expect(lesson).toContain('curl pattern and shrinkage vary by client')
    expect(lesson).toContain('Techniques developed on straight hair may need to be adapted rather than copied directly')
  })

  it('narrows razor suitability claims and keeps condition-based technique selection', () => {
    expect(lesson).not.toContain('It is ideal for clients who want a lighter, more textured edge')
    expect(lesson).not.toContain('Razor cutting is not appropriate for every texture')
    expect(lesson).not.toContain('Fine, fragile, or highly porous hair can fray or weaken')
    expect(lesson).toContain('Suitability depends on the desired finish, hair condition, texture, density, and the practitioner')
    expect(lesson).toContain('may be more vulnerable to roughness or fraying')
  })

  it('narrows thermal-tool absolutes and anchors use to tool directions and lowest effective heat', () => {
    expect(lesson).not.toContain('Always apply a heat protectant before using thermal tools')
    expect(lesson).not.toContain('healthy, coarse hair can tolerate more')
    expect(lesson).not.toContain('never apply heat to damp hair unless')
    expect(lesson).toContain("Follow the tool and product manufacturers' directions")
    expect(lesson).toContain('select the lowest effective temperature')
    expect(lesson).toContain('unless the specific tool is designed and labeled for damp or wet use')
  })

  it('removes unsupported textbook-figure claims while preserving original ASCYN PRO instructional intent', () => {
    expect(lesson).not.toContain('The textbook figures for this topic show')
    expect(lesson).not.toContain('The textbook figures show overdirection')
    expect(lesson).toContain("Use the lesson's visual callouts")
    expect(lesson).toContain('without reproducing textbook artwork')
  })
})
