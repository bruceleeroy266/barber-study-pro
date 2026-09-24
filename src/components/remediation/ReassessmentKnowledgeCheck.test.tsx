import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ReassessmentKnowledgeCheck, { buildReassessmentOptions } from './ReassessmentKnowledgeCheck'

function makeQuestion(id = 'qq-6-051') {
  return {
    id,
    question: 'Which answer is best?',
    answer_a: 'Original A',
    answer_b: 'Original B',
    answer_c: 'Original C',
    answer_d: 'Original D',
    explanation: null,
  }
}

describe('ReassessmentKnowledgeCheck answer presentation', () => {
  it('uses a stable shuffled presentation without changing canonical answer keys', () => {
    const first = buildReassessmentOptions(makeQuestion())
    const second = buildReassessmentOptions(makeQuestion())

    expect(first).toEqual(second)
    expect(first.map((option) => option.label)).toEqual(['A', 'B', 'C', 'D'])
    expect(new Set(first.map((option) => option.key))).toEqual(new Set(['a', 'b', 'c', 'd']))
    expect(new Set(first.map((option) => option.text))).toEqual(
      new Set(['Original A', 'Original B', 'Original C', 'Original D']),
    )

    const originalOrder = ['a', 'b', 'c', 'd'].join('')
    const severalQuestions = ['qq-6-051', 'qq-6-052', 'qq-6-053', 'qq-6-054']
      .map((id) => buildReassessmentOptions(makeQuestion(id)).map((option) => option.key).join(''))
    expect(severalQuestions.some((order) => order !== originalOrder)).toBe(true)
  })

  it('submits the canonical key even when the displayed label is shuffled', () => {
    const question = makeQuestion('qq-6-051')
    const options = buildReassessmentOptions(question)
    const canonicalB = options.find((option) => option.key === 'b')!
    const onSubmit = vi.fn()

    render(
      <ReassessmentKnowledgeCheck
        question={question}
        onSubmit={onSubmit}
        isLoading={false}
        questionNumber={1}
        totalQuestions={5}
      />,
    )

    fireEvent.click(screen.getByText(canonicalB.text))
    fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }))
    expect(onSubmit).toHaveBeenCalledWith('b')
  })
})
