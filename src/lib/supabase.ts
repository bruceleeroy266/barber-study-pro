import { createBrowserClient } from '@supabase/ssr'
import { isExplicitDemoMode, isSupabaseConfigured } from './demo-helpers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const demoMode = isExplicitDemoMode()
const supabaseConfigured = isSupabaseConfigured()

/**
 * Creates a chainable mock query builder that behaves like the real Supabase
 * PostgREST builder. Each filtering method returns the builder for further
 * chaining, and awaiting the builder resolves to a safe default result.
 */
function createMockQueryBuilder(operation: 'select' | 'insert' | 'upsert' | 'delete' = 'select') {
  let shouldError = false

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
  // Only use demo mode if explicitly enabled AND Supabase is not configured
  if (demoMode && !supabaseConfigured) {
    console.warn('[ASCYN PRO] Demo mode active — Supabase not configured')
    return mockSupabase as any
  }

  // Production: require real Supabase
  if (!supabaseConfigured) {
    console.error('[ASCYN PRO] ERROR: Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or enable demo mode.')
    // Return mock to prevent crashes, but log error
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

export const supabase = createClient()
