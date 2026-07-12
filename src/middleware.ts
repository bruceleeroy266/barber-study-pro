import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInstructorOrAdmin, isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import { BETA_AGREEMENT_VERSION } from '@/lib/beta'
import { getRoleBasedRedirect, validateLoginAccess } from '@/lib/auth-access'

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

/** Match /school and /school/* without false positives like /schoolXYZ. */
function isSchoolRoute(pathname: string): boolean {
  return pathname === '/school' || pathname.startsWith('/school/')
}

/** Match /dashboard and /dashboard/* routes. */
function isDashboardRoute(pathname: string): boolean {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
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
    const protectedRoutes = ['/dashboard', '/instructor', '/admin', '/school']
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

  const protectedRoutes = ['/dashboard', '/instructor', '/admin', '/school']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  const authRoutes = ['/login', '/signup', '/reset-password', '/update-password']
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Load profile once for protected routes and auth-route redirects.
  interface MinimalProfile {
    role: string | null
    approval_status: string
    is_disabled: boolean
    requires_password_change: boolean
  }
  let profile: MinimalProfile | null = null
  if ((isProtectedRoute || isAuthRoute) && user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, approval_status, is_disabled, requires_password_change')
      .eq('id', user.id)
      .single()
    if (profileData) {
      profile = profileData as MinimalProfile
    }
  }

  // Auth routes: redirect already-logged-in users to their role dashboard.
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = getRoleBasedRedirect(profile?.role)
    return NextResponse.redirect(url)
  }

  // Protected routes: enforce approval, disabled status, and password-change requirement.
  if (isProtectedRoute && user) {
    const access = validateLoginAccess(profile)
    if (!access.ok) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', access.errorKey ?? 'unknown')
      if (request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(url)
      }
    }

    if (profile?.requires_password_change && !request.nextUrl.pathname.startsWith('/update-password')) {
      const url = request.nextUrl.clone()
      url.pathname = '/update-password'
      url.searchParams.set('reason', 'required')
      return NextResponse.redirect(url)
    }
  }

  // ── BETA AGREEMENT ENFORCEMENT (edge layer) ──
  // All authenticated /dashboard/* users must have accepted the current beta agreement.
  // Admins and instructors are exempt so they can manage the platform without restriction.
  if (isDashboardRoute(request.nextUrl.pathname) && user) {
    const profileRole = await getUserRole(supabase, user.id)
    const isAdminOrInstructor = profileRole === 'admin' || profileRole === 'instructor'

    if (!isAdminOrInstructor) {
      const hasAgreement = await hasAcceptedBetaAgreement(supabase, user.id)
      if (!hasAgreement) {
        const url = request.nextUrl.clone()
        url.pathname = '/beta-agreement'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }
    }
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
      url.pathname = getRoleBasedRedirect(profile?.role)
      return NextResponse.redirect(url)
    }
  }

  // ── ADMIN ACCESS ENFORCEMENT (edge layer) ──
  // Only users whose profile role is 'admin' may access /admin and /admin/*.
  // Exception: /admin/school and /admin/school/* are also accessible to
  // school_admin users because they share the school dashboard UI.
  if (isAdminRoute(request.nextUrl.pathname) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const pathname = request.nextUrl.pathname
    const isSchoolSubRoute = pathname === '/admin/school' || pathname.startsWith('/admin/school/')
    const allowed = isAdmin(profile?.role ?? '') || (isSchoolSubRoute && isSchoolAdmin(profile?.role ?? ''))

    if (!profile || !allowed) {
      console.warn(
        `[Middleware] Unauthorized admin route attempt: user=${user.id} role=${profile?.role ?? 'none'} path=${pathname}`
      )
      const url = request.nextUrl.clone()
      url.pathname = getRoleBasedRedirect(profile?.role)
      return NextResponse.redirect(url)
    }
  }

  // ── SCHOOL ADMIN ACCESS ENFORCEMENT (edge layer) ──
  // Only users whose profile role is 'school_admin' or 'admin' may access
  // /school and /school/* sub-routes.
  if (isSchoolRoute(request.nextUrl.pathname) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !(isSchoolAdmin(profile.role) || isAdmin(profile.role))) {
      console.warn(
        `[Middleware] Unauthorized school route attempt: user=${user.id} role=${profile?.role ?? 'none'} path=${request.nextUrl.pathname}`
      )
      const url = request.nextUrl.clone()
      url.pathname = getRoleBasedRedirect(profile?.role)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

/**
 * Get the user's profile role from Supabase.
 */
async function getUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<string | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    return profile?.role ?? null
  } catch (err) {
    console.warn('[Middleware] Failed to load user role:', err)
    return null
  }
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