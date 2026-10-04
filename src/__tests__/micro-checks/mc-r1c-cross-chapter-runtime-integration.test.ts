import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('MC-R1C cross-chapter micro-check runtime integration', () => {
  it('wires every Chapter 1-21 micro-check card to the shared randomized renderer', () => {
    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const source = read(
        `src/components/chapter/Chapter${chapter}MicroCheckCard.tsx`,
      )

      expect(source).toContain(
        "import RandomizedMicroCheckChoices from './RandomizedMicroCheckChoices'",
      )
      expect(source).toContain('<RandomizedMicroCheckChoices')
      expect(source).toContain('question={question}')
      expect(source).toContain('chosen={chosen}')
      expect(source).toContain('recordedAnswer={attempt?.selected_answer}')
      expect(source).toContain('locked={!!attempt}')
      expect(source).toContain('disabled={saving === question.id}')
      expect(source).toContain('[question.id]: answerKey')

      expect(source).not.toContain(
        "(['a', 'b', 'c', 'd'] as const).map",
      )
    }
  })

  it('keeps the shared renderer grading-neutral and label-only at display time', () => {
    const source = read(
      'src/components/chapter/RandomizedMicroCheckChoices.tsx',
    )

    expect(source).toContain('buildShuffledMicroCheckChoices(question)')
    expect(source).toContain('recordedAnswer === choice.sourceKey')
    expect(source).toContain('chosen === choice.sourceKey')
    expect(source).toContain('onSelect(choice.sourceKey)')
    expect(source).toContain('{choice.displayLabel}.')
    expect(source).toContain('{choice.text}')

    expect(source).not.toContain('correctAnswer')
    expect(source).not.toContain('is_correct')
  })

  it('preserves all canonical persistence calls in the chapter cards', () => {
    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const source = read(
        `src/components/chapter/Chapter${chapter}MicroCheckCard.tsx`,
      )

      expect(source).toContain(
        `persistChapter${chapter}MicroCheckAttempt`,
      )
      expect(source).toContain(
        `persistChapter${chapter}MicroCheckAttempt(`,
      )
    }
  })

  it('does not move answer randomization into the question banks', () => {
    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const source = read(
        `src/lib/chapter-${chapter}-concepts/micro-checks.ts`,
      )

      expect(source).not.toContain('buildShuffledMicroCheckChoices')
      expect(source).not.toContain('RandomizedMicroCheckChoices')
    }
  })
})
