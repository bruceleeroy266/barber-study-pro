import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProScenario from './ProScenario'
import ScenarioBlock from './ScenarioBlock'

const mocks = vi.hoisted(() => ({
  load: vi.fn(),
  persist: vi.fn(),
}))

vi.mock('@/lib/concept-mastery/activity-evidence', () => ({
  loadChapterActivityEvidence: mocks.load,
  persistChapterActivityEvidence: mocks.persist,
}))
vi.mock('@/lib/concept-mastery/activity-evidence-registry', () => ({
  getScenarioEvidenceConcept: () => 'test-concept',
  isUnifiedActivityEvidenceChapter: () => true,
}))

const scenarios = [{
  situation: 'A client requests a service.',
  options: [
    { letter: 'A', text: 'Clarify the request', feedback: 'Good response' },
    { letter: 'B', text: 'Ignore the request', feedback: 'Poor response' },
  ],
  correctAnswer: 'A',
  proTip: 'Listen carefully',
}]

const saved = [{
  id: 'saved-record',
  user_id: 'test-user',
  chapter_id: 'ch-2',
  concept_id: 'test-concept',
  source: 'scenario_application',
  item_id: 'ethics-scenarios:0',
  selected_answer: 'B',
  is_correct: false,
  answered_at: '2026-10-11T19:30:51Z',
  created_at: '2026-10-11T19:30:51Z',
}]

describe('SCENARIO-PERSISTENCE-2', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.load.mockResolvedValue(saved)
    mocks.persist.mockResolvedValue(null)
  })

  it('restores a prior Real Shop Scenario answer without inserting another attempt', async () => {
    render(<ScenarioBlock scenarios={scenarios} chapterId="ch-2" userId="test-user" sectionId="ethics-scenarios" />)
    await waitFor(() => expect(screen.getByText('Poor response')).toBeTruthy())
    expect(mocks.persist).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: /try this scenario again/i })).toBeNull()
  })

  it('restores a prior Professional Scenario answer', async () => {
    render(<ProScenario scenarios={scenarios} chapterId="ch-2" userId="test-user" sectionId="ethics-scenarios" />)
    await waitFor(() => expect(screen.getByText('Poor response')).toBeTruthy())
    expect(mocks.persist).not.toHaveBeenCalled()
  })

  it('restores the original incorrect C answer explicitly for attitude scenario index 1', async () => {
    mocks.load.mockResolvedValue([{
      ...saved[0],
      item_id: 'attitude-scenarios:1',
      selected_answer: 'C',
      is_correct: false,
    }])
    render(<ScenarioBlock scenarios={[scenarios[0], scenarios[0]]} chapterId="ch-2" userId="test-user" sectionId="attitude-scenarios" />)
    await waitFor(() => expect(screen.getByTestId('saved-scenario-answer-attitude-scenarios-1').textContent).toContain('Your saved answer: C'))
    expect(mocks.persist).not.toHaveBeenCalled()
  })

  it('does not reveal feedback on failed persistence', async () => {
    mocks.load.mockResolvedValue([])
    render(<ScenarioBlock scenarios={scenarios} chapterId="ch-2" userId="test-user" sectionId="ethics-scenarios" />)
    await waitFor(() => expect(mocks.load).toHaveBeenCalled())
    fireEvent.click(screen.getByRole('button', { name: /option a:/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Unable to save'))
    expect(screen.queryByText('Good response')).toBeNull()
  })
})
