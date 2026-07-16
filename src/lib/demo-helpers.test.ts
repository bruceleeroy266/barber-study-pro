import { describe, it, expect } from 'vitest'
import { isLocalSupabaseUrl } from './demo-helpers'

describe('isLocalSupabaseUrl', () => {
  it.each([
    'http://127.0.0.1:54321',
    'http://127.0.0.1:55321',
    'http://localhost:54321',
    'http://localhost:55321',
    'http://[::1]:54321',
    'http://[::1]:55321',
    'http://127.0.0.1:80',
    'http://localhost:3000',
  ])('accepts %s', (url) => {
    expect(isLocalSupabaseUrl(url)).toBe(true)
  })

  it.each([
    'https://127.0.0.1:54321',
    'https://localhost:54321',
    'http://127.0.0.1.example.com:54321',
    'http://localhost.example.com:54321',
    'http://127.0.0.1:***@evil.com',
    'http://user:pass@127.0.0.1:55321',
    'http://127.0.0.1:99999',
    'http://localhost:abc',
    'http://192.168.1.1:54321',
    'http://10.0.0.1:54321',
    'http://example.supabase.co',
    'http://your-project.supabase.co',
    'http://fake.localhost:54321',
    'http://localhost.local:54321',
    '',
  ])('rejects %s', (url) => {
    expect(isLocalSupabaseUrl(url)).toBe(false)
  })
})
