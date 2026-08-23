import { afterEach, describe, expect, it, vi } from 'vitest'
import { logError } from './error-logging'

const originalNodeEnv = process.env.NODE_ENV

afterEach(() => {
  vi.restoreAllMocks()
  vi.stubEnv('NODE_ENV', originalNodeEnv || 'test')
})

describe('client-visible error logging', () => {
  it('sanitizes messages and stacks in a production browser', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = new Error('SENTINEL_SECRET_MESSAGE')
    error.stack = 'SENTINEL_STACK at C:\\private\\server.ts:42'

    logError(error, { source: 'test-client' })

    const output = consoleError.mock.calls.flat().map(String).join(' ')
    expect(output).toContain('[ERROR] [test-client] Client error')
    expect(output).not.toContain('SENTINEL_SECRET_MESSAGE')
    expect(output).not.toContain('SENTINEL_STACK')
    expect(output).not.toContain('private\\server.ts')
  })

  it('retains diagnostics outside a production browser', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const error = new Error('DEVELOPMENT_DIAGNOSTIC')
    error.stack = 'DEVELOPMENT_STACK'

    logError(error, { source: 'test-client' })

    const output = consoleError.mock.calls.flat().map(String).join(' ')
    expect(output).toContain('DEVELOPMENT_DIAGNOSTIC')
    expect(output).toContain('DEVELOPMENT_STACK')
  })
})
