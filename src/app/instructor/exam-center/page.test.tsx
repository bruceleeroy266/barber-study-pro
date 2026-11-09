import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import InstructorExamCenterPage from './page'

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('EXAM-COACHING-UI-QA-8 release boundaries', () => {
  it('offers distinct master-key and student-review routes, without releasing final-exam answers', () => {
    render(<InstructorExamCenterPage />)
    expect(screen.getByRole('heading', { name: 'Exam Center' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Chapter Master Answer Keys/i })).toHaveAttribute('href', '/instructor/answer-keys')
    expect(screen.getByRole('link', { name: /Student Exam Review/i })).toHaveAttribute('href', '/instructor/students')
    expect(screen.getByText(/Not yet released in this hub/i)).toBeInTheDocument()
  })

  it('keeps the hub within the authenticated instructor route guard', () => {
    const layout = source('src/app/instructor/layout.tsx')
    expect(layout).toContain('supabase.auth.getUser()')
    expect(layout).toContain("redirect('/login')")
    expect(layout).toContain('isInstructorOrAdmin(profile.role)')
    expect(layout).toContain("redirect('/dashboard')")
    expect(source('src/components/InstructorNav.tsx')).toContain("href: '/instructor/exam-center'")
  })

  it('has compact responsive cards and accessible answer-reveal controls', () => {
    const hub = source('src/app/instructor/exam-center/page.tsx')
    const search = source('src/app/instructor/answer-keys/AnswerKeySearch.tsx')
    expect(hub).toContain('md:grid-cols-2')
    expect(hub).toContain('min-w-0')
    expect(search).toContain('sm:p-4')
    expect(search).toContain('min-h-11')
    expect(search).toContain('aria-expanded=')
    expect(search).toContain('Show answer and coaching')
  })
})
