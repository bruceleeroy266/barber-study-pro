import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PilotPage from './page'

vi.mock('@/lib/analytics/events', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

vi.mock('@/lib/analytics/utm', () => ({
  storeUtmParams: vi.fn(),
  getCurrentUtmContext: () => ({ utm_source: 'wave2-test' }),
}))

vi.mock('@/components/brand', () => ({
  Logo: () => <div data-testid="logo" />,
}))

describe('PilotPage submission contract', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('declares a POST fallback to the mutation endpoint', () => {
    const { container } = render(<PilotPage />)
    const form = container.querySelector('form')

    expect(form).toHaveAttribute('method', 'post')
    expect(form).toHaveAttribute('action', '/api/email')
    expect(container.querySelector('input[name="formType"]')).toHaveValue('pilot')
  })

  it('submits JSON with POST and never places form data in the URL', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<PilotPage />)
    fireEvent.change(screen.getByLabelText(/school name/i), { target: { value: 'Wave 2 School' } })
    fireEvent.change(screen.getByLabelText(/contact name/i), { target: { value: 'Test Contact' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'contact@example.com' } })
    fireEvent.change(screen.getByLabelText(/program type/i), { target: { value: 'Barbering' } })
    fireEvent.submit(screen.getByRole('button', { name: /submit pilot inquiry/i }).closest('form')!)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/email')
    expect(init?.method).toBe('POST')
    expect(String(url)).not.toContain('contact@example.com')
    expect(JSON.parse(String(init?.body))).toMatchObject({
      formType: 'pilot',
      schoolName: 'Wave 2 School',
      email: 'contact@example.com',
    })
    expect(await screen.findByRole('heading', { name: /thank you/i })).toBeVisible()
  })

  it('announces and focuses a failed submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Submission service unavailable.' }),
    } as Response)

    render(<PilotPage />)
    fireEvent.submit(screen.getByRole('button', { name: /submit pilot inquiry/i }).closest('form')!)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Pilot inquiry not submitted')
    expect(alert).toHaveTextContent('Submission service unavailable.')
    await waitFor(() => expect(alert).toHaveFocus())
  })
})
