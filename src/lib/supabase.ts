/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBrowserClient } from '@supabase/ssr'
import { isExplicitDemoMode, diagnoseSupabaseConfig } from './demo-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
// Module-load diagnostic (build-time / top-level evaluation)
diagnoseSupabaseConfig('supabase:module-load')

/**
 * Creates a chainable mock query builder that behaves like the real Supabase
 * PostgREST builder. Each filtering method returns the builder for further
 * chaining, and awaiting the builder resolves to a safe default result.
 */
function createMockQueryBuilder(operation: 'select' | 'insert' | 'upsert' | 'delete' = 'select') {
  const shouldError = false

  const builder: any = {
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    range: () => builder,
    overlaps: () => builder,
    textSearch: () => builder,
    match: () => builder,
    not: () => builder,
    or: () => builder,
    filter: () => builder,
    select: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    csv: () => Promise.resolve({ data: null, error: null }),
    then: (onfulfilled?: any, onrejected?: any) => {
      if (shouldError) {
        const error = { message: 'Demo mode query failed', code: 'DEMO_ERROR' }
        return onrejected ? Promise.reject(error).catch(onrejected) : Promise.reject(error)
      }

      let result: any
      if (operation === 'select') {
        result = { data: [], error: null }
      } else if (operation === 'insert' || operation === 'upsert') {
        result = { data: null, error: null }
      } else if (operation === 'delete') {
        result = { data: null, error: null }
      } else {
        result = { data: null, error: null }
      }

      return Promise.resolve(result).then(onfulfilled, onrejected)
    },
  }

  return builder
}

const mockSupabase = {
  auth: {
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({
      data: {
        user: { id: 'demo-user', email: 'demo@example.com' },
        session: { access_token: 'demo-token' },
      },
      error: null,
    }),
    signUp: async () => ({
      data: {
        user: { id: 'demo-user', email: 'demo@example.com' },
        session: { access_token: 'demo-token' },
      },
      error: null,
    }),
    getUser: async () => ({
      data: { user: { id: 'demo-user', email: 'demo@example.com' } },
      error: null,
    }),
    getSession: async () => ({
      data: { session: { access_token: 'demo-token' } },
      error: null,
    }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
  },
  from: () => ({
    insert: () => createMockQueryBuilder('insert'),
    upsert: () => createMockQueryBuilder('upsert'),
    update: () => createMockQueryBuilder('upsert'),
    delete: () => createMockQueryBuilder('delete'),
    select: () => createMockQueryBuilder('select'),
  }),
}

function createClient() {
  // Evaluate configuration at call time so server-side code uses runtime env
  // values and client-side diagnostics reflect the built-in values accurately.
  const demoMode = isExplicitDemoMode()
  const diag = diagnoseSupabaseConfig('supabase:createClient')
  const supabaseConfigured = diag.configured

  // Production safety: never silently fall back to mock auth/data — not even
  // under demo mode. The mock client ignores credentials and returns a demo
  // admin profile, which would let anyone into /admin if it leaked into a
  // production deployment. This check runs before the demo-mode fallback so a
  // misconfigured production deployment fails loudly instead of serving demo data.
  if (!supabaseConfigured) {
    const message =
      '[ASCYN PRO] ERROR: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    console.error(message)
    console.error('[ASCYN PRO] Client diagnostic:', {
      urlPresent: diag.urlPresent,
      keyPresent: diag.keyPresent,
      urlLength: diag.urlLength,
      keyLength: diag.keyLength,
      urlValidScheme: diag.urlValidScheme,
      urlNonPlaceholder: diag.urlNonPlaceholder,
      keyLongEnough: diag.keyLongEnough,
      nodeEnv: process.env.NODE_ENV,
    })
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message)
    }
    // Non-production: allow explicit demo mode to keep local development from
    // crashing when env vars are intentionally omitted.
    if (demoMode) {
      console.warn('[ASCYN PRO] Demo mode active — Supabase not configured')
      return mockSupabase as any
    }
    // Non-production, non-demo fallback still surfaces the misconfiguration.
    return mockSupabase as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        if (typeof document === 'undefined') return []
        return document.cookie.split('; ').filter(Boolean).map((cookie) => {
          const [name, ...rest] = cookie.split('=')
          return { name, value: rest.join('=') }
        })
      },
      setAll(cookiesToSet) {
        if (typeof document === 'undefined') return
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${value}`
          if (options) {
            if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
            if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`
            if (options.path) cookieString += `; Path=${options.path}`
            if (options.domain) cookieString += `; Domain=${options.domain}`
            if (options.secure) cookieString += '; Secure'
            if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
            if (options.httpOnly) cookieString += '; HttpOnly'
          }
          document.cookie = cookieString
        })
      },
    },
  })
}

// Lazy singleton: do not call createClient() at module load. Calling it during
// module initialization causes it to run during `next build` page-data
// collection for any page that imports this module, even when the page is
// marked force-dynamic. Deferring creation until first use lets protected
// pages build successfully while still failing loudly at runtime if Supabase
// is genuinely unconfigured.
let supabaseInstance: any

export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    if (!supabaseInstance) {
      supabaseInstance = createClient()
    }
    return supabaseInstance[prop]
  },
})

export function getSupabaseBrowserClient(): typeof supabase {
  return supabase
}
