import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import SchoolAdminMenu from './SchoolAdminMenu'

describe('SchoolAdminMenu', () => {
  it('opens a school-scoped management menu', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))

    expect(screen.getByRole('menuitem', { name: /School Dashboard/i })).toHaveAttribute('href', '/school')
    expect(screen.getByRole('menuitem', { name: /Manage Users/i })).toHaveAttribute('href', '/admin/users')
    expect(screen.getByRole('menuitem', { name: /School Settings/i })).toHaveAttribute('href', '/admin/school/configuration')
    expect(screen.getByRole('menuitem', { name: /Student & Instructor Performance/i })).toHaveAttribute('href', '/school#performance')
    expect(screen.getByRole('menuitem', { name: /Student Hours/i })).toHaveAttribute('href', '/school/hours')
    expect(screen.getByRole('menuitem', { name: /Reports & Compliance/i })).toHaveAttribute('href', '/school#reports-compliance')
    expect(screen.queryByText(/Pilot Inquiries/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/System Health/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Maintenance/i)).not.toBeInTheDocument()
  })

  it('shows a mobile backdrop and closes when it is tapped', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    const backdrop = screen.getByRole('button', { name: /Close School Menu/i })
    expect(backdrop).toHaveClass('sm:hidden')
    expect(backdrop).toHaveClass('bg-black/60')

    fireEvent.click(backdrop)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('uses the server-backed logout route', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))

    expect(screen.getByRole('menuitem', { name: /Logout/i })).toHaveAttribute('href', '/auth/logout')
  })
})
