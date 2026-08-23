import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

process.env.RESEND_API_KEY = 're_test'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.OWNER_NOTIFICATION_EMAIL = 'owner@example.com'
process.env.NOTIFICATION_FROM_EMAIL = 'notifications@example.com'

const mockResendSend = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockResendSend } }
  }),
}))

const mockSelectSingle = vi.fn()
const mockEq = vi.fn()

const ownerNotificationsChain = {
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: mockSelectSingle,
    })),
  })),
  update: vi.fn(() => ({
    eq: mockEq,
  })),
}

const pilotInquiriesChain = {
  insert: vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn().mockResolvedValue({
        data: { id: 'pilot-123' },
        error: null,
      }),
    })),
  })),
}

vi.mock('@/lib/supabase-service-role', () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: (table: string) => {
      if (table === 'pilot_inquiries') return pilotInquiriesChain
      if (table === 'owner_notifications') return ownerNotificationsChain
      throw new Error(`Unexpected table: ${table}`)
    },
  })),
}))

// Import route after mocks and env are configured.
const { GET, POST } = await import('./route')

function buildRequest(body: object) {
  return new NextRequest('http://localhost:3000/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResendSend.mockResolvedValue({ data: { id: 'email-1' }, error: null })
    mockSelectSingle.mockResolvedValue({
      data: { id: 'notif-1', payload: {} },
      error: null,
    })
    mockEq.mockResolvedValue({ error: null })
  })

  it('accepts a pilot request and sends confirmation email', async () => {
    const req = buildRequest({
      formType: 'pilot',
      schoolName: 'Test School',
      contactName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-1234',
      programType: 'Barbering',
      cohortSize: '20',
      startDate: '2026-08-01',
      message: 'Ready to pilot',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockResendSend).toHaveBeenCalledTimes(2)
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
      })
    )
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jane@example.com',
        subject: 'Thank you for contacting ASCYN PRO',
      })
    )
  })

  it('accepts a contact form submission', async () => {
    const req = buildRequest({
      formType: 'contact',
      name: 'John Smith',
      school: 'Some School',
      email: 'john@example.com',
      phone: '555-5678',
      message: 'Hello',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockResendSend).toHaveBeenCalledTimes(2)
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
      })
    )
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com',
      })
    )
  })

  it('accepts a demo request', async () => {
    const req = buildRequest({
      formType: 'demo',
      name: 'Alice Demo',
      school: 'Demo Academy',
      email: 'alice@example.com',
      phone: '555-9999',
      state: 'Oklahoma',
      studentCount: '30',
      message: 'Schedule a demo',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockResendSend).toHaveBeenCalledTimes(2)
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.com',
      })
    )
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'alice@example.com',
      })
    )
  })

  it('rejects honeypot submissions silently', async () => {
    const req = buildRequest({
      formType: 'contact',
      name: 'Bot',
      email: 'bot@example.com',
      message: 'Spam',
      website: 'filled',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockResendSend).not.toHaveBeenCalled()
  })

  it('validates required demo fields', async () => {
    const req = buildRequest({
      formType: 'demo',
      name: '',
      email: 'alice@example.com',
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/name and email are required/i)
  })

  it('accepts the native form POST fallback without query-string data', async () => {
    const body = new URLSearchParams({
      formType: 'pilot',
      schoolName: 'Native Form School',
      contactName: 'Native Contact',
      email: 'native@example.com',
      programType: 'Barbering',
    })
    const req = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(req.nextUrl.search).toBe('')
    expect(pilotInquiriesChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'native@example.com', school_name: 'Native Form School' })
    )
  })

  it('rejects malformed JSON safely', async () => {
    const req = new NextRequest('http://localhost:3000/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not-json',
    })

    const res = await POST(req)

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid submission body.' })
    expect(pilotInquiriesChain.insert).not.toHaveBeenCalled()
  })

  it('handles repeated valid submissions under the existing rate-limit contract', async () => {
    const body = {
      formType: 'pilot',
      schoolName: 'Repeat School',
      contactName: 'Repeat Contact',
      email: 'repeat@example.com',
      programType: 'Barbering',
    }

    const first = await POST(buildRequest(body))
    const second = await POST(buildRequest(body))

    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect(pilotInquiriesChain.insert).toHaveBeenCalledTimes(2)
  })

  it('does not mutate on GET', async () => {
    const res = await GET()

    expect(res.status).toBe(405)
    expect(res.headers.get('allow')).toBe('POST')
    expect(pilotInquiriesChain.insert).not.toHaveBeenCalled()
    expect(mockResendSend).not.toHaveBeenCalled()
  })
})
