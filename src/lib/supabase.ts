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