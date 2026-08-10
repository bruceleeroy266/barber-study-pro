import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Grade, GradeCategory, Assessment, Profile } from '@/types'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import {
  demoGradeCategories,
  demoGrades,
  demoAssessments,
  demoStudents,
} from '@/lib/demo-data'
import { calculateStudentGradePerformance, getGradeColorClass, getLetterGrade } from '@/lib/gradebook'
import StudentGradeWidget from '@/components/gradebook/StudentGradeWidget'
import StudentGradeReport from '@/components/reports/StudentGradeReport'
import { mapGradesFromDb, mapGradeCategoriesFromDb, mapAssessmentsFromDb } from '@/lib/mappers/operational-data-mappers'

// Phase 4 Design System Components
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function StudentGradesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const gradesQuery = supabase
    .from('grades')
    .select('*')
    .eq('student_id', user.id)
  if (profile?.school_id) {
    gradesQuery.eq('school_id', profile.school_id)
  }
  const { data: gradesData } = await gradesQuery

  let grades: Grade[] = mapGradesFromDb(gradesData || []) || []

  let categoriesQuery = supabase.from('grade_categories').select('*')
  if (profile?.school_id) {
    categoriesQuery = categoriesQuery.or(`school_id.eq.${profile.school_id},school_id.is.null`)
  } else {
    categoriesQuery = categoriesQuery.is('school_id', null)
  }
  const { data: categoriesData } = await categoriesQuery

  let categories: GradeCategory[] = mapGradeCategoriesFromDb(categoriesData || []) || []

  if ((grades.length === 0 || categories.length === 0) && isDemoFallbackEnabled()) {
    grades = demoGrades.filter((g) => g.studentId === user.id)
    categories = demoGradeCategories
  }

  const assessmentsQuery = supabase
    .from('assessments')
    .select('*')
    .eq('student_id', user.id)
  if (profile?.school_id) {
    assessmentsQuery.eq('school_id', profile.school_id)
  }
  const { data: assessmentsData } = await assessmentsQuery

  let assessments: Assessment[] = mapAssessmentsFromDb(assessmentsData || []) || []
  if (assessments.length === 0 && isDemoFallbackEnabled()) {
    assessments = demoAssessments.filter((a) => a.studentId === user.id)
  }

  const missingAssignments = categories.filter((c) => {
    const categoryGrades = grades.filter((g) => g.categoryId === c.id && !g.isExcused)
    return categoryGrades.length === 0
  }).length

  const performance = calculateStudentGradePerformance(user.id, grades, categories, assessments, missingAssignments)
  const studentProfile: Profile = (profile as Profile) || demoStudents.find((s) => s.id === user.id) || {
    id: user.id,
    email: user.email || '',
    full_name: 'Student',
    role: 'student',
    school_id: null,
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    created_at: '',
    updated_at: '',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Grades</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Track your academic progress and assessment results</p>
      </div>

      {/* Grade Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudentGradeWidget performance={performance} />
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Grades</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Your latest graded work</p>
            </div>
            
            <Card variant="default" padding="lg">
              {grades.length === 0 ? (
                <EmptyState
                  icon="📝"
                  title="No grades recorded yet"
                  description="Your grades will appear here once your instructor records them."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                        <th className="p-3">Category</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-graphite">
                      {grades
                        .filter((g) => !g.isExcused)
                        .sort((a, b) => new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime())
                        .map((grade) => {
                          const category = categories.find((c) => c.id === grade.categoryId)
                          return (
                            <tr key={grade.id} className="hover:bg-[var(--color-background-secondary)]/30">
                              <td className="p-3 text-white">{category?.name || grade.categoryType}</td>
                              <td className="p-3 text-[var(--color-text-secondary)]">
                                {grade.score}/{grade.maxScore}
                              </td>
                              <td className={`p-3 font-bold ${getGradeColorClass(grade.percentage)}`}>
                                {grade.percentage}%
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant={grade.percentage >= 90 ? 'success' : grade.percentage >= 80 ? 'gold' : grade.percentage >= 70 ? 'warning' : 'error'}
                                  size="sm"
                                >
                                  {getLetterGrade(grade.percentage)}
                                </Badge>
                              </td>
                              <td className="p-3 text-[var(--color-text-muted)]">{grade.notes || '—'}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Grade Report */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Grade Report</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Comprehensive academic summary</p>
        </div>
        
        <div className="bg-white rounded-xl overflow-hidden">
          <StudentGradeReport
            student={studentProfile}
            performance={performance}
            grades={grades}
            categories={categories}
            assessments={assessments}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-start">
        <Link
          href="/dashboard/assessments"
          className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] text-sm font-medium"
        >
          View my practical assessments →
        </Link>
      </div>
    </div>
  )
}
