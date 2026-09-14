import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import InstructorTeachingNotesIndexPage from './page'

describe('Instructor teaching notes hub', () => {
  it('lists the registered Chapter 2 teaching notes and links to the chapter route', () => {
    render(<InstructorTeachingNotesIndexPage />)

    expect(screen.getByRole('heading', { name: 'Teaching Notes' })).toBeInTheDocument()
    expect(screen.getByText('Instructor Only')).toBeInTheDocument()
    expect(screen.getByText('Chapter 2')).toBeInTheDocument()
    expect(screen.getByText('Life Skills for Barbers — Instructor Notes')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Life Skills for Barbers — Instructor Notes/i })).toHaveAttribute(
      'href',
      '/instructor/chapters/2',
    )
  })

  it('is reachable from the instructor navigation', async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const navSource = readFileSync(
      resolve(process.cwd(), 'src/components/InstructorNav.tsx'),
      'utf-8',
    )

    expect(navSource).toContain("href: '/instructor/chapters'")
    expect(navSource).toContain("label: 'Teaching Notes'")
  })
})
