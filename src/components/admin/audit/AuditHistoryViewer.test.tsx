import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuditHistoryViewer from './AuditHistoryViewer'

describe('AuditHistoryViewer mobile layout', () => {
  it('renders mobile cards and keeps the desktop table separate', () => {
    const { container } = render(
      <AuditHistoryViewer
        initialData={{
          logs: [
            {
              id: 'audit-1',
              created_at: '2026-09-25T23:22:54.000Z',
              type: 'failed_login',
              result: 'failure',
              user_id: 'user-123',
              email: 'student@example.com',
              school_id: 'school-456',
              resource: '/login',
              resource_id: null,
              reason: 'Invalid credentials',
              ip_address: null,
              user_agent: null,
              metadata: null,
            },
          ],
          count: 1,
          error: null,
        }}
      />,
    )

    const mobileCards = screen.getByLabelText('Audit log cards')
    expect(mobileCards).toHaveClass('md:hidden')
    expect(screen.getByText('failed_login')).toBeInTheDocument()
    expect(screen.getByText('student@example.com')).toBeInTheDocument()
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()

    const desktopWrapper = container.querySelector('.md\\:block')
    expect(desktopWrapper).not.toBeNull()
    expect(desktopWrapper?.querySelector('table')).toHaveClass('min-w-[64rem]')
  })

  it('makes the filter action full width on phones', () => {
    render(
      <AuditHistoryViewer
        initialData={{ logs: [], count: 267, error: null }}
      />,
    )

    const filterButton = screen.getByRole('button', { name: 'Filter' })
    expect(filterButton).toHaveClass('w-full')
    expect(filterButton).toHaveClass('sm:w-auto')
    expect(screen.getByText('267 total results')).toBeInTheDocument()
  })
})
