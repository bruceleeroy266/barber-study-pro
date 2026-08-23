/**
 * Centralized error logging for ASCYN PRO.
 *
 * Provides structured error logging that can be extended to external
 * services (Sentry, LogRocket, etc.) without changing call sites.
 *
 * Currently logs to console with structured context. To integrate an
 * external service, set the appropriate env vars and update the
 * `reportToExternalService` function.
 */

export interface ErrorContext {
  /** Component or module where the error occurred */
  source: string
  /** User ID if available */
  userId?: string
  /** User role if available */
  userRole?: string
  /** Current page/route */
  route?: string
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

export interface LoggedError {
  message: string
  stack?: string
  digest?: string
  context: ErrorContext
  timestamp: string
  severity: 'error' | 'warning' | 'fatal'
  environment: string
}

/**
 * Log an error with structured context.
 */
export function logError(
  error: Error | unknown,
  context: ErrorContext,
  severity: 'error' | 'warning' | 'fatal' = 'error'
): LoggedError {
  const err = error instanceof Error ? error : new Error(String(error))

  const loggedError: LoggedError = {
    message: err.message,
    stack: err.stack,
    digest: (err as Error & { digest?: string }).digest,
    context,
    timestamp: new Date().toISOString(),
    severity,
    environment: process.env.NODE_ENV || 'unknown',
  }

  const isBrowser = typeof window !== 'undefined'
  const isProductionBrowser = isBrowser && process.env.NODE_ENV === 'production'
  const logFn = severity === 'warning' ? console.warn : console.error

  if (isProductionBrowser) {
    // Browser consoles are client-visible. Emit only stable context and an
    // optional opaque Next.js digest; never expose messages, stacks, or PII.
    logFn(`[${severity.toUpperCase()}] [${context.source}] Client error`, {
      digest: loggedError.digest,
      timestamp: loggedError.timestamp,
    })
  } else {
    // Development browser output and protected server logs retain diagnostics.
    logFn(`[${severity.toUpperCase()}] [${context.source}] ${err.message}`, {
      ...loggedError,
      stack: undefined,
    })

    if (err.stack && severity !== 'warning') {
      console.error(err.stack)
    }
  }

  // Report to external service (placeholder for Sentry/etc.)
  reportToExternalService(loggedError)

  return loggedError
}

/**
 * Log an error from a React error boundary.
 */
export function logBoundaryError(
  error: Error & { digest?: string },
  errorInfo: { componentStack?: string },
  source: string
): LoggedError {
  return logError(error, {
    source,
    metadata: {
      componentStack: errorInfo.componentStack,
      digest: error.digest,
    },
  }, 'fatal')
}

/**
 * Log an API route error.
 */
export function logApiError(
  error: Error | unknown,
  route: string,
  method: string,
  additionalContext?: Record<string, unknown>
): LoggedError {
  return logError(error, {
    source: `api:${route}`,
    route,
    metadata: {
      method,
      ...additionalContext,
    },
  })
}

/**
 * Log a database operation error.
 */
export function logDbError(
  error: Error | unknown,
  table: string,
  operation: string,
  additionalContext?: Record<string, unknown>
): LoggedError {
  return logError(error, {
    source: `db:${table}`,
    metadata: {
      operation,
      table,
      ...additionalContext,
    },
  })
}

/**
 * Log an authentication error.
 */
export function logAuthError(
  error: Error | unknown,
  action: string,
  userId?: string
): LoggedError {
  return logError(error, {
    source: `auth:${action}`,
    userId,
  }, 'warning')
}

// ── External Service Integration ────────────────────────────────────────────

/**
 * Report error to external monitoring service.
 *
 * To integrate Sentry:
 * 1. npm install @sentry/nextjs
 * 2. Set SENTRY_DSN env var
 * 3. Uncomment the Sentry code below
 *
 * To integrate another service, replace the implementation.
 */
function reportToExternalService(error: LoggedError): void {
  // ── Sentry Integration (uncomment when ready) ──
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(new Error(error.message), {
  //     extra: error.context.metadata,
  //     tags: {
  //       source: error.context.source,
  //       severity: error.severity,
  //       environment: error.environment,
  //     },
  //     user: error.context.userId ? { id: error.context.userId } : undefined,
  //   })
  // }

  // ── Vercel Log Drains ──
  // Vercel automatically captures console.error output in production.
  // For structured log drains, configure in Vercel Dashboard → Settings → Log Drains.

  // Suppress unused variable warning
  void error
}
