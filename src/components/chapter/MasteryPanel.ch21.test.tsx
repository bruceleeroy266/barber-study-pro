/**
 * ASCYN PRO — Chapter 21 MasteryPanel Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MasteryPanel from './MasteryPanel'
import { chapter21PremiumContent } from '@/lib/chapter-21-premium-content'

describe('MasteryPanel — Chapter 21', () => {
  const learningObjectives = chapter21PremiumContent.learningObjectives ?? []
  const competencies = chapter21PremiumContent.competencies ?? []
  const mastery = chapter21PremiumContent.mastery
  const theme = chapter21PremiumContent.theme

  it('renders the panel with passing score and remediation threshold', () => {
    render(
      <MasteryPanel
        learningObjectives={learningObjectives}
        competencies={competencies}
        mastery={mastery}
        theme={theme}
      />
    )

    expect(screen.getByText('Mastery Expectations')).toBeInTheDocument()
    expect(screen.getByText(/Passing score: 80%/i)).toBeInTheDocument()
    expect(screen.getByText(/Remediation suggested below: 80%/i)).toBeInTheDocument()
  })

  it('displays all six competencies', () => {
    render(
      <MasteryPanel
        learningObjectives={learningObjectives}
        competencies={competencies}
        mastery={mastery}
        theme={theme}
      />
    )

    expect(screen.getByText('Competencies')).toBeInTheDocument()
    for (const c of competencies) {
      expect(screen.getByText(c.title)).toBeInTheDocument()
    }
  })

  it('displays all six learning objectives', () => {
    render(
      <MasteryPanel
        learningObjectives={learningObjectives}
        competencies={competencies}
        mastery={mastery}
        theme={theme}
      />
    )

    expect(screen.getByText('Learning Objectives')).toBeInTheDocument()
    for (const lo of learningObjectives) {
      expect(screen.getAllByText(lo.description).length).toBeGreaterThan(0)
    }
  })

  it('shows mastery achieved when best score is at or above 80%', () => {
    render(
      <MasteryPanel
        learningObjectives={learningObjectives}
        competencies={competencies}
        mastery={mastery}
        bestAttemptPercentage={88}
        theme={theme}
      />
    )

    expect(screen.getByText('Mastery Achieved')).toBeInTheDocument()
    expect(screen.getByText('88%')).toBeInTheDocument()
  })

  it('shows mastery in progress when best score is below 80%', () => {
    render(
      <MasteryPanel
        learningObjectives={learningObjectives}
        competencies={competencies}
        mastery={mastery}
        bestAttemptPercentage={65}
        theme={theme}
      />
    )

    expect(screen.getByText('Mastery In Progress')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('shows no score badge when no attempt exists', () => {
    render(
      <MasteryPanel
        learningObjectives={learningObjectives}
        competencies={competencies}
        mastery={mastery}
        theme={theme}
      />
    )

    expect(screen.queryByText('Mastery Achieved')).not.toBeInTheDocument()
    expect(screen.queryByText('Mastery In Progress')).not.toBeInTheDocument()
  })
})
