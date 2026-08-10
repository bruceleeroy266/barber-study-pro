import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { hasPermission } from '@/lib/security/permissions'
import { Settings, Activity, History, Flag, Wrench, Archive, Bell, Users, Plane } from 'lucide-react'

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
    <div className="min-h-screen bg-[var(--color-background-primary)] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-[var(--color-text-muted)]">
            {canViewPlatformAnalytics
              ? 'Platform management and overview'
              : schoolName
              ? `School management — ${schoolName}`
              : 'School management'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="text-3xl font-bold text-[var(--color-brand-gold)]">{userCount}</div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {canViewPlatformAnalytics ? 'Total Platform Users' : 'School Users'}
            </div>
          </div>
          
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="text-3xl font-bold text-silver">{schoolCount}</div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {canViewPlatformAnalytics ? 'Total Schools' : 'Your School'}
            </div>
          </div>
          
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="text-3xl font-bold text-gold">{chapterCount || 0}</div>
            <div className="text-sm text-[var(--color-text-muted)]">Chapters</div>
          </div>
          
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="text-3xl font-bold text-silver">Active</div>
            <div className="text-sm text-[var(--color-text-muted)]">Platform Status</div>
          </div>

          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="text-3xl font-bold text-silver">13D</div>
            <div className="text-sm text-[var(--color-text-muted)]">Enterprise Services</div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/school/configuration"
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6 hover:border-[var(--color-brand-gold)]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-brand-gold)]">School Settings</h2>
              <Settings className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Configure school profile, programs, policies, and roles</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-sm rounded-lg border border-[var(--color-brand-gold)]/20">
              Open Configuration
            </span>
          </Link>

          <Link
            href="/admin/pilot-inquiries"
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6 hover:border-[var(--color-brand-gold)]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-brand-gold)]">Pilot Inquiries</h2>
              <Plane className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Review and manage pilot program submissions</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-sm rounded-lg border border-[var(--color-brand-gold)]/20">
              View Submissions
            </span>
          </Link>

          <Link
            href="/admin/audit"
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6 hover:border-[var(--color-brand-gold)]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-brand-gold)]">Audit History</h2>
              <History className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Review security events and platform activity</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-sm rounded-lg border border-[var(--color-brand-gold)]/20">
              View Logs
            </span>
          </Link>

          <Link
            href="/admin/health"
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6 hover:border-[var(--color-brand-gold)]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-brand-gold)]">System Health</h2>
              <Activity className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Run diagnostics and monitor platform status</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-sm rounded-lg border border-[var(--color-brand-gold)]/20">
              Run Checks
            </span>
          </Link>

          <Link
            href="/admin/maintenance"
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6 hover:border-[var(--color-brand-gold)]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-brand-gold)]">Maintenance Mode</h2>
              <Wrench className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Enable or disable platform maintenance mode</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-sm rounded-lg border border-[var(--color-brand-gold)]/20">
              Manage
            </span>
          </Link>

          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Production notification service is ready</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-sm rounded-lg border border-gold/20">
              <span>Operational</span>
            </div>
          </div>

          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Feature Flags</h2>
              <Flag className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Global and school-specific feature toggles</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-sm rounded-lg border border-gold/20">
              <span>Operational</span>
            </div>
          </div>

          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Backup & Recovery</h2>
              <Archive className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Backup status and recovery readiness</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-background-secondary)] text-[var(--color-text-muted)] text-sm rounded-lg">
              <span>External integration required</span>
            </div>
          </div>

          <Link
            href="/admin/users"
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6 hover:border-[var(--color-brand-gold)]/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-brand-gold)]">Users</h2>
              <Users className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Manage user accounts, roles, and approvals</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-sm rounded-lg border border-[var(--color-brand-gold)]/20">
              Manage Users
            </span>
          </Link>

          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Content Management</h2>
              <Archive className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">Chapters 1-21, flashcards, and quizzes are production-ready</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-sm rounded-lg border border-gold/20">
              <span>21 Chapters Active</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[var(--color-background-primary)]/50 border border-[var(--color-border-primary)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-light rounded-full"></div>
              <span className="text-[var(--color-text-muted)]">Authentication: Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-light rounded-full"></div>
              <span className="text-[var(--color-text-muted)]">Database: Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-light rounded-full"></div>
              <span className="text-[var(--color-text-muted)]">Content: 21 Chapters Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-light rounded-full"></div>
              <span className="text-[var(--color-text-muted)]">User Management: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
