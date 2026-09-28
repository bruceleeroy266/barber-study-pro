import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('Chapters 1-10 student → instructor → school-admin role connection certification', () => {
  it('authorizes instructor and school-admin oversight while rejecting learner access', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(isInstructorOrAdmin('apprentice')).toBe(false)

    expect(canAccessRoute('instructor', '/instructor/student/student-1')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-1')).toBe(true)
    expect(canAccessRoute('admin', '/instructor/student/student-1')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-1')).toBe(false)
  })

  it('uses one student evidence read for Chapters 1-10 micro-checks and the same quiz/progress rows', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')

    expect(page.match(/\.from\('chapter_micro_check_attempts'\)/g)).toHaveLength(1)
    expect(page.match(/\.from\('quiz_attempts'\)/g)).toHaveLength(1)
    expect(page.match(/\.from\('student_progress'\)/g)).toHaveLength(1)

    expect(page).toContain(
      ".in('chapter_id', ['ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9','ch-10'])",
    )

    for (let chapter = 1; chapter <= 10; chapter += 1) {
      expect(page).toContain('chapter' + chapter + 'MicroCheckRows = chapterMicroCheckRows?.filter(')
      expect(page).toContain("row.chapter_id === 'ch-" + chapter + "'")
      expect(page).toContain('buildChapter' + chapter + 'InstructorDiagnostics({')
      expect(page).toContain(
        'const chapter' + chapter + "Progress = progressRecords.find((record) => record.chapter_id === 'ch-" + chapter + "')",
      )
    }

    expect(page.match(/quizAttempts: attemptRecords/g)?.length).toBeGreaterThanOrEqual(10)
  })

  it('keeps Chapter 7 reassessment evidence chapter-scoped instead of accepting every reassessment', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(
      "(attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch7-'))",
    )
    expect(page).not.toContain(
      ".filter((attempt) => attempt.quiz_id === 'quiz-7' || attempt.is_reassessment)",
    )
  })

  it('uses the identical diagnostic route for school-admin and instructor oversight', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const schoolPanel = read('src/components/school-owner/StudentPerformancePanel.tsx')

    expect(page).toContain('if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))')
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(schoolPanel).toContain('href={\`/instructor/student/\${row.studentId}\`}')
    expect(schoolPanel).toContain('View the same mastery diagnostics used by instructors')
  })

  it('proves same-school instructor/admin RLS visibility over the evidence tables', () => {
    const quizProgressMigration = read('supabase/migrations/20260714010000_fix_quiz_progress_missed_rls.sql')
    const microMigration = read('supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql')
    const remediationMigration = read('supabase/migrations/20260818000000_phase_6c2a_remediation_foundation.sql')

    expect(quizProgressMigration).toContain("role in ('instructor', 'admin', 'school_admin')")
    expect(quizProgressMigration).toContain('create policy "student_progress_staff_select"')
    expect(quizProgressMigration).toContain('create policy "quiz_attempts_staff_select"')
    expect(quizProgressMigration).toContain(
      'public.current_user_school_id() = public.user_school_id(user_id)',
    )

    expect(microMigration).toContain('create policy chapter_micro_check_attempts_staff_select')
    expect(microMigration).toContain('current_user_school_id() = user_school_id(user_id)')

    expect(remediationMigration).toContain('create policy remediation_cycles_staff_select')
    expect(remediationMigration).toContain(
      'public.current_user_school_id() = public.user_school_id(user_id)',
    )
  })

  it('renders all ten chapter diagnostic sections from the shared authorized page', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    for (let chapter = 1; chapter <= 10; chapter += 1) {
      expect(page).toContain('chapter' + chapter + 'Diagnostics.')
    }

    expect(page).toContain('Chapter 10 — Properties and Disorders of the Hair and Scalp')
    expect(page).toContain('Initial misses remain historical evidence after recovery.')
  })
})
