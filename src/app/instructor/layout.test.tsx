import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import InstructorLayout from './layout'

vi.mock('@/lib/supabase-server', () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: { id: 'instructor-id' } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { role: 'instructor' } }),
        }),
      }),
    }),
  }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`Unexpected redirect to ${destination}`)
  }),
}))

vi.mock('@/components/auth/BackButtonPrevention', () => ({
  default: () => null,
}))

vi.mock('@/components/InstructorNav', () => ({
  default: () => <div data-testid="instructor-navigation" />,
}))

describe('InstructorLayout responsive clearance', () => {
  it('keeps content below the fixed mobile navigation without shifting desktop content', async () => {
    const layout = await InstructorLayout({ children: <h1>Student detail</h1> })
    const { container } = render(layout)

    const main = container.querySelector('main#main-content')
    expect(main).toHaveClass('pt-16', 'lg:pt-0', 'lg:pl-64')
    expect(screen.getByRole('heading', { name: 'Student detail' })).toBeVisible()
  })
})
