import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInstructorOrAdmin, isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { isExplicitDemoMode, isSupabaseConfigured, diagnoseSupabaseConfig } from '@/lib/demo-helpers'
import { BETA_AGREEMENT_VERSION } from '@/lib/beta'
import { getRoleBasedRedirect, validateLoginAccess } from '@/lib/auth-access'

// Module-load diagnostic (build-time / top-level evaluation)
diagnoseSupabaseConfig('middleware:module-load')

/** Match /instructor and /instructor/* without false positives like /instructorXYZ. */
function isInstructorRoute(pathname: string): boolean {
  return pathname === '/instructor' || pathname.startsWith('/instructor/')
}

/** Match /admin and /admin/* without false positives like /adminXYZ. */
function isAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

/** Match /school and /school/* without false positives like /schoolXYZ. */
function isSchoolRoute(pathname: string): boolean {
  return pathname === '/school' || pathname.startsWith('/school/')
}

/** Match /dashboard and /dashboard/* routes. */
function isDashboardRoute(pathname: string): boolean {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
}

/** Match auth routes. */
function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/login', '/signup', '/reset-password', '/update-password']
  return authRoutes.some((route) => pathname.startsWith(route))
}

/** Match protected routes. */
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/dashboard', '/instructor', '/admin', '/school']
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  // Evaluate configuration per request so edge runtime uses current env values.
  diagnoseSupabaseConfig('middleware:request')
  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

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
    if (isProtectedRoute(request.nextUrl.pathname)) {
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

  const pathname = request.nextUrl.pathname
  const isProtected = isProtectedRoute(pathname)
  const isAuth = isAuthRoute(pathname)

  // Redirect unauthenticated users from protected routes to login
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Load profile once for all subsequent checks
  interface MinimalProfile {
    role: string | null
    approval_status: string
    is_disabled: boolean
    requires_password_change: boolean
  }
  let profile: MinimalProfile | null = null
  if ((isProtected || isAuth) && user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, approval_status, is_disabled, requires_password_change')
      .eq('id', user.id)
      .single()
    if (profileData) {
      profile = profileData as MinimalProfile
    }
  }

  // Auth routes: redirect already-logged-in users to their role dashboard
  if (isAuth && user) {
    const url = request.nextUrl.clone()
    url.pathname = getRoleBasedRedirect(profile?.role)
    return NextResponse.redirect(url)
  }

  // Protected routes: enforce approval, disabled status, and password-change requirement
  if (isProtected && user) {
    const access = validateLoginAccess(profile)
    if (!access.ok) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', access.errorKey ?? 'unknown')
      return NextResponse.redirect(url)
    }

    if (profile?.requires_password_change && !pathname.startsWith('/update-password')) {
      const url = request.nextUrl.clone()
      url.pathname = '/update-password'
      url.searchParams.set('reason', 'required')
      return NextResponse.redirect(url)
    }
  }

  // ── BETA AGREEMENT ENFORCEMENT (edge layer) ──
  if (isDashboardRoute(pathname) && user) {
    const profileRole = profile?.role
    const isAdminOrInstructor = profileRole === 'admin' || profileRole === 'instructor'

    if (!isAdminOrInstructor) {
      const hasAgreement = await hasAcceptedBetaAgreement(supabase, user.id)
      if (!hasAgreement) {
        const url = request.nextUrl.clone()
        url.pathname = '/beta-agreement'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
      }
    }
  }

  // ── MAINTENANCE MODE ENFORCEMENT (edge layer) ──
  if (!demoMode && !pathname.startsWith('/maintenance')) {
    const maintenanceRedirect = await checkMaintenanceMode(request, supabase, user?.id)
    if (maintenanceRedirect) {
      return maintenanceRedirect
    }
  }

  // ── ROLE-BASED ROUTE ENFORCEMENT (edge layer) ──
  // Single source of truth: verify user has correct role for the route they're accessing
  if (user && profile) {
    const userRole = profile.role

    // Instructor routes: only instructor or admin
    if (isInstructorRoute(pathname)) {
      if (!isInstructorOrAdmin(userRole)) {
        console.warn(
          `[Middleware] Unauthorized instructor route attempt: user=${user.id} role=${userRole ?? 'none'} path=${pathname}`
        )
        const url = request.nextUrl.clone()
        url.pathname = getRoleBasedRedirect(userRole)
        return NextResponse.redirect(url)
      }
    }

    // Admin routes: only admin or school_admin (school_admin limited to certain routes)
    if (isAdminRoute(pathname)) {
      const isSchoolAdminAllowedRoute =
        pathname === '/admin' ||
        pathname === '/admin/users' ||
        pathname.startsWith('/admin/users/')
      const allowed =
        isAdmin(userRole ?? '') ||
        (isSchoolAdminAllowedRoute && isSchoolAdmin(userRole ?? ''))

      if (!allowed) {
        console.warn(
          `[Middleware] Unauthorized admin route attempt: user=${user.id} role=${userRole ?? 'none'} path=${pathname}`
        )
        const url = request.nextUrl.clone()
        url.pathname = getRoleBasedRedirect(userRole)
        return NextResponse.redirect(url)
      }
    }

    // School routes: only school_admin or admin
    if (isSchoolRoute(pathname)) {
      if (!(isSchoolAdmin(userRole) || isAdmin(userRole))) {
        console.warn(
          `[Middleware] Unauthorized school route attempt: user=${user.id} role=${userRole ?? 'none'} path=${pathname}`
        )
        const url = request.nextUrl.clone()
        url.pathname = getRoleBasedRedirect(userRole)
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

/**
 * Check whether the user has accepted the current beta agreement version.
 */
async function hasAcceptedBetaAgreement(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('beta_agreements')
      .select('id')
      .eq('user_id', userId)
      .eq('agreement_version', BETA_AGREEMENT_VERSION)
      .maybeSingle()

    if (error) {
      console.warn('[Middleware] Beta agreement check failed:', error)
      // Fail open: if the table is missing or query fails, allow access to avoid lockouts.
      return true
    }

    return !!data
  } catch (err) {
    console.warn('[Middleware] Beta agreement check error:', err)
    return true
  }
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