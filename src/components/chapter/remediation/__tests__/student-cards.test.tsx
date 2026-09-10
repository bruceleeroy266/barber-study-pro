/**
 * Tier 1 component tests — WhyFocusCard + CycleStepMap
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WhyFocusCard from '../WhyFocusCard'
import CycleStepMap from '../CycleStepMap'

describe('WhyFocusCard', () => {
  it('renders the plain-language reason and last activity', () => {
    render(
      <WhyFocusCard
        conceptName="Stress Management & Self-Care"
        reason="You've missed 2 of the 3 questions you've tried on this topic."
        lastActivity="Last quiz activity: September 8, 2026"
        guidance="Finish each review activity below. When everything is complete, a knowledge check unlocks."
      />,
    )
    expect(screen.getByText(/missed 2 of the 3 questions/)).toBeInTheDocument()
    expect(screen.getByText(/September 8, 2026/)).toBeInTheDocument()
    expect(screen.getByText(/knowledge check unlocks/)).toBeInTheDocument()
  })

  it('renders the low-evidence fallback when reason is null and omits date', () => {
    render(
      <WhyFocusCard
        conceptName="Networking"
        reason={null}
        lastActivity={null}
        guidance="Finish each review activity below."
      />,
    )
    expect(screen.getByText(/flagged for a little extra practice/)).toBeInTheDocument()
    expect(screen.queryByText(/Last quiz activity/)).not.toBeInTheDocument()
  })

  it('never displays diagnostic vocabulary', () => {
    const { container } = render(
      <WhyFocusCard
        conceptName="Networking"
        reason="You missed 1 of the 4 questions you've tried on this topic."
        lastActivity={null}
        guidance="Finish each review activity below."
      />,
    )
    expect(container.textContent).not.toMatch(
      /weakness|detection|confidence|mastery|repeated|emerging/i,
    )
  })
})

describe('CycleStepMap', () => {
  it('marks step 1 current at review stage', () => {
    render(<CycleStepMap currentStep={1} />)
    expect(screen.getByText('Review').parentElement?.querySelector('[aria-current="step"]')).toBeTruthy()
    expect(screen.getByText('Knowledge Check')).toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('marks step 2 current with step 1 completed', () => {
    render(<CycleStepMap currentStep={2} />)
    expect(
      screen.getByText('Knowledge Check').parentElement?.querySelector('[aria-current="step"]'),
    ).toBeTruthy()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('marks step 3 current at terminal states with both prior steps checked', () => {
    render(<CycleStepMap currentStep={3} />)
    expect(screen.getByText('Complete').parentElement?.querySelector('[aria-current="step"]')).toBeTruthy()
    expect(screen.getAllByText('✓')).toHaveLength(2)
  })
})
