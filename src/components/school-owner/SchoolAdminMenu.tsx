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
} from 'lucide-react'

const items = [
  { href: '/school', label: 'School Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/school/configuration', label: 'School Settings', icon: Settings },
  { href: '/school#performance', label: 'Student & Instructor Performance', icon: BarChart3 },
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
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm font-medium text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/15"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        School Management
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-[60] mt-2 w-72 overflow-hidden rounded-xl border border-graphite bg-charcoal shadow-2xl"
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
      )}
    </div>
  )
}
