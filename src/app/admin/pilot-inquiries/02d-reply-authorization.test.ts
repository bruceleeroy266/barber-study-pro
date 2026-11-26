import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  service: vi.fn(),
}))
vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(async () => ({ auth: { getUser: mocks.getUser }, from: mocks.from })),
}))
vi.mock('@/lib/supabase-service-role', () => ({ createServiceRoleClient: mocks.service }))
vi.mock('@/lib/notifications/NotificationService', () => ({
  NotificationService: { createDefault: () => ({ notifyOwner: vi.fn() }) },
}))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubEnv('RESEND_API_KEY', '')
})

describe('SEC-02D pilot reply authorization before email or service-role use', () => {
  it('denies anonymous caller without constructing privileged client', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })
    const { sendPilotInquiryReply } = await import('./actions')
    const result = await sendPilotInquiryReply('test-inquiry', 'Subject', 'Message')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Platform administrator access required')
    expect(mocks.service).not.toHaveBeenCalled()
  })

  it.each([
    ['disabled', { role: 'admin', school_id: null, approval_status: 'approved', is_disabled: true }],
    ['unapproved', { role: 'admin', school_id: null, approval_status: 'pending', is_disabled: false }],
    ['school admin', { role: 'school_admin', school_id: 'school-a', approval_status: 'approved', is_disabled: false }],
    ['attached admin', { role: 'admin', school_id: 'school-a', approval_status: 'approved', is_disabled: false }],
  ])('denies %s without sending or writing', async (_case, actor) => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'caller-id' } }, error: null })
    const chain: Record<string, unknown> = {}
    chain.select = vi.fn(() => chain)
    chain.eq = vi.fn(() => chain)
    chain.maybeSingle = vi.fn().mockResolvedValue({ data: actor, error: null })
    mocks.from.mockReturnValue(chain)
    const { sendPilotInquiryReply } = await import('./actions')
    const result = await sendPilotInquiryReply('test-inquiry', 'Subject', 'Message')
    expect(result.success).toBe(false)
    expect(mocks.service).not.toHaveBeenCalled()
  })

  it('approved enabled platform admin passes auth and reaches email configuration check', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'caller-id' } }, error: null })
    const chain: Record<string, unknown> = {}
    chain.select = vi.fn(() => chain)
    chain.eq = vi.fn(() => chain)
    chain.maybeSingle = vi.fn().mockResolvedValue({
      data: { role: 'admin', school_id: null, approval_status: 'approved', is_disabled: false },
      error: null,
    })
    mocks.from.mockReturnValue(chain)
    const { sendPilotInquiryReply } = await import('./actions')
    const result = await sendPilotInquiryReply('test-inquiry', 'Subject', 'Message')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Resend is not configured')
    expect(mocks.service).not.toHaveBeenCalled()
  })
})
