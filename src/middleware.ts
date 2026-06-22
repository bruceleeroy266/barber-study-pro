import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInstructorOrAdmin, isAdmin } from '@/lib/auth-helpers'

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

const isSupabaseConfigured =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('example.supabase.co') &&
  supabaseKey.length > 20

/** Match /instructor and /instructor/* without false positives like /instructorXYZ. */
function isInstructorRoute(pathname: string): boolean {
  return pathname === '/instructor' || pathname.startsWith('/instructor/')
}

/** Match /admin and /admin/* without false positives like /adminXYZ. */
function isAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export async function middleware(request: NextRequest) {
  // Demo mode: skip auth checks ONLY if explicitly enabled AND Supabase not configured
  if (demoMode && !isSupabaseConfigured) {
    console.warn('[Middleware] Demo mode — auth bypassed')
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // If Supabase not configured and demo mode is off, block protected routes
  if (!isSupabaseConfigured) {
    const protectedRoutes = ['/dashboard', '/instructor', '/admin']
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'supabase_not_configured')
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedRoutes = ['/dashboard', '/instructor', '/admin']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  const authRoutes = ['/login', '/signup', '/reset-password']
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // ── INSTRUCTOR ACCESS ENFORCEMENT (edge layer) ──
  // Only users whose profile role is 'instructor' or 'admin' may access
  // /instructor and /instructor/* sub-routes. Students/apprentices are
  // redirected to /dashboard. Logged-out users were handled above.
  if (isInstructorRoute(request.nextUrl.pathname) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !isInstructorOrAdmin(profile.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // ── ADMIN ACCESS ENFORCEMENT (edge layer) ──
  // Only users whose profile role is 'admin' may access /admin and /admin/*.
  if (isAdminRoute(request.nextUrl.pathname) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !isAdmin(profile.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}