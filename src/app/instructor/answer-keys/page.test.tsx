import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import InstructorAnswerKeysPage from './page'

describe('Instructor answer key hub', () => {
  it('lists chapter answer keys and links to chapter routes', () => {
    render(<InstructorAnswerKeysPage />)

    expect(screen.getByRole('heading', { name: 'Chapter Quiz Answer Keys' })).toBeInTheDocument()
    expect(screen.getByText('Instructor Only')).toBeInTheDocument()
    expect(screen.getByText('Chapter 1')).toBeInTheDocument()
    expect(screen.getByText('Chapter 1').closest('a')).toHaveAttribute(
      'href',
      '/instructor/answer-keys/1',
    )
  })

  it('is reachable from the instructor navigation', async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const navSource = readFileSync(
      resolve(process.cwd(), 'src/components/InstructorNav.tsx'),
      'utf-8',
    )

    expect(navSource).toContain("href: '/instructor/answer-keys'")
    expect(navSource).toContain("label: 'Answer Keys'")
  })
})
