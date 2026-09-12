'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, TrendingUp, User, LogOut, GraduationCap, Shield, RotateCcw, MessageSquare, Calculator, ClipboardCheck, Building2, FileCheck, Settings, FileSignature, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'
import { isInstructorOrAdmin, isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { logLogout } from '@/app/(auth)/actions'
import { Logo } from '@/components/brand'

interface DashboardNavProps { user: Profile | null }

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/chapters', label: 'Chapters', icon: BookOpen },
  { href: '/dashboard/chapters', label: 'Flashcards', icon: RotateCcw },
  { href: '/dashboard/missed-questions', label: 'Missed Questions', icon: RotateCcw },
  { href: '/dashboard/progress', label: 'My Progress', icon: TrendingUp },
  { href: '/dashboard/attendance', label: 'Attendance & Hours', icon: Clock },
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
  const navItems = useMemo(() => {
    const items = [...baseNavItems]
    if (user && isInstructorOrAdmin(user.role)) {
      items.push(...instructorNavItems)
      items.push({ href: '/instructor', label: 'Instructor Portal', icon: GraduationCap })
    }
    if (user && (isAdmin(user.role) || isSchoolAdmin(user.role))) items.push({ href: '/school', label: 'School Dashboard', icon: Building2 })
    if (user && isAdmin(user.role)) {
      items.push({ href: '/admin/school/configuration', label: 'School Settings', icon: Settings })
      items.push({ href: '/admin', label: 'Admin Portal', icon: Shield })
    }
    return items
  }, [user])

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await logLogout(user?.id ?? 'unknown', user?.email)
    } catch {}
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      window.localStorage.clear(); window.sessionStorage.clear()
      document.cookie.split(';').forEach((c) => {
        const eqPos = c.indexOf('='); const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      })
    }
    router.push('/'); router.refresh()
    setTimeout(() => { window.location.href = '/' }, 100)
  }

  const links = (mobile = false) => navItems.map((item) => {
    const Icon = item.icon
    return <Link key={item.href} href={item.href} onClick={mobile ? () => setMobileMenuOpen(false) : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-gold/10 text-gold border border-gold/20' : 'text-silver-gray hover:bg-graphite hover:text-white'}`}><Icon className="w-5 h-5" /><span className="font-medium">{item.label}</span></Link>
  })

  return <>
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-graphite px-4 py-3"><div className="flex items-center justify-between"><Link href="/dashboard"><Logo variant="compact" size="md" /></Link><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-silver-gray hover:text-white" aria-label="Toggle navigation"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg></button></div></div>
    {mobileMenuOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black pt-16 overflow-y-auto"><nav className="p-4 space-y-2 pb-8">{links(true)}<button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-silver hover:bg-silver/10 rounded-lg"><LogOut className="w-5 h-5" /><span className="font-medium">Logout</span></button></nav></div>}
    <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-charcoal border-r border-graphite"><div className="p-6"><Link href="/dashboard" className="flex items-center gap-3 mb-8"><Logo variant="full" size="3xl" /><span className="text-xs text-silver-gray">v2.0</span></Link><div className="mb-6 pb-6 border-b border-graphite"><p className="text-sm text-silver-gray mb-1">Welcome back,</p><p className="font-medium text-white truncate">{user?.full_name || 'Student'}</p><span className="inline-block mt-2 px-2 py-1 bg-gold/10 text-gold text-xs rounded capitalize">{user?.role || 'Student'}</span></div><nav className="space-y-1">{links()}</nav></div><div className="absolute bottom-0 left-0 right-0 p-6 border-t border-graphite"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-silver hover:bg-silver/10 rounded-lg"><LogOut className="w-5 h-5" /><span className="font-medium">Logout</span></button></div></aside>
  </>
}
