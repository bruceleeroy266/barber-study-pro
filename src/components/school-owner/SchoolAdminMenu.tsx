'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { logLogout } from '@/app/(auth)/actions'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  BarChart3,
  ShieldCheck,
  Clock3,
} from 'lucide-react'

const items = [
  { href: '/school', label: 'School Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/school/configuration', label: 'School Settings', icon: Settings },
  { href: '/school#performance', label: 'Student & Instructor Performance', icon: BarChart3 },
  { href: '/school/hours', label: 'Student Hours', icon: Clock3 },
  { href: '/school#reports-compliance', label: 'Reports & Compliance', icon: ShieldCheck },
]

export default function SchoolAdminMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await logLogout(user?.id ?? 'unknown', user?.email)
    } catch {
      // Logging should never block sign-out.
    }

    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex max-w-[11rem] items-center gap-2 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm font-medium leading-tight text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/15 sm:max-w-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="sm:hidden">School Menu</span>
        <span className="hidden sm:inline">School Management</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close School Menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[1px] sm:hidden"
          />
          <div
          role="menu"
          className="fixed left-3 right-3 top-[4.5rem] z-[60] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-xl border border-graphite bg-charcoal shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-72 sm:max-h-none"
        >
          <div className="p-2">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-silver transition-colors hover:bg-graphite hover:text-white"
                >
                  <Icon className="h-4 w-4 text-[var(--color-brand-gold)]" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="border-t border-graphite p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-silver transition-colors hover:bg-silver/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  )
}
