'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { logLogout } from '@/app/(auth)/actions'
import {
  LayoutDashboard,
  Users,
  Settings,
  History,
  Activity,
  Wrench,
  Plane,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { Profile } from '@/types'
import { isAdmin } from '@/lib/auth-helpers'

interface AdminNavProps {
  user: Profile | null
}

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/school/configuration', label: 'School Settings', icon: Settings },
  { href: '/admin/pilot-inquiries', label: 'Pilot Inquiries', icon: Plane },
  { href: '/admin/audit', label: 'Audit History', icon: History },
  { href: '/admin/health', label: 'System Health', icon: Activity },
  { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
]

export default function AdminNav({ user }: AdminNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      await logLogout(currentUser?.id ?? 'unknown', currentUser?.email)
    } catch {
      // Ignore logging failures; still sign the user out.
    }
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = isAdmin(user?.role ?? '')
    ? adminLinks
    : adminLinks.filter((link) =>
        ['/admin', '/admin/users', '/admin/school/configuration'].includes(link.href)
      )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo.svg" alt="ASCYN PRO" className="h-7 w-auto" />
            <Shield className="w-4 h-4 text-[#D4AF37]" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-gray-400 hover:text-white"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-950 pt-16">
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 mb-8">
            <img src="/logo.svg" alt="ASCYN PRO" className="h-8 w-auto" />
            <Shield className="w-5 h-5 text-[#D4AF37]" />
          </Link>

          <div className="mb-6 pb-6 border-b border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Admin,</p>
            <p className="font-medium text-white truncate">{user?.full_name || 'Administrator'}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs rounded capitalize">
              {user?.role || 'admin'}
            </span>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

    </>
  )
}
