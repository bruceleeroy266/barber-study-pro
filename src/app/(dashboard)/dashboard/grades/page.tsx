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
        <h1 className="text-3xl font-bold text-white mb-2">My Grades</h1>
        <p className="text-gray-400">Track your academic progress and assessment results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudentGradeWidget performance={performance} />
        </div>

        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Grades</h2>
          {grades.length === 0 ? (
            <p className="text-gray-500">No grades recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="p-3">Category</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {grades
                    .filter((g) => !g.isExcused)
                    .sort((a, b) => new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime())
                    .map((grade) => {
                      const category = categories.find((c) => c.id === grade.categoryId)
                      return (
                        <tr key={grade.id} className="hover:bg-gray-800/30">
                          <td className="p-3 text-white">{category?.name || grade.categoryType}</td>
                          <td className="p-3 text-gray-300">
                            {grade.score}/{grade.maxScore}
                          </td>
                          <td className={`p-3 font-bold ${getGradeColorClass(grade.percentage)}`}>
                            {grade.percentage}% · {getLetterGrade(grade.percentage)}
                          </td>
                          <td className="p-3 text-gray-500">{grade.notes || '—'}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

      <div className="flex justify-start">
        <Link
          href="/dashboard/assessments"
          className="text-[#D4AF37] hover:text-[#F4E4A6] text-sm font-medium"
        >
          View my practical assessments →
        </Link>
      </div>
    </div>
  )
}
