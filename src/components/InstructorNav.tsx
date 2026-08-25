'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, Calculator, FileCheck, MessageSquare, ClipboardCheck, LogOut, GraduationCap, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { logLogout } from '@/app/(auth)/actions'
import { Logo } from '@/components/brand'
import EscalationBadge from '@/components/instructor/EscalationBadge'

interface InstructorNavProps {
  user: Profile | null
}

const navItems = [
  { href: '/instructor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/instructor/students', label: 'Students', icon: Users },
  { href: '/instructor/attendance', label: 'Attendance', icon: Calendar },
  { href: '/instructor/gradebook', label: 'Gradebook', icon: Calculator },
  { href: '/instructor/compliance', label: 'Compliance', icon: FileCheck },
  { href: '/instructor/messages', label: 'Messages', icon: MessageSquare },
  { href: '/instructor/assessments', label: 'Assessments', icon: ClipboardCheck },
  { href: '/instructor/rubrics', label: 'Rubrics', icon: GraduationCap },
  { href: '/instructor/escalations', label: 'Escalations', icon: AlertTriangle, badge: true },
]

export default function InstructorNav({ user }: InstructorNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await logLogout(user?.id ?? 'unknown', user?.email)
    } catch {
      // ignore logging failures
    }
    
    // Clear Supabase session
    await supabase.auth.signOut()
    
    // Clear all storage
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
      window.sessionStorage.clear()
      document.cookie.split(';').forEach((c) => {
        const eqPos = c.indexOf('=')
        const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      })
    }
    
    // Redirect to home with cache-busting
    router.push('/')
    router.refresh()
    
    // Force reload to clear any cached state
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-graphite px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/instructor" className="flex items-center">
            <Logo variant="compact" size="md" className="lg:hidden" />
            <Logo variant="full" size="lg" className="hidden lg:block" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-silver hover:text-white"
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
        <div className="lg:hidden fixed inset-0 z-40 bg-black pt-16">
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
                      ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20'
                      : 'text-silver hover:bg-graphite hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {'badge' in item && item.badge && <EscalationBadge />}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-silver hover:bg-silver/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-charcoal border-r border-graphite">
        <div className="p-6">
          <Link href="/instructor" className="flex items-center">
            <Logo variant="full" size="lg" />
          </Link>
        </div>
        
        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20'
                    : 'text-silver hover:bg-graphite hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {'badge' in item && item.badge && <EscalationBadge />}
              </Link>
            )
          })}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-silver hover:bg-silver/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  )
}
