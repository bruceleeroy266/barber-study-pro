import 'server-only'

/**
 * Instructor "Last Login" Signal — server-side only
 *
 * Provides auth.users.last_sign_in_at for a verified roster of student IDs so
 * instructors can distinguish "logged in" from "did learning work".
 *
 * Safety architecture (per the existing platform pattern):
 *   - Uses the service-role client (src/lib/supabase-service-role.ts), which
 *     already gates server-side privileged access (notifications, audit log).
 *   - Runs ONLY in server components / route handlers. The service-role key is
 *     never shipped to the browser; Auth admin API responses are reduced to a
 *     single timestamp per already-verified, school-scoped student — no Auth
 *     user objects, tokens, or admin capabilities are exposed to the client.
 *   - Callers pass only student IDs they have already verified belong to the
 *     instructor's own school (school isolation is enforced upstream by the
 *     roster queries).
 *   - Degrades gracefully: if the service role is not configured or an
 *     individual lookup fails, that student's signal is simply absent ('—')
 *     and the rest of the dashboard renders normally.
 */

import { createServiceRoleClient } from '@/lib/supabase-service-role'

/**
 * Fetch last_sign_in_at for each user id.
 *
 * @returns Map of userId → ISO last_sign_in_at, or null when the account has
 *          never signed in or the lookup failed. An empty object means the
 *          signal is entirely unavailable (service role not configured).
 */
export async function getLastSignInAtMap(
  userIds: string[]
): Promise<Record<string, string | null>> {
  const uniqueIds = [...new Set(userIds.filter((id) => typeof id === 'string' && id.length > 0))]
  if (uniqueIds.length === 0) {
    return {}
  }

  let supabase: ReturnType<typeof createServiceRoleClient>
  try {
    supabase = createServiceRoleClient()
  } catch (err) {
    console.warn(
      '[last-login] Service role client unavailable; Last Login signal disabled:',
      err instanceof Error ? err.message : err
    )
    return {}
  }

  const entries = await Promise.all(
    uniqueIds.map(async (id): Promise<[string, string | null]> => {
      try {
        const { data, error } = await supabase.auth.admin.getUserById(id)
        if (error) {
          console.warn(`[last-login] Lookup failed for a roster student: ${error.message}`)
          return [id, null]
        }
        return [id, data?.user?.last_sign_in_at ?? null]
      } catch (err) {
        console.warn(
          '[last-login] Unexpected lookup failure for a roster student:',
          err instanceof Error ? err.message : err
        )
        return [id, null]
      }
    })
  )

  return Object.fromEntries(entries)
}
