import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client authenticated with the service role key.
 *
 * ⚠️ This client bypasses RLS and must only be used inside trusted server
 * actions, route handlers, or server components. Never import this file into
 * client components or expose the resulting client to the browser.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Service role client is not configured')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
