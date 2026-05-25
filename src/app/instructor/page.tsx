import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Profile, Chapter, StudentProgress, QuizAttempt } from '@/types'

export default async function InstructorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is instructor or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, full_name, schools(*)')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  const schoolId = profile.school_id
  const schoolName = profile.schools?.name || 'Your School'

  // Get students in the same school (exclude apprentices without a school)
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice']) as { data: Profile[] | null; error: any }

  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('is_active', true)
    .order('chapter_number', { ascending: true }) as { data: Chapter[] | null; error: any }

  // Get all student progress for this school
  const studentIds = students?.map((s) => s.id) || []
  const { data: allProgress } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__']) as { data: StudentProgress[] | null; error: any }

  // Get all quiz attempts for these students
  const { data: allAttempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__']) as { data: QuizAttempt[] | null; error: any }

  // Compute per-student stats
  const studentStats = (students || []).map((student) => {
    const progress = (allProgress || []).filter((p) => p.user_id === student.id)
    const attempts = (allAttempts || []).filter((a) => a.user_id === student.id)
    const completedChapters = progress.filter((p) => p.progress_percentage === 100).length
    const avgQuizScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0
    const quizzesTaken = attempts.length
    return {
      ...student,
      completedChapters,
      avgQuizScore,
      quizzesTaken,
      totalChapters: chapters?.length || 0,
    }
  })

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Instructor Dashboard</h1>
          <p className="text-gray-400">
            {schoolName} — Monitor your students&apos; progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-[#D4AF37]">{students?.length || 0}</div>
            <div className="text-sm text-gray-400">Total Students</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{chapters?.length || 0}</div>
            <div className="text-sm text-gray-400">Chapters</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">
              {studentStats.filter((s) => s.completedChapters === s.totalChapters).length}
            </div>
            <div className="text-sm text-gray-400">Fully Completed</div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Students</h2>
          </div>

          {studentStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Chapters Done</th>
                    <th className="p-4">Avg Quiz</th>
                    <th className="p-4">Quizzes Taken</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {studentStats.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800/50">
                      <td className="p-4 text-white font-medium">{student.full_name}</td>
                      <td className="p-4 text-gray-400">{student.email}</td>
                      <td className="p-4 text-gray-300">
                        {student.completedChapters} / {student.totalChapters}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            student.avgQuizScore >= 75
                              ? 'text-green-400'
                              : student.avgQuizScore >= 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {student.avgQuizScore}%
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{student.quizzesTaken}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/instructor/student/${student.id}`}
                          className="text-[#D4AF37] hover:text-[#F4E4A6] font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No students found in your school yet.
              <p className="text-sm text-gray-500 mt-2">
                Students will appear here once they sign up and select &quot;{schoolName}&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Instructor Tips</h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>• Students must select your school name during signup to appear here.</li>
            <li>• Click &quot;View&quot; on any student to see detailed chapter-by-chapter progress.</li>
            <li>• Avg Quiz scores below 75% suggest a student needs additional review.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
