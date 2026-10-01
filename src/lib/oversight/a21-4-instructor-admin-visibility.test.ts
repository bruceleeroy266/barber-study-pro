import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')
const chapters = Array.from({ length: 21 }, (_, i) => i + 1)

describe('A21-4 Chapters 1-21 instructor / school-admin visibility', () => {
  it('authorizes staff roles and rejects learner roles on the student diagnostic route', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(isInstructorOrAdmin('apprentice')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-1')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-1')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-1')).toBe(false)
  })

  it('enforces same-school learner lookup before any diagnostic rendering', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain('if (!resolvedStudent)')
    expect(page).toContain('notFound()')
  })

  it.each(chapters)('renders Chapter %i diagnostics from the shared authorized student page', (chapter) => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(`buildChapter${chapter}InstructorDiagnostics({`)
    expect(page).toContain(`chapter${chapter}Diagnostics.`)
    expect(page).toContain(`chapter${chapter}MicroCheckRows`)
  })

  it('shows mastery, weak concepts, original misses, remediation and reassessment state', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain('Overall Mastery')
    expect(page).toContain('Weakest Concepts')
    expect(page).toContain('initial misses')
    expect(page).toContain('Remediation Status')
    expect(page).toContain('Latest Reassessment')
    expect(page).toContain('reassessment correct')
  })

  it('surfaces safety and compliance escalation without exposing raw answer payloads or internal IDs', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain('urgent safety intervention')
    expect(page).toContain('100% recovery required')
    expect(page).toContain('Compliance')
    expect(page).toContain('without exposing internal IDs or raw answer payloads')
    expect(page).not.toContain('{JSON.stringify(attempt.answers_json)}')
  })

  it('keeps the diagnostic evidence reads chapter-scoped through Chapter 21', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page.match(/\.from\('chapter_micro_check_attempts'\)/g)).toHaveLength(1)
    expect(page.match(/\.from\('chapter_activity_evidence'\)/g)).toHaveLength(1)
    for (const chapter of chapters) {
      expect(page).toContain(`row.chapter_id === 'ch-${chapter}'`)
    }
  })

  it('retains same-school RLS for quiz/progress, micro-check, remediation, and activity evidence', () => {
    const quiz = read('supabase/migrations/20260714010000_fix_quiz_progress_missed_rls.sql')
    const micro = read('supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql')
    const remediation = read('supabase/migrations/20260818000000_phase_6c2a_remediation_foundation.sql')
    const activity = read('supabase/migrations/20260930165000_chapter_activity_evidence.sql')
    expect(quiz).toContain("role in ('instructor', 'admin', 'school_admin')")
    expect(quiz).toContain('public.current_user_school_id() = public.user_school_id(user_id)')
    expect(micro).toContain('current_user_school_id() = user_school_id(user_id)')
    expect(remediation).toContain('public.current_user_school_id() = public.user_school_id(user_id)')
    expect(activity).toContain('current_user_school_id() = user_school_id(user_id)')
  })
})
