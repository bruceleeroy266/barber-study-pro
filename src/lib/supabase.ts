import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

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
  if (demoMode || !supabaseUrl || !supabaseKey || supabaseUrl.includes('example.supabase.co')) {
    console.warn('Demo mode: Supabase disabled')
    return mockSupabase as any
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

export const supabase = createClient()