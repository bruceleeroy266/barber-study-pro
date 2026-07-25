/**
 * ASCYN PRO — Chapter 20 ChapterContent Tests
 *
 * Validates that the Chapter 20 premium content renders correctly through
 * the shared ChapterContent component, including lesson sections, knowledge
 * checks, scenarios, taskings, reflections, study guide, and instructor notes.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChapterContent from './ChapterContent'
import { chapter20PremiumContent } from '@/lib/chapter-20-premium-content'

describe('ChapterContent — Chapter 20 Working Behind the Chair', () => {
  const theme = chapter20PremiumContent.theme

  it('renders all section types without errors', () => {
    const { container } = render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(container.querySelector('.space-y-10')).toBeInTheDocument()
  })

  it('renders the chapter title and learning objective sections', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getAllByText('LO1 — From Student to Professional').length).toBeGreaterThan(0)
  })

  it('renders the employment classification table', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getAllByText(/Employee/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Booth Renter/i).length).toBeGreaterThan(0)
  })

  it('renders knowledge check sections', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Knowledge Check: Professional Expectations/i)).toBeInTheDocument()
    expect(screen.getByText(/Knowledge Check: Teamwork and Loyalty/i)).toBeInTheDocument()
  })

  it('renders practical scenario sections', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Real Shop Scenarios/i)).toBeInTheDocument()
  })

  it('renders student tasking (challenge card) sections', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Try This: Build Your Professional Practice/i)).toBeInTheDocument()
  })

  it('renders reflection blocks', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Knowledge Check: Teamwork and Loyalty/i)).toBeInTheDocument()
    expect(screen.getByText(/Reflect on the habits that make barbershop teams succeed/i)).toBeInTheDocument()
  })

  it('renders the study guide', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText('Premium Study Guide')).toBeInTheDocument()
    expect(screen.getByText(/Chapter Summary/i)).toBeInTheDocument()
  })

  it('renders instructor notes', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText('Instructor Notes')).toBeInTheDocument()
  })

  it('allows selecting and revealing a scenario answer', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )

    const scenarioOptions = screen.getAllByRole('button', { name: /^Option [A-D]:/i })
    expect(scenarioOptions.length).toBeGreaterThan(0)

    fireEvent.click(scenarioOptions[0])

    const checkButtons = screen.getAllByRole('button', { name: /Check Answer/i })
    fireEvent.click(checkButtons[0])

    expect(screen.getByText(/Correct!|Not quite/i)).toBeInTheDocument()
  })

  it('allows toggling a challenge card complete/incomplete', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )

    const challenge = screen.getByRole('button', { name: /Build a Monthly Budget/i })
    expect(challenge).toBeInTheDocument()
    fireEvent.click(challenge)
    expect(screen.getAllByText(/Completed!/i).length).toBeGreaterThan(0)
  })

  it('allows submitting a reflection response', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )

    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThan(0)

    fireEvent.change(textareas[0], { target: { value: 'My reflection response' } })

    const submitButtons = screen.getAllByRole('button', { name: /Submit reflection and reveal insight/i })
    fireEvent.click(submitButtons[0])

    expect(screen.getByText(/Instructor Insight/i)).toBeInTheDocument()
  })

  it('exposes scenario feedback in an aria-live region', () => {
    render(
      <ChapterContent
        sections={chapter20PremiumContent.sections}
        theme={theme}
      />
    )

    const scenarioOptions = screen.getAllByRole('button', { name: /^Option [A-D]:/i })
    fireEvent.click(scenarioOptions[0])

    const checkButtons = screen.getAllByRole('button', { name: /Check Answer/i })
    fireEvent.click(checkButtons[0])

    const feedback = screen.getByText(/Correct!|Not quite/i).closest('[aria-live="polite"]')
    expect(feedback).toBeInTheDocument()
  })
})
