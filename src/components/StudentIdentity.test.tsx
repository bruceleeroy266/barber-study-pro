import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StudentIdentity from './StudentIdentity'
import type { Profile } from '@/types'

const student: Profile = {
  id: 'student-1',
  email: 'student@ascyn-smoke.test',
  full_name: 'Smoke Test Student',
  role: 'student',
  school_id: 'school-1',
  approval_status: 'approved',
  barber_shop_name: null,
  mentor_name: null,
  avatar_url: null,
  is_disabled: false,
  approved_by: null,
  approved_at: null,
  requires_password_change: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('StudentIdentity', () => {
  it('renders canonical name and email from the profile', () => {
    render(<StudentIdentity student={student} />)

    expect(screen.getByText(student.full_name)).toBeInTheDocument()
    expect(screen.getByText(student.email)).toBeInTheDocument()
  })

  it('can display the student role', () => {
    render(<StudentIdentity student={student} showRole />)
    expect(screen.getByText(/Role: student/i)).toBeInTheDocument()
  })

  it('supports a light variant for printable reports', () => {
    render(<StudentIdentity student={student} variant="light" showRole />)

    expect(screen.getByText(student.full_name)).toHaveClass('text-gray-900')
    expect(screen.getByText(student.email)).toHaveClass('text-gray-600')
  })
})
