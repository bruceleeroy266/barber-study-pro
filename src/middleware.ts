import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInstructorOrAdmin, isAdmin } from '@/lib/auth-helpers'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const demoMode = isExplicitDemoMode()
const supabaseConfigured = isSupabaseConfigured()

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
  if (demoMode && !supabaseConfigured) {
    console.warn('[Middleware] Demo mode — auth bypassed')
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // If Supabase not configured and demo mode is off, block protected routes
  if (!supabaseConfigured) {
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

  // ── MAINTENANCE MODE ENFORCEMENT (edge layer) ──
  // If maintenance mode is enabled, redirect non-allowed users to /maintenance.
  // Allowed roles are stored in maintenance_mode.allowed_roles. Demo mode
  // always bypasses maintenance checks because the service reports disabled.
  if (!demoMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
    const maintenanceRedirect = await checkMaintenanceMode(request, supabase, user?.id)
    if (maintenanceRedirect) {
      return maintenanceRedirect
    }
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
      console.warn(
        `[Middleware] Unauthorized instructor route attempt: user=${user.id} role=${profile?.role ?? 'none'} path=${request.nextUrl.pathname}`
      )
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
      console.warn(
        `[Middleware] Unauthorized admin route attempt: user=${user.id} role=${profile?.role ?? 'none'} path=${request.nextUrl.pathname}`
      )
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

/**
 * Check whether maintenance mode is enabled and the current user is allowed
 * through. Returns a redirect response to /maintenance when the user should
 * be blocked, or null when they may proceed.
 */
async function checkMaintenanceMode(
  request: NextRequest,
  supabase: ReturnType<typeof createServerClient>,
  userId: string | undefined
): Promise<NextResponse | null> {
  try {
    const { data: mode } = await supabase
      .from('maintenance_mode')
      .select('enabled, message, allowed_roles')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!mode?.enabled) {
      return null
    }

    const allowedRoles: string[] = Array.isArray(mode.allowed_roles)
      ? mode.allowed_roles
      : ['platform_super_admin']

    // Unauthenticated users are always blocked during maintenance.
    if (!userId) {
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      if (mode.message) {
        url.searchParams.set('message', mode.message)
      }
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profile?.role && allowedRoles.includes(profile.role)) {
      return null
    }

    const url = request.nextUrl.clone()
    url.pathname = '/maintenance'
    if (mode.message) {
      url.searchParams.set('message', mode.message)
    }
    return NextResponse.redirect(url)
  } catch (err) {
    console.warn('[Middleware] Maintenance mode check failed:', err)
    // Fail open: if we cannot verify maintenance mode, allow the request.
    return null
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}