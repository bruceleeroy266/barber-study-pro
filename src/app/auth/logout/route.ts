import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { logLogout } from '@/app/(auth)/actions'

const LOGOUT_AUDIT_TIMEOUT_MS = 750

async function handleLogout(request: NextRequest) {
  const supabase = await createClient()

  let userId = 'unknown'
  let email: string | null | undefined = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? 'unknown'
    email = user?.email
  } catch {
    // Continue with logout even if user lookup fails.
  }

  await supabase.auth.signOut()

  // Audit logging is best-effort and must never block logout navigation.
  if (userId !== 'unknown') {
    await Promise.race([
      logLogout(userId, email),
      new Promise<void>((resolve) => setTimeout(resolve, LOGOUT_AUDIT_TIMEOUT_MS)),
    ])
  }

  const response = NextResponse.redirect(new URL('/login', request.url), 303)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET(request: NextRequest) {
  return handleLogout(request)
}

export async function POST(request: NextRequest) {
  return handleLogout(request)
}
