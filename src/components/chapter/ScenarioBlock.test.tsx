import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ScenarioBlock from './ScenarioBlock'

const timedScenario = [{
  situation: 'A timed safety scenario',
  options: [
    { letter: 'A', text: 'Correct action', feedback: 'Correct.' },
    { letter: 'B', text: 'Incorrect action', feedback: 'Try again.' },
  ],
  correctAnswer: 'A',
  timeLimit: 2,
}]

describe('ScenarioBlock progress completion', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not award completion when a timed scenario expires unanswered', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()

    render(<ScenarioBlock scenarios={timedScenario} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: /start timed scenario/i }))

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText(/time expired/i)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('awards completion after the student submits an answer', () => {
    const onComplete = vi.fn()

    render(
      <ScenarioBlock
        scenarios={[{
          ...timedScenario[0],
          timeLimit: undefined,
        }]}
        onComplete={onComplete}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /option a:/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
