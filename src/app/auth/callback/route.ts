import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getRoleBasedRedirect } from '@/lib/auth-access'

/**
 * Allowed internal redirect prefixes. The `next` search param is only used
 * when it is a relative path starting with one of these prefixes to prevent
 * open-redirect attacks.
 */
const ALLOWED_REDIRECT_PREFIXES = ['/dashboard', '/instructor', '/admin', '/school']

function isSafeRedirectPath(path: string): boolean {
  // Reject absolute URLs and protocol-relative URLs.
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(path) || path.startsWith('//')) {
    return false
  }
  return ALLOWED_REDIRECT_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  // if "next" is in param, use it as the redirect URL only if it is safe.
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const next = isSafeRedirectPath(rawNext) ? rawNext : '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Handle password recovery.
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }

      // Invited users must set their password before accessing the platform.
      if (type === 'invite') {
        return NextResponse.redirect(`${origin}/auth/set-password`)
      }

      // For all other authenticated callbacks, route the user to their
      // role-specific portal to ensure instructors land on /instructor.
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const redirectPath = getRoleBasedRedirect(profile?.role)
        // If the role-based helper returns the login error path, keep the
        // safe `next` fallback so the user still lands somewhere useful.
        if (!redirectPath.startsWith('/login')) {
          return NextResponse.redirect(`${origin}${redirectPath}`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
