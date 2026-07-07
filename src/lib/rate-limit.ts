// Simple client-side rate limiting for auth endpoints.
// This is a defense-in-depth measure; real production apps should also
// enforce rate limits on the server/API edge.

const RATE_LIMIT_KEY = 'ascyn_auth_rate_limit'

interface AttemptRecord {
  count: number
  firstAttemptAt: number
  lockedUntil?: number
}

interface RateLimitState {
  login: Record<string, AttemptRecord>
  signup: AttemptRecord
}

function loadState(): RateLimitState {
  if (typeof window === 'undefined') {
    return { login: {}, signup: { count: 0, firstAttemptAt: 0 } }
  }

  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (raw) {
      return JSON.parse(raw) as RateLimitState
    }
  } catch {
    // Ignore parse errors and fall back to default state.
  }

  return { login: {}, signup: { count: 0, firstAttemptAt: 0 } }
}

function saveState(state: RateLimitState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors (e.g., private mode).
  }
}

function now(): number {
  return Date.now()
}

function isLocked(record: AttemptRecord | undefined): boolean {
  if (!record || !record.lockedUntil) return false
  return record.lockedUntil > now()
}

function lockoutMs(attemptCount: number): number {
  // Exponential backoff: 30s, 60s, 2m, 4m, 8m, cap at 15m.
  const base = 30_000
  const multiplier = Math.min(attemptCount - 4, 5) // start after 5 attempts
  return base * 2 ** multiplier
}

export function checkLoginRateLimit(email: string): { allowed: boolean; waitSeconds: number } {
  const state = loadState()
  const record = state.login[email.toLowerCase()]

  if (isLocked(record)) {
    const waitSeconds = Math.ceil((record!.lockedUntil! - now()) / 1000)
    return { allowed: false, waitSeconds }
  }

  return { allowed: true, waitSeconds: 0 }
}

export function recordLoginAttempt(email: string, success: boolean): void {
  const state = loadState()
  const key = email.toLowerCase()
  const existing = state.login[key]
  const currentTime = now()

  if (success) {
    delete state.login[key]
    saveState(state)
    return
  }

  const record: AttemptRecord = existing && !isLocked(existing)
    ? {
        count: existing.count + 1,
        firstAttemptAt: existing.firstAttemptAt,
      }
    : {
        count: 1,
        firstAttemptAt: currentTime,
      }

  // Lock out after 5 failed attempts.
  if (record.count >= 5) {
    record.lockedUntil = currentTime + lockoutMs(record.count)
  }

  state.login[key] = record
  saveState(state)
}

export function checkSignupRateLimit(): { allowed: boolean; waitSeconds: number } {
  const state = loadState()
  const record = state.signup

  if (isLocked(record)) {
    const waitSeconds = Math.ceil((record.lockedUntil! - now()) / 1000)
    return { allowed: false, waitSeconds }
  }

  return { allowed: true, waitSeconds: 0 }
}

export function recordSignupAttempt(): { allowed: boolean; waitSeconds: number } {
  const state = loadState()
  const currentTime = now()
  const record = state.signup

  // Reset counter if more than 60 minutes have passed since the first attempt.
  if (currentTime - record.firstAttemptAt > 60 * 60 * 1000) {
    record.count = 0
    record.firstAttemptAt = currentTime
  }

  record.count += 1

  // Allow up to 3 signup attempts per hour from this browser.
  if (record.count > 3) {
    record.lockedUntil = currentTime + 60 * 60 * 1000
    saveState(state)
    return { allowed: false, waitSeconds: 3600 }
  }

  saveState(state)
  return { allowed: true, waitSeconds: 0 }
}
