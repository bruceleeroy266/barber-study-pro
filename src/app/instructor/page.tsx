import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile, Chapter } from '@/types'

export default async function InstructorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is instructor or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  // Get students in the same school
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', profile.school_id)
    .eq('role', 'student') as { data: Profile[] | null; error: any }

  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('is_active', true)
    .order('chapter_number', { ascending: true }) as { data: Chapter[] | null; error: any }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Instructor Dashboard</h1>
          <p className="text-gray-400">Monitor your students&apos; progress</p>
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
            <div className="text-3xl font-bold text-green-400">Active</div>
            <div className="text-sm text-gray-400">Platform Status</div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Students</h2>
          </div>
          
          {students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800/50">
                      <td className="p-4 text-white">{student.full_name}</td>
                      <td className="p-4 text-gray-400">{student.email}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button className="text-[#D4AF37] hover:text-[#F4E4A6]">
                          View Progress →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No students found in your school.
            </div>
          )}
        </div>

        {/* Coming Soon */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Detailed student progress analytics</li>
            <li>• Quiz score reports</li>
            <li>• Chapter completion tracking</li>
            <li>• Weak areas identification</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
