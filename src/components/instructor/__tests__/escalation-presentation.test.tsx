/**
 * Tier 2 component tests — EscalationList + EscalationDetail + InterventionHistoryView
 *
 * Proves resolved names render (no raw C-2-/ch- IDs), evidence summaries
 * display, the "What ASCYN observed" block renders with coaching, and the
 * acknowledge flow is unchanged.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EscalationList from '@/components/instructor/EscalationList'
import EscalationDetail from '@/components/instructor/EscalationDetail'
import InterventionHistoryView from '@/components/instructor/InterventionHistoryView'
import type { InterventionHistoryItem } from '@/lib/instructor/types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}))

const listItem = {
  id: 'esc-1',
  studentName: 'Jordan Smith',
  studentEmail: 'jordan@example.com',
  conceptName: 'Stress Management & Self-Care',
  chapterTitle: 'Life Skills (Chapter 2)',
  evidenceSummary: '4 misses on 5 observations across 3 questions · Aug 30 – Sep 8',
  status: 'pending',
  unsuccessfulCycleCount: 2,
  createdAt: '2026-09-09T10:00:00Z',
  acknowledgedByName: null,
  acknowledgedAt: null,
}

describe('EscalationList', () => {
  it('renders concept/chapter names and evidence summary — never raw IDs', () => {
    const { container } = render(<EscalationList escalations={[listItem]} />)
    expect(screen.getByText('Jordan Smith')).toBeInTheDocument()
    expect(screen.getByText(/Stress Management & Self-Care/)).toBeInTheDocument()
    expect(screen.getByText(/Life Skills \(Chapter 2\)/)).toBeInTheDocument()
    expect(screen.getByText(/4 misses on 5 observations/)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/C-2-\d{2}/)
    expect(container.textContent).not.toContain('ch-2')
  })

  it('omits the summary line when evidenceSummary is null', () => {
    const { container } = render(
      <EscalationList escalations={[{ ...listItem, id: 'esc-2', evidenceSummary: null }]} />,
    )
    expect(container.textContent).not.toMatch(/misses on \d+ observations/)
  })
})

const detailEscalation = {
  id: 'esc-1',
  studentName: 'Jordan Smith',
  studentEmail: 'jordan@example.com',
  studentId: 'student-1',
  conceptId: 'C-2-15',
  chapterId: 'ch-2',
  status: 'pending',
  unsuccessfulCycleCount: 2,
  triggeringCycleIds: ['cyc-1', 'cyc-2'],
  createdAt: '2026-09-09T10:00:00Z',
  acknowledgedBy: null,
  acknowledgedByName: null,
  acknowledgedAt: null,
  instructorNotes: null,
  interventionPlan: null,
  resolutionSummary: null,
  followUpRequired: null,
}

const diagnostics = {
  conceptName: 'Stress Management & Self-Care',
  chapterTitle: 'Life Skills (Chapter 2)',
  detectionStateLabel: 'Repeated difficulty',
  confidenceLabel: 'high confidence — consistent pattern',
  evidenceSummary: '4 misses on 5 observations across 3 questions · Aug 30 – Sep 8',
  cycleCount: 2,
  knowledgeChecksTaken: 2,
  knowledgeChecksPassed: 1,
  triggerReason: 'Escalated automatically after 2 unsuccessful remediation cycles within 30 days.',
  coaching: {
    confusions: [
      { topic: 'Burnout vs. tiredness', clarification: 'Tiredness lifts with rest; burnout persists.' },
    ],
    chapterGuidance: 'Route struggling students through the 6C remediation cycle.',
    enrichmentNote: null as string | null,
  },
}

describe('EscalationDetail', () => {
  it('renders resolved names instead of raw IDs', () => {
    const { container } = render(
      <EscalationDetail escalation={detailEscalation} currentUserId="inst-1" diagnostics={diagnostics} />,
    )
    expect(screen.getAllByText('Stress Management & Self-Care').length).toBeGreaterThan(0)
    expect(screen.getByText('Life Skills (Chapter 2)')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/C-2-15/)
  })

  it('renders the "What ASCYN Observed" block with state, evidence, tally, trigger, coaching', () => {
    render(
      <EscalationDetail escalation={detailEscalation} currentUserId="inst-1" diagnostics={diagnostics} />,
    )
    expect(screen.getByText('What ASCYN Observed')).toBeInTheDocument()
    expect(screen.getByText(/Repeated difficulty/)).toBeInTheDocument()
    expect(screen.getByText(/high confidence — consistent pattern/)).toBeInTheDocument()
    expect(screen.getByText(/4 misses on 5 observations/)).toBeInTheDocument()
    expect(screen.getByText(/2 taken, 1 passed/)).toBeInTheDocument()
    expect(screen.getByText(/Escalated automatically after 2 unsuccessful remediation cycles/)).toBeInTheDocument()
    expect(screen.getByText(/Burnout vs. tiredness/)).toBeInTheDocument()
    expect(screen.getByText(/6C remediation cycle/)).toBeInTheDocument()
  })

  it('renders enrichment note when present', () => {
    render(
      <EscalationDetail
        escalation={detailEscalation}
        currentUserId="inst-1"
        diagnostics={{
          ...diagnostics,
          coaching: { ...diagnostics.coaching, enrichmentNote: 'ASCYN ENRICHMENT — original ASCYN PRO content.' },
        }}
      />,
    )
    expect(screen.getByText(/ASCYN ENRICHMENT/)).toBeInTheDocument()
  })

  it('keeps the acknowledge flow intact for pending escalations', () => {
    render(
      <EscalationDetail escalation={detailEscalation} currentUserId="inst-1" diagnostics={diagnostics} />,
    )
    expect(screen.getByRole('button', { name: /^Acknowledge$/ })).toBeInTheDocument()
  })

  it('shows the snapshot-missing fallback instead of fabricated state', () => {
    render(
      <EscalationDetail
        escalation={detailEscalation}
        currentUserId="inst-1"
        diagnostics={{ ...diagnostics, detectionStateLabel: null, confidenceLabel: null, evidenceSummary: null }}
      />,
    )
    expect(screen.getByText(/Evidence snapshot not recorded/)).toBeInTheDocument()
  })
})

const historyItem: InterventionHistoryItem & { conceptName: string; chapterTitle: string } = {
  cycleId: 'cycle-abc123',
  conceptId: 'C-2-15',
  chapterId: 'ch-2',
  conceptName: 'Stress Management & Self-Care',
  chapterTitle: 'Life Skills (Chapter 2)',
  status: 'evaluated',
  outcome: 'successful',
  targetedAt: '2026-09-01T10:00:00Z',
  reviewCompletedAt: '2026-09-02T10:00:00Z',
  reassessmentCompletedAt: '2026-09-03T10:00:00Z',
  evaluatedAt: '2026-09-03T10:05:00Z',
  detectionSummary: 'repeated_weakness',
  evaluationSummary: 'currently_performing_well',
  escalation: null,
  events: [],
}

describe('InterventionHistoryView', () => {
  it('renders resolved concept and chapter names — never raw IDs', () => {
    const { container } = render(
      <InterventionHistoryView
        studentName="Jordan Smith"
        studentEmail="jordan@example.com"
        history={[historyItem]}
      />,
    )
    expect(screen.getByText('Stress Management & Self-Care')).toBeInTheDocument()
    expect(screen.getByText(/Life Skills \(Chapter 2\)/)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/C-2-15/)
  })
})
