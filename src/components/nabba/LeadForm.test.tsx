/**
 * LeadForm tests — NABBA lead status persistence defect.
 *
 * Defect: in edit mode, the Status <select> was prop-bound with an onChange
 * auto-save, while Save Changes re-sent the ORIGINAL prop status — so a
 * NEW → CONTACTED change was overwritten back to NEW on Save.
 *
 * Fix: status is local state, persisted only via Save Changes (single write
 * path). These tests pin that behavior plus create-mode regression.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LeadForm from './LeadForm'
import type { NabbaLead } from '@/types/nabba-leads'

const mockUpdateLead = vi.fn()
const mockCreateLead = vi.fn()

vi.mock('@/app/admin/nabba/leads/actions', () => ({
  updateLead: (...args: unknown[]) => mockUpdateLead(...args),
  createLead: (...args: unknown[]) => mockCreateLead(...args),
}))

const existingLead: NabbaLead = {
  id: 'lead-1',
  event: 'NABBA 2026',
  name: 'NABBA Test Lead',
  organization: 'Test Organization',
  role: 'Instructor',
  email: 'testlead@example.com',
  phone: null,
  state: null,
  interests: [],
  temperature: 'WARM',
  notes: null,
  follow_up_action: 'No Action Yet',
  status: 'NEW',
  captured_by: 'user-1',
  captured_by_email: 'admin@example.com',
  created_at: '2026-09-09T00:00:00Z',
  updated_at: '2026-09-09T00:00:00Z',
}

describe('LeadForm — edit mode status persistence', () => {
  beforeEach(() => {
    mockUpdateLead.mockReset()
    mockCreateLead.mockReset()
    mockUpdateLead.mockResolvedValue({ success: true, lead: { ...existingLead, status: 'CONTACTED' } })
  })

  it('does NOT write when the Status select changes alone (no auto-save)', () => {
    render(<LeadForm existingLead={existingLead} />)

    const statusSelect = screen.getByDisplayValue('NEW')
    fireEvent.change(statusSelect, { target: { value: 'CONTACTED' } })

    expect(mockUpdateLead).not.toHaveBeenCalled()
  })

  it('select displays the newly chosen status (state-bound, no snap-back)', () => {
    render(<LeadForm existingLead={existingLead} />)

    const statusSelect = screen.getByDisplayValue('NEW')
    fireEvent.change(statusSelect, { target: { value: 'CONTACTED' } })

    expect(screen.getByDisplayValue('CONTACTED')).toBeTruthy()
  })

  it('Save Changes submits the SELECTED status exactly once and never the stale one', async () => {
    const onSuccess = vi.fn()
    render(<LeadForm existingLead={existingLead} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByDisplayValue('NEW'), { target: { value: 'CONTACTED' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => expect(mockUpdateLead).toHaveBeenCalledTimes(1))

    const [idArg, dataArg] = mockUpdateLead.mock.calls[0]
    expect(idArg).toBe(existingLead.id)
    expect(dataArg).toEqual(
      expect.objectContaining({
        status: 'CONTACTED',
        name: existingLead.name,
        organization: existingLead.organization,
        email: existingLead.email,
      })
    )
    // The reported defect: a stale 'NEW' must never be written.
    for (const call of mockUpdateLead.mock.calls) {
      expect(call[1]).not.toEqual(expect.objectContaining({ status: 'NEW' }))
    }

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })

  it('Save Changes with untouched status still submits the current status', async () => {
    render(<LeadForm existingLead={existingLead} />)

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => expect(mockUpdateLead).toHaveBeenCalledTimes(1))
    expect(mockUpdateLead.mock.calls[0][1]).toEqual(
      expect.objectContaining({ status: 'NEW' })
    )
  })
})

describe('LeadForm — create mode regression', () => {
  beforeEach(() => {
    mockUpdateLead.mockReset()
    mockCreateLead.mockReset()
    mockCreateLead.mockResolvedValue({ success: true, lead: { ...existingLead, id: 'lead-new' } })
  })

  it('renders no Status select in create mode', () => {
    render(<LeadForm />)
    expect(screen.queryByDisplayValue('NEW')).toBeNull()
  })

  it('Save Lead calls createLead with form data only (no updateLead, no status field)', async () => {
    render(<LeadForm />)

    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByPlaceholderText('School or company name'), { target: { value: 'Test School' } })
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Lead' }))

    await waitFor(() => expect(mockCreateLead).toHaveBeenCalledTimes(1))
    expect(mockCreateLead.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        name: 'Jane Doe',
        organization: 'Test School',
        email: 'jane@example.com',
      })
    )
    expect(mockCreateLead.mock.calls[0][0]).not.toHaveProperty('status')
    expect(mockUpdateLead).not.toHaveBeenCalled()
  })
})
