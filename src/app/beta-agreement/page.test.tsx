import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BetaAgreementPage from './page'

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
  const insert = vi.fn().mockResolvedValue({ error: null })
  const eq2 = vi.fn().mockImplementation(() => ({ maybeSingle }))
  const eq = vi.fn().mockImplementation(() => ({ eq: eq2, maybeSingle }))
  const select = vi.fn().mockImplementation(() => ({ eq }))

  return {
    push: vi.fn(),
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
    maybeSingle,
    insert,
    eq,
    eq2,
    select,
    from: vi.fn().mockImplementation(() => ({ select, insert })),
  }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    from: mocks.from,
  },
}))

vi.mock('@/lib/demo-helpers', () => ({
  isSupabaseConfigured: () => true,
  diagnoseSupabaseConfig: () => ({
    urlPresent: true,
    keyPresent: true,
    urlLength: 64,
    keyLength: 128,
    urlValidScheme: true,
    urlNonPlaceholder: true,
    keyLongEnough: true,
    configured: true,
  }),
}))

describe('BetaAgreementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.from.mockImplementation(() => ({ select: mocks.select, insert: mocks.insert }))
    mocks.select.mockImplementation(() => ({ eq: mocks.eq }))
    mocks.eq.mockImplementation(() => ({ eq: mocks.eq2, maybeSingle: mocks.maybeSingle }))
    mocks.eq2.mockImplementation(() => ({ maybeSingle: mocks.maybeSingle }))
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null })
    mocks.insert.mockResolvedValue({ error: null })
    window.localStorage.clear()
  })

  it('renders the agreement heading and tester form', () => {
    render(<BetaAgreementPage />)
    expect(screen.getAllByRole('heading', { name: /Beta Tester Agreement/i }).length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/Tester Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tester Email/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /I agree/i })).toBeInTheDocument()
  })

  it('requires name and email before accepting', async () => {
    render(<BetaAgreementPage />)
    const checkbox = screen.getByRole('checkbox', { name: /I agree/i })
    fireEvent.click(checkbox)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Please enter your name and email/i)
    })
  })

  it('disables Continue until agreement is accepted', () => {
    render(<BetaAgreementPage />)
    expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled()
  })

  it('inserts a new agreement when none exists', async () => {
    render(<BetaAgreementPage />)

    fireEvent.change(screen.getByLabelText(/Tester Name/i), { target: { value: 'Gabe' } })
    fireEvent.change(screen.getByLabelText(/Tester Email/i), { target: { value: 'gabe@example.com' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree/i }))

    await waitFor(() => {
      expect(mocks.maybeSingle).toHaveBeenCalled()
      expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        tester_name: 'Gabe',
        tester_email: 'gabe@example.com',
      }))
      expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
    })
  })

  it('treats an existing agreement as accepted without inserting', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { id: 'agreement-1', tester_name: 'Gabe', tester_email: 'gabe@example.com' },
      error: null,
    })

    render(<BetaAgreementPage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Gabe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('gabe@example.com')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /I agree/i })).toBeChecked()
      expect(mocks.insert).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
    })
  })

  it('treats a unique-conflict race as success', async () => {
    mocks.insert.mockResolvedValue({
      error: { code: '23505', message: 'duplicate key value violates unique constraint "beta_agreements_user_version_unique"' },
    })

    render(<BetaAgreementPage />)

    fireEvent.change(screen.getByLabelText(/Tester Name/i), { target: { value: 'Gabe' } })
    fireEvent.change(screen.getByLabelText(/Tester Email/i), { target: { value: 'gabe@example.com' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree/i }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
    })
  })

  it('prevents rapid duplicate submissions', async () => {
    let insertCount = 0
    mocks.insert.mockImplementation(async () => {
      insertCount += 1
      await new Promise((resolve) => setTimeout(resolve, 50))
      return { error: null }
    })

    render(<BetaAgreementPage />)

    fireEvent.change(screen.getByLabelText(/Tester Name/i), { target: { value: 'Gabe' } })
    fireEvent.change(screen.getByLabelText(/Tester Email/i), { target: { value: 'gabe@example.com' } })

    const checkbox = screen.getByRole('checkbox', { name: /I agree/i })
    fireEvent.click(checkbox)
    fireEvent.click(checkbox)
    fireEvent.click(checkbox)

    await waitFor(() => {
      expect(insertCount).toBe(1)
    })
  })

  it('shows an error when insert fails for a non-conflict reason', async () => {
    mocks.insert.mockResolvedValue({ error: { code: '50000', message: 'database unavailable' } })

    render(<BetaAgreementPage />)

    fireEvent.change(screen.getByLabelText(/Tester Name/i), { target: { value: 'Gabe' } })
    fireEvent.change(screen.getByLabelText(/Tester Email/i), { target: { value: 'gabe@example.com' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/database unavailable/i)
      expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled()
    })
  })

  it('shows an error when navigation fails', async () => {
    mocks.push.mockImplementation(() => {
      throw new Error('Navigation failed')
    })

    render(<BetaAgreementPage />)

    fireEvent.change(screen.getByLabelText(/Tester Name/i), { target: { value: 'Gabe' } })
    fireEvent.change(screen.getByLabelText(/Tester Email/i), { target: { value: 'gabe@example.com' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /I agree/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Continue/i })).not.toBeDisabled()
    })

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Navigation failed/i)
    })
  })
})
