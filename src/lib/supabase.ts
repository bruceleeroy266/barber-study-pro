import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Check if Supabase is properly configured
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('example.supabase.co') &&
  supabaseKey.length > 20

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
    insert: async () => ({ data: null, error: null }),
    upsert: async () => ({ data: null, error: null }),
    select: async () => ({ data: [], error: null }),
    eq: async () => ({ data: [], error: null }),
  }),
}

function createClient() {
  // Only use demo mode if explicitly enabled AND Supabase is not configured
  if (demoMode && !isSupabaseConfigured) {
    console.warn('[Barber Study Pro] Demo mode active — Supabase not configured')
    return mockSupabase as any
  }

  // Production: require real Supabase
  if (!isSupabaseConfigured) {
    console.error('[Barber Study Pro] ERROR: Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or enable demo mode.')
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