/**
 * ASCYN PRO — Chapter 21 ChapterContent Tests
 *
 * Validates that the Chapter 21 premium content renders correctly through
 * the shared ChapterContent component, including lesson sections, knowledge
 * checks, scenarios, taskings, reflections, study guide, and instructor notes.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChapterContent from './ChapterContent'
import { chapter21PremiumContent } from '@/lib/chapter-21-premium-content'

describe('ChapterContent — Chapter 21 The Business of Barbering', () => {
  const theme = chapter21PremiumContent.theme

  it('renders all section types without errors', () => {
    const { container } = render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(container.querySelector('.space-y-10')).toBeInTheDocument()
  })

  it('renders the chapter title and learning objective sections', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getAllByText('LO1: Your Two Main Paths Into Business').length).toBeGreaterThan(0)
  })

  it('renders the ownership comparison table', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getAllByText(/Sole Proprietorship/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Partnership/i).length).toBeGreaterThan(0)
  })

  it('renders knowledge check sections', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Knowledge Check 1: Choosing Your Path/i)).toBeInTheDocument()
    expect(screen.getByText(/Knowledge Check 2: Ownership Types/i)).toBeInTheDocument()
  })

  it('renders practical scenario sections', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Real Shop Scenarios/i)).toBeInTheDocument()
  })

  it('renders student tasking (challenge card) sections', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Try This: Build Your Business Practice/i)).toBeInTheDocument()
  })

  it('renders reflection blocks', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText(/Knowledge Check 5: Successful Operations/i)).toBeInTheDocument()
    expect(screen.getByText(/List three operational systems a successful barbershop needs/i)).toBeInTheDocument()
  })

  it('renders the study guide', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText('Premium Study Guide')).toBeInTheDocument()
    expect(screen.getByText(/Chapter Summary/i)).toBeInTheDocument()
  })

  it('renders instructor notes', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )
    expect(screen.getByText('Instructor Notes')).toBeInTheDocument()
  })

  it('allows selecting and revealing a scenario answer', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
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
        sections={chapter21PremiumContent.sections}
        theme={theme}
      />
    )

    const challenge = screen.getByRole('button', { name: /Draft a One-Page Business Plan/i })
    expect(challenge).toBeInTheDocument()
    fireEvent.click(challenge)
    expect(screen.getAllByText(/Completed!/i).length).toBeGreaterThan(0)
  })

  it('allows submitting a reflection response', () => {
    render(
      <ChapterContent
        sections={chapter21PremiumContent.sections}
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
        sections={chapter21PremiumContent.sections}
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
