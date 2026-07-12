import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { hasPermission } from '@/lib/security/permissions'
import { Settings, Activity, History, Flag, Wrench, Archive, Bell, Users } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin and fetch school assignment.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  // ── ADMIN ACCESS ENFORCEMENT (server component layer) ──
  // Platform admins ('admin') and school admins ('school_admin') may access
  // the admin dashboard. School admins see a scoped school-only view.
  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  const canViewPlatformAnalytics = hasPermission(profile.role, 'view_platform_analytics')

  // Phase 13C.1: regular school admins must only see data for their assigned
  // school. Platform-wide analytics require the platform_super_admin permission.
  let userCount = 0
  let schoolCount = 0
  let schoolName: string | null = null

  if (canViewPlatformAnalytics) {
    const { count: platformUserCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    const { count: platformSchoolCount } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
    userCount = platformUserCount || 0
    schoolCount = platformSchoolCount || 0
  } else if (profile.school_id) {
    const [{ count: schoolUserCount }, { data: school }] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id),
      supabase.from('schools').select('name').eq('id', profile.school_id).single(),
    ])
    userCount = schoolUserCount || 0
    schoolCount = 1
    schoolName = school?.name || null
  }

  const chapterCount = 21 // Local curriculum chapters

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">
            {canViewPlatformAnalytics
              ? 'Platform management and overview'
              : schoolName
              ? `School management — ${schoolName}`
              : 'School management'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-[#D4AF37]">{userCount}</div>
            <div className="text-sm text-gray-400">
              {canViewPlatformAnalytics ? 'Total Platform Users' : 'School Users'}
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{schoolCount}</div>
            <div className="text-sm text-gray-400">
              {canViewPlatformAnalytics ? 'Total Schools' : 'Your School'}
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{chapterCount || 0}</div>
            <div className="text-sm text-gray-400">Chapters</div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">Active</div>
            <div className="text-sm text-gray-400">Platform Status</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-pink-400">13D</div>
            <div className="text-sm text-gray-400">Enterprise Services</div>
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

          <Link
            href="/admin/audit"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37]">Audit History</h3>
              <History className="w-5 h-5 text-gray-500 group-hover:text-[#D4AF37]" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Review security events and platform activity</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-sm rounded-lg border border-[#D4AF37]/20">
              View Logs
            </span>
          </Link>

          <Link
            href="/admin/health"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37]">System Health</h3>
              <Activity className="w-5 h-5 text-gray-500 group-hover:text-[#D4AF37]" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Run diagnostics and monitor platform status</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-sm rounded-lg border border-[#D4AF37]/20">
              Run Checks
            </span>
          </Link>

          <Link
            href="/admin/maintenance"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37]">Maintenance Mode</h3>
              <Wrench className="w-5 h-5 text-gray-500 group-hover:text-[#D4AF37]" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Enable or disable platform maintenance mode</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-sm rounded-lg border border-[#D4AF37]/20">
              Manage
            </span>
          </Link>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <Bell className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Production notification service is ready</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20">
              <span>Operational</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Feature Flags</h3>
              <Flag className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Global and school-specific feature toggles</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 text-sm rounded-lg border border-green-500/20">
              <span>Operational</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Backup & Recovery</h3>
              <Archive className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Backup status and recovery readiness</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-400 text-sm rounded-lg">
              <span>External integration required</span>
            </div>
          </div>

          <Link
            href="/admin/users"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37]">Users</h3>
              <Users className="w-5 h-5 text-gray-500 group-hover:text-[#D4AF37]" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Manage user accounts, roles, and approvals</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-sm rounded-lg border border-[#D4AF37]/20">
              Manage Users
            </span>
          </Link>

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
