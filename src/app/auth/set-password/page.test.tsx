import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SetPasswordPage from './page'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'invite-token' } }, error: null }),
  getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
  updateUser: vi.fn().mockResolvedValue({ error: null }),
  single: vi.fn().mockResolvedValue({ data: { role: 'instructor' }, error: null }),
  select: vi.fn(),
  from: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: vi.fn() }),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      getUser: mocks.getUser,
      updateUser: mocks.updateUser,
    },
    from: mocks.from,
  },
}))

describe('SetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getSession.mockResolvedValue({ data: { session: { access_token: 'invite-token' } }, error: null })
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mocks.updateUser.mockResolvedValue({ error: null })

    const eq = vi.fn().mockReturnValue({ single: mocks.single })
    mocks.select.mockReturnValue({ eq })
    mocks.from.mockReturnValue({ select: mocks.select })
  })

  it('shows a verifying state while checking the invitation session', () => {
    mocks.getSession.mockImplementation(() => new Promise(() => {}))
    render(<SetPasswordPage />)
    expect(screen.getByText(/Verifying invitation/i)).toBeInTheDocument()
  })

  it('shows an error when the invitation session is missing or expired', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })
    render(<SetPasswordPage />)
    await waitFor(() => {
      expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument()
    })
  })

  it('shows an error when passwords do not match', async () => {
    render(<SetPasswordPage />)
    const passwordInput = await screen.findByLabelText(/^Password$/i)
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Different456' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Password/i }))

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('shows an error when the password is too weak', async () => {
    render(<SetPasswordPage />)
    const passwordInput = await screen.findByLabelText(/^Password$/i)
    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Password/i }))

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters and include/i)).toBeInTheDocument()
    })
  })

  it('redirects an instructor to /instructor after successful password creation', async () => {
    mocks.single.mockResolvedValue({ data: { role: 'instructor' }, error: null })
    render(<SetPasswordPage />)
    const passwordInput = await screen.findByLabelText(/^Password$/i)

    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Password/i }))

    await waitFor(() => {
      expect(mocks.updateUser).toHaveBeenCalledWith({ password: 'Password123' })
      expect(mocks.push).toHaveBeenCalledWith('/instructor')
    })
  })

  it('redirects a student to /dashboard after successful password creation', async () => {
    mocks.single.mockResolvedValue({ data: { role: 'student' }, error: null })
    render(<SetPasswordPage />)
    const passwordInput = await screen.findByLabelText(/^Password$/i)

    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Password/i }))

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('redirects to /login when the user cannot be loaded after password creation', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })
    render(<SetPasswordPage />)
    const passwordInput = await screen.findByLabelText(/^Password$/i)

    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Password/i }))

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith('/login')
    })
  })

  it('displays an error when updateUser fails', async () => {
    mocks.updateUser.mockResolvedValue({ error: new Error('Token expired') })
    render(<SetPasswordPage />)
    const passwordInput = await screen.findByLabelText(/^Password$/i)

    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Create Password/i }))

    await waitFor(() => {
      expect(screen.getByText(/Token expired/i)).toBeInTheDocument()
    })
  })
})
