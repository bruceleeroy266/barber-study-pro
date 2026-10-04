import { describe, expect, it } from 'vitest'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter21MicroChecks } from '@/lib/chapter-21-concepts/micro-checks'
import {
  buildNeutralMicroCheckHint,
  hintLeaksAnswer,
  resolveMicroCheckHint,
  type HintableMicroCheckQuestion,
} from '@/lib/micro-checks/hints'

const chapter4Question = chapter4MicroChecks
  .flatMap((check) => check.questions)
  .find((question) => question.id === 'mcq-4-004') as HintableMicroCheckQuestion

const chapter21Question = chapter21MicroChecks
  .flatMap((check) => check.questions)
  .find((question) => question.id === 'mcq-21-015') as HintableMicroCheckQuestion

describe('MC-R1F.1 shared hint resolver', () => {
  it('prefers a safe question-specific hint over broader sources', () => {
    const resolved = resolveMicroCheckHint(
      chapter4Question,
      {
        questionHints: {
          'mcq-4-004':
            'Think about which product instruction controls both concentration and surface exposure time.',
        },
        conceptHints: {
          'ch4-disinfection-sterilization':
            'Compare each step with the product label and the required processing sequence.',
        },
      },
      () => 'Focus on the governing disinfection rule.',
    )

    expect(resolved).toEqual({
      text:
        'Think about which product instruction controls both concentration and surface exposure time.',
      source: 'question',
    })
  })

  it('rejects positional answer leakage and falls back to the concept hint', () => {
    const resolved = resolveMicroCheckHint(chapter4Question, {
      questionHints: {
        'mcq-4-004': 'Choice B is the correct answer.',
      },
      conceptHints: {
        'ch4-disinfection-sterilization':
          'Ask which action follows the governing product directions rather than changing them.',
      },
    })

    expect(resolved.source).toBe('concept')
    expect(resolved.text).toContain('governing product directions')
  })

  it('rejects a hint that substantially reproduces the correct answer', () => {
    expect(
      hintLeaksAnswer(
        'Follow the labeled dilution and full required contact time for that intended use.',
        chapter4Question,
      ),
    ).toBe(true)
  })

  it('accepts a safe explanation-derived hint when higher-priority hints are unavailable', () => {
    const resolved = resolveMicroCheckHint(
      chapter21Question,
      {},
      () =>
        'Think about what permission and policy checks must happen before identifiable client content is used.',
    )

    expect(resolved).toEqual({
      text:
        'Think about what permission and policy checks must happen before identifiable client content is used.',
      source: 'explanation',
    })
  })

  it('fails closed to a neutral concept prompt when an explanation-derived hint leaks the answer', () => {
    const resolved = resolveMicroCheckHint(
      chapter21Question,
      {},
      (question) => question[`answer_${question.correctAnswer}`],
    )

    expect(resolved).toEqual({
      text: buildNeutralMicroCheckHint(chapter21Question),
      source: 'neutral',
    })
  })

  it('does not expose answer position or source-key language in the neutral fallback', () => {
    const neutral = buildNeutralMicroCheckHint(chapter4Question)

    expect(neutral).not.toMatch(/\b(?:a|b|c|d)\b/i)
    expect(neutral).not.toMatch(/\b(?:first|second|third|fourth)\b/i)
    expect(neutral).not.toMatch(/correct answer|choice|option/i)
  })

  it('does not mutate the source question while resolving hints', () => {
    const before = JSON.stringify(chapter4Question)

    resolveMicroCheckHint(chapter4Question, {
      conceptHints: {
        'ch4-disinfection-sterilization':
          'Use the rule that governs how the product must be prepared and kept active on the surface.',
      },
    })

    expect(JSON.stringify(chapter4Question)).toBe(before)
  })

  it('works across chapter question shapes without chapter-specific resolver logic', () => {
    const ch4 = resolveMicroCheckHint(chapter4Question, {
      conceptHints: {
        'ch4-disinfection-sterilization':
          'Focus on the controlling product-use rule.',
      },
    })
    const ch21 = resolveMicroCheckHint(chapter21Question, {
      conceptHints: {
        'ch21-advertising-marketing-client-consent':
          'Focus on authorization and policy before using identifiable client material.',
      },
    })

    expect(ch4.source).toBe('concept')
    expect(ch21.source).toBe('concept')
  })
})
