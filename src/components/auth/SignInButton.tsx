'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getRoleBasedRedirect } from '@/lib/auth-access'

interface SignInButtonProps {
  className?: string
  children: React.ReactNode
}

export default function SignInButton({ className, children }: SignInButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // User has active session, get their role and redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role) {
            router.push(getRoleBasedRedirect(profile.role))
            return
          }
        }
      } catch (err) {
        console.error('[SignInButton] Session check failed:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Re-check session on click
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role) {
          router.push(getRoleBasedRedirect(profile.role))
          return
        }
      }
    } catch (err) {
      console.error('[SignInButton] Click session check failed:', err)
    }

    // No valid session, go to login
    router.push('/login')
  }

  if (loading) {
    return (
      <span className={className} style={{ opacity: 0.7 }}>
        {children}
      </span>
    )
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
