'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, TrendingUp, User, LogOut, GraduationCap, Shield, RotateCcw, MessageSquare, Calculator, ClipboardCheck, Building2, FileCheck, Settings, FileSignature } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { isInstructorOrAdmin, isAdmin } from '@/lib/auth-helpers'

interface DashboardNavProps {
  user: Profile | null
}

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/chapters', label: 'Chapters', icon: BookOpen },
  { href: '/dashboard/missed-questions', label: 'Missed Questions', icon: RotateCcw },
  { href: '/dashboard/progress', label: 'My Progress', icon: TrendingUp },
  { href: '/dashboard/grades', label: 'Grades', icon: Calculator },
  { href: '/dashboard/assessments', label: 'Assessments', icon: ClipboardCheck },
  { href: '/dashboard/compliance', label: 'Compliance', icon: FileCheck },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/beta-agreement', label: 'Beta Agreement / Tester Checklist', icon: FileSignature },
]

const instructorNavItems = [
  { href: '/instructor/gradebook', label: 'Gradebook', icon: Calculator },
  { href: '/instructor/assessments', label: 'Assessments', icon: ClipboardCheck },
  { href: '/instructor/rubrics', label: 'Rubrics', icon: ClipboardCheck },
]

export default function DashboardNav({ user }: DashboardNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Build nav items based on role so instructors/admins can reach their portals.
  const navItems = useMemo(() => {
    const items = [...baseNavItems]
    if (user && isInstructorOrAdmin(user.role)) {
      items.push(...instructorNavItems)
      items.push({ href: '/instructor', label: 'Instructor Portal', icon: GraduationCap })
    }
    if (user && isAdmin(user.role)) {
      items.push({ href: '/admin/school', label: 'School Dashboard', icon: Building2 })
      items.push({ href: '/admin/school/configuration', label: 'School Settings', icon: Settings })
      items.push({ href: '/admin', label: 'Admin Portal', icon: Shield })
    }
    return items
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.svg" alt="ASCYN PRO" className="h-7 w-auto" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-950 pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
            <button
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
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 mb-8">
            <img src="/logo.svg" alt="ASCYN PRO" className="h-8 w-auto" />
            <div>
              <span className="text-xs text-gray-500">v2.0</span>
            </div>
          </Link>

          <div className="mb-6 pb-6 border-b border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
            <p className="font-medium text-white truncate">{user?.full_name || 'Student'}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs rounded capitalize">
              {user?.role || 'Student'}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <button
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
