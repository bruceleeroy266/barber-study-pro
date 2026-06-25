import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import { Settings } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // ── ADMIN ACCESS ENFORCEMENT (server component layer) ──
  // Only the 'admin' role may access /admin. Instructors and students
  // are redirected to /dashboard.
  if (!profile || !isAdmin(profile.role)) {
    redirect('/dashboard')
  }

  // Get stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: schoolCount } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true })

  const chapterCount = 21 // Local curriculum chapters

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Platform management and overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-[#D4AF37]">{userCount || 0}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{schoolCount || 0}</div>
            <div className="text-sm text-gray-400">Schools</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{chapterCount || 0}</div>
            <div className="text-sm text-gray-400">Chapters</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">Active</div>
            <div className="text-sm text-gray-400">Platform Status</div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/school/configuration"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37]">School Settings</h3>
              <Settings className="w-5 h-5 text-gray-500 group-hover:text-[#D4AF37]" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Configure school profile, programs, policies, and roles</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-sm rounded-lg border border-[#D4AF37]/20">
              Open Configuration
            </span>
          </Link>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Users</h3>
            <p className="text-gray-400 text-sm mb-4">Manage user accounts and roles</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-400 text-sm rounded-lg">
              <span>Coming soon</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Content</h3>
            <p className="text-gray-400 text-sm mb-4">Manage chapters, flashcards, and quizzes</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-400 text-sm rounded-lg">
              <span>Coming soon</span>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Admin Features Coming Soon</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• User management with role assignment</li>
            <li>• School creation and management</li>
            <li>• Content editor for chapters</li>
            <li>• Flashcard and quiz management</li>
            <li>• Platform analytics and reports</li>
            <li>• Subscription management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
